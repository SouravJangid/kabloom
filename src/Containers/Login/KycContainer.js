import { isEmpty } from 'lodash';
import moment from "moment";
import Webcam from 'react-webcam';
import LoaderButton from '../../Global/UIComponents/LoaderButton';
import CameraIcon from '@material-ui/icons/Camera';
import uuid from 'react-uuid';
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import showMessage from '../../Redux/Actions/toastAction';
import { Container, Row, Col } from 'reactstrap'
import { Loader } from '../../Global/UIComponents/LoaderHoc';
import CloseIcon from '@material-ui/icons/Close';
import { Storage } from 'aws-amplify'
import API, { graphqlOperation } from '@aws-amplify/api';
import {genericPostData} from '../../Redux/Actions/genericPostData';
import { logoutActionCreator } from '../../Redux/Actions/logoutAction';

const styles = theme => ({
});

class KycContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            screenshot: null,
            adharFrontFile: '',
            adharBackFile: '',
            adharFrontImagePreviewUrl: '',
            adharBackImagePreviewUrl: '',
            uniqueId: '',
            kycUpdate: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ uniqueId: uuid(), kycUpdate:  this.props.location.kycUpdate ? true : false });

    }

    verfiyFaceFromBackendApi = async () => {
        try {
            console.log('========= this.state.appID=======', this.state.uniqueId);
            genericPostData({
                dispatch: this.props.dispatch,
                reqObj: {
                    "applicationID": this.state.uniqueId,
                },
                url: 'connect/verifycustomer/verify',
                constants: {
                    init: "VERIFY_FACE_AFTER_UPLOADING_IMAGES_INIT",
                    success: "VERIFY_FACE_AFTER_UPLOADING_IMAGES_SUCCESS",
                    error: "VERIFY_FACE_AFTER_UPLOADING_IMAGES_ERROR"
                },
                identifier: "VERIFY_FACE_AFTER_UPLOADING_IMAGES",
                successCb: this.verfiyFaceFromBackendApiSuccess,
                errorCb: this.verfiyFaceFromBackendApiError,
                dontShowMessage: true
            });
        }
        catch (err) {
            console.log("============verfiyFaceFromBackendApi err=========", err);
        }
    }

    verfiyFaceFromBackendApiSuccess = (response) => {
        console.log("====verfiyFaceFromBackendApiSuccess==userDetails ======", response);
        this.setState({ isLoading: false });
        if (_get(response, 'data.faceMatch')) {
            this.props.dispatch(showMessage({
                text: `Kyc Successful Face Match is ${response.data.faceMatchPercent} %`, isSuccess: true
            }));
            const years = moment().diff(moment(response.data.dob, 'DD/MM/YYYY'), 'years');
            const userAadharNo = _get(this.props, 'userRegisterInfo.aadhar_no', _get(this.props, 'userDetails.aadhar_no')); // user entered number
            const photoAadharNo = _get(response, 'data.aadharNumber'); // number from photo uploaded

            console.log("========years======", years, userAadharNo, 'photoAadharNo', photoAadharNo);
            console.log("========token======", _get(this.props, 'userDetails.api_token', _get(this.props, 'userRegisterInfo.token')));
            // aadhar no validation 
            // age verification
            if (years > 21) {
                genericPostData({
                    dispatch: this.props.dispatch,
                    reqObj: {
                        "api_token": _get(this.props, 'userDetails.api_token', _get(this.props, 'userRegisterInfo.token')),
                        "is_verified": 1,
                        "verificationid": this.state.uniqueId,
                        "store_id": 1
                    },
                    url: 'api/customer/customerverify',
                    constants: {
                        init: "USER_REGISTER_KYC_INIT",
                        success: "USER_REGISTER_KYC_SUCCESS",
                        error: "USER_REGISTER_KYC_ERROR"
                    },
                    identifier: "USER_REGISTER_KYC",
                    successCb: this.userRegisterKycSuccess,
                    errorCb: this.userRegisterKycError,
                    dontShowMessage: true
                });

            } else {
                this.props.dispatch(showMessage({ text: 'Not Yet Fit For Alcohol Acc. To Govt. See you soon!!!', isSuccess: false }));
                this.setState({ isLoading: false });
            }


        } else {
            this.props.dispatch(showMessage({ text: _get(response, 'message') ? _get(response, 'message') : 'Error In Face Matching. Please Try Again', isSuccess: false }));
            this.setState({ isLoading: false });
        }
    }

    verfiyFaceFromBackendApiError = (data) => {
        this.setState({ isLoading: false });
        console.log("------verfiyFaceFromBackendApiError------error---", data);
        this.props.dispatch(showMessage({ text: 'Something Went Wrong', isSuccess: false }));
    }

    submit = async (values) => {
        console.log("===========this.state========", this.state);
        console.log("===========this.props========", this.props);
        if (isEmpty(this.state.adharFrontImagePreviewUrl)) {
            this.props.dispatch(showMessage({ text: 'Aadhar Front In Not Uploaded.', isSuccess: false }));
        } else if (isEmpty(this.state.adharBackImagePreviewUrl)) {
            this.props.dispatch(showMessage({ text: 'Aadhar Back In Not Uploaded.', isSuccess: false }));
        } else if (isEmpty(this.state.screenshot)) {
            this.props.dispatch(showMessage({ text: 'Selfie In Not Uploaded.', isSuccess: false }));
        } else {
            this.setState({ isLoading: true });
            try {
                await this.verfiyFaceFromBackendApi();
            } catch (err) {
                console.log("Verification err", err);
                this.props.dispatch(showMessage({ text: 'Error In Uploading.', isSuccess: false }));
                this.setState({ isLoading: false });
            }
        }
    }

    userRegisterKycSuccess = (data) => {
        console.log("====userRegisterKycSuccess==userDetails ======", _get(this.props, 'userDetails'));
        this.setState({ isLoading: false });
        const code = _get(data, 'code');
        const message = _get(data, 'message', '');
        if (code === 1) {
            // if (isEmpty(_get(this.props, 'userDetails'))) {
            console.log("======when user not signed in ======");
            this.props.dispatch(showMessage({
                text: 'Sign Up Successful - Please Sign In with your credentials.', isSuccess: true
            }));
            // this.props.dispatch(logoutActionCreator());
            const cartId = localStorage.getItem("cart_id");
            if (!isEmpty(cartId)) {
                this.guestSignIn();
            } else {
                this.props.dispatch(logoutActionCreator());
                this.signIn();
            }

            // } else {
            //     console.log("======when user is signed ======");
            //     this.props.dispatch(logoutActionCreator());
            //     this.props.history.push("/signIn");
            // }
        } else if (code === 2) {
            this.props.dispatch(showMessage({ text: message, isSuccess: false }));
        } else if (message && message.length > 0) {
            this.props.dispatch(showMessage({ text: message, isSuccess: false }));
        } else if (message && message.length === 0) {
            this.props.dispatch(showMessage({ text: 'Something Went Wrong.', isSuccess: false }));
        }
    }

    userRegisterKycError = (data) => {
        this.setState({ isLoading: false });
        console.log("------userRegisterKycError------error---", data);
        this.props.dispatch(showMessage({ text: 'Something Went Wrong', isSuccess: false }));
    }

    signIn = () => {
        this.props.history.push('/signIn');
    }
    guestSignIn = () => {
        this.props.history.push('/guest/register');
    }

    screenshot = async (e) => {
        console.log("================screenshot===============invoked==");
        // access the webcam trough this.refs
        const screenshot = this.refs.webcam.getScreenshot();
        console.log("===================screenshot==============", screenshot);
        this.setState({ screenshot: screenshot });
        const appID = this.state.uniqueId;
        const res = await fetch(screenshot);
        console.log("res: ", res);
        const blob = await res.blob();
        console.log("mime:", blob.type)
        const fileName = appID + "_selfie.jpg";
        const key = await Storage.put(fileName, blob, { contentType: "image/jpeg" });
        const selfieOnS3 = await Storage.get(key.key, { expires: 3600 });
        console.log("key", key, "selfie", selfieOnS3);
    }

    blobToBase64 = (blob) => {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    uploadImageApi = async (imageDataBase64, imageName) => {
        try {
            console.log('========= uploadImageApi=======');
            genericPostData({
                dispatch: this.props.dispatch,
                reqObj: {
                    imageData: imageDataBase64,
                    fileName: imageName,
                },
                url: 'connect/uploadkyc/kyc',
                constants: {
                    init: "UPLOAD_IMAGES_API_INIT",
                    success: "UPLOAD_IMAGES_API_SUCCESS",
                    error: "UPLOAD_IMAGES_API_ERROR"
                },
                identifier: "UPLOAD_IMAGES_API",
                successCb: this.uploadImageApiSuccess,
                errorCb: this.uploadImageApiError,
                dontShowMessage: true
            });
        }
        catch (err) {
            console.log("============uploadImageApi err=========", err);
        }
    }

    uploadImageApiSuccess = (response) => {
        console.log("====uploadImageApiSuccess==userDetails ======", response);
        this.setState({ isLoading: false });
    }

    uploadImageApiError = (data) => {
        this.setState({ isLoading: false });
        console.log("------uploadImageApiError------error---", data);
        this.props.dispatch(showMessage({ text: 'Something Went Wrong', isSuccess: false }));
    }

    uploadAadhaar = async (data, value) => {
        console.log("upload data", data)
        console.log("upload value", value)
        const appID = this.state.uniqueId;
        const res = await fetch(data);
        const blob = await res.blob();
        console.log(" uploadAdharFront ====blob: ", blob);
        console.log("mime:", blob.type)
        const fileName = value === "front" ? appID + "_aadhaar_front.jpg" : appID + "_aadhaar_back.jpg";
        // const fileName1 = value === "front" ? appID + "_aadhaar_front_api.jpg" : appID + "_aadhaar_back_api.jpg";
        console.log('===========fileName===========', fileName);
        console.log('===========base64===========', await this.blobToBase64(blob));
        // const key = await Storage.put(fileName, blob, { contentType: blob.type });
        // const aadhaarOnS3 = await Storage.get(key.key, { expires: 3600 });
        // console.log("key", key, "uploadAdharFront", aadhaarOnS3);
        await this.uploadImageApi(await this.blobToBase64(blob), fileName);
    }

    cancelScreenshot = async (e) => {
        console.log("================cancelScreenshot===============invoked==");
        this.setState({ screenshot: null });
    }

    handleImageChange = async (e, value) => {
        // e.preventDefault();
        this.setState({ isLoading: true });

        console.log("================handleImageChange===============invoked==", e, value);

        let reader = new FileReader();
        let file = e.target.files[0];
        console.log("================file===============file==", file);
        console.log("================reader===============reader==", reader);
        const stateToBeSet = value === "front" ? ["adharFrontImagePreviewUrl", "adharFronFile"] : ["adharBackImagePreviewUrl", "adharBackFile"];
        reader.onloadend = () => {
            this.setState({
                [stateToBeSet[1]]: file,
                [stateToBeSet[0]]: reader.result
            });
            console.log("readResulte", reader.result)
            this.uploadAadhaar(reader.result, value)
        }
        reader.readAsDataURL(file)
        this.setState({ isLoading: false });
    }

    cancelUploadImage = async (e, value) => {
        console.log("================handleUploadImage===============invoked==");
        if (value === "front") {
            this.setState({ adharFrontImagePreviewUrl: '', adharFronFile: '' });
        } else if (value === "back") {
            this.setState({ adharBackImagePreviewUrl: '', adharBackFile: '' });
        }
    }
    rediretToPreviosPage = () => {
        this.props.history.push('/setting/user');
    }

    // signIn = () => {
    //     this.props.history.push('/signIn');
    // }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment >
                {this.state.isLoading && <Loader />}
                < div className="WhiteCurveBg justify-content-start justify-content-md-center" >
                    <CssBaseline />
                    <Container className="container-custom homeStylebg d-flex KYC-Container flex-column justify-content-center">
                        <Row className="align-items-center mb-5" style={{ flex: 1, maxHeight: 70, minHeight: 70 }}>
                            <Col className="text-center" >
                                <h4 className="holduptext">KYC</h4>
                            </Col>
                        </Row>
                        <h5 className="AppId"><b>Application ID:</b> {this.state.uniqueId}</h5>
                        <div className="uploadBox">
                            <h3 className="mb-3" ><b>Upload Aadhar Front</b></h3>
                            {
                                this.state.adharFrontImagePreviewUrl ?
                                    <div className="uploadBoxareaimg">
                                        <button onClick={(e) => this.cancelUploadImage(e, "front")} className="removeImg"><CloseIcon></CloseIcon></button>
                                        {/* <button type="submit" onClick={(e) => this.handleUploadImage(e, "front")}>Upload Aadhar Front Image</button> */}
                                        <img className="img-responsive" alt="Aadhar Front" src={this.state.adharFrontImagePreviewUrl} />
                                    </div> :
                                    <form onSubmit={(e) => this.handleImageChange(e, "front")}>
                                        <input type="file" className="uploadBoxarea" id="adharFront" onChange={(e) => this.handleImageChange(e, "front")} />
                                        <label className="chooseBtn" for="adharFront">Drag and drop a file here or click</label>
                                    </form>
                            }
                        </div>
                        <div className="uploadBox">
                            <h3 className="mb-3" ><b>Upload Aadhar Back</b></h3>
                            {
                                this.state.adharBackImagePreviewUrl ?
                                    <div className="uploadBoxareaimg">
                                        <button onClick={(e) => this.cancelUploadImage(e, "back")} className="removeImg"><CloseIcon></CloseIcon></button>
                                        {/* <button type="submit" onClick={(e) => this.handleUploadImage(e, "back")}>Upload Aadhar Back Image</button> */}
                                        <img className="img-responsive" alt="Aadhar Back" src={this.state.adharBackImagePreviewUrl} />
                                    </div> :
                                    <form onSubmit={(e) => this.handleImageChange(e, "back")}>
                                        <input type="file" className="uploadBoxarea" id="adharBack" onChange={(e) => this.handleImageChange(e, "back")} />
                                        <label className="chooseBtn" for="adharBack">Drag and drop a file here or click</label>
                                    </form>
                            }
                        </div>
                        <div className="uploadBox">
                            <h3 className="mb-3" ><b>Take Your Selfie</b></h3>
                            {this.state.screenshot ? null :
                                <div className="captureImg">
                                    <Webcam audio={false} className="webcam" ref='webcam' screenshotFormat="image/jpeg" />
                                    <button onClick={(e) => this.screenshot(e)} className="capture"><CameraIcon></CameraIcon></button>
                                </div>
                            }
                            {this.state.screenshot ?
                                <div className="uploadBoxareaimg">
                                    <button onClick={(e) => this.cancelScreenshot(e)} className="removeImg"><CloseIcon></CloseIcon></button>
                                    <img className="img-responsive" alt="Selfie" src={this.state.screenshot} />
                                </div> : null}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            
                            { this.state.kycUpdate ? <LoaderButton
                                onClick={this.rediretToPreviosPage}
                                
                                isFetching={this.state.isFetching}
                                variant="contained"
                                color="primary"
                                className="submitBtn"
                            >
                                Cancel
                            </LoaderButton> : null }
                            <LoaderButton
                                onClick={this.submit}
                                type="submit"
                                isFetching={this.state.isFetching}
                                variant="contained"
                                color="primary"
                                className="submitBtn"
                            >
                                Submit
                            </LoaderButton>
                        </div>

                        
                    </Container>
                </div>
            </React.Fragment >
        );
    }
}


function mapStateToProps(state) {
    let userInfo = _get(state, 'userSignInInfo.lookUpData', []);
    let userRegisterInfo = _get(state, 'userRegisterInfo.lookUpData[0].data', {});
    console.log("----mapStateToProps----state-------KycContainer--", state);
    let userDetails = _get(userInfo, '[0].result', {});
    return { userDetails, userRegisterInfo };
}
export default connect(mapStateToProps)(withStyles(styles)(KycContainer));