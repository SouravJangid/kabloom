import React from 'react'
import Webcam from 'react-webcam';
import LoaderButton from '../../../Global/UIComponents/LoaderButton';
import CameraIcon from '@material-ui/icons/Camera';
import CloseIcon from '@material-ui/icons/Close';
import { v4 as uuidv4 } from 'uuid';
import API, { graphqlOperation } from '@aws-amplify/api';
import { Storage } from 'aws-amplify';
import {
    Form as ReactStrapFrom, FormGroup, Button, Container, Row, Col
} from 'reactstrap';
import { connect } from "react-redux";
import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { commonActionCreater } from "../../../Redux/Actions/commonAction";
import { Loader } from "../../../Global/UIComponents/LoaderHoc";
import { PageView } from '../../../Global/helper/react-ga';
import showMessage from '../../../Redux/Actions/toastAction';
import { genericPostData } from '../../../Redux/Actions/genericPostData';


class VerifyFace extends React.Component {
    constructor(props) {
        super(props)
        this.state = { isLoading: false, screenshot: null, faceMatchFileName: null };
    }

    handleContinueFromExistingCard = () => {
        PageView();
        this.props.handleTabOnContinue('checkout');
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        // cart tab validation
        let cartTabValidation = this.props.cartTabValidation;

        let data = {
            ...cartTabValidation,
            isFaceTab: true,
            isSummaryTab: false
        };
        this.props.dispatch(commonActionCreater(data, 'CART_TAB_VALIDATION'));

        // cart tab validation end
    }


    verfiyFaceFromBackendApiForOrder = async () => {
        try {
            genericPostData({
                dispatch: this.props.dispatch,
                reqObj: {
                    applicationID: _get(this.props, "userDetails.verification_id"),
                    orderID: this.state.faceMatchFileName
                },
                url: 'connect/verifyorder/verify',
                constants: {
                    init: "VERIFY_FACE_AFTER_ORDER_PLACING_INIT",
                    success: "VERIFY_FACE_AFTER_ORDER_PLACING_SUCCESS",
                    error: "VERIFY_FACE_AFTER_ORDER_PLACING_ERROR"
                },
                identifier: "VERIFY_FACE_AFTER_ORDER_PLACING",
                successCb: this.verfiyFaceFromBackendApiForOrderSuccess,
                errorCb: this.verfiyFaceFromBackendApiForOrderError,
                dontShowMessage: true
            });
        }
        catch (err) {
            console.log("============verfiyFaceFromBackendApi err=========", err);
        }
    }


    verfiyFaceFromBackendApiForOrderSuccess = (response) => {
        console.log("====verfiyFaceFromBackendApiForOrderSuccess==userDetails ======", response);
        this.setState({ isLoading: false });
        if (response.data.faceMatch) {
            this.props.dispatch(showMessage({
                text: `Face Verification Successful Match is ${response.data.faceMatchPercent} %`, isSuccess: true
            }));
            this.handleContinueFromExistingCard();
        } else {
            this.props.dispatch(showMessage({ text: 'Error In Face Matching Or WebCam Access Issue. Please Try Again', isSuccess: false }));
            this.setState({ isLoading: false });
        }
    }

    verfiyFaceFromBackendApiForOrderError = (data) => {
        this.setState({ isLoading: false });
        console.log("------verfiyFaceFromBackendApiForOrderError------error---", data);
        this.props.dispatch(showMessage({ text: 'Something Went Wrong', isSuccess: false }));
    }


    verifyFaceForOrder = async (e) => {
        try {
            if (isEmpty(this.state.screenshot)) {
                this.props.dispatch(showMessage({ text: 'Selfie In Not Uploaded.', isSuccess: false }));
            } else if (isEmpty(this.state.faceMatchFileName)) {
                this.props.dispatch(showMessage({ text: 'Face Match Id Not Available.', isSuccess: false }));
            } else {
                this.setState({ isLoading: true });
                await this.verfiyFaceFromBackendApiForOrder();
            }
        } catch (err) {
            console.log("Verification err", err);
            this.props.dispatch(showMessage({ text: 'Error In Face Matching Or WebCam Access Issue. Please Try Again', isSuccess: false }));
            this.setState({ isLoading: false });
        }
    }

