import React from 'react'
import { render } from 'react-dom'
import Styles from './Styles'
import { Form, Field } from 'react-final-form'
import CardChild from './CardChild'
import { Form as ReactStrapFrom, FormGroup, Button, Container, Row, Col, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, } from 'reactstrap';
import proImg from '../../../assets/images/party-can.png';
import watermark from '../../../assets/images/watermark.jpg';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import Scrollbar from "react-scrollbars-custom";
import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate
} from './cardUtils'
import { TextInputField } from "../../../Global/FormCompoents/wrapperComponent"

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import AddCard from "./AddCard";
import { genericPostData } from "../../../Redux/Actions/genericPostData";
import { connect } from "react-redux";
import _get from "lodash/get";
import { commonActionCreater } from "../../../Redux/Actions/commonAction";
import { isMobile, isTablet } from 'react-device-detect';
import { Loader } from "../../../Global/UIComponents/LoaderHoc";

import { PageView } from '../../../Global/helper/react-ga';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onSubmit = async values => {
    await sleep(300)
    window.alert(JSON.stringify(values, 0, 2))
}

class CardComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = { addCard: false };
    }
    addCardFunction = () => {
        this.setState({ addCard: true });
    }
    handleContinueFromExistingCard = () => {
        
        let cartFlow = this.props.cartFlow;
        let selectedCard = this.props.paymentMethods[this.state.selectedCard - 1];
        console.log(selectedCard, 'selected card');
        let card_token = "";
        let card_id = selectedCard.id;
        let customer_stripe_id = selectedCard.customer_stripe_id;
        let card_info = selectedCard.card_info;
        let payment_method = this.props.payment_method;
        // let billing_address_id = _get(this.props.paymentMethods, 'billing_address_id', '');
        let billing_address_id = _get(selectedCard, 'address.billing_address_id', '');
        let data = {
            ...cartFlow,
            card_id,
            card_token,
            customer_stripe_id,
            card_info,
            payment_method,
            billing_address_id
        }
        this.props.dispatch(commonActionCreater(data, 'CART_FLOW'));
        this.props.handleTabOnContinue('checkout');
    }
    handleContinueFromNewCard = () => {
        this.props.handleTabOnContinue('checkout');

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        PageView();
        // cart tab validation
        let cartTabValidation = this.props.cartTabValidation;

        let data = {
            ...cartTabValidation,
            isCardTab: true,
            isSummaryTab: false
        };
        this.props.dispatch(commonActionCreater(data, 'CART_TAB_VALIDATION'));

        // cart tab validation end

        this.fetchCardData();
    }
    fetchCardData = () => {
        let reqObj = {
            api_token: localStorage.getItem("Token"),
            cart_id: localStorage.getItem("cart_id")
        };

        this.setState({ loading: true })
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: "/api/checkout/paymentmethods",
            identifier: "GET_PAYMENTMETHODS",
            successCb: () => { this.setState({ loading: false }) },
            errorCb: () => { this.setState({ loading: false }) },
            dontShowMessage:true

        })
    }
    loadCardDataAndBack = () =>{
        this.setState({addCard:false});
        this.fetchCardData();
    }

    renderContent = (addresses) => {
        let commonContent =
            <div className="scrollerwrapper" >
                <div className="CardsWrapper d-flex align-items-center flex-wrap">
                    <Card  onClick={this.addCardFunction}>
                        <CardBody className="cardStyles addnewcard">
                            <div className="mb-4"><AddCircleOutlineOutlinedIcon style={{ fontSize: 25 }} /> </div>
                            <div>  ADD NEW CARD</div>
                        </CardBody>
                    </Card>
                    {
                        this.props.paymentMethods.map((values, index) => {
                            console.log(`0${values.card_exp_month}${values.card_exp_year}`, 'check dard');
                            return (
                            
                            <span className="ccCardsList" onClick={() => this.setState({ selectedCard: index + 1 })} style={this.state.selectedCard == index + 1 ? { opacity: "1" } : { opacity: ".3" }}>
                                <CardChild
                                    number={("************" + values.card_no) || ''}
                                    issuer={values.brand}
                                    preview={true}
                                    name={values.name || ''}
                                    // expiry={Number(values.card_exp_month) < 10 ? `0${values.card_exp_month}${values.card_exp_year}` : values.card_exp_month + values.card_exp_year || ''}
                                    expiry={Number(values.card_exp_month) < 10 ? `0${values.card_exp_month}${values.card_exp_year}` : `${values.card_exp_month}`+ `${values.card_exp_year}` || ''}
                                    cvc={values.cvc || ''}
                                    className="ccCard"

                                />
                            </span>)}
                        )
                    }
                </div>
            </div>
        if (!this.state.addCard) {
            return <div>{commonContent}</div>
            // if (isMobile || isTablet) {
            //     return <div>{commonContent}</div>
            // }
            // else {
            //     return <Scrollbar className="leftSecmaxHeight">{commonContent}</Scrollbar>
            // }
        }
        else {
            return <AddCard
                loadCardDataAndBack = {this.loadCardDataAndBack}
                goBack={() => this.setState({ addCard: false })}
                handleContinueFromNewCard={this.handleContinueFromNewCard} />
        }

    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        return (
            <React.Fragment>
                <div className="page-content-container">
                <Container fluid={true}>
                    <Row className="no-gutters justify-content-lg-between secMinHeight">
                        <Col lg={5} className="order-1 d-none d-lg-block order-md-2">
                            <div className="productImgSection">
                                <img src={watermark} alt='watermark' className="imgProduct img-responsive"></img>
                            </div>
                        </Col>
                        <Col lg={6} className="p-xl-5 p-md-4 py-4 flex-column d-flex">
                            {!this.state.addCard ? <div className="block-title mb-4">Choose a Card for Payment</div> : null}
                            {this.renderContent()}
                            {!this.state.addCard ?
                                <div className="text-left mt-4" >
                                    <Button variant="contained" onClick={this.handleContinueFromExistingCard} disabled={!this.state.selectedCard} color="primary" className="bottomActionbutton cartActionBtn" type="submit">
                                         Continue
                                        </Button>
                                </div>
                                : null}
                        </Col>

                    </Row>
                </Container>
                </div>

            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    let cartTabValidation = _get(state, 'cartTabValidation.lookUpData', {});
    let paymentMethods = _get(state, "paymentMethods.lookUpData.data", {});
    let payment_method = _get(paymentMethods, "payment_method");
    let cartId = _get(state, "cart.lookUpData[0].cart_id", null);
    paymentMethods = Object.keys(paymentMethods).filter(key => !isNaN(key)).map(key => paymentMethods[key]);
    let cartFlow = _get(state, 'cartFlow.lookUpData', {});
    return {
        paymentMethods,
        cartId,
        cartFlow,
        payment_method,
        cartTabValidation
    }
}

export default connect(mapStateToProps)(CardComponent);
