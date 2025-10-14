import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import {Container, Row, Col, Alert} from 'reactstrap'
import { Form, Field } from 'react-final-form';
import {TextInputField, SwitchInputField} from '../../Global/FormCompoents/wrapperComponent';
import { Button, FormControl } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import validate from './Validate/holdupValidate';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import genericGetData from '../../Redux/Actions/genericGetData';
import showMessage from '../../Redux/Actions/toastAction';
import WithLoading from '../../Global/UIComponents/LoaderHoc';
// import Logo from '../../../src/assets/images/drinksbucket-logo.png';
import Logo from '../../../src/assets/images/kabloom-logo.png';
import _get from 'lodash/get';
import { isEmpty as _isEmpty, isObjectLike } from 'lodash';
import { commonActionCreater } from '../../Redux/Actions/commonAction';
import { Redirect } from 'react-router';
import axios from "axios";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

//google analytics
import {PageView, Event} from '../../Global/helper/react-ga';
import { cleanEntityData, getArrayOutOfServerObject } from '../../Global/helper/commonUtil';
import ReCAPTCHA from "react-google-recaptcha";


const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_KEY;

const styles = theme => ({
    main: {
    }
   
});

class HoldupContainer extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            validationError: false,
            location: '',
            zipcode: localStorage.getItem('zipcode'),
            serviceAblePinCode: [],
            backToZipCodeSelectionClicked: false,
            backendError: false,
            backendErrorMessage: '',
            courierType: '',
            continueDisable: true

        }
    }
    onSubmit  = async (values) => {
        console.log(values);
        
        const body = cleanEntityData({
            zipcode: _get(values, 'pincode', ''),
            location: _get(values, 'location', '')
        });
        if (_isEmpty(body)) {
            this.setState({
                validationError: true
            });
        }
        if (!_isEmpty(_get(body, 'location'))) {
            // this.setState({ location: _get(body, 'location')});
            localStorage.setItem("location", _get(body, 'location'));
            // this.props.history.push('/ship/options');
        }

        if (_isEmpty(_get(body, 'zipcode')) && !_isEmpty(_get(body, 'location'))) {
            localStorage.setItem('ageGateVerified', true);
            this.props.history.push('/store');
            
        }
        
        if (!_isEmpty(_get(body, 'zipcode'))) {
            this.setState({ zipcode: values.pincode });
            genericGetData({
                dispatch:this.props.dispatch,
                url:`/connect/index/getaddressbyzipcode?zipcode=${values.pincode}&store_id=1`,
                constants:{
                init:"ZIPCODE_LOCATOR_INIT",
                success:"ZIPCODE_LOCATOR_SUCCESS",
                error:"ZIPCODE_LOCATOR_ERROR" 
                },
                identifier:"ZIPCODE_LOCATOR",
                successCb:this.zipcodeLocatorSuccess,
                errorCb:this.zipcodeLocatorFetchError,
                dontShowMessage: true })
        } 

        
        
      }
      handleZipCode = (e) => {
          if(e.target.dataset.action == undefined){
              this.setState({zipcode : e.target.innerHTML, backToZipCodeSelectionClicked: true, serviceAblePinCode: []} )
          }
          else {
            this.setState({zipcode : e.target.dataset.action, backToZipCodeSelectionClicked : true, serviceAblePinCode: []} )
          }
    }

      zipcodeLocatorSuccess= (data) => {

        Event("AGE GATE", "Age Gate Triggered", "Age Gate Page");
            // if(data.messgae === "Zipcode validation success") {
            //     this.props.history.push('/store');
            // } else {
            //    this.props.dispatch(
            //        showMessage({ text: 'This is not valid Zipcode. Please try another zipcode.',
            //                     isSuccess: false }));
            // }
            
           if(data.code == -1){
            // this.setState({serviceAblePinCode: _get(data, 'data.pincode') })
            this.setState({ backendError: true, backendErrorMessage: _get(data, 'message') });
           }else if (data) {
                console.log("this is data",data);
                localStorage.setItem("couriertype", this.state.courierType);
                localStorage.setItem('ageGateVerified', true);
                localStorage.setItem('zipcode', this.state.zipcode);
                localStorage.setItem('zipState', _get(data['data'], '0.state'));
                localStorage.setItem('vendor_location_id', _get(data['data'], '0.loc_id'));
                console.log('check 1');

                // let isValidRetailerFound = false;
                // let { retailers_method } = _get(data, 'data', {});
                // if (Array.isArray(retailers_method)) {
                // isValidRetailerFound = retailers_method.length > 0 ? true : false
                // }
                // if (isObjectLike(retailers_method)) {
                // let retailers_methodArr = getArrayOutOfServerObject(retailers_method);
                // isValidRetailerFound = retailers_methodArr.length > 0 ? true : false

                // }
                // if (isValidRetailerFound)
                this.props.history.push('/store');
               
                
                
            }
      }
      zipcodeLocatorFetchError = (data) => { }

      useLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {console.log(position);
            const initialPosition = JSON.stringify(position);
            console.log(initialPosition);
            },
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );
    }

    signIn = () => {
        this.props.history.push('/signIn');
    }

    async componentDidMount() {
        let res = await axios.get(`https://api.ipstack.com/check?access_key=c6015f473dc3d3a2beb0f6bc11bf4782`);
        // console.log("=====res========", res);
        this.setState({ pincode: res.data.zip });
        
        PageView();
    }

    handleChangeCourierType = (e) => {
        let courierType = e.target.value;
        this.setState({ courierType: courierType });
    }

    courierTypeArr = [
        
            <MenuItem value='local'>Local</MenuItem>,
            <MenuItem value='courier'>Courier</MenuItem>,

        
    ]

    handleCaptchChange = () => {
        
        this.setState({ continueDisable: false })
    }
  
      
    render() {
        const { classes } = this.props;
        return this.state.serviceAblePinCode.length == 0 ? (           
               <React.Fragment>
                <div  className="WhiteCurveBg justify-content-start justify-content-md-center topSpacer">
                     <CssBaseline />
                <Container className="container-custom holdUpscreen d-flex flex-column align-items-center justify-content-start justify-content-md-center">
                    <Row className="align-items-center justify-content-center">
                    <Col sm={4} className="d-flex justify-content-center align-items-center mt-2" >
                                <img src={Logo} alt='KabloomLogo' className="img-responsive logo"></img>
                    </Col>
                    </Row>
                    <Row className="align-items-center mt-3">
                        <Col  className="text-center px-0" >
                        <h4 className="holduptextmain">Flower, Gifts and More..<br></br>Straight to Your Door.</h4>
                        </Col>                        
                    </Row> 
                    <Form   onSubmit= {this.onSubmit} validate={validate}
                            render={({ handleSubmit }) => (
                        <form className="d-flex flex-column justify-content-around homeInput"  onSubmit={handleSubmit}>
                            {/* <Row>
                                <Col className="text-center homeInputAddress" >
                                <Field name="pincode" component={TextInputField} placeholder='Enter delivery pincode'
                                        autoFocus={false} type='text' />
                                    <Button variant="contained" color="primary" className="addressbutton border-0" type="submit">
                                        <ArrowForwardIcon style={{ fontSize: 40 }}  /></Button>
                                </Col>                        
                            </Row> */}
                                    <div className="position-relative">
                                    
                                    <Row>
                                        <Col className="text-center mb-5" >
                                            <Field name="pincode" component={TextInputField} placeholder='ENTER SERVICE ZIPCODE' initialValues={this.state.zipcode} value={this.state.zipcode} autoFocus={false} type='text' />
                                            
                                            {/* <div style={{ marginTop: 20, width: '100%'}}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Select Courier Type</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        className="w-100, text-left"
                                                        label='Select Courier Type'
                                                        value={this.state.courierType}
                                                        onChange={(e) => this.handleChangeCourierType(e)}
                                                    >
                                                        {this.courierTypeArr}
                                                    </Select>
                                                    
                                                </FormControl>
                                                
                                            </div> */}
                                            
                                        </Col>
                                        {/* <Col>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={this.state.courierType}
                                                onChange={(e) => this.handleChangeCourierType(e)}
                                            >
                                                {this.courierTypeArr}
                                            </Select>
                                        </Col> */}
                                    </Row>

                                    {/* <Row>
                                        <Col className="text-center mb-5" >
                                            <Field name="location" component={TextInputField} placeholder='LOCATION'
                                                autoFocus={false} type='text' />
                                        </Col>
                                    </Row> */}

                                    { this.state.validationError ? 
                                        <div className="locationError " >                             
                                                Please provide zipcode                  
                                        </div>                        
                                  
                                    : null } 
                                    { this.state.backendError ? 
                                        <div className="locationError " >                             
                                                {this.state.backendErrorMessage}                 
                                        </div>                        
                                  
                                    : null } 
                                    </div>
                            {/* <Row className="align-items-center justify-content-center overAgetxt ">
                                <Col md={5} className="text-center d-flex align-items-center justify-content-between" >
                                    <Field name="overAge" component={SwitchInputField} label='ARE YOU OVER 21 ?' />
                                </Col>                        
                            </Row>  */}

                            <Row className="justify-content-center mt-5 align-items-center">
                                <ReCAPTCHA
                                        sitekey={recaptchaSiteKey}
                                        onChange={this.handleCaptchChange}
                                    />
                            </Row>
                                
                            

                            <Row className="justify-content-center mt-5 align-items-center">
                            <Col xs={12} sm={'auto'} className="d-flex justify-content-center" >
                                        <Button type="submit" variant="contained" color="primary" className="bottomActionbutton cartActionBtn" disabled={this.state.continueDisable} >
                                        <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> CONTINUE
                                        </Button>
                                        </Col>                        
                            </Row>
                            {/* <Row className="justify-content-center mt-5 align-items-center">
                            <Col xs={12} sm={'auto'} className="d-flex justify-content-center" >
                                    <Button variant="contained" color="primary" className="bottomActionbutton" type="submit">
                                        <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> LET'S PARTY</Button>
                                </Col>                        
                            </Row>   */}
                         </form>)}                           
                    />  
                </Container>
                </div>
                        {/* <Container className="container-custom">
                            <Row>
                                <Col className="text-center" >
                                    <Button variant="text" color="secondary" className="txtButton" onClick={this.signIn} >SIGN IN</Button>
                                </Col>                        
                            </Row>
                        </Container> */}
            </React.Fragment>
          ) : (
            <React.Fragment>
            <div  className="WhiteCurveBg justify-content-start justify-content-md-center topSpacer">
                 <CssBaseline />
            <Container className="container-custom holdUpscreen d-flex flex-column align-items-center justify-content-start justify-content-md-center">
                <Row className="align-items-center justify-content-center">
                <Col sm={4} className="d-flex justify-content-center align-items-center mt-2" >
                            <img src={Logo} alt='Kabloom Logo' className="img-responsive logo"></img>
                </Col>
                </Row>
                <Row className="align-items-center mt-3">
                    <Col  className="text-center" >
                    <h4 className="holduptextmain">Wine, Liquor, and Beer.<br></br>Straight to Your Door.</h4>
                    </Col>                        
                </Row> 
              
              <Row>
              <h1>{`We are not currently serving the zipcode ${this.state.zipcode}`}</h1>
              </Row>
              <Row className="align-items-center mt-3">
                <h4>Please select one of the following zipcode.</h4>
              </Row>
              <Row onClick={this.handleZipCode}>
              {this.state.serviceAblePinCode.map((x) =>  <Col sm={4}  data-action={x} className="d-flex justify-content-center align-items-center mt-2" >
              <Button variant="contained" color="primary" data-action={x}>{x}</Button>
                </Col>)}
              </Row>
            </Container>
            </div>
              
        </React.Fragment>
          );
     }
}

const mapStateToProps = (state) => {
    let isLoading = _get(state, 'zipCodeLocator.isFetching')
    return {
        isLoading,
    };
};

export default connect(mapStateToProps)(withStyles(styles)(WithLoading(HoldupContainer)));