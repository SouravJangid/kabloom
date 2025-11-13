import React from "react";
import CartListItem from "../../CartHomeComponents/CartItemList";
import { connect } from "react-redux";
import _get from "lodash/get";
import { map as _map } from 'lodash';
import { cleanEntityData, deliveryMethods } from '../../../Global/helper/commonUtil';
import { genericPostData } from "../../../Redux/Actions/genericPostData";import CouponCode from "../../../Components/CartHomeComponents/CouponCode";
import { Button, Label } from 'reactstrap';
import CheckOutPriceSummary from "./CheckOutPriceSummary";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MUIButton from '@material-ui/core/Button';

import LoaderButton from '../../../Global/UIComponents/LoaderButton';
import { withRouter } from "react-router-dom";
import { isMobile, isTablet } from 'react-device-detect';
import Scrollbar from "react-scrollbars-custom";
import { Container, Row, Col } from 'reactstrap'
import proImg from '../../../assets/images/party-can.png';
import watermark from '../../../assets/images/watermark.jpg';
import CartImage from '../../../assets/images/Cart_Image.png';
import { createReqObjForCart } from "../../../Global/helper/commonUtil";
import CartEmptyComponent from "../../CartHomeComponents/CartEmptyComponent";
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { commonActionCreater } from "../../../Redux/Actions/commonAction";

import { PageView, MakeTransaction } from '../../../Global/helper/react-ga';
import GiftCard from "../../CartHomeComponents/GiftCard";
import {LoaderOverLay } from '../../../Global/UIComponents/LoaderHoc';

class CheckOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = { driverTip: { id: 0, value: 0 }, driverTipAmount: 0, isLoading: false }
    }

    reactGACartItem = () => {
        const cart = _map(this.props.cartItems, c => cleanEntityData({
            productId: _get(c, 'product_id'),
            name: _get(c, 'name'),
            quantity: _get(c, 'qty'),
            price: _get(c, 'product_price') ? Number(_get(c, 'product_price')) : undefined,
            variant: _get(c, 'type')

        }));
        return cart;
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        PageView();
        //this.fetchCart(this.cartFetchSuccess);
    };
    fetchCart = (successCB) => {
        let reqObj = createReqObjForCart();
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: "/api/cart/showcart",
            identifier: "CART_ITEMS",
            successCb: () => successCB(),
            errorCb: this.cartFetchError,
            dontShowMessage: true
        })
    }
    cartFetchSuccess = (data) => {
        let coupon_code = _get(data, "[0].coupon_code", "");
        this.setState({ coupon_code })
    };
    cartFetchError = (err) => {
        //TODO ERROR HANDLING REAMINING WHEN FETCHING THE CART
        console.log(err);
    };
    DriverTip = (DriverTipObj) => {
        let subtotal = this.props.subTotal.split(",").join("");
        let driverTipAmount = (Number(subtotal) * (DriverTipObj.value) / 100).toFixed(2)
        this.setState({ driverTip: DriverTipObj, driverTipAmount })
    }
    placeOrder = () => {
        let { cartFlow, taxes, cartId,giftMessage } = this.props;
        const cartItems = this.props.cartItems;
        const cartFlowDateTime = this.props.cartFlowDateTime;
        
        // Use billing address ID if available, otherwise use selected delivery address as billing address
        let billingAddressId = _get(cartFlow, 'billing_address_id', "");
        
        // If no billing address is specified, use the selected delivery address as billing address
        if (!billingAddressId) {
            billingAddressId = _get(cartFlow, 'selectedAddress', "");
        }
        
        // Final validation - ensure we have an address for billing
        if (!billingAddressId) {
            alert("Delivery address is required. Please add a delivery address before placing the order.");
            return;
        }
        
        const deliverable = _map(cartItems, c => {
            if (_get(c, 'speed_id') == 'Same Day') {

                const date = _get(cartFlowDateTime, `${_get(c, 'vendor_name')}#${deliveryMethods[`${_get(c, 'speed_id')}`]}`, null);
                const timeslot = _get(cartFlowDateTime, `${_get(c, 'vendor_name')}#${deliveryMethods[`${_get(c, 'speed_id')}`]}-timeslot-selected`, null);
                return {
                    item_id: _get(c, 'cart_rid'),
                    vendor_loc_id: _get(c, 'vendor_loc_id'),
                    date,
                    timeslot,
                    shipping_amount: _get(c, 'shipping_amount')
                }
            } else {
                const date = _get(cartFlowDateTime, `${_get(c, 'vendor_name')}#${deliveryMethods[`${_get(c, 'speed_id')}`]}-${_get(c, 'name')}`, null);
                return {
                    item_id: _get(c, 'cart_rid'),
                    vendor_loc_id: _get(c, 'vendor_loc_id'),
                    date,
                    shipping_amount: _get(c, 'shipping_amount')
                }
            }
        })
        let reqObj = {
            "api_token": localStorage.getItem("Token"),
            "cart_id": cartId,
            "delivery_address_id": cartFlow.selectedAddress,
            "billing_address_id": billingAddressId,
            "speed_id": cartFlow.selectedSpeedID,
            "retialer_id": cartFlow.selectedRetailerID,
            "ship_method_id": cartFlow.selectedShippingMethodID == -1 ? "" : cartFlow.selectedShippingMethodID,
            "delivery_date": cartFlow.deliveryDate,
            "ship_method": cartFlow.selectedShippingMethod == "none" ? "" : cartFlow.selectedShippingMethod,
            "ship_method_amount": cartFlow.shippingAmount,
            "card_id": cartFlow.card_id,
            "customer_stripe_id": cartFlow.customer_stripe_id,
            "card_info": cartFlow.card_info,
            "card_token": cartFlow.card_token,
            "taxes": taxes,
            "delivery_fee": cartFlow.deliveryFee,
            "driver_tip": this.state.driverTipAmount.toString(), //workhere
            "payment_method": cartFlow.payment_method,
            "gift_message":giftMessage,
            "pickup_date": cartFlow.pickup_date,
            "time_slot": "null",
            "deliverable": deliverable
            
        }
        
        // console.log(reqObj, 'place order');
        this.setState({ placeOrderLoading: true, isLoading: true })
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: "/api/placeorder/placeorder",
            identifier: "PLACE_ORDER",
            successCb: this.placeOrderSuccess,
            errorCb: this.placeOrderError,
            dontShowMessage: true
        })
    }
    reactGAPurchase = ({ data }) => {

        const cart = this.reactGACartItem();
        const purchasePayload= cleanEntityData({
            id: _get(data, 'order_id'),
            revenue: this.props.grandTotal ? Number(this.props.grandTotal) : undefined,
            tax: this.props.taxes ? Number(this.props.taxes) : undefined,
            shipping: this.props.cartFlow.shippingAmount ? Number(this.props.cartFlow.shippingAmount) : undefined,
            coupon: this.props.coupon_code,

        });
        MakeTransaction({ cart, purchasePayload });

    };
    placeOrderSuccess = (data) => {
        if (data.code === 1) {
            this.reactGAPurchase({ data });

            localStorage.removeItem("cart_id"); //removing the cart_id when place order is done
            this.props.dispatch(commonActionCreater("", "GIFT_MESSAGE"));
            this.props.dispatch(commonActionCreater({}, "CART_FLOW_DATE_TIME"));
            this.fetchCart(() => {
                this.setState({ placeOrderLoading: false, isLoading: false });
                this.setState({ order_id: data.order_id, orderPlaced: true });
                if (window.gtag) {
                    // console.log("GTag event fired");
                    
                    window.gtag('event', 'conversion', {
                        'send_to': 'AW-16867197670/kB84CPGN7JwaEOaF9Oo-',
                        'value': data.amount_paid,
                        'currency': 'USD',
                        'transaction_id': data.order_id
                    });
                    //@todo provide the user email id 
                    window.gtag('set', 'user_data', {
                        "email": data.email,
                        "phone_number": data.phone
                    });
                }
            });
        }
        else {
            this.setState({ placeOrderLoading: false, isLoading: false })
            // If invalid_items are present, mark them in state and redirect to /cart
            const invalidItems = data.invalid_items || [];            
            if (invalidItems.length > 0) {
                // Store invalid product info in state
                this.setState({ invalidItems });
                // Redirect to /cart
                // this.props.history.push("/cart");
            }

            if(data.code==="false" && data.message==="Invalid shipping dates detected"){
                this.setState({ isDateError: true , dateErrorMessage: data.message});
            }
            // alert(_get(data, "message", "something went wrong while placing the order"));
        }
    }
    placeOrderError = () => {
        this.setState({ placeOrderLoading: false, isLoading: false });
        alert("internal server error occured");
        //TODO ERROR HANDLING REAMINING WHEN FETCHING THE CART
    }


    onChange = (e) => {
        this.setState({ coupon_code: e.target.value })
    }


    trackOrder = () => {
        this.props.history.push("/setting/order")
    }

    updatedCartContainerState = ({vendorName, item, type, date, time}) => {
        // console.log(vendorName, item,type, 'check cart', time);
        let cartflowdatetime = this.props.cartFlowDateTime;
        // console.log(cartflowdatetime, 'check data 1');
        let data = {};
        if (type == 'sameday') {
            data = {
                ...cartflowdatetime,
                [`${vendorName}`]: date
            }
        } else if ( type == 'otherday') {
            data = {
                ...cartflowdatetime,
                [`${vendorName}-${_get(item, 'name')}`]: date
            }
        } else if (type == 'sameday-time') {
            data = {
                ...cartflowdatetime,
                [`${vendorName}-timeslot-selected`]: time
            }
        }
        // console.log(data, 'check data');
        this.props.dispatch(commonActionCreater(data, 'CART_FLOW_DATE_TIME'));

    }

    renderContent = () => {
        let { discount, subTotal, grandTotal, taxes, feeAmount, delivery_charges, cartIsFetching, itemRemovedFetching, itemUpdatedFetching } = this.props;
        let { coupon_code, invalidItems } = this.state;
        // Map invalidItems to a lookup for quick access
        
        const invalidMap = (invalidItems || []).reduce((acc, item) => {
            acc[item.product_id] = item.message || "Out of Stock";
            return acc;
        }, {});
        // Enhance cartItems with out_of_stock info
         
        // console.log("invalidMap",invalidMap);
        
        // let windowWidth = window.innerWidth;
        // let cardWidth = windowWidth > 800 ? "60%" : "100%";
        let commonContent = <>
            <div className="cartContainer scrollerwrapper">
                <div className="CartItemParent">
                    <CartListItem
                        dispatch={this.props.dispatch}
                        cartIsFetching={(itemRemovedFetching || itemUpdatedFetching || cartIsFetching)}
                        //width={cardWidth}
                        isCheckOut = {true}
                        updatedCartContainerState={this.updatedCartContainerState}
                        cartItems={this.props.cartItems}
                        cartItemErroDataCheckout={invalidMap}
                        isDateError ={this.state.isDateError}
                        dateErrorMessage={this.state.dateErrorMessage}
                        />
                </div>
                {/* <div className="couponParent mt-5">
                    <CouponCode dispatch={this.props.dispatch} onChange={this.onChange} coupon_code={coupon_code} />
                </div>    
                {_get(this.props, "cartFlow.selectedSpeedID") == 1 && <div className="driverTip">
                    <Label>TIP FOR DRIVER </Label>
                    <br />
                    <ButtonGroup color="secondary" aria-label="outlined primary button group">
                        <MUIButton style={this.state.driverTip.id == 0 ? { background: "white", color: '#000' } : null} onClick={() => this.DriverTip({ id: 0, value: 0 })}>0%</MUIButton>
                        <MUIButton style={this.state.driverTip.id == 0.5 ? { background: "white", color: '#000' } : null} onClick={() => this.DriverTip({ id: 0.5, value: 5 })}>5%</MUIButton>
                        <MUIButton style={this.state.driverTip.id == 1 ? { background: "white", color: '#000' } : null} onClick={() => this.DriverTip({ id: 1, value: 10 })}>10%</MUIButton>
                        <MUIButton style={this.state.driverTip.id == 2 ? { background: "white", color: '#000' } : null} onClick={() => this.DriverTip({ id: 2, value: 15 })}>15%</MUIButton>
                        <MUIButton style={this.state.driverTip.id == 3 ? { background: "white", color: '#000' } : null} onClick={() => this.DriverTip({ id: 3, value: 20 })}>20%</MUIButton>
                    </ButtonGroup>
                </div>}
                <GiftCard
                 dispatch ={this.props.dispatch}
                handleGift={()=>{}}
                />  
                <div className="PriceSummaryParent">
                    <CheckOutPriceSummary
                        showDriverTip={_get(this.props, "cartFlow.selectedSpeedID") == 1}
                        delivery_charges={delivery_charges}
                        shippingAmount={this.props.cartFlow.shippingAmount}
                        taxes={taxes}
                        subTotal={subTotal}
                        grandTotal={grandTotal}
                        driverTipAmount={this.state.driverTipAmount || 0}
                        discount={discount}
                        cartIsFetching={(itemRemovedFetching || itemUpdatedFetching || cartIsFetching)}
                    />
                </div> */}
            </div>
        </>
        return <div>{commonContent}</div>
    }

    render() {
        let { discount, subTotal, grandTotal, taxes, feeAmount, delivery_charges, cartIsFetching, itemRemovedFetching, itemUpdatedFetching } = this.props;
        let { coupon_code } = this.state;
        if (this.state.orderPlaced) {
            return (
                <React.Fragment>
                    
                    <Container fluid={true}>
                        <Row className="no-gutters justify-content-lg-between secMinHeight">
                            <Col lg={6} className="p-xl-5 p-md-4 py-4 d-flex flex-column align-items-center justify-content-center orderPlaced">
                                <span>Order Placed.</span>
                                <span className="mt-0">Your Order id is <b class="orderNumber">#{this.state.order_id}</b></span>
                                <div className="mt-5" >

                                   {!this.props.isGuest?
                                        <LoaderButton
                                            onClick={this.trackOrder}
                                            color="primary"
                                            variant="contained"
                                            type="submit" className="bottomActionbutton autoWidthbtn transiBtn btn btn-secondary">
                                            <LocationOnOutlinedIcon className="mr-3" /> Your Orders
                                        </LoaderButton>
                   :<LoaderButton
                                        onClick={() => window.location.href = (window.location.origin+"/category/ALL")}
                                            color="primary"
                                            variant="contained"
                                            type="submit" className="bottomActionbutton autoWidthbtn transiBtn btn btn-secondary">
                                            Continue Shopping
                                        </LoaderButton>}
                                </div>
                            </Col>
                            <Col lg={5} className="d-none d-lg-block">
                                <div className="productImgSection">
                                    <img src={CartImage} alt="watermark" className="imgProduct img-responsive"></img>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    
                </React.Fragment>
            )
        }

        let noCartItem = this.props.cartItems.length == 0 && !this.props.cartIsFetching;
        // let { cartIsFetching, itemRemovedFetching, itemUpdatedFetching } = this.props;
        return (
            <React.Fragment>
                <div className="page-content-container">
                <Container fluid={true}>
                {this.state.isLoading ? <LoaderOverLay /> : null }
                    
                    <Row style={noCartItem ? { display: "none" } : null} className="no-gutters justify-content-lg-between secMinHeight">
                        <Col xs={12} lg={6} className="p-xl-5 p-md-4 py-4 flex-column d-flex">
                            <div className="block-title mb-5">Order Summary</div>
                            {this.renderContent()}
                            {/* <div className="mt-4" >
                                <LoaderButton
                                    isFetching={
                                        itemRemovedFetching
                                        || itemUpdatedFetching
                                        || cartIsFetching
                                        || this.state.placeOrderLoading
                                    }
                                    variant="contained"
                                    color="primary"
                                    className="bottomActionbutton cartActionBtn"
                                    type="submit" onClick={this.placeOrder}>
                                    PLACE ORDER
                                </LoaderButton>
                            </div> */}
                        </Col>
                        <Col lg={5} className="d-lg-block">
                            <div className="cartContainer">
                                <div className="couponParent mt-5">
                                    <CouponCode dispatch={this.props.dispatch} onChange={this.onChange} coupon_code={coupon_code} />
                                </div>    
                                {_get(this.props, "cartFlow.selectedSpeedID") == 1 && <div className="driverTip">
                                    <Label>TIP FOR DRIVER </Label>
                                    <br />
                                    <ButtonGroup color="secondary" aria-label="outlined primary button group">
                                        <MUIButton style={this.state.driverTip.id == 0 ? { background: "white", color: '#000' } : null} onClick={() => this.DriverTip({ id: 0, value: 0 })}>0%</MUIButton>
                                        <MUIButton style={this.state.driverTip.id == 0.5 ? { background: "white", color: '#000' } : null} onClick={() => this.DriverTip({ id: 0.5, value: 5 })}>5%</MUIButton>
                                        <MUIButton style={this.state.driverTip.id == 1 ? { background: "white", color: '#000' } : null} onClick={() => this.DriverTip({ id: 1, value: 10 })}>10%</MUIButton>
                                        <MUIButton style={this.state.driverTip.id == 2 ? { background: "white", color: '#000' } : null} onClick={() => this.DriverTip({ id: 2, value: 15 })}>15%</MUIButton>
                                        <MUIButton style={this.state.driverTip.id == 3 ? { background: "white", color: '#000' } : null} onClick={() => this.DriverTip({ id: 3, value: 20 })}>20%</MUIButton>
                                    </ButtonGroup>
                                </div>}
                                <GiftCard
                                dispatch ={this.props.dispatch}
                                handleGift={()=>{}}
                                />  
                                <div className="PriceSummaryParent">
                                    <CheckOutPriceSummary
                                        showDriverTip={_get(this.props, "cartFlow.selectedSpeedID") == 1}
                                        delivery_charges={delivery_charges}
                                        shippingAmount={this.props.cartFlow.shippingAmount}
                                        taxes={taxes}
                                        subTotal={subTotal}
                                        grandTotal={grandTotal}
                                        driverTipAmount={this.state.driverTipAmount || 0}
                                        discount={discount}
                                        cartIsFetching={(itemRemovedFetching || itemUpdatedFetching || cartIsFetching)}
                                    />
                                </div>
                                <div className="mt-4" >
                                    <LoaderButton
                                        isFetching={
                                            itemRemovedFetching
                                            || itemUpdatedFetching
                                            || cartIsFetching
                                            || this.state.placeOrderLoading
                                        }
                                        variant="contained"
                                        color="primary"
                                        className="bottomActionbutton cartActionBtn"
                                        type="submit" onClick={this.placeOrder}>
                                        PLACE ORDER
                                    </LoaderButton>
                                </div>
                            </div>
                            <div className="productImgSection proDetailSec" style={{ margin: '3rem auto 3rem auto'}}>
                                <img src={CartImage} alt="watermark" className="imgProduct img-responsive"></img>
                            </div>
                            
                        </Col>
                    </Row>
                    {noCartItem && <CartEmptyComponent />}
                    
                </Container>
                </div>
            </React.Fragment>
        )
    }

}