    screenshot = async (e) => {
        console.log("================screenshot===============invoked==");
        // access the webcam trough this.refs
        const screenshot = this.refs.webcam.getScreenshot();
        console.log("===================screenshot==============", screenshot);
        this.setState({ screenshot: screenshot });
        const res = await fetch(screenshot);
        console.log("res: ", res);
        const blob = await res.blob();
        console.log("mime:", blob.type)
        const id = uuidv4();
        const fileName = `facematch-${id}`;
        this.setState({ faceMatchFileName: fileName });
        const key = await Storage.put(fileName + ".jpg", blob, { contentType: "image/jpeg" });
        const selfieOnS3 = await Storage.get(key.key, { expires: 3600 });
        console.log("key", key, "selfie", selfieOnS3);
        // this.verifyFaceForOrder();
    }

    cancelScreenshot = async (e) => {
        console.log("================cancelScreenshot===============invoked==");
        this.setState({ screenshot: null });
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        return (
            <React.Fragment>
                <div className="page-content-container">
                    <Container fluid={true}>
                    <Container className="container-custom homeStylebg d-flex KYC-Container flex-column justify-content-center">
                        <Row className="align-items-center mb-5" style={{ flex: 1, maxHeight: 70, minHeight: 70 }}>
                            <Col className="text-center" >
                                <h4 className="holduptext">Verify Yourself Before Placing An Order</h4>
                            </Col>
                        </Row>                        
                        <h5 className="AppId"><b>Application ID:</b> {this.state.uniqueId}</h5>
                        <div className="uploadBox">
                            <h3 className="mb-3" ><b>Take Your Selfie</b></h3>
                            {this.state.screenshot ? null :
                                <div className="captureImg">
                                    <Webcam audio={false} className="webcam" ref='webcam' screenshotFormat="image/jpeg" />
                                    <button onClick={(e) => this.screenshot(e)}
                                        className="capture"><CameraIcon></CameraIcon></button>
                                </div>
                            }
                            {this.state.screenshot ?
                                <div className="uploadBoxareaimg">
                                    <button onClick={(e) => this.cancelScreenshot(e)}
                                        className="removeImg"><CloseIcon></CloseIcon></button>
                                    <img className="img-responsive" alt="Selfie"
                                        src={this.state.screenshot} />
                                </div> : null}
                        </div>

                        <LoaderButton
                            onClick={this.verifyFaceForOrder}
                            type="submit"
                            isFetching={this.state.isFetching}
                            variant="contained"
                            color="primary"
                            className="submitBtn"
                        >
                            Verify
                        </LoaderButton>
                        </Container>
                    </Container>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    let cartTabValidation = _get(state, 'cartTabValidation.lookUpData', {});
    let paymentMethods = _get(state, "paymentMethods.lookUpData.data", {});
    let payment_method = _get(paymentMethods, "payment_method")
    let cartId = _get(state, "cart.lookUpData[0].cart_id", null);
    paymentMethods = Object.keys(paymentMethods).filter(key => !isNaN(key)).map(key => paymentMethods[key]);
    let cartFlow = _get(state, 'cartFlow.lookUpData', {});
    let userInfo = _get(state, 'userSignInInfo.lookUpData', []);
    let userRegisterInfo = _get(state, 'userRegisterInfo.lookUpData[0].data', []);
    let userDetails = _get(userInfo, '[0].result', {});
    console.log(cartFlow, 'cartflow');
    return {
        paymentMethods,
        cartId,
        cartFlow,
        payment_method,
        cartTabValidation,
        userDetails, userRegisterInfo
    }
}

export default connect(mapStateToProps)(VerifyFace);
