import { Form, Field } from 'react-final-form';
import { TextInputField, SwitchInputField } from '../../Global/FormCompoents/wrapperComponent';
import { Button } from '@material-ui/core';
import validate from './Validate/loginValidate';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import LoginComponent from '../../Components/LoginComponents/login';
import {genericPostData} from '../../Redux/Actions/genericPostData';
import showMessage from '../../Redux/Actions/toastAction';
import { Container, Row, Col } from 'reactstrap';
import WithLoading from '../../Global/UIComponents/LoaderHoc';
import { commonActionCreater } from "../../Redux/Actions/commonAction";
import genericGetData from '../../Redux/Actions/genericGetData';
import { cleanEntityData } from '../../Global/helper/commonUtil';

import ReCAPTCHA from "react-google-recaptcha";

const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_KEY;

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    letsPartyButton: {
        textAlign: 'center',
        marginTop: '12px'
    }
});

class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // currentStep: 1
            continueDisable: true
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    

    signInSuccess = ({ data, total_items_count }) => {
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
    }

    onSubmit = async values => {
        let cartId = localStorage.getItem("cart_id");
        let body = cleanEntityData({
            email: _get(values, 'email'),
            password: _get(values, 'password'),
            cart_id: cartId
        });
        genericPostData({
            dispatch: this.props.dispatch,
            // reqObj: { email: values.email, password: values.password },
            reqObj: body,
            
            url: `api/customer/login?email=${values.email}&password=${values.password}`,
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
            // if (_get(data[0], 'result.is_verified') == null || _get(data[0], 'result.is_verified') == 0) {
            //     console.log("---------inside not verified------");
            //     // this.props.history.push('/kyc');
            //     localStorage.setItem('Token', _get(data[0], 'result.api_token', ''));
            //     localStorage.setItem('cart_id', _get(data[0], 'result.cart_id', ''));
            //     const customer_id = _get(data[0], 'result.customer_id');
            //     localStorage.setItem('CustomerId', customer_id);
            //     let cartObj = [{ total_items_count }];
            //     this.props.dispatch(commonActionCreater(cartObj, 'CART_ITEMS_SUCCESS'));
            //     this.props.history.push('/store');
            // } else {
            //     console.log("---------inside verified------");
            //     let cartObj = [{ total_items_count }];
            //     this.props.dispatch(commonActionCreater(cartObj, 'CART_ITEMS_SUCCESS'));
            //     localStorage.setItem('Token', _get(data[0], 'result.api_token', ''));
            //     localStorage.setItem('cart_id', _get(data[0], 'result.cart_id', ''));
            //     const customer_id = _get(data[0], 'result.customer_id');
            //     localStorage.setItem('CustomerId', customer_id);
            //     this.props.history.push('/store');
            // }
            // this.fetchCategories();

            this.signInSuccess({ data, total_items_count });
        } else if (message) {
            this.props.dispatch(showMessage({ text: message, isSuccess: false }));
        } else {
            this.props.dispatch(showMessage({ text: 'Something Went Wrong.', isSuccess: false }));
        }
    }

    fetchCategories = () => {
        const couriertype = localStorage.getItem("couriertype");
        genericGetData({
            dispatch: this.props.dispatch,
            url: "/connect/index/categorylist?store_id=1&courier_type="+couriertype,
            constants: {
                init: "CATEGORIES_LIST_INIT",
                success: "CATEGORIES_LIST_SUCCESS",
                error: "CATEGORIES_LIST_ERROR"
            },
            identifier: "CATEGORIES_LIST",
            successCb: this.categoriesFetchSuccess,
            errorCb: this.categoriesFetchError,
            dontShowMessage: true
        })
    }

    categoriesFetchSuccess = (data) => {

        this.props.history.push('/category/ALL');
    }

    categoriesFetchError = () => { }

    userSigninError = (data) => {
        this.props.dispatch(showMessage({ text: 'Something Went wrong', isSuccess: false }));
    }
    createAccount = () => {
        this.props.history.push('/createAccount');
    }

    forgotPasswordHandler = () => {
        this.props.history.push('/forgot/password');
    }

    handleCaptchChange = () => {
        
        this.setState({ continueDisable: false })
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>

                <div className="WhiteCurveBg justify-content-start justify-content-md-center">
                    <CssBaseline />
                    <Container className="container-custom homeStylebg d-flex flex-column justify-content-center">
                        <Row className="align-items-center  mb-5" style={{ flex: 2, maxHeight: 130, minHeight: 130 }}>
                            <Col className="text-center" >
                                <h4 className="holduptext">SIGN IN</h4>
                            </Col>
                        </Row>


                        <Form onSubmit={this.onSubmit} validate={validate}
                            render={({ handleSubmit }) => (
                                <form className="d-flex flex-column justify-content-around mb-4" onSubmit={handleSubmit}>
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

                                    {/* <Row >
                                        <Col className="locationTxt" >
                                            FORGOT PASSWORD ?
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
                                                <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" />SIGN IN</Button>
                                        </Col>
                                    </Row>

                                </form>)}
                        />


                        <div>
                            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
                                <a href="javascript: void(0)" onClick={this.forgotPasswordHandler} className="forgotPassword">Forgot Password?</a>
                            </div>
                            <Row>
                                <Col className="text-center" >
                                    <Button variant="text" color="secondary" className="txtButton" onClick={this.createAccount} >CREATE ACCOUNT</Button>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </div>

            </React.Fragment>
        );
    }
}


SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    let isLoading = _get(state, 'userSignInInfo.isFetching') || _get(state, 'categoriesList.isFetching')
    return { isLoading }
}
export default connect(mapStateToProps)(withStyles(styles)(WithLoading(SignIn)));