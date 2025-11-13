import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { Container, Row, Col } from 'reactstrap'
import { Button, Badge } from '@material-ui/core';
import { get as _get, isEmpty as _isEmpty } from "lodash";
import { commonActionCreater } from "../../Redux/Actions/commonAction";
import { genericPostData } from "../../Redux/Actions/genericPostData";
import { logoutActionCreator } from '../../Redux/Actions/logoutAction';
import cLogo from '../../../src/assets/images/cocktail-courier-logo.png';
const styles = theme => ({

});

class Footer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // showUserMenuOption: false
        }
    }

    // showUserMenu = () => {
    //     this.setState({ showUserMenuOption: true })
    //     // this.props.history.push('/setting/user')
    // }

    handleAddProductToCart = () => {
        if (this.props.history.location.pathname.includes("product")) {
            genericPostData({
                dispatch: this.props.dispatch,
                reqObj: this.props.addProductToCartByFooter,
                url: `api/cart/addtocart`,
                constants: {
                    init: "ADD_TO_CART_INIT",
                    success: "ADD_TO_CART_SUCCESS",
                    error: "ADD_TO_CART_ERROR"
                },
                identifier: "ADD_TO_CART",
                successCb: this.addToCartSuccess,
                errorCb: this.addToCartFailure,
                dontShowMessage: true,
            })
        }
    }

    addToCartSuccess = (data) => {
        localStorage.setItem("cart_id", data[0].cart_id);
        this.props.history.push('/cart');
    }

    showUserMenu = () => {
        this.props.showUserMenu();
    }
    handleSettingClick = () => {
        this.props.history.push("/setting/user");
    }
    handleSignInClick = () => {
        this.props.history.push("/signIn");
    }
    handleCreateAccountClick = () => {
        this.props.history.push("/createAccount");
    }
    handleLogout = () => {
        this.props.dispatch(logoutActionCreator());
        this.props.history.push("");
        window.location.reload();

    }


    render() {
        const { classes, isLoginAndSignupScreen } = this.props;
        return (
            <React.Fragment>
                <Container fluid={true} className="footerLayout d-flex align-items-center py-4  p-md-3">
                    <Container className="justify-content-center ">
                        <Row className="w-100  no-gutters justify-content-xl-between justify-content-center ">
                            <Col  xl={'8'} className="mb-4 mb-xl-0" >
                                <div className="d-flex flex-wrap flex-row justify-content-center justify-content-xl-start footerLink">
                                    <a href="/contact-us">Contact Us</a>
                                    <a href="/faq">FAQs</a>
                                    <a href="/privacy-policy">Privacy & Cookie Policy</a>
                                    <a href="/terms-conditions">Terms & Conditions</a>
                                    <a href="/about-us">About Us</a>
                                    <a href="/refund-policy">Refund Policy</a>
                                    
                                </div>
                            </Col>
                            <Col  xl={'4'} className="d-flex drinkText flex-row justify-content-center justify-content-xl-end" >
                                <span className="pb-2">© {new Date().getFullYear()} Kabloom, All Rights Reserved</span>
                                {/* <span>Please drink responsible</span> */}
                            </Col>


                        </Row>
                    </Container>
                </Container>

            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    let total_items_count = _get(state, "cart.lookUpData[0].total_items_count", 0);
    let addProductToCartByFooter = _get(state, 'addProductToCartByFooter.lookUpData');
    let userName = _get(state, "userSignInInfo.lookUpData[0].result.cust_name", '');
    return { addProductToCartByFooter, userName, total_items_count }
}

export default connect(mapStateToProps)(withStyles(styles)(Footer));