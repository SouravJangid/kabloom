
import React from 'react';

import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { Button } from 'reactstrap';
import validate from './validator/guestSignupFormValidator';
import { TextInputField, CheckBoxInputField, DateTimePickerMain, RadioBtnInput } from '../../Global/FormCompoents/wrapperComponent';
import {genericPostData} from '../../Redux/Actions/genericPostData';
import { cleanEntityData } from '../../Global/helper/commonUtil';
import { get as _get, map as _map } from 'lodash';
import showMessage from '../../Redux/Actions/toastAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import { countryDropdown } from '../../assets/data/dropdown';
import RFReactSelect from '../../Global/FormCompoents/react-select-wrapper';
import moment from 'moment';
import { Container, Row, Col } from 'reactstrap'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CalenderIcon from '@material-ui/icons/CalendarTodayOutlined';
import { commonActionCreater } from '../../Redux/Actions/commonAction';


const countryOptions = _map(countryDropdown, s => cleanEntityData({
    value: _get(s, 'code'),
    label: _get(s, 'name')
}));

let dateBefore21Year = moment().subtract(21, 'years');
let valid = function (current) {
    return current.isBefore(dateBefore21Year);
}
function normalizeDate(value, prevValue, b, c) {
    if (!value) return value;
    if (value._isAMomentObject) {
        return value
    }

    const valueOnlyNumbers = value.replace(/[^\d]/g, '');
    const prevValueOnlyNumbers = prevValue && prevValue.replace(/[^\d]/g, '');

    // Enable backspacing:
    // if the user is backspacing and they backspace a forward slash, the date's
    // numbers won't be affected so just return the value.
    if (valueOnlyNumbers === prevValueOnlyNumbers) return value;

    const month = valueOnlyNumbers.slice(0, 2);
    const day = valueOnlyNumbers.slice(2, 4);
    const year = valueOnlyNumbers.slice(4, 8);

    if (valueOnlyNumbers.length < 2) return `${month}`;
    if (valueOnlyNumbers.length === 2) return `${month}/`;
    if (valueOnlyNumbers.length < 4) return `${month}/${day}`;
    if (valueOnlyNumbers.length === 4) return `${month}/${day}/`;
    if (valueOnlyNumbers.length > 4) return `${month}/${day}/${year}`;
}







class GuestSignUpComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }


    }

    onSubmit = async values => {
        this.setState({ isLoading: true, email: values.email, password: values.password });
        let cartId = localStorage.getItem("cart_id");
        const dob = values.dob ? moment(_get(values, 'dob')).format('MM/DD/YYYY') : ''
        let body = cleanEntityData({
            email: _get(values, 'email'),
            password: _get(values, 'password'),
            confirm_password: _get(values, 'confirmPassword'),
            first_name: _get(values, 'firstName'),
            last_name: _get(values, 'lastName'),
            cart_id: cartId,
            dob,
            gender: _get(values, 'gender'),
            country: _get(values, 'country'),
            newsletter_subscription: _get(values, 'newsletter_subscription'),
        });

        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: body,
            url: `api/customer/register?email=${values.email}&password=${values.password}&confirm_password=${values.confirmPassword}&first_name=${values.firstName}&last_name=${values.lastName}&newsletter_subscription=${values.newsletter_subscription}`,
            constants: {
                init: "USER_REGISTER_INIT",
                success: "USER_REGISTER_SUCCESS",
                error: "USER_REGISTER_ERROR"
            },
            identifier: "USER_REGISTER",
            successCb: this.userRegisterSuccess,
            errorCb: this.userRegisterError,
            dontShowMessage: true
        });
    }

    userRegisterSuccess = (data) => {
        this.setState({ isLoading: false });
        const code = _get(data[0], 'code');
        const message = _get(data[0], 'message');
        const total_items_count = _get(data[0], 'result.total_product_in_cart', 0) || localStorage.getItem("total_products_in_cart");
        if (code === 1) {
            // if (_get(data[0], 'result.is_verified') == null || _get(data[0], 'result.is_verified') == 0) {
            //     console.log("---------inside not verified------");
            //     this.props.history.push('/kyc');
            // } else {
            //     console.log("---------inside verified------");
            //     let cartObj = [{ total_items_count }];
            //     this.props.dispatch(commonActionCreater(cartObj, 'CART_ITEMS_SUCCESS'));
            //     localStorage.setItem('Token', _get(data[0], 'result.api_token', ''));
            //     localStorage.setItem('cart_id', _get(data[0], 'result.cart_id', ''));
            //     this.props.history.push('/store');
            // }
            let cartObj = [{ total_items_count }];
            this.props.dispatch(commonActionCreater(cartObj, 'CART_ITEMS_SUCCESS'));
            localStorage.setItem('Token', _get(data[0], 'result.api_token', ''));
            localStorage.setItem('cart_id', _get(data[0], 'result.cart_id', ''));
            // this.props.history.push('/store');
            this.signIn()
        } else {

            this.props.dispatch(showMessage({ text: message, isSuccess: false }));
        }
    }
    userRegisterError = (err) => {
        this.setState({ isLoading: false });
        this.props.dispatch(showMessage({ text: 'Something Went wrong', isSuccess: false }));
    }

    signIn = () => {
        // this.props.history.push('/signIn');

        let cartId = localStorage.getItem("cart_id");
        let body = cleanEntityData({
            email: _get(this.state, 'email'),
            password: _get(this.state, 'password'),
            cart_id: cartId
        });

        genericPostData({
            dispatch: this.props.dispatch,
            // reqObj: { email: values.email, password: values.password },
            reqObj: body,
            
            url: `api/customer/login?email=${this.state.email}&password=${this.state.password}`,
            constants: {
                init: "USER_SIGNIN_INIT",
                success: "USER_SIGNIN_SUCCESS",
                error: "USER_SIGNIN_ERROR"
            },
            
            identifier: "USER_SIGNIN",
            successCb: this.userSigninSuccess,
            errorCb: this.userSigninError,
            dontShowMessage: true
        })
    }

    userSigninSuccess = (data) => {
        const code = _get(data[0], 'code');
        const total_items_count = _get(data[0], 'result.total_product_in_cart', 0) || localStorage.getItem("total_products_in_cart")
        const message = _get(data[0], 'message');
        if (code === 1 && message === 'success') {
            if (_get(data[0], 'result.is_verified') == null || _get(data[0], 'result.is_verified') == 0) {
                console.log("---------inside not verified------");
                // this.props.history.push('/kyc');
                localStorage.setItem('Token', _get(data[0], 'result.api_token', ''));
                localStorage.setItem('cart_id', _get(data[0], 'result.cart_id', ''));
                const customer_id = _get(data[0], 'result.customer_id');
                localStorage.setItem('CustomerId', customer_id);
                let cartObj = [{ total_items_count }];
                this.props.dispatch(commonActionCreater(cartObj, 'CART_ITEMS_SUCCESS'));
                this.props.history.push('/store');
            } else {
                console.log("---------inside verified------");
                let cartObj = [{ total_items_count }];
                this.props.dispatch(commonActionCreater(cartObj, 'CART_ITEMS_SUCCESS'));
                localStorage.setItem('Token', _get(data[0], 'result.api_token', ''));
                localStorage.setItem('cart_id', _get(data[0], 'result.cart_id', ''));
                const customer_id = _get(data[0], 'result.customer_id');
                localStorage.setItem('CustomerId', customer_id);
                this.props.history.push('/store');
            }
            // this.fetchCategories();
        } else if (message) {
            this.props.dispatch(showMessage({ text: message, isSuccess: false }));
        } else {
            this.props.dispatch(showMessage({ text: 'Something Went Wrong.', isSuccess: false }));
        }
    }

    userSigninError = (data) => {
        this.props.dispatch(showMessage({ text: 'Something Went wrong', isSuccess: false }));
    }

    render() {



        return (
            <React.Fragment>
                <Col xs={12} lg={8} className="d-flex justify-content-center mb-5 mb-md-0 mpb-30 ">
                <div className="sectionWrapper">
                    <Row className="align-items-center pb-5" >
                        <Col className="text-center" >
                            <h4 className="holduptext"> CREATE ACCOUNT</h4>
                        </Col>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Form onSubmit={this.onSubmit} validate={validate} initialValues={{ country: 'US' }}
                            render={({ handleSubmit }) => (
                                <form onSubmit={handleSubmit} >
                                    <Row className="no-gutters ">
                                        <Col xs={12} md={6} className="pr-md-5 mb-5" >
                                            <Field name="firstName" component={TextInputField} placeholder='FIRST NAME'
                                                autoFocus={false} type='text' />
                                        </Col>
                                        <Col xs={12} md={6} className="mb-5" >
                                            <Field name="lastName" component={TextInputField} placeholder='LAST NAME'
                                                autoFocus={false} type='text' />
                                        </Col>
                                    </Row>

                                    <Row className="no-gutters">
                                        <Col className="mb-5" >
                                            <Field name="email" component={TextInputField} placeholder='EMAIL ADDRESS'
                                                autoFocus={false} type='text' />
                                        </Col>
                                    </Row>
                                    <Row className="no-gutters">
                                        <Col xs={12} md={6} className="pr-md-5 mb-5" >
                                            <Field name="password" component={TextInputField} placeholder='PASSWORD'
                                                autoFocus={false} type='password' />
                                        </Col>
                                        <Col xs={12} md={6} className=" mb-5" >
                                            <Field name="confirmPassword" component={TextInputField} placeholder='CONFIRM PASSWORD'
                                                autoFocus={false} type='password' />
                                        </Col>
                                    </Row>
                                    {/* <Row className="no-gutters">
                                        <Col className="mb-5 datePicker" >
                                            <CalenderIcon className="calenderIcon" />
                                            <Field name="dob" component={DateTimePickerMain}
                                                parse={normalizeDate}
                                                isValidDate={valid}
                                                viewDate={dateBefore21Year}
                                                dateFormat="MM/DD/YYYY"
                                                placeholder='DATE OF BIRTH(MM/DD/YYYY)'
                                                autoFocus={false} />
                                        </Col>
                                    </Row> */}
                                    {/* <Row className="no-gutters">
                                        <Col className="mb-5" >
                                            <Field name="country" component={RFReactSelect} placeholder='COUNTRY'
                                                search={true} autoFocus={false} type='text' options={countryOptions} />
                                        </Col>
                                    </Row> */}
                                    {/* <Row className="no-gutters">
                                        <Col className="mb-4 genderSelection" >
                                            <Field name="gender" component={RadioBtnInput} placeholder='GENDER' label='GENDER'
                                                classes={{ root: { display: 'flex' } }}
                                                radioBtnOptions={[{ label: 'MALE', value: 'M' }, { label: 'FEMALE', value: 'F' }]} />
                                        </Col>
                                    </Row> */}

                                    <Row className="no-gutters newsOffers">
                                        <Col className="d-flex align-items-center justify-content-center mb-4 " >
                                            <Field name="newsletter_subscription" component={CheckBoxInputField}
                                                label='KEEP ME UP TO DATE ON NEWS AND EXCLUSIVE OFFERS' />
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-center align-items-ceenter mb-5">
                                        <Col xs={12} sm={'auto'} className="d-flex justify-content-center" >
                                            <Button variant="contained" color="primary" className="bottomActionbutton" type="submit">
                                                <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" />CREATE ACCOUNT</Button>
                                        </Col>
                                    </Row>
                                    <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
                                        <p><span>ALREADY HAVE AN ACCOUNT? </span><a href="javascript: void(0)" onClick={this.props.handleSignInReq} className="forgotPassword underlineTxt" >Sign in</a></p>
                                    </div>
                                </form>)}
                        />
                    </div>


                </div>
                </Col>                     
            </React.Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
    };
}
export default connect(mapStateToProps)(GuestSignUpComponent);