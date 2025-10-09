import React from "react";
import { genericPostData } from "../../Redux/Actions/genericPostData";
import { connect } from "react-redux";
import _ from "lodash";
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap'
import proImg from '../../assets/images/party-can.png';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import RemoveOutlinedIcon from '@material-ui/icons/RemoveOutlined';
import { createReqObjForCart, cleanEntityData, deliveryMethods, deliveryMethodsAbb, enrichArrDataToObj, deliveryMethodsAbbReverse, presentDateInEST, oneDateLaterInEST } from "../../Global/helper/commonUtil";
import _get from "lodash/get";
import CartEmptyComponent from "./CartEmptyComponent";
import { Loader, LoaderOverLay } from "../../Global/UIComponents/LoaderHoc";
import { ProductRemovefromCart } from '../../Global/helper/react-ga';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { cartItem } from "../../assets/data/cartitem";
import { commonActionCreater } from '../../Redux/Actions/commonAction';
import { FormHelperText } from '@material-ui/core';
import moment from 'moment-timezone';


import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
  import DateFnsUtils from '@date-io/date-fns';
  import 'date-fns';
  import { isEqual } from 'date-fns'; // Helper to compare dates



//THIS COMPONENT IS COMMON FOR CHECKOUT CONTAINER AND CART CONTAINER
class CartItemList extends React.Component {
    constructor(props) {
        super(props);
        // if (this.props.isCheckOut && this.props.cartItems && this.props.cartItems.length > 0) {
        //     const result_data = this.props.cartItems.map(d => ({
        //       ...d,
        //       vendor_name_modified: `${d.vendor_name}#${deliveryMethods[d.speed_id]}`
        //     }));
        //     const cartItemsGrouping = Object.groupBy(result_data, ({ vendor_name_modified }) => vendor_name_modified);
        //     this.state = { cartItems: result_data, cartItemsGrouping, cartIsFetching: false, deliveryTime: null, deliveryDate: {}, timeslot: {} };
        //     this.usePropCartOnly = true; // flag to skip fetch
        // } else {
            this.state = { cartItems: [], cartItemsGrouping: {}, cartIsFetching: false, deliveryTime: null, deliveryDate: {}, timeslot: {} };
            // this.usePropCartOnly = false;
        // }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        // if (this.usePropCartOnly) return; // don’t overwrite with API data
        this.setState({ cartIsFetching: true })
        if (this.props.isCheckOut) {
            this.fetchTaxes(this.sb, this.eb)
        }
        else {
            this.fetchCartAgain(this.sb, this.eb);
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.isCheckOut) {
            const prevItems = _get(prevProps, 'cartItemErroDataCheckout', []);
            const cartItemErroDataCheckout = _get(this.props, 'cartItemErroDataCheckout', []);
            if (prevItems !== cartItemErroDataCheckout) {
                const result_data = (this.state.cartItems || []).map(d => {
                    let resp={};
                    if (cartItemErroDataCheckout?.[d.product_id]) {
                        resp={
                            out_of_stock: true, 
                            message: cartItemErroDataCheckout[d.product_id] 
                        }
                    }
                    return ({
                        ...d,
                        ...resp
                })});
                console.log("result_data",result_data,cartItemErroDataCheckout);
                const cartItemsGrouping = Object.groupBy(result_data, ({ vendor_name_modified }) => vendor_name_modified);
                
                this.setState({ cartItems: result_data, cartItemsGrouping, cartIsFetching: false });
            }
        }
    }
    fetchTaxes = (sb, eb) => {
        let { cartFlow, avail_id } = this.props;
        let reqObj = {
            ...createReqObjForCart(),
            "delivery_address_id": cartFlow.selectedAddress,
            "speed_id": cartFlow.selectedSpeedID,
            "retialer_id": cartFlow.selectedRetailerID,
            "ship_method_id": cartFlow.selectedShippingMethodID == -1 ? "" : cartFlow.selectedShippingMethodID,
            "delivery_date": cartFlow.deliveryDate,
            "ship_method": cartFlow.selectedShippingMethod == "none" ? "" : cartFlow.selectedShippingMethod,
            "ship_method_amount": cartFlow.shippingAmount,
            "avail_id": avail_id
        }
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: "/api/checkout/orderreview",
            constants: {
                init: "CART_ITEMS_INIT",
                success: "CART_ITEMS_SUCCESS",
                error: "CART_ITEMS_ERROR"
            },
            identifier: "CART_ITEMS",
            successCb: sb,
            errorCb: eb,
            dontShowMessage: true
        })
    }
    // orderReviewSuccess = (data)=>{
    //     if(data[0].code==1){
    //     let taxes = _get(data,"[0].taxes");
    //     let grandTotal = _get(data,"[0].grandTotal");
    //     let discount = _get(data,"[0].discount");
    //     this.setState({taxes,grandTotal,discount,fetchingTaxes:false});
    //     }
    //     else{
    //         alert("something went wrong while fetching taxes")
    //     }
    // }
    sb = (data) => {
        // groupign cart items
        // data = cartItem
        let result_data = _.get(data, '0.result', []);
        result_data = _.map(result_data, d => {
            const vendor_name_modified = `${_.get(d, 'vendor_name')}#${deliveryMethods[`${_.get(d, 'speed_id')}`]}`
            return {
                ...d,
                vendor_name_modified,
            }
        });
        // console.log(result_data, 'data modified');
        data = [{
            ..._.get(data, '0'),
            result: result_data
        }]
        const groupedCartItems = Object.groupBy(result_data, ({ vendor_name_modified }) => vendor_name_modified);
        
        this.setState({ cartItems: [] }, () => { this.setState({ cartItems: _get(data, "[0].result", []), cartItemsGrouping: groupedCartItems  }) });

        if(this.props.updateCartItemGroupingState){
            this.props.updateCartItemGroupingState(groupedCartItems);
        }
        // this.setState({ cartIsFetching: false })
        if (!_.isEmpty(_get(data, "[0].result", []))) {
            if (_.isEmpty(_get(this.props.userSignInInfo, '[0].result.api_token', ''))) {
                this.props.history.push('/guest/register');
            }
        }

        this.fetchNextDate({ cartItems: data, groupedCartItems });

    }
    eb = (err) => {
        this.setState({ cartIsFetching: false })

        //TODO HANDLE FETCH ERROR HANDLING REMAIMNING
    }

    fetchNextDate  = ({ cartItems, groupedCartItems }) => {
        let reqObj = [];
        for (const property in groupedCartItems) { 
            const data = _.get(groupedCartItems, `${property}`) || [];
        
        
            if (_.get(data, '0.speed_id') === 'Same Day') {
                _.map(data, (item, key) => {
                    const vendor_loc_id = _get(item, 'vendor_loc_id');

                    reqObj.push({
                        vendor_id: vendor_loc_id,
                        delivery_type: _get(deliveryMethodsAbb, `${_get(item, 'speed_id')}`)
                    })
                });
            } else {
                _.map(data, (item, key) => {
                    const vendor_loc_id = _get(item, 'vendor_loc_id');

                    reqObj.push({
                        vendor_id: vendor_loc_id,
                        delivery_type: _get(deliveryMethodsAbb, `${_get(item, 'speed_id')}`)
                    })
                })
                
            }
    
        }

        // console.log(reqObj, 'check111');
        // let reqObj = {
        //     ...createReqObjForCart(),
        //     // coupon_code: 'Partay',
        //     // coupon_code: 'NUDGE20'
        // }
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: "/connect/delivery/nextDeliveryDate",
            constants: {
                init: "NEXTDELIVERYDATE_ITEMS_INIT",
                success: "NEXTDELIVERYDATE_ITEMS_SUCCESS",
                error: "NEXTDELIVERYDATE_ITEMS_ERROR"
            },
            identifier: "NEXTDELIVERYDATE_ITEMS",
            successCb: this.fetchNextDateSuccess,
            errorCb: this.fetchNextDateError, //TODO: ERROR CASE NEED TO BE HANDLED 
            dontShowMessage: true
        }) 
    }

    fetchNextDateSuccess = (data) => {
        if (_get(data, 'status') == true) {
            const result_data = _.map(_get(data, 'response'), d => {
                const vendor_id_modified = `${_.get(d, 'vendor_id')}#${deliveryMethodsAbbReverse[`${_.get(d, 'delivery_type')}`]}`
                
                return {
                    ...d,
                    vendor_id_modified,
                }
            });
            // console.log(result_data, 'check 1122');
            const newDeliveryDateObj = enrichArrDataToObj({ data: result_data, field: 'vendor_id_modified'});
            // console.log(newDeliveryDateObj, 'check 123')
            this.setState({ nextDeliveryDate: newDeliveryDateObj, cartIsFetching: false});
        } else {
            this.setState({ cartIsFetching: false})
        }
    }

    fetchNextDateError = (e) => {
        // console.log('Next Delivery Date Error', e);
        this.setState({ cartIsFetching: false })
    }

    reactGAADDRemoveFromCart = ({ id, item }) => {

        const cart = cleanEntityData({
            productId: _.get(item, 'product_id'),
            name: _.get(item, 'name'),
            quantity: _.get(item, 'qty'),
            price: _.get(item, 'product_price'),
            variant: _.get(item, 'type'),
        });
        if (id === 2) {
            ProductRemovefromCart({ ...cart });


        }
    };

    handleCartRemoveItem = (item) => {
        this.setState({ itemRemovedFetching: true });
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: {
                api_token: localStorage.getItem("Token"),
                cart_rid: item.cart_rid,
                cart_id: localStorage.getItem("cart_id")
            },
            url: "/api/cart/deleteitem",
            identifier: "CART_ITEM_REMOVE",
            successCb: () => {
                this.setState({ itemRemovedFetching: false, cartIsFetching: true });
                if (this.props.isCheckOut) {
                    this.fetchTaxes(this.sb, this.eb)
                }
                else {
                    this.fetchCartAgain(this.sb, this.eb);
                }
                this.reactGAADDRemoveFromCart({ id: 2, item });
            },
            errorCb: this.handleCartItemRemoveError,
            dontShowMessage: true
        })
    }
    handleCartItemRemoveError = (err) => {
        this.setState({ itemRemovedFetching: false });
        ////TODO: ERROR CASE NEED TO BE HANDLED
    }
    fetchCartAgain = (sb, eb) => {

        let reqObj = {
            ...createReqObjForCart(),
            // coupon_code: 'Partay',
            // coupon_code: 'NUDGE20'
        }
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: "/api/cart/showcart",
            constants: {
                init: "CART_ITEMS_INIT",
                success: "CART_ITEMS_SUCCESS",
                error: "CART_ITEMS_ERROR"
            },
            identifier: "CART_ITEMS",
            successCb: sb,
            errorCb: eb, //TODO: ERROR CASE NEED TO BE HANDLED 
            dontShowMessage: true
        })
    }
    callUpdateQuantityApi = (item, newQty) => {
        let reqObj = {
            "api_token": localStorage.getItem("Token"),
            cart_rid: item.cart_rid,
            cart_id: localStorage.getItem("cart_id"),
            qty: newQty,
            product_id: item.product_id
        }
        if (newQty == 0) {
            this.handleCartRemoveItem(item);
            return;
        }
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: "/api/cart/updateitem",
            identifier: "CART_ITEM_UPDATE",
            successCb: () => {
                this.fetchCartAgain(this.sb, this.eb);
            },
            errorCb: this.errorUpdateQuantity,
            dontShowMessage: true
        })
    }

    updateQty = (item, d, index) => {
        this.setState({ cartIsFetching: true });
        let qty = item.qty;
        if (qty == 0 && d == -1) {
            return;
        }
        let newQty = qty + d;
        this.state.cartItems[index].qty = newQty;

        // ====================================== 48 hour promo ========================
        // if (_get(this.state.cartItems[index], 'name') === process.env.REACT_APP_PARTYCAN_NAME){
        //     const pricingQuantity = Math.ceil(newQty/2);
        //     // productPrice = (pricingQuantity * this.props.productDetailsData.price).toFixed(2)
        //     this.state.cartItems[index].row_total = (parseFloat(this.state.cartItems[index].product_price) * parseInt(pricingQuantity)).toFixed(2);
        // } else {
        //     this.state.cartItems[index].row_total = (parseFloat(this.state.cartItems[index].product_price) * parseInt(newQty)).toFixed(2);
        // }

        // =============================================================================
        this.state.cartItems[index].row_total = (parseFloat(this.state.cartItems[index].product_price) * parseInt(newQty)).toFixed(2);
        if (this.timeOutId) {
            // console.log(this.timeOutId, "timeoutid outside");
            if (this.item.product_id != item.product_id) {  //This is the case when diffrent product qunatity is clicked
                this.callUpdateQuantityApi(this.item, this.newQty);   // we are doing immediate api call in this case
            }
            clearTimeout(this.timeOutId)
        }

        this.newQty = newQty; //saving to global variable that would be execute after one second
        this.item = item; //saving to global variable that would be execute after one second

        //logic that settles down the event for one second than make api calls
        this.timeOutId = setTimeout(() => {
            this.callUpdateQuantityApi(this.item, this.newQty);
            this.timeOutId = null //clearing the last timeout id
        }, 800);

        const groupedCartItems = Object.groupBy(_get(this.state, 'cartItems', []), ({ vendor_name_modified }) => vendor_name_modified);
        this.setState({ cartItems: this.state.cartItems, cartItemsGrouping: groupedCartItems });


        
        
    }
    errorUpdateQuantity = (err) => {
        //HIGH IMPORTANCE TODO: ERROR CASE NEED TO BE HANDLED
        this.setState({ cartIsFetching: false }); 
    }

    handleChangeTimeSlot = (e, property) => {
        // console.log(e, e.target.value);
        this.setState({
            [`${property}-timeslot-selected`]: e.target.value
        })
        this.props.updatedCartContainerState({ vendorName: property, type: 'sameday-time', time: e.target.value})
        // const data1 = {
        //     [`${property}-timeslot-selected`]: e.target.value
        // }
        // this.props.dispatch(commonActionCreater(data1, "SET_BOTTLE_ID"));
    }

    handleOthersDateChange = ({ vendorName, item, itemData, event}) => {
        // console.log(event, 'event', vendorName)
        this.setState({
            [`${vendorName}-${item}`]: event
        })
        this.props.updatedCartContainerState({ vendorName, item: itemData, type: 'otherday', date: event})
    }

    handleSameDayDateChange = ({vendorName,  vendor_loc_id, event}) => {
        
        this.setState( {
            [`${vendorName}`]: event
        });
        this.props.updatedCartContainerState({ vendorName, type: 'sameday', date: event });
        
        this.handleTimeSlot({ vendorName,  vendor_loc_id, date: event });
        
        
    }

    handleTimeSlot = ({ vendorName, vendor_loc_id,  date }) => {
        // console.log(vendorName, vendor_loc_id, date, 'timeslot req');
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: { "order_date": date, "zipcode": localStorage.getItem("zipcode"), "vendor_loc_id": vendor_loc_id },
            url: '/connect/driverslot/getslot',
            constants: {
              init: 'FETCH_SLOTS_OPTIONS_INIT',
              success: 'FETCH_SLOTS_OPTIONS_SUCCESS',
              error: 'FETCH_SLOTS_OPTIONS_ERROR'
            },
            identifier: 'FETCH_SHIPPING_OPTIONS',
            successCb: (data) => this.slotOptionsFetchSuccess(data, vendorName),
            errorCb: this.slotOptionsFetchError,
            dontShowMessage: true
          });
    }

    slotOptionsFetchError = (err) => {


    }
    slotOptionsFetchSuccess = (data, vendorName) => {
        // console.log(data, 'check timeslot data');
      if (data.message === "No Slots are available!" || data.code == -1) {
        this.setState({ timeSlot: [], timeslotnotavailable: true })
      }
      else {
        this.setState({ [`timeslot-${vendorName}`]: data, timeslotnotavailable: false });
        const timeslotData = {
            ...this.props.cartFlowDateTime,
            timeslot: {
                ..._get(this.props.cartFlowDateTime, 'timeslot', {}),
                [`timeslot-${vendorName}`]: data
            }
        }
        this.props.dispatch(commonActionCreater(timeslotData, 'CART_FLOW_DATE_TIME'));
      }
  
  
  
    }

    normalizeDate = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0); // Normalize to midnight
        return d;
      };

    normalizeGivenDate = (date) => {
        date.set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        });
        return date;
    }

    // Function to disable specific dates
    prevDate = null;
    nextDisableDate = null;
  shouldDisableDate = (date, vendor_loc_id, delivery_type) => {
    // console.log(vendor_loc_id, delivery_type, 'check 2')
    // Disable weekends (Saturday and Sunday)


    // const dayOfWeek = date.getDay();
    
    

    

    const normalizedDate = this.normalizeDate(date);
    // console.log(normalizedDate, 'check 123');
    // // const normalizedtoday = this.normalizeDate(new Date());

    // const normalToday = moment(date).set({
    //     hour: 0,
    //     minute: 0,
    //     second: 0,
    //     millisecond: 0 
    // }).format('YYYY-MM-DD HH:mm:ss');

    // if (this.nextDisableDate == normalToday) {
    //     // this.nextDisableDate = null;
    //     return true;
    // }


    // // Get the current local time
    // const localTime = moment();

    // // Convert the local time to Eastern Standard Time (EST/EDT)
    // const localTimeInEST = localTime.clone().tz("America/New_York");


    // const normalizedLocalTimeInEST = moment.tz("America/New_York").set({
    //     hour: 0,
    //     minute: 0,
    //     second: 0,
    //     millisecond: 0
    //   });

    


    

    // const twoPmETToday = moment.tz("America/New_York").set({
    //     hour: 14,
    //     minute: 0,
    //     second: 0,
    //     millisecond: 0
    //   });
    

   
    // if (localTimeInEST.isAfter(twoPmETToday)  ) {
    //     const temp = normalizedLocalTimeInEST.clone().add(1, 'days')
    //     this.nextDisableDate = temp.format('YYYY-MM-DD HH:mm:ss');
        
    // }

    


    
    // if (normalizedDate.getTime() <= normalizedLocalTimeInEST.toDate().getTime()) return true;

    // if (normalizedDate.getTime() == normalizedtoday.getTime()) return true;
    
    // if (dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 1) return true; // Disable Sundays and Saturdays and monday

    // disable hoidays

    const delivery_date_obj = _get(this.state.nextDeliveryDate, `${vendor_loc_id}#${delivery_type}`);
    const holidays = _get(delivery_date_obj, 'holidays', []);
    // console.log(holidays, 'holidays');

    const disabledDates = _.map(holidays, h => {
        return new Date(h+'T00:00:00');
    });

    // new Date(delivery_date+'T00:00:00');

    // console.log(disabledDates, 'disable dates');

    // const finalDisabledDates = disabledDates.map(this.normalizeDate)
    const finalDisabledDates = disabledDates;
    // console.log(finalDisabledDates, 'check 1');

    return finalDisabledDates.some((disabledDate) => isEqual(disabledDate, normalizedDate));

    

    // // Disable specific dates (e.g., disable all dates in 2023-01-01)
    // const disabledDates = [
    //   new Date('2025-02-10'), // Example: Disable New Year's Day
    //   new Date('2025-02-11'), // Example: Disable Christmas
    // ];

    // const finalDisabledDates = disabledDates.map(this.normalizeDate)
    // console.log(finalDisabledDates, 'check 1');

    // const normalizedDate = this.normalizeDate(date);

    // // Check if the current date is in the list of disabled dates
    // const r = finalDisabledDates.some((disabledDate) => isEqual(disabledDate, normalizedDate));
    // console.log('disable', r, disabledDates);
    // return finalDisabledDates.some((disabledDate) => isEqual(disabledDate, normalizedDate));



    // return false;
  };

    cartItemOtherTypeRender = (item, key) => {
        //console.log(item, 'item');
        const today = new Date();
        const vendor_loc_id = _get(item, 'vendor_loc_id');
        const delivery_type = _get(item, 'speed_id');
        //console.log(vendor_loc_id, delivery_type, 'cccc')
        const delivery_date_obj = _get(this.state.nextDeliveryDate, `${vendor_loc_id}#${delivery_type}`)
        const delivery_date = _get(delivery_date_obj, 'delivery_date');
        // console.log('delivery_date', delivery_date);

        // const minDate = new Date(delivery_date);
        let minDate = new Date(delivery_date+'T00:00:00');
        // minDate = minDate.getDate() + 1;

        console.log(minDate, 'min date');

        // minDate = oneDateLaterInEST();
        // if (minDate.format('YYYY-MM-DD HH:mm:ss') == this.nextDisableDate) {
        //     minDate.add(1, 'days')
        // }

        // console.log('other day ', minDate);
        return (
            <React.Fragment>
                {item.out_of_stock && (
                    <Row className="no-gutters">
                        <Col className="d-flex order-2 order-md-1 align-self-start ">
                            <div style={{ color: '#c00', fontSize: '20px', marginTop: 6, fontWeight: '700' }}>
                                {item.message || 'Out of Stock'}
                            </div>
                        </Col>
                    </Row>
                )}
                <Row className="no-gutters mb-4">
                                            
                    <Col className="d-flex order-2 order-md-1 align-self-start ">
                                                

                                                
                        <div key={key} className="CarItemMain align-items-center justify-content-between no-gutters row" 
                            style={item.out_of_stock ? { opacity: 0.5, filter: 'grayscale(1)' } : undefined}

                        >
                            <div className="col-md-11 col-12 p-3 p-xl-3 cartItemChild ">

                            <div className="d-flex align-items-center cart-pro-img ">
                                <img height={50} width={50} src={item.image} alt="Product Image" />
                                <div className="d-none d-sm-block">{item.name}-{item.bottle_size}</div>
                            </div>
                            <div className="additems">
                                <div className="d-block d-sm-none itemName">{item.name}-{item.bottle_size}</div>
                                <div className="d-flex align-items-center justify-content-between addQty ">
                                    {!this.props.isCheckOut ? <span onClick={() => this.updateQty(item, -1, key)} style={{ cursor: "pointer" }}><RemoveOutlinedIcon style={{ fontSize: 15 }} /></span> : null}
                                    <span className="Qty">{`   ${item.qty}   `}</span>
                                    {!this.props.isCheckOut ? <span onClick={() => this.updateQty(item, +1, key)} style={{ cursor: "pointer" }} ><AddOutlinedIcon style={{ fontSize: 15 }} /></span> : null}
                                </div>
                                {this.props.cartIsFetching ? <span>Loading</span> : <span className="cartItemPrice">${item.row_total}</span>}
                            </div>


                            {!this.props.isCheckOut ? <div className="col-auto ml-3 d-block d-sm-none remove-cart-icon" onClick={() => this.handleCartRemoveItem(item)}>
                                <div className="mb-2"><CloseOutlinedIcon style={{ fontSize: 25 }} /> </div>
                            </div> : null}


                            </div>




                            { (!this.props.isCheckOut || item.out_of_stock )? <div className="col-auto ml-3 text-center d-none d-sm-block remove-cart-icon" onClick={() => this.handleCartRemoveItem(item)}>
                            <div className="mb-2"><CloseOutlinedIcon style={{ fontSize: 25 }} /> </div>
                            <div>Remove</div>
                            </div> : null}
                        </div>
                    </Col>
                </Row>
                <Row className="no-gutters mb-4" style={{width:'90%'}}>
                    <Col className="d-flex justify-content-between">
                        <div> SHIPPING AMOUNT </div>
                        <div>${ _.get(item, 'shipping_amount', '0') }</div>
                    </Col>
                    
                </Row>
                <Row className="no-gutters mb-4">
                                        
                    <Col className="d-flex order-2 order-md-1 align-self-start ">
                        <div>
                            <FormControl error={_get(this.props.formError, `${_get(item, 'vendor_name_modified')}-${_get(item, 'name')}`, false)}>
                            <MuiPickersUtilsProvider  utils={DateFnsUtils}>
        
                                <KeyboardDatePicker
                                disableToolbar
                                autoOk={true}
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date"
                                label="Select Date"
                                minDate={minDate} 
                                // minDate={new Date('2025-03-13T00:00:00Z')}
                                // defaultValue={null}
                                value={_get(this.state, `${_get(item, 'vendor_name_modified')}-${_get(item, 'name')}`, _get(this.props.cartFlowDateTime, `${_get(item, 'vendor_name_modified')}-${_get(item, 'name')}`, null))}
                                onChange={(e) =>  this.handleOthersDateChange({item: _get(item, 'name'), vendorName: _get(item, 'vendor_name_modified'),itemData: item, event: e})}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                shouldDisableDate={(date) => this.shouldDisableDate(date, vendor_loc_id, delivery_type)} // Disable dates based on your condition
                                />
                                
                        
                        
                            </MuiPickersUtilsProvider>
                            {_get(this.props.formError, `${_get(item, 'vendor_name_modified')}-${_get(item, 'name')}`, false) && <FormHelperText>Required</FormHelperText>}
                            </FormControl>
                        </div>
                    </Col>
                </Row>
            </React.Fragment>
        )

    }

    cartItemsSameDayRenderer = (item, key) => {
        return (
            <React.Fragment>

                {item.out_of_stock && (
                    <Row className="no-gutters">
                        <Col className="d-flex order-2 order-md-1 align-self-start ">
                            <div style={{ color: '#c00', fontSize: '20px', marginTop: 6, fontWeight: '700' }}>
                                {item.message || 'Out of Stock'}
                            </div>
                        </Col>
                    </Row>
                )}
                <Row className="no-gutters mb-4">
                                            
                    <Col className="d-flex order-2 order-md-1 align-self-start ">
                                                

                                                
                        <div key={key} className="CarItemMain align-items-center justify-content-between no-gutters row" >
                            <div className="col-md-11 col-12 p-3 p-xl-3 cartItemChild "
                                  style={item.out_of_stock ? { opacity: 0.5, filter: 'grayscale(1)' } : undefined}
                            >

                                <div className="d-flex align-items-center cart-pro-img ">
                                    <img height={50} width={50} src={item.image} alt="Product Image" />
                                    <div className="d-none d-sm-block">{item.name}-{item.bottle_size}</div>
                                </div>
                                <div className="additems">
                                    <div className="d-block d-sm-none itemName">{item.name}</div>
                                    <div className="d-flex align-items-center justify-content-between addQty ">
                                        {!this.props.isCheckOut ? <span onClick={() => this.updateQty(item, -1, key)} style={{ cursor: "pointer" }}><RemoveOutlinedIcon style={{ fontSize: 15 }} /></span> : null}
                                        <span className="Qty">{`   ${item.qty}   `}</span>
                                        {!this.props.isCheckOut ? <span onClick={() => this.updateQty(item, +1, key)} style={{ cursor: "pointer" }} ><AddOutlinedIcon style={{ fontSize: 15 }} /></span> : null}
                                    </div>
                                    {this.props.cartIsFetching ? <span>Loading</span> : <span className="cartItemPrice">${item.row_total}</span>}
                                </div>

                                {!this.props.isCheckOut ? <div className="col-auto ml-3 d-block d-sm-none remove-cart-icon" onClick={() => this.handleCartRemoveItem(item)}>
                                    <div className="mb-2"><CloseOutlinedIcon style={{ fontSize: 25 }} /> </div>
                                </div> : null}
                            </div>
                            {(!this.props.isCheckOut || item.out_of_stock ) ? <div className="col-auto ml-3 text-center d-none d-sm-block remove-cart-icon" onClick={() => this.handleCartRemoveItem(item)}>
                            <div className="mb-2"><CloseOutlinedIcon style={{ fontSize: 25 }} /> </div>
                            <div>Remove</div>
                            </div> : null}
                            
                        </div>
                    </Col>
                </Row>
                
                
        </React.Fragment>

        )
    }

    handleSameDayItems = (property) => {
        const today = new Date();
        // console.log(_get(this.props.cartFlowDateTime, `${property}-timeslot-selected`, null), 'check 12')
        const data = _.get(this.state.cartItemsGrouping, `${property}`) || [];
        
        let vendor_loc_id = null;
        let delivery_type  = null;
        const dataTemplate = data.map((item, key) => {
            vendor_loc_id = item.vendor_loc_id;
            delivery_type = item.speed_id;
            return (
                <div key={item.product_id}>
                    {this.cartItemsSameDayRenderer(item, key)}
                </div>
            );
        });

        const delivery_date_obj = _get(this.state.nextDeliveryDate, `${vendor_loc_id}#${delivery_type}`)
        const delivery_date = _get(delivery_date_obj, 'delivery_date');
        // console.log('delivery_date', delivery_date);

        // // const minDate = new Date(delivery_date);
        // let minDate = new Date();
        // minDate = minDate.getDate() + 1;

        let minDate = new Date(delivery_date+'T00:00:00');
        // let minDate = new Date();
        // minDate = minDate.getDate() + 1;

        // minDate = oneDateLaterInEST();
        // if (minDate.format('YYYY-MM-DD HH:mm:ss') == this.nextDisableDate) {
        //     minDate.add(1, 'days')
        // }

        let timeslotArr = [];

        let timeslotDropdown = [];


        if (_.get(this.state, `timeslot-${property}`, _get(this.props.cartFlowDateTime, `timeslot.timeslot-${property}`, null))) {
            timeslotDropdown = _.map(_.get(this.state, `timeslot-${property}`, _get(this.props.cartFlowDateTime, `timeslot.timeslot-${property}`, [])), x => {
                return {
                    value: `${x.start} - ${x.end}`,
                    displayText: `${x.start}-${x.end}`
                }
            })
        }
        // const timeslotDropdown = [{ value: '3 pM', displayText: '3 PM'}, {value: '4 pM', displayText: '4 PM'}]
        !_.isEmpty(timeslotDropdown) && timeslotDropdown.map(v => {
            timeslotArr.push(
                <MenuItem key={v.value} value={_.get(v, 'value')}>{_.get(v, 'displayText')}</MenuItem>

            )
        });

        // console.log(`working-${property}`);
        return <>
            <div>
                {dataTemplate}
                <Row className="no-gutters mb-4" style={{width:'90%'}}>
                    <Col className="d-flex justify-content-between">
                        <div> SHIPPING AMOUNT </div>
                        <div>${ _.get(data, '0.shipping_amount', '0') }</div>
                    </Col>
                    
                </Row>
                <Row className="no-gutters mb-4">
                                        
                        <Col className="d-flex order-2 order-md-1 align-self-start align-items-center ">
                            <div>
                                <FormControl error={_get(this.props.formError, `${property}`, false)}>
                                    <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                
                                        <KeyboardDatePicker
                                            disableToolbar
                                            autoOk={true}
                                            variant="inline"
                                            format="MM/dd/yyyy"
                                            margin="normal"
                                            id="date"
                                            label="Select Date"
                                            minDate={minDate} 
                                            
                                            value={_get(this.state, `${property}`, _get(this.props.cartFlowDateTime, `${property}`, null))}
                                            
                                            onChange={(e)=> this.handleSameDayDateChange({ vendorName: property, vendor_loc_id, event: e, })}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            shouldDisableDate={(date) => this.shouldDisableDate(date, vendor_loc_id, delivery_type)} // Disable dates based on your condition
                                            error={this.props.isDateError === true}   // 👈 show error state
                                            helperText={this.props.dateErrorMessage}   
                                        />
                                
                                
                                    </MuiPickersUtilsProvider>
                                    {_get(this.props.formError, `${property}`, false) && <FormHelperText>Required</FormHelperText>}
                                </FormControl>
                            </div>
                            <div style={{ marginLeft: 20 }}>
                            <FormControl style={{ display: 'flex', minWidth: '100px', marginTop: 10 }} error={_get(this.props.formError, `${property}-timeslot-selected`, false)}>
                                <InputLabel id="demo-simple-select-label">TIMESLOT</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    className="mt-4"
                                    value={_get(this.state, `${property}-timeslot-selected`, _get(this.props.cartFlowDateTime, `${property}-timeslot-selected`, null))}
                                    // value={_get(this.props.cartFlowDateTime, `${property}-timeslot-selected`, null)}
                                    onChange={(e) => this.handleChangeTimeSlot(e, property)}
                                >
                                    {timeslotArr}
                                </Select>
                                {_get(this.props.formError, `${property}-timeslot-selected`, false) && <FormHelperText>Required</FormHelperText>}
                            </FormControl>
                            </div>
                        </Col>
                    </Row>
                    
            </div>
        </>

    }

    handleOtherDayItems = (property) => {
        const data = _.get(this.state.cartItemsGrouping, `${property}`) || [];
        const dataTemplate = _.map(data, (item, key) => {
            return (
                <div>
                    <Card style={{ marginTop: 10}}>
                            <CardBody className="p-3">
                                
                                        <div>
                                            {this.cartItemOtherTypeRender(item, key)}
                                            
                                        </div> 
                                        
                            </CardBody>
                    </Card>
                </div>
            )
        });
        return <>
            <div>
                {dataTemplate}
            </div>
        </>
    }

    cartItemInSingleVendor = (property) => {
        // console.log('propery', property);
        const data = _.get(this.state.cartItemsGrouping, `${property}`) || [];
        
        
        if (_.get(data, '0.speed_id') == 'Same Day') {
            return this.handleSameDayItems(property);
        } else {
            return this.handleOtherDayItems(property);
        }


        
        
        
    }
    
    CartItemsRenderer = () => {
        const itemRenderRes = [];
        for (const property in this.state.cartItemsGrouping) {
            const data = (<>
                <Card style={{ marginTop: 10}}>
                    <CardBody>
                        <CardTitle>
                            <Row className="no-gutters mb-4">
                                <div>
                                    {property}
                                </div>
                            </Row>
                            
                            {this.cartItemInSingleVendor(property)}
                            
                        </CardTitle>
                    </CardBody>
                </Card>
            </>);
            
            itemRenderRes.push(data);
        }
        return itemRenderRes;
        // return this.state.cartItems.map((item, key) => {
        //     return (
        //         <React.Fragment>
        //             <Card>
        //                 <CardBody>
        //                     <CardTitle>
        //                         <Row className="no-gutters mb-4">
        //                             <Col className="d-flex order-2 order-md-1 align-self-start">
        //                                 <div key={key} className="CarItemMain align-items-center justify-content-between no-gutters row" >
        //                                     <div className="col-md-11 col-12 p-3 p-xl-3 cartItemChild">
        //                                         <div className="d-flex align-items-center cart-pro-img ">
        //                                             <img height={50} width={50} src={item.image} alt="Product Image" />
        //                                             <div className="d-none d-sm-block">{item.name}</div>
        //                                         </div>
        //                                         <div className="additems">
        //                                             <div className="d-block d-sm-none itemName">{item.name}</div>
        //                                             <div className="d-flex align-items-center justify-content-between addQty ">
        //                                                 {!this.props.isCheckOut ? <span onClick={() => this.updateQty(item, -1, key)} style={{ cursor: "pointer" }}><RemoveOutlinedIcon style={{ fontSize: 15 }} /></span> : null}
        //                                                 <span class="Qty">{`   ${item.qty}   `}</span>
        //                                                 {!this.props.isCheckOut ? <span onClick={() => this.updateQty(item, +1, key)} style={{ cursor: "pointer" }} ><AddOutlinedIcon style={{ fontSize: 15 }} /></span> : null}
        //                                             </div>
        //                                             {this.props.cartIsFetching ? <span>Loading</span> : <span className="cartItemPrice">${item.row_total}</span>}
        //                                         </div>
        //                                         {!this.props.isCheckOut ? <div className="col-auto ml-3 d-block d-sm-none remove-cart-icon" onClick={() => this.handleCartRemoveItem(item)}>
        //                                             <div className="mb-2"><CloseOutlinedIcon style={{ fontSize: 25 }} /> </div>
        //                                         </div> : null}

        //                                     </div>
        //                                     {!this.props.isCheckOut ? <div className="col-auto ml-3 text-center d-none d-sm-block remove-cart-icon" onClick={() => this.handleCartRemoveItem(item)}>
        //                                         <div className="mb-2"><CloseOutlinedIcon style={{ fontSize: 25 }} /> </div>
        //                                         <div>Remove</div>
        //                                     </div> : null}
        //                                 </div>
        //                             </Col>
        //                         </Row>
        //                     </CardTitle>
        //                 </CardBody>
        //             </Card>
                    

        //         </React.Fragment>
        //     )
        // })
    }
    render() {

        // if (this.state.cartIsFetching || this.state.itemRemovedFetching) {
        //     return <LoaderOverLay />
        // }
        return (
            <>
                {(this.state.cartIsFetching || this.state.itemRemovedFetching) ? <LoaderOverLay /> : null }
                {this.CartItemsRenderer()}
            </>
        )
    }
}

function mapStateToProps(state) {
    let userSignInInfo = _get(state, 'userSignInInfo.lookUpData', []);
    let cartFlow = _get(state, "cartFlow.lookUpData");
    //console.log(state.productAvailabilityReducer.lookUpData.data.avail_id,"hahahahha")
    let avail_id = _get(state, "productAvailabilityReducer.lookUpData.data.avail_id", "")
    let cartFlowDateTime = _get(state, 'cartFlowDateTime.lookUpData', {});
    return {
        userSignInInfo,
        cartFlow,
        avail_id,
        cartFlowDateTime
    }
}

export default connect(mapStateToProps, null)(CartItemList);
// export default CartItemList;