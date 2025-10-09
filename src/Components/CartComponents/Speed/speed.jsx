
import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { genericPostData } from '../../../Redux/Actions/genericPostData';
import { Button, Card, CardBody } from 'reactstrap';
import { get as _get, map as _map, find as _find, findIndex as _findIndex, isEmpty as _isEmpty, sortBy as _sortBy } from 'lodash';
import { cleanEntityData, formatPrice } from '../../../Global/helper/commonUtil';
import SpeedCard from './speedCard';
import RetailerCard from './retailerCard';
import ShippingMethodCard from './shippingMethodCard';
import DateCard from './dateCard';
import TimeCard from './timeCard';
import moment from 'moment';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { commonActionCreater } from '../../../Redux/Actions/commonAction';
import { blue } from '@material-ui/core/colors';
import { Container, Row, Col } from 'reactstrap'
import proImg from '../../../assets/images/party-can.png'
import { Loader } from '../../../Global/UIComponents/LoaderHoc';
import Scrollbar from "react-scrollbars-custom";
import { isMobile, isTablet } from 'react-device-detect';
import { speedMockData } from '../../../assets/data/speedMockData';
import { mapSpeedDataStructure } from './mapper';
import { PageView, ProductCheckout, ProductCheckoutOptions } from '../../../Global/helper/react-ga';
import {
  TextField, FormHelperText, Switch, InputLabel, Checkbox, Radio, RadioGroup, FormControl,
  FormControlLabel, FormLabel, MenuItem, Select
} from '@material-ui/core';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';


const styles = theme => ({
  root: {
    background: '#00BFB2',
    // background: 'White',
    height: '50px',
    'border-bottom': '1px solid white',
    'border-radius': '0px 0px 25px 25px',
    // opacity: 0.38
  },

});

