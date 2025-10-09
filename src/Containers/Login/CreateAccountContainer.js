import { Form, Field } from 'react-final-form';
import moment from 'moment';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import CalenderIcon from '@material-ui/icons/CalendarTodayOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import {genericPostData} from '../../Redux/Actions/genericPostData';
import showMessage from '../../Redux/Actions/toastAction';
import validate from './Validate/createAccountValidate';
import { Container, Row, Col } from 'reactstrap'
import { Loader } from '../../Global/UIComponents/LoaderHoc';
import { TextInputField, SwitchInputField, DateTimePickerMain } from '../../Global/FormCompoents/wrapperComponent';
import { commonActionCreater } from "../../Redux/Actions/commonAction";
import { cleanEntityData } from '../../Global/helper/commonUtil';


import ReCAPTCHA from "react-google-recaptcha";

const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_KEY;

const styles = theme => ({
});


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
    if (valueOnlyNumbers.length == 2) return `${month}/`;
    if (valueOnlyNumbers.length < 4) return `${month}/${day}`;
    if (valueOnlyNumbers.length == 4) return `${month}/${day}/`;
    if (valueOnlyNumbers.length > 4) return `${month}/${day}/${year}`;
}

class CreateAccountContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            continueDisable: true
        }
    }

    onSubmit = async values => {
        this.setState({ isLoading: true });
        const dob = values.dob ? moment(_get(values, 'dob')).format('MM/DD/YYYY') : '';
        this.setState({ email: values.email, password: values.password });
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: {
                email: values.email,
                password: values.password,
                confirm_password: values.confirm_password,
                first_name: values.first_name,
                last_name: values.last_name,
                // dob
            },
            url: `api/customer/register?email=${values.email}&password=${values.password}&confirm_password=${values.confirm_password}&first_name=${values.first_name}&last_name=${values.last_name}`,
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
        const message = _get(data[0], 'message', '');
        if (code === 1) {
            this.props.dispatch(showMessage({
                text: 'User Created.', isSuccess: true
            }));
            
            // this.kyc();
            this.signIn();
        } else if (code === 2) {
            this.props.dispatch(showMessage({ text: message, isSuccess: false }));
        } else if (message && message.length > 0) {
            this.props.dispatch(showMessage({ text: message, isSuccess: false }));
        } else if (message && message.length === 0) {
            this.props.dispatch(showMessage({ text: 'Something Went Wrong.', isSuccess: false }));
        }
    }
    userRegisterError = (data) => {
        this.setState({ isLoading: false });
        this.props.dispatch(showMessage({ text: 'Something Went Wrong', isSuccess: false }));
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

    kyc = () => {
        this.props.history.push('/kyc');
    }

    handleCaptchChange = () => {
        
        this.setState({ continueDisable: false })
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                {this.state.isLoading && <Loader />}
                <div className="WhiteCurveBg justify-content-start justify-content-md-center">
                    <CssBaseline />
                    <Container className="container-custom homeStylebg d-flex flex-column justify-content-center">
                        <Row className="align-items-center mb-5" style={{ flex: 2, maxHeight: 130, minHeight: 130 }}>
                            <Col className="text-center" >
                                <h4 className="holduptext">CREATE ACCOUNT</h4>
                            </Col>
                        </Row>
                        <Form onSubmit={this.onSubmit} validate={validate}
                            render={({ handleSubmit }) => (
                                <form className="d-flex flex-column justify-content-around mb-4 " onSubmit={handleSubmit}>
                                    <Row>
                                        <Col className="text-center mb-5" >
                                            <Field name="first_name" component={TextInputField} placeholder='FIRST NAME'
                                                autoFocus={false} type='text' />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-center mb-5" >
                                            <Field name="last_name" component={TextInputField} placeholder='LAST NAME'
                                                autoFocus={false} type='text' />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-center mb-5" >
                                            <Field name="email" component={TextInputField} placeholder='EMAIL'
                                                autoFocus={false} type='text' />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-center mb-5" >
                                            <Field name="password" component={TextInputField} placeholder='PASSWORD'
                                                autoFocus={false} type='password' />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-center mb-5" >
                                            <Field name="confirm_password" component={TextInputField} placeholder=' CONFIRM PASSWORD'
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
         
                                    {/* <Row >
                                <Col className="locationTxt" >
                                FORGOT PASSWORD ?
                                </Col>                        
                            </Row> */}
                                    {/* <Row>
                                        <Col className="text-center d-flex align-items-center justify-content-between" >
                                            <Field name="overAge" component={SwitchInputField} label='ARE YOU OVER 21 ?' />
                                        </Col>
                                    </Row> */}
                                    <Row className="justify-content-center mt-5 align-items-center">
                                        <ReCAPTCHA
                                                sitekey={recaptchaSiteKey}
                                                onChange={this.handleCaptchChange}
                                            />
                                    </Row>
                                    <Row className="justify-content-center mt-5 align-items-ceenter">
                                        <Col xs={12} sm={'auto'} className="d-flex justify-content-center" >
                                            <Button variant="contained" color="primary" className="bottomActionbutton" type="submit" disabled={this.state.continueDisable}>
                                                <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" />CREATE ACCOUNT</Button>
                                        </Col>
                                    </Row>
                                </form>)}
                        />

                        <div >
                            <Row>
                                <Col className="text-center" >
                                    <Button variant="text" color="secondary" className="txtButton" onClick={this.signIn} >SIGN IN</Button>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </div>

            </React.Fragment>
        );
    }
}

CreateAccountContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {}
}
export default connect(mapStateToProps)(withStyles(styles)(CreateAccountContainer));