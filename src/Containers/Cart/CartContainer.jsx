import React from "react";
import { connect } from "react-redux";
import CartItemsList from "../../Components/CartHomeComponents/CartItemList"
import CouponCode from "../../Components/CartHomeComponents/CouponCode";
import CartPriceSummary from "../../Components/CartHomeComponents/CartPriceSummary"
import { genericPostData } from "../../Redux/Actions/genericPostData";
import _get from "lodash/get";
import {isEmpty as _isEmpty, map as _map, omit as _omit} from 'lodash';
import LoaderButton from '../../Global/UIComponents/LoaderButton';
import { isMobile, isTablet } from 'react-device-detect';
import Scrollbar from "react-scrollbars-custom";
import proImg from '../../assets/images/party-can.png';
import waterMark from '../../assets/images/watermark.jpg';
import { Container, Row, Col } from 'reactstrap'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Loader } from "../../Global/UIComponents/LoaderHoc";
import CartEmptyComponent from "../../Components/CartHomeComponents/CartEmptyComponent";
import GiftCard from "../../Components/CartHomeComponents/GiftCard";
import { cleanEntityData } from '../../Global/helper/commonUtil';
import { commonActionCreater } from '../../Redux/Actions/commonAction';

import { PageView, ProductCheckout } from '../../Global/helper/react-ga';

import { Form, Field } from 'react-final-form';
import { TextInputField, SwitchInputField } from '../../Global/FormCompoents/wrapperComponent';


class CartContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enabledGift: false,
            checkoutDisble: false,
            walletOrder: 'false',
            error: {
            },
            selectedFieldState: {},
            cartItemGrouping: {}
        }
    }
    cartFetchSuccess = (data) => {
        let coupon_code = _get(data, "[0].coupon_code", "");
        this.setState({ coupon_code })
        
    };
    cartFetchError = (err) => {
        console.log(err);  //TODO: ERROR CASE NEED TO BE HANDLED 
    };

    componentDidMount() {
        
        window.scrollTo(0, 0);
        const wallet = localStorage.getItem('walletOrder');
        this.setState({
            walletOrder: wallet,
        });
        // if (_isEmpty(this.props.cartFlowDateTime)) {
        //     let data = {
        //         ...this.props.cartFlowDateTime
        //     }
        //     // this.props.dispatch(commonActionCreater(data, 'CART_TAB_VALIDATION'));
        // } else {
        //     let data = {
        //         check: true
        //     }
        //     // this.props.dispatch(commonActionCreater(data, 'CART_TAB_VALIDATION'));
        // }
        
        


    }
    formatPrice = (price) => {
        const newPrice = price.replace(/,/g, '');
        return Number(newPrice);
    };

    reactGACartItem = () => {
        const cart = _map(this.props.cartItems, c => cleanEntityData({
            productId: _get(c, 'product_id'),
            name: _get(c, 'name'),
            quantity: _get(c, 'qty'),
            price: _get(c, 'product_price') ? this.formatPrice(_get(c, 'product_price')) : undefined,
            variant: _get(c, 'type')

        }));
        return cart;
    };

    updateReduxStateForCart = () => {

    }

    validateFormFields = () => {
        let cartflowdatetime = this.props.cartFlowDateTime;
        let cartItemGrouping = _get(this.state, 'cartItemGrouping', {});
        let errorFlag = false;
        let toBeUpdatedFormError = {};
        for (const vendor_name in cartItemGrouping) {
            const data = _get(cartItemGrouping, `${vendor_name}`, []);
            if (_get(data, '0.speed_id') == 'Same Day') {
                // check whether date and time field has value or not, if not then raise error
                if(!cartflowdatetime.hasOwnProperty(`${vendor_name}`) || !cartflowdatetime.hasOwnProperty(`${vendor_name}-timeslot-selected`)) {
                    if (!cartflowdatetime.hasOwnProperty(`${vendor_name}`) ) {
                        // const newError = {
                        //     ...this.state.error,
                        //     [`${vendor_name}`]: true
    
                        // }
                        // console.log(newError, 'newError');
                        // this.setState({ error: {}}, () => {
                        //     this.setState({ error: newError });
                        // });
                        toBeUpdatedFormError = {
                            ...toBeUpdatedFormError,
                            [`${vendor_name}`]: true
                        }
                        errorFlag = true;
                    } else {
                        // const newError = {
                        //     ...this.state.error,
                        //     [`${vendor_name}-timeslot-selected`]: true
    
                        // }
                        // console.log(newError, 'newError');
                        // this.setState({ error: {}}, () => {
                        //     this.setState({ error: newError });
                        // });
                        toBeUpdatedFormError = {
                            ...toBeUpdatedFormError,
                            [`${vendor_name}-timeslot-selected`]: true
                        }
                        errorFlag = true;
                    }
                    
                }

            } else {
                // other kind of delivery method, we have to loop and check each item has date field value or not, if not then raise error
                _map(data, d => {
                    if (!cartflowdatetime.hasOwnProperty(`${vendor_name}-${_get(d, 'name')}`)) {
                        // console.log(this.state.error, 'newError prev error');
                        // const newError = {
                        //     ...this.state.error,
                        //     [`${vendor_name}-${_get(d, 'name')}`]: true
    
                        // }
                        // console.log(newError, 'newError');
                        // this.setState({ error: {}}, () => {
                        //     this.setState({ error: newError });
                        // }) 
                        
                        toBeUpdatedFormError = {
                            ...toBeUpdatedFormError,
                            [`${vendor_name}-${_get(d, 'name')}`]: true
                        }
                        errorFlag = true;
                    }
                })
            }


        } 
        if (!errorFlag) {
            return true;
        } else {
            this.setState({ error: toBeUpdatedFormError });
            return false;
        }
    }
    handleCheckout = async (values) => {
        const validation = this.validateFormFields();
        console.log('gift form values', values, validation, this.state.error);
        if (!validation) {
            return;
        }
        ProductCheckout({ cart: this.reactGACartItem(), step: 1, option: 'Address Options'});
        PageView();
        const shippingType = localStorage.getItem('shippingType');
        this.updateReduxStateForCart()
        if (shippingType === 'dine-in' || shippingType === 'pick-up') {
            localStorage.setItem("nextTab", "card");
            this.props.history.push('/cart/card');
        } else {
            let data = {
                isAddressTab: true,
                isSpeedTab: false,
                iscardTab: false,
                isFaceTab: false,
                isSummaryTab: false
            };
            this.props.dispatch(commonActionCreater(data, 'CART_TAB_VALIDATION'));
            this.props.history.push("/cart/address");
        }
        // this.props.history.push("/cart/address");
    };

    handleGift = () => {
        this.setState({ enabledGift: !this.state.enabledGift });
    }

    checkoutSubmit = () => {
        document
            .getElementById('###giftform###')
            .dispatchEvent(new Event('submit', { cancelable: true }))
    }
    checkoutdisable = (value) => {
        // console.log('checking', value);
      this.setState({checkoutDisble: value})
    }

    updatedCartContainerState = ({vendorName, item, type, date, time}) => {
        // console.log(vendorName, item,type, 'check cart', time);
        let cartflowdatetime = this.props.cartFlowDateTime;
        // console.log(cartflowdatetime, 'check data 1');
        let data = {};
        let finalError = this.state.error;
        if (type == 'sameday') {
            data = {
                ...cartflowdatetime,
                [`${vendorName}`]: date
            }
            // const newError = this.state.error;
            // console.log(newError, 'prevError');
            // _omit(finalError, [`${vendorName}`]);
            delete finalError[`${vendorName}`];

            // console.log(newError, 'newError');
            // this.setState({ error: newError });

            // const newSelectedState = {
            //     ...this.state.selectedFieldState,
            //     [`${vendorName}`]: date
            // }
            // this.setState({ selectedFieldState: {} }, () => {
            //     this.setState({ selectedFieldState: newSelectedState })
            // });
        } else if ( type == 'otherday') {
            data = {
                ...cartflowdatetime,
                [`${vendorName}-${_get(item, 'name')}`]: date
            }
            // const newError = this.state.error;
            // console.log(newError, 'prevError');
            // _omit(finalError, [`${vendorName}-${_get(item, 'name')}`]);
            delete finalError[`${vendorName}-${_get(item, 'name')}`];
            // console.log(newError, 'newError');
            // this.setState({ error: newError });

            // const newSelectedState = {
            //     ...this.state.selectedFieldState,
            //     [`${vendorName}-${_get(item, 'name')}`]: date
            // }
            // this.setState({ selectedFieldState: {} }, () => {
            //     this.setState({ selectedFieldState: newSelectedState })
            // });
        } else if (type == 'sameday-time') {
            data = {
                ...cartflowdatetime,
                [`${vendorName}-timeslot-selected`]: time
            }
            // const newError = this.state.error;
            // console.log(newError, 'prevError');
            // _omit(finalError, [`${vendorName}-timeslot-selected`]);
            delete finalError[`${vendorName}-timeslot-selected`];
            // console.log(newError, 'newError');
            // this.setState({ error: newError });

            // const newSelectedState = {
            //     ...this.state.selectedFieldState,
            //     [`${vendorName}-timeslot-selected`]: time
            // }
            // this.setState({ selectedFieldState: {} }, () => {
            //     this.setState({ selectedFieldState: newSelectedState })
            // });
        }
        // console.log(this.state.selectedFieldState, 'check data');
        this.setState({ error: finalError });
        this.props.dispatch(commonActionCreater(data, 'CART_FLOW_DATE_TIME'));

    }

    updateCartItemGroupingState = (groupedItem) => {
        console.log(groupedItem, 'check 12');
        this.setState({ cartItemGrouping: groupedItem });
    }

    renderContent = () => {
        let { discount, 
            subTotal,
             grandTotal, 
             cartIsFetching, 
             itemRemovedFetching, 
             itemUpdatedFetching, 
             delivery_fee,
            gst_on_fee,
            processing_fee,
            packaging_fee, } = this.props;
        let { coupon_code } = this.state;
        // let windowWidth = window.innerWidth;
        // let cardWidth = windowWidth > 800 ? "60%" : "100%";
        let commonContent = <>
            <div className="cartContainer scrollerwrapper">
                <div className="CartItemParent mb-3" >
                    <CartItemsList
                        {...this.props}
                        dispatch={this.props.dispatch}
                        //width={cardWidth}
                        disable={this.checkoutdisable}
                        updatedCartContainerState={this.updatedCartContainerState}
                        updateCartItemGroupingState = {this.updateCartItemGroupingState}
                        walletOrder={this.state.walletOrder}
                        formError = {this.state.error}
                        cartItems={this.props.cartItems} />
                </div>
                {/* <div className="couponParent">
                    <CouponCode
                        dispatch={this.props.dispatch}
                        onChange={this.onChangeCouponCode}
                        applyCouponLoading={(applyCouponLoading) => this.setState({ applyCouponLoading })}
                        //width={cardWidth}
                        coupon_code={coupon_code} />
                </div> */}
                <div style={{marginTop:"3rem"}} className="couponParent">
                {/* <GiftCard
                handleGift={this.handleGift}
                /> */}
                {/* { this.state.enabledGift ? <Form onSubmit={this.handleCheckout} 
                        render={({ handleSubmit }) => (
                            <form id="###giftform###" onSubmit={handleSubmit}>
                                
                                <div className="d-flex flex-wrap mt-5 no-gutters">
                                    <div className="col-12 col-md-6 pr-md-4">
                                        <Field name="firstName" component={TextInputField} label='RECIPIENT FIRST NAME'
                                            autoFocus={false} type='text' />
                                    </div>
                                    <div className="col-12 mt-5 mt-md-0 col-md-6">
                                        <Field name="lastName" component={TextInputField} label='RECIPIENT LAST NAME'
                                            autoFocus={false} type='text' />
                                    </div>
                                </div>
                                
                                <div className="mt-5">
                                    <Field name="email" component={TextInputField} label='RECIPIENT EMAIL'
                                                autoFocus={false} type='text' />
                                </div>
                                
                                <div className="mt-5">
                                    <Field name="phone" component={TextInputField} label='RECIPIENT PHONE '
                                        autoFocus={false} type='text' />
                                </div>

                                

                                <div className="block-title d-flex justify-content-between align-items-center my-4">
                                    <span className="d-flex align-items-center">
                                    <Field name="overAge" component={SwitchInputField} label='IS RECIPIENT OVER 21 ?' />
                                    </span>
                                </div>

                            </form>)}
                    /> : null } */}
                </div>
                {/* <div
                    //style={{ width: cardWidth }}
                    className="PriceSummaryParent">
                    <CartPriceSummary
                        cartIsFetching={(itemRemovedFetching || itemUpdatedFetching || cartIsFetching)}
                        //width={cardWidth}
                        discount={discount}
                        subTotal={subTotal}
                        bank_charges={this.props?.bank_charges}
                        taxes={this.props.taxes}
                        grandTotal={grandTotal}
                        delivery_fee= {delivery_fee}
                        gst_on_fee={gst_on_fee}
                        processing_fee = {processing_fee}
                        packaging_fee={packaging_fee}
                        walletOrder={this.state.walletOrder}
                    />
                </div> */}
            </div>
        </>
          return <div>{commonContent}</div>
        // if (isMobile || isTablet) {
        //     return <div>{commonContent}</div>
        // }
        // else {
        //     return <Scrollbar className="leftSecmaxHeight">{commonContent}</Scrollbar>
        // }
    }
    render() {
        // if (this.props.itemRemovedFetching) {
        //     return <Loader />
        // }
        let noCartItem = this.props.cartItems.length == 0 && !this.props.cartIsFetching;
        // let { cartIsFetching, itemRemovedFetching, itemUpdatedFetching } = this.props;
        let { coupon_code } = this.state;
        let { discount, 
            subTotal,
             grandTotal, 
             cartIsFetching, 
             itemRemovedFetching, 
             itemUpdatedFetching, 
             delivery_fee,
            gst_on_fee,
            processing_fee,
            delivery_charges,
            packaging_fee, } = this.props;
        console.log(this.props, 'all props');
        return (
            <React.Fragment>
                <div className="page-content-container">
                <Container fluid={true} >
                    <Row style={noCartItem ? { display: "none" } : null} className="no-gutters justify-content-lg-between secMinHeightwt">
                        <Col xs={12} lg={6} className="d-flex flex-column">
                            <div className="block-title mb-3" style={{}}>CART</div>
                            <div >
                                {this.renderContent()}
                            </div>
                            
                            {/* {this.state.checkoutDisble && <div className="mb-5" style={{}}>ordering more than 2000 is not allowed in single day. You can now only add 500 ml</div>} */}
                            
                {/* <div style={{marginTop:"3rem"}} className="couponParent"></div> */}
                            {/* <div className="text-left mt-4" >
                                { this.state.enabledGift ? <LoaderButton
                                    isFetching={itemRemovedFetching || itemUpdatedFetching || cartIsFetching}
                                    variant="contained"
                                    color="primary"
                                    disabled={itemRemovedFetching || itemUpdatedFetching || cartIsFetching}
                                    className="bottomActionbutton cartActionBtn"
                                    onClick={() => this.checkoutSubmit()}>
                                    <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> CHECKOUT
                                  </LoaderButton>
                                  : 
                                  <LoaderButton
                                    isFetching={itemRemovedFetching || itemUpdatedFetching || cartIsFetching}
                                    variant="contained"
                                    color="primary"
                                    disabled={itemRemovedFetching || itemUpdatedFetching || cartIsFetching|| this.state.checkoutDisble}
                                    className="bottomActionbutton cartActionBtn"
                                    onClick={() => this.handleCheckout()}>
                                    <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> CHECKOUT
                                </LoaderButton> }
                            </div> */}
                        </Col>
                        <Col xs={12} lg={5}  >
                            <div className="cartContainer scrollerwrapper">
                                <div className="couponParent">
                                    <CouponCode
                                        dispatch={this.props.dispatch}
                                        onChange={this.onChangeCouponCode}
                                        applyCouponLoading={(applyCouponLoading) => this.setState({ applyCouponLoading })}
                                        //width={cardWidth}
                                        coupon_code={coupon_code} />
                                </div>
                                <div>
                                    <GiftCard
                                        dispatch ={this.props.dispatch}
                                        handleGift={()=>{}}
                                        />  
                                </div>
                                <div
                                    //style={{ width: cardWidth }}
                                    className="PriceSummaryParent">
                                    <CartPriceSummary
                                        cartIsFetching={(itemRemovedFetching || itemUpdatedFetching || cartIsFetching)}
                                        //width={cardWidth}
                                        discount={discount}
                                        subTotal={subTotal}
                                        bank_charges={this.props?.bank_charges}
                                        taxes={this.props.taxes}
                                        grandTotal={grandTotal}
                                        delivery_fee= {delivery_fee}
                                        delivery_charges={delivery_charges}
                                        gst_on_fee={gst_on_fee}
                                        processing_fee = {processing_fee}
                                        packaging_fee={packaging_fee}
                                        walletOrder={this.state.walletOrder}
                                    />
                                </div>
                                <div className="text-left mt-4 mb-4" >
                                    { this.state.enabledGift ? <LoaderButton
                                        isFetching={itemRemovedFetching || itemUpdatedFetching || cartIsFetching}
                                        variant="contained"
                                        color="primary"
                                        disabled={itemRemovedFetching || itemUpdatedFetching || cartIsFetching}
                                        className="bottomActionbutton cartActionBtn"
                                        onClick={() => this.checkoutSubmit()}>
                                        <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> CHECKOUT
                                    </LoaderButton>
                                    : 
                                    <LoaderButton
                                        isFetching={itemRemovedFetching || itemUpdatedFetching || cartIsFetching}
                                        variant="contained"
                                        color="primary"
                                        disabled={itemRemovedFetching || itemUpdatedFetching || cartIsFetching|| this.state.checkoutDisble}
                                        className="bottomActionbutton cartActionBtn"
                                        onClick={() => this.handleCheckout()}>
                                        <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> CHECKOUT
                                    </LoaderButton> }
                                </div>
                                <div className="productImgSection ImgSectionwt">
                                    <img src={waterMark} className="imgProduct"></img>
                                </div>
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
    let cartItems = _get(state, "cart.lookUpData[0].result", []);
    let subTotal = _get(state, "cart.lookUpData[0].subtotal", 0);
    let discount = _get(state, "cart.lookUpData[0].discount", 0);
    //let grandTotal = _get(state, "cart.lookUpData[0].grandtotal", 0);
    let grandTotal = _get(state, "cart.lookUpData[0].subtotal_discount", 0); //for cart it is the subtotal_discount
    let cartIsFetching = _get(state, "cart.isFetching", false);
    let itemRemovedFetching = _get(state, "removeCart.isFetching");
    let itemUpdatedFetching = _get(state, "updateCart.isFetching");
    let feeAmount = _get(state, "cart.lookUpData[0].fee_amount", 0);
    let taxes = _get(state, "cart.lookUpData[0].taxes", 0);
    let  delivery_fee= _get(state, "cart.lookUpData[0].delivery_fee", 0);
    let  delivery_charges= _get(state, "cart.lookUpData[0].delivery_charges", 0);
    let  gst_on_fee= _get(state, "cart.lookUpData[0].gst_on_fee", 0);
    let  processing_fee= _get(state, "cart.lookUpData[0].processing_fee", 0);
    let  packaging_fee= _get(state, "cart.lookUpData[0].packaging_fee", 0);
    let bank_charges = _get(state, "cart.lookUpData[0].bank_charges", 0);
    let userSignInInfo = _get(state, 'userSignInInfo.lookUpData', []);

    let cartFlowDateTime = _get(state, 'cartFlowDateTime.lookUpData', {});

    return {
        cartItems,
        subTotal,
        discount,
        grandTotal,
        cartIsFetching,
        itemRemovedFetching,
        itemUpdatedFetching,
        feeAmount,
        taxes,
        delivery_fee,
        gst_on_fee,
        processing_fee,
        packaging_fee,
        userSignInInfo,
        bank_charges,
        cartFlowDateTime,
        delivery_charges

    }
}


export default connect(mapStateToProps, null)(CartContainer);