class Speed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryList: [],
      // selectedSpeed: {},
      selectedCardColor: '#00BFB2',
      isLoading: false,
      primarySelected: false,
      timeslotnotavailable: false,
      timeSlot: []
    }
  }
  selection = {
    name: '1 Hour Delivery',
    speed_id: 1,
    retailerCardHeight: 75,
    retailerCardWidth: 150,
    retailerNameFontSize: 12,
    retailerDeliveryRateFontSize: 10,
    retailerPriceFontSize: 16,
    retialerAddressFontSize: 10
  };

  selectRetailer({ selectedSpeedDelivery }) {
    let selectedRetailer = selectedSpeedDelivery && selectedSpeedDelivery.retailers && selectedSpeedDelivery.retailers.find(del => {
      if (del.isPrimary === true) {
        return del;
      }
    });
    if (!_isEmpty(selectedRetailer)) {
      this.setState({
        // ...this.state,
        selectedRetailer,
        selectedRetailerId: selectedRetailer.id
      });
    }

    return selectedRetailer;
  };

  selectDeliverySpeed({ deliveryList }) {

    let selectedSpeedDelivery = deliveryList && deliveryList.speed && deliveryList.speed.find(del => {

      if (del?.isPrimary === "True") {
        return del;
      }
    });
    // console.log(selectedSpeedDelivery, 'check 1');
    this.setState({
      // ...this.state,
      selectedSpeed: selectedSpeedDelivery,
      selectedSpeedDeliveryId: selectedSpeedDelivery.id
    });

    this.selection['name'] = selectedSpeedDelivery.name;
    localStorage.setItem('deliveryFees', this.state.selectedSpeed?.retailers?.[0]?.delivery_fee);
    return selectedSpeedDelivery;
  }

  selectShipping({ selectedRetailer, selectedSpeedDelivery }) {
    let selectedShippingMethod = selectedRetailer && selectedSpeedDelivery && selectedSpeedDelivery.retailers[selectedRetailer.index].find(del => {
      if (del.isPrimary === true) {
        return del;
      }
    });

    if (!_isEmpty(selectedShippingMethod)) {
      this.setState({
        // ...this.state,
        selectedShippingMethod: selectedShippingMethod,
        selectedShippingMethodId: selectedShippingMethod.id,
        // selectedTime: _get(selectedSpeedDelivery, 'name') === '1 Hour Delivery' ? selectedShippingMethod.id : undefined, // just shipping time is taken as time selection
      });
      return selectedShippingMethod;
    }
    return null;

  }

  reactGACartItem = () => {
    const cart = _map(this.props.cartItems, c => cleanEntityData({
      productId: _get(c, 'product_id'),
      name: _get(c, 'name'),
      quantity: _get(c, 'qty'),
      price: _get(c, 'product_price') ? formatPrice(_get(c, 'product_price')) : undefined,
      variant: _get(c, 'type')

    }));
    return cart;
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    let cartTabValidation = this.props.cartTabValidation;

    let data = {
      ...cartTabValidation,
      isSpeedTab: true,
      isCardTab: false,
      isFaceTab: false,
      isSummaryTab: false
    };
    this.props.dispatch(commonActionCreater(data, 'CART_TAB_VALIDATION'));

    const mapRetailers = ({ data }) => _map(data, (d, index) => cleanEntityData({
      id: _get(d, 'id'),
      name: _get(d, 'name'),
      phone: _get(d, 'phone'),
      address: _get(d, 'address'),
      product_total: _get(d, 'product_total'),
      desc: _get(d, 'desc'),
      distance: _get(d, 'distance'),
      pickup_date: _get(d, 'pickup_date'),
      ready_time: _get(d, 'ready_time'),
      delivery_fee: _get(d, 'delivery_fee'),
      isPrimary: (index === 0) ? true : false,
      index

    }));

    const mapShipMethods = ({ data }) => {
      let shortedShipMethods = _sortBy(data, [function (o) {
        if (_get(o, 'amount')) {
          let amount = _get(o, 'amount', 0);
          let intAmount = parseInt(amount, 10);
          return intAmount;
        }

      }]);
      let response = _map(shortedShipMethods, (d, index) => cleanEntityData({
        method: _get(d, 'method'),
        amount: _get(d, 'amount'),
        delivery_date: _get(d, 'delivery_date'),
        id: _get(d, 'id') ? _get(d, 'id') : index,
        fee: _get(d, 'fee'),
        duration: _get(d, 'duration'),
        dropoff_eta: _get(d, 'dropoff_eta'),
        pickup_date: _get(d, 'pickup_date'),
        isPrimary: _get(d, 'isPrimary'),
        index
      }));

      return response;
    };

    /*const findPrimarySpeed = ({ data, index }) => {
      const ship_methods = _map(_get(data, 'ship_methods', []), s => mapShipMethods({ data: s }));
      const retailers = mapRetailers({ data: _get(data, 'retailers', []) });
      const cleanedShipMethods = cleanEntityData({ ship: ship_methods });
      if (_get(data, 'speed_id') !== 3 && !_isEmpty(cleanedShipMethods)) {
        this.setState({
          primarySelected: true,
        });
        return true;
      } else if (_get(data, 'speed_id') === 3 && !_isEmpty(retailers)) {
        this.setState({
          primarySelected: true,
        });
        return true;
      } else {
        return false;
      }
    };*/

    const findPointerEnable = ({ data, index }) => {
      const ship_methods = _map(_get(data, 'ship_methods', []), s => mapShipMethods({ data: s }));
      const retailers = mapRetailers({ data: _get(data, 'retailers', []) });
      const cleanedShipMethods = cleanEntityData({ ship: ship_methods });
      if (!_isEmpty(cleanedShipMethods) && _get(data, 'speed_id') !== 3) {
        return true;
      } else if (!_isEmpty(retailers) && _get(data, 'speed_id') === 3) {
        return true;
      } else {
        return false;
      }
    }
    const deliveryOptionsMetaData = {
      'Courier Delivery': '2 ~ 3 DAYS',
      '1 Hour Delivery': '~ 1 HOUR',
      'Store Pickup': 'READY IN 1 HOUR'
    };

    const deliveryOptionsFetchSuccess = (speeddata) => {
      const data = mapSpeedDataStructure({ data: speeddata });
      // console.log(data, speeddata, 'check');
      let deliveryList = {
        speed: _map(_get(data, 'speed'), (d, index) => cleanEntityData({
          id: _get(d, 'speed_id'),
          description: _get(d, 'description'),
          duration: _get(deliveryOptionsMetaData, _get(d, 'name')),
          name: _get(d, 'name'),
          retailers: mapRetailers({ data: _get(d, 'retailers') }),
          // ship_methods: _map(_get(d, 'ship_methods'), s => mapShipMethods({ data: s })),
          ship_methods: _get(d, 'ship_methods'),
          isPrimary: _get(d, 'isPrimary'),
          delivery_fee: _get(d, 'delivery_fee'),
          enablePointer: findPointerEnable({ data: d, index })
        })),
      };




      this.setState({
        // ...this.state,
        deliveryList: deliveryList
      });
      // console.log(deliveryList, 'delivery list');
      const selectedSpeed = this.selectDeliverySpeed({ deliveryList });

      const selectedRetailer = this.selectRetailer({ selectedSpeedDelivery: selectedSpeed });

      this.selectShipping({ selectedRetailer, selectedSpeedDelivery: selectedSpeed });
      // console.log(this.state.deliveryList, 'check 2');
      this.setState({
        isLoading: false
      });


    };



    const deliveryOptionsFetchError = (err) => {
      console.log(err);
      this.setState({
        isLoading: false
      });
    };

    let body = {
      // api_token: "1c779ca336234ffc6a98807a6d36140e",
      // cart_id:"26234",
      // delivery_address_id: "2517"
      api_token: _get(this.props, 'userDetails.api_token', ''),
      cart_id: localStorage.getItem("cart_id"),
      delivery_address_id: _get(this.props, 'cartFlow.selectedAddress', '0'),
      zipcode: localStorage.getItem("zipcode"),
      // delivery : localStorage.getItem("delivery"),
      delivery: '1',
      // dineinpickup : localStorage.getItem("dineinpickup"),
      dineinpickup: '0',
      // pickup : localStorage.getItem("pickup"),
      pickup: '0',
      // vendor_location_id : localStorage.getItem("vendor_location_id")

    }
    this.setState({
      isLoading: true,
    });
    genericPostData({
      dispatch: this.props.dispatch,
      reqObj: body,
      url: '/api/shipping',
      constants: {
        init: 'FETCH_DELIVERY_OPTIONS_INIT',
        success: 'FETCH_DELIVERY_OPTIONS_SUCCESS',
        error: 'FETCH_DELIVERY_OPTIONS_ERROR'
      },
      identifier: 'FETCH_DELIVERY_OPTIONS',
      successCb: deliveryOptionsFetchSuccess,
      errorCb: deliveryOptionsFetchError,
      dontShowMessage: true
    });
  }

  _changeOpacity = async (selectedId) => {
    const selectedSpeed = _find(_get(this.state.deliveryList, 'speed', []), ['id', selectedId]);
    this.setState({
      selectedSpeedDeliveryId: selectedId,
      selectedSpeed: selectedSpeed,
      primarySelected: true
    });
    localStorage.setItem('deliveryFees', this.state.selectedSpeed?.retailers?.[0]?.delivery_fee);
    const selectedRetailer = this.selectRetailer({ selectedSpeedDelivery: selectedSpeed });
    this.selectShipping({ selectedRetailer: selectedRetailer, selectedSpeedDelivery: selectedSpeed });

    if (_get(selectedSpeed, 'name') === 'Dine-In') {
      this.selection = {
        name: 'Dine-In',
        id: 1,
        retailerCardHeight: 75,
        retailerCardWidth: 150,
        retailerNameFontSize: 12,
        retailerDeliveryRateFontSize: 10,
        retailerPriceFontSize: 16,
        retialerAddressFontSize: 10
      };
    } else if (_get(selectedSpeed, 'name') === 'Delivery') {
      this.selection = {
        name: 'Delivery',
        id: 2,
        retailerCardHeight: 75,
        retailerCardWidth: 150,
        retailerNameFontSize: 12,
        retailerPriceFontSize: 16,
      };
    } else if (_get(selectedSpeed, 'name') === 'Pick-Up') {
      this.selection = {
        name: 'Pick-Up',
        id: 3,
        retailerCardHeight: 200,
        retailerCardWidth: 150,
        retailerNameFontSize: 16,
        retailerPriceFontSize: 16,
        retailerAddressFontSize: 10,
        retailerDistanceFontSize: 8
      }
    }
  };

  _changeRetailerOpacity = (selectedId) => {

    const newSelectedRetailer = _find(_get(this.state.selectedSpeed, 'retailers', []), ['id', selectedId]);
    if (!_isEmpty(newSelectedRetailer)) {
      this.setState({
        selectedRetailerId: selectedId,
        selectedRetailer: newSelectedRetailer
      });
    }
    localStorage.setItem('deliveryFees', this.state.selectedSpeed?.retailers?.[0]?.delivery_fee);
  };

  _changeShippingMethodOpacity = (selectedId) => {
    let selectedShippingMethod = this.state.selectedRetailer && this.state.selectedSpeed && this.state.selectedSpeed.retailers[this.state.selectedRetailer.index].find(del => {
      if (del.id === selectedId) {
        return del;
      }
    });
    this.setState({
      selectedShippingMethodId: selectedId,
      selectedShippingMethod: selectedShippingMethod

    })
  };

  _changeTimeOpacity = (selectedId) => {
    this.setState({
      selectedTime: selectedId
    });
  };

  reactGACheckoutOptions = () => {
    const deliveryDetails = _find(this.state.deliveryList.speed, ['id', this.state.selectedSpeedDeliveryId]);
    const cart = this.reactGACartItem();
    ProductCheckoutOptions({ cart, step: 2, option: _get(deliveryDetails, 'name') });
  };

  onSubmitDelivery = (e, x, y, index) => {
    let status = e.target.classList.contains('btn-success');
    e.target.classList.add(status ? 'btn-outline-success' : 'btn-success');
    e.target.classList.remove(status ? 'btn-success' : 'btn-outline-success');
    if (this.state.deliverySlot != e.target) {
      this.state.deliverySlot && this.state.deliverySlot.classList.add('btn-outline-success');
      this.state.deliverySlot && this.state.deliverySlot.classList.remove('btn-success');
      this.setState({ deliverySlot: e.target })
    }
    let dineinTime = ""
    dineinTime = `${this.state.deliveryTime} ${x}: ${y}`

    localStorage.setItem("dineinTime", dineinTime);
    localStorage.setItem("time_slot", `${x} - ${y}`);
    const delivery_date_time = moment(this.state.deliveryTime).format('YYYY-MM-DD');
    localStorage.setItem("delivery_date_time", delivery_date_time);
    // console.log(delivery_date_time, this.state.deliverySlot, x, y, 'checking', e.target);
  }

  handleDateChange = (date) => {
    // this.setState({ deliveryTime: event.target.value })
    this.setState({ deliveryTime: date});
    genericPostData({
      dispatch: this.props.dispatch,
      reqObj: { "order_date": date, "zipcode": localStorage.getItem("zipcode") },
      url: '/connect/driverslot/getslot',
      constants: {
        init: 'FETCH_SLOTS_OPTIONS_INIT',
        success: 'FETCH_SLOTS_OPTIONS_SUCCESS',
        error: 'FETCH_SLOTS_OPTIONS_ERROR'
      },
      identifier: 'FETCH_SHIPPING_OPTIONS',
      successCb: this.slotOptionsFetchSuccess,
      errorCb: this.slotOptionsFetchError,
      dontShowMessage: true
    });
  };
  slotOptionsFetchError = (err) => {


  }
  slotOptionsFetchSuccess = (data) => {
    if (data.message === "No Slots are available!" || data.code == -1) {
      this.setState({ timeSlot: [], timeslotnotavailable: true })
    }
    else {
      this.setState({ timeSlot: data, timeslotnotavailable: false })
    }



  }

  handleDeliverySelect = async () => {

    this.reactGACheckoutOptions();
    ProductCheckout({ cart: this.reactGACartItem(), step: 3, option: 'Payment Options' });
    PageView();

    // return this.props.handleTabOnContinue('card');
    const findShippingId = () => {
      if (_get(this.state, 'selectedSpeedDeliveryId') === 2 || _get(this.state, 'selectedSpeedDeliveryId') === 3) {
        return -1;
      } else {
        return _get(this.state, 'selectedShippingMethodId');
      }
    };
    const findShippingMethod = () => {
      if (_get(this.state, 'selectedSpeedDeliveryId') === 2) {
        return _get(this.state, 'selectedShippingMethod.method');
      } else {
        return 'none';
      }
    }
    const findShippingAmount = () => {
      if (_get(this.state, 'selectedSpeedDeliveryId') === 2) {
        return _get(this.state, 'selectedShippingMethod.amount');
      } else if (_get(this.state, 'selectedSpeedDeliveryId') === 1) {
        return _get(this.state, 'selectedShippingMethod.fee');
      }
      else {
        return '0.00';
      }
    };

    const findPickeUpDate = () => {
      let pickupDate;
      if (_get(this.state, 'selectedSpeedDeliveryId') === 2) {
        pickupDate = !_isEmpty(_get(this.state, 'selectedShippingMethod.pickup_date', '')) ? moment(_get(this.state, 'selectedShippingMethod.pickup_date')).format('YYYY-MM-DD') : 'NA';
        return pickupDate;
      } else {
        const pickupDate = !_isEmpty(_get(this.state, 'selectedRetailer.pickup_date', '')) ? moment(_get(this.state, 'selectedRetailer.pickup_date', '')).format('YYYY-MM-DD') : 'NA';
        return pickupDate;
      }
    };

    const findDeliveryDate = () => {
      if (_get(this.state, 'selectedSpeedDeliveryId') === 2) {
        let delivery_date = _get(this.state, 'selectedShippingMethod.delivery_date', '');
        delivery_date = !_isEmpty(delivery_date) ? moment(delivery_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        return delivery_date;
      } else if (_get(this.state, 'selectedSpeedDeliveryId') === 1) {
        let delivery_date = _get(this.state, 'selectedShippingMethod.dropoff_eta', '');
        delivery_date = !_isEmpty(delivery_date) ? moment(delivery_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        return delivery_date;
      }
      else {
        return moment().format('YYYY-MM-DD');
      };
    };


    const findShippingMethodNew = () => {
      // console.log(this.state.selectedSpeedDeliveryId)
      const obj = _find(this.state.deliveryList.speed, ['id', this.state.selectedSpeedDeliveryId])
      // console.log(obj, 'check 23')
      return _get(obj, 'ship_methods')
    }

    const findShippingAmountNew = () => {
      // console.log(this.state.selectedSpeedDeliveryId)
      const obj = _find(this.state.deliveryList.speed, ['id', this.state.selectedSpeedDeliveryId])
      // console.log(obj, 'check 23')
      return _get(obj, 'delivery_fee')
    }

    const findShippingIdNew = () => {
      // console.log(this.state.selectedSpeedDeliveryId)
      const obj = _find(this.state.deliveryList.speed, ['id', this.state.selectedSpeedDeliveryId])
      // console.log(obj, 'check 23')
      return _get(obj, 'name')
    }

    const findDeliveryFeeNew = () => {
      // console.log(this.state.selectedSpeedDeliveryId)
      const obj = _find(this.state.deliveryList.speed, ['id', this.state.selectedSpeedDeliveryId])
      // console.log(obj, 'check 23')
      return _get(obj, 'delivery_fee')
    }

    const findDeliveryDateNew = () => {
      let delivery_date_time = _get(this.state, 'deliveryTime', '');

      let delivery_date = !_isEmpty(delivery_date_time) ? moment(delivery_date_time).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
      return delivery_date;
    };


    const deliveryOptions = cleanEntityData({
      // ============ old ==============
      // selectedSpeedID: _get(this.state, 'selectedSpeedDeliveryId'),
      // selectedRetailerID: _get(this.state, 'selectedRetailerId'),
      // // selectedShippingMethodID:  _get(this.state, 'selectedSpeedDeliveryId') === 2 ? _get(this.state, 'selectedShippingMethodId') : null,
      // selectedShippingMethodID: findShippingId(),
      // selectedShippingMethod: findShippingMethod(),
      // shippingAmount: findShippingAmount(),
      // deliveryFee: _get(this.state, 'selectedRetailer.delivery_fee', '0.00'),
      // deliveryDate: findDeliveryDate(),
      // pickup_date: findPickeUpDate(),

      // ============ old end ==================

      selectedSpeedID: _get(this.state, 'selectedSpeedDeliveryId'),
      selectedRetailerID: _get(this.state, 'selectedRetailerId'),
      // selectedShippingMethodID:  _get(this.state, 'selectedSpeedDeliveryId') === 2 ? _get(this.state, 'selectedShippingMethodId') : null,
      selectedShippingMethodID: findShippingIdNew(),
      selectedShippingMethod: findShippingMethodNew(),
      shippingAmount: findShippingAmountNew(),
      deliveryFee: findDeliveryFeeNew(),
      deliveryDate: findDeliveryDateNew(),
      // pickup_date: findPickeUpDate(),
    });


    let cartFlow = this.props.cartFlow;
    let data = {
      ...cartFlow,
      ...deliveryOptions,
    };
    this.props.dispatch(commonActionCreater(data, 'CART_FLOW'));
    this.props.handleTabOnContinue('card');

    // const selectedSpeedId = _get(this.state, 'selectedSpeedDelivery');
    // const selectedSpeed = _find(_get(this.deliveryList, 'speed', []), ['id', selectedSpeedId]);
    // if (_get(selectedSpeed, 'name') === 'cold_now') {
    //   deliveryOptions = cleanEntityData({
    //     selectedSpeed: _get(this.state, 'selectedSpeedDelivery'),
    //     selectedRetailer: _get(this.state, 'selectedRetailer'),
    //     selectedDate: _get(this.state, 'selectedDate'),
    //     selectedTime: _get(this.state, 'selectedTime')
    //   });
    // } else if (_get(selectedSpeed, 'name') === 'shipped') {
    //   deliveryOptions = cleanEntityData({
    //     selectedSpeed: _get(this.state, 'selectedSpeedDelivery'),
    //     selectedRetailer: _get(this.state, 'selectedRetailer'),
    //     selectedShippingMethod: _get(this.state, 'selectedShippingMethod')
    //   })
    // } else if (_get(selectedSpeed, 'name') === 'pickup') {
    //   deliveryOptions = cleanEntityData({
    //     selectedSpeed: _get(this.state, 'selectedSpeedDelivery'),
    //     selectedRetailer: _get(this.state, 'selectedRetailer')
    //   })
    // }

    // let constants = {
    //   init: 'CART_FLOW_CUSTOM_INIT',
    // };
    // let identifier = 'CART_FLOW';
    // let key = 'cartFlow';
    // let cartFlow = this.props.cartFlow;
    // let data = {
    //   ...cartFlow,
    //   ...deliveryOptions,
    // };
    // this.props.dispatch(setCustomKeyData(data, constants, identifier, key))
    // this.props.navigation.navigate('Card', {isPaymentCard: true});
  }

  renderContent = (speed, retailer, selectFees, selectDate, availableTime) => {
    console.log("<-----------selectedSpeed------->", _get(this.state, 'selectedSpeed'), this.state.selectedSpeed?.retailers?.[0]?.delivery_fee);
    let commonContent = <>
      <div className="scrollerwrapper" >
        <div className="d-flex flex-column">

          <div className="d-flex flex-column mb-5 ">
            <div className="block-sub-title">Select Speed</div>
            <div className="d-flex flex-lg-wrap CardsWrapper">{speed}</div>
          </div>

          {((_get(this.state, 'selectedSpeed.id', -1) === 1 || _get(this.state, 'selectedSpeed.id', -1) === 2)) ?

            <div className="d-flex flex-column mb-5 ">
              <div className="block-sub-title">Select Retailer</div>
              <div className="d-flex flex-lg-wrap CardsWrapper">{retailer}</div>
            </div>
            : _get(this.state, 'selectedSpeed.id', -1) === 3 ?
              <div className="d-flex flex-column mb-5 ">
                <div className="block-sub-title">Select Retailer</div>
                <div className="d-flex flex-lg-wrap CardsWrapper">{retailer}</div>
              </div>
              : null}

          {(_get(this.state, 'selectedSpeed.id', -1) === 1) ?
            <div className="d-flex flex-column mb-5 ">
              <div className="block-sub-title ">Delivery Fees</div>
              <div className="d-flex flex-lg-wrap CardsWrapper">{'$' + selectFees}</div>
            </div>
            : null}

          {(_get(this.state, 'selectedSpeed.id', -1) === 10) ?
            <div className="d-flex flex-column mb-5 ">
              <div className="block-sub-title">Select Date</div>
              <div className="d-flex flex-lg-wrap CardsWrapper">{selectDate}</div>
            </div>
            : null}

          {(!_isEmpty(availableTime)) ?
            <div className="d-flex flex-column mb-5 ">
              <div className="block-sub-title">Select Time</div>
              <div className="d-flex flex-lg-wrap CardsWrapper">
                <TimeCard
                  availableTime={availableTime}
                  fee={_get(this.state, 'selectedShippingMethod.fee', '')}
                  // changeTimeOpacity={this._changeTimeOpacity}
                  selectedTime={this.state.selectedTime}
                  selectedCardColor={this.state.selectedCardColor}
                />
              </div>
            </div>
            : null}
        </div>
      </div>
    </>
    return <div>{commonContent}</div>
    // if(isMobile || isTablet){
    //     return <div>{commonContent}</div>
    // }
    // else{
    // return <Scrollbar  className="leftSecmaxHeight">{commonContent}</Scrollbar>
    // }
  }

  render() {
    // loader
    const { isLoading } = this.state;
    if (isLoading) {
      return <Loader />
    }


    let speed = this.state.deliveryList && this.state.deliveryList.speed && this.state.deliveryList.speed.map(a => {
      return (
        <React.Fragment key={a.id}>
          <SpeedCard
            data={a}
            changeOpactiy={this._changeOpacity}
            selectedCardColor={this.state.selectedCardColor}
            selectedTransportAddress={this.state.selectedSpeedDeliveryId}
          />
        </React.Fragment>


      );
    });
    let retailer = this.state.selectedSpeed && this.state.selectedSpeed.retailers && this.state.selectedSpeed.retailers.map(r => {
      return (
        <React.Fragment key={r.id}>
          <RetailerCard
            data={r}
            selection={this.selection}
            changeRetailerOpacity={this._changeRetailerOpacity}
            selectedRetailer={this.state.selectedRetailerId}
            selectedCardColor={this.state.selectedCardColor}
          />
        </React.Fragment>
      )
    });
    const index = this.state?.selectedRetailer?.index;
    let selectFees = <React.Fragment>
      <Card className="cardStyles retailerCards active"   >
        <CardBody>
          <div style={{ fontSize: 15 }}>
            $   {this.state.selectedSpeed?.retailers?.[0]?.delivery_fee}
          </div>
        </CardBody>
      </Card>
    </React.Fragment>

    // let selectTime = this.state.deliveryList && this.state.deliveryList.time.map(st => {
    //   return (
    //     <TimeCard
    //       data={st}
    //       changeTimeOpacity={this._changeTimeOpacity}
    //       selectedTime={this.state.selectedTime}
    //     />
    // )
    // });


    /*let shippingMethod = this.state.selectedRetailer && this.state.selectedSpeed && this.state.selectedSpeed?.retailers[this.state.selectedRetailer?.index].map(sm => {
       // console.log('============deliveryDate', sm);
       // const deliveryDate = sm.delivery_date.toString();
       const date1 = new Date();
       const date2 = new Date(sm.delivery_date);
 
       const differenceInTime = date2.getTime() - date1.getTime();
       const differenceInDays = differenceInTime / (1000 * 3600 * 24);
       const ceiledDays = Math.ceil(differenceInDays);
       return (
         <React.Fragment key={sm.id}>
           <ShippingMethodCard
             data={sm}
             changeShippingMethodOpacity={this._changeShippingMethodOpacity}
             selectedShippingMethod={this.state.selectedShippingMethodId}
             selectedCardColor={this.state.selectedCardColor}
             estimatedShippingTime={ceiledDays}
           />
         </React.Fragment>
 
       )
     });*/


    // const { classes } = this.props;
    const buttonDisable = !_get(this.state, 'primarySelected');
    return (
      <div className="page-content-container">
        <Container fluid={true}>
          <Row className="no-gutters justify-content-lg-between secMinHeight">
            <Col lg={5} className="order-1 d-none d-lg-block order-md-2">
              <div className="productImgSection">
                <img src={proImg} className="imgProduct img-responsive"></img>
              </div>
            </Col>
            <Col lg={6} className="order-2 d-flex flex-column order-md-1">
              <div className="block-title mb-5">Choose Delivery Slots</div>
              <React.Fragment>
                {/* <TextField
                  id="datetime-local"
                  label="Select Date"
                  type="date"
                  dateFormat={true}
                  closeOnSelect="true"
                  sx={{ width: '550px' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="locationBorder"
                  onChange={this.handleDateChange}
                  inputProps={{ min: new Date().toISOString().slice(0, 10) }}
                /> */}

                <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                            
                  <KeyboardDatePicker
                    disableToolbar
                    autoOk={true}
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date"
                    label="Select Date"
                    value={this.state.deliveryTime}
                    onChange={this.handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
            
          
                </MuiPickersUtilsProvider>

              </React.Fragment>
              {this.state.timeslotnotavailable ? <h3 style={{ marginTop: "15px" }}>All Slots are booked. Please try another date.</h3> :
                this.state.timeSlot.map((x, index) => <Col style={{ marginTop: "15px" }} sm={{ size: 'auto', }}><Button className="timestyle px-2" outline color="success" size="lg" onClick={(e) => this.onSubmitDelivery(e, x.start, x.end, index)}>
                  {x.start} - {x.end}
                </Button></Col>)}
              <div className="text-left mt-4" >
                <Button variant="contained" color="primary" className="bottomActionbutton cartActionBtn" onClick={this.handleDeliverySelect}>
                  <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> CONTINUE
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}





// _changeDateOpacity = (selectedId) => {
//   this.setState({
//     selectedDate: selectedId
//   });
// };





// _moveToAddAddressScreen = async () => {
//   this.props.navigation.navigate('AddAddress');
// };



const mapStateToProps = (state) => {
  let cartFlow = _get(state, 'cartFlow.lookUpData', {});
  let userInfo = _get(state, 'userSignInInfo.lookUpData', []);
  let userDetails = _get(userInfo, '[0].result', {});
  let cartTabValidation = _get(state, 'cartTabValidation.lookUpData', {});
  let cartItems = _get(state, "cart.lookUpData[0].result", []);
  return {
    cartFlow,
    userDetails,
    cartTabValidation,
    cartItems
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Speed));