function mapStateToProps(state) {
    let cartId = _get(state, "cart.lookUpData[0].cart_id", '');
    let cartItems = _get(state, "cart.lookUpData[0].result", []);
    let subTotal = _get(state, "cart.lookUpData[0].subtotal", "");
    let discount = _get(state, "cart.lookUpData[0].discount", "");
    let grandTotal = _get(state, "cart.lookUpData[0].grandtotal", "");
    let feeAmount = _get(state, "cart.lookUpData[0].fee_amount", "");
    let taxes = _get(state, "cart.lookUpData[0].taxes", "");
    let delivery_charges = _get(state, "cart.lookUpData[0].delivery_charges", "")
    let coupon_code = _get(state, "cart.lookUpData[0].coupon_code", "");
    let cartIsFetching = _get(state, "cart.isFetching", false);
    let itemRemovedFetching = _get(state, "removeCart.isFetching");
    let itemUpdatedFetching = _get(state, "updateCart.isFetching");
    let cartFlow = _get(state, "cartFlow.lookUpData");
    let giftMessage = _get(state, "giftMessage.lookUpData","");
    let userName = _get(state,"userSignInInfo.lookUpData[0].result.cust_name",''); 
    let isGuest = userName ? false : true;
    let cartFlowDateTime = _get(state, 'cartFlowDateTime.lookUpData', {});
    return {
        cartItems,
        subTotal,
        discount,
        coupon_code,
        grandTotal,
        taxes,
        delivery_charges,
        cartIsFetching,
        itemRemovedFetching,
        itemUpdatedFetching,
        cartFlow,
        cartId,
        feeAmount,
        giftMessage,
        isGuest,
        cartFlowDateTime
    }
}

export default connect(mapStateToProps, null)(withRouter(CheckOut));