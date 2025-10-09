import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import {genericPostData} from '../../Redux/Actions/genericPostData';
import { Button } from 'reactstrap';
import { get as _get, map as _map, find as _find, findIndex as _findIndex, isEmpty as _isEmpty, sortBy as _sortBy, reduce as _reduce, filter as _filter } from 'lodash';
import { cleanEntityData, enrichArrDataToObj, formatPrice } from '../../Global/helper/commonUtil';
import SpeedCard from '../../Components/CartComponents/Speed/speedCard';
import RetailerCard from '../../Components/CartComponents/Speed/retailerCard';
import ShippingMethodCard from '../../Components/CartComponents/Speed/shippingMethodCard';
import DateCard from '../../Components/CartComponents/Speed/dateCard';
import TimeCard from '../../Components/CartComponents/Speed/timeCard';
import moment from 'moment';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { commonActionCreater } from '../../Redux/Actions/commonAction';
import { blue } from '@material-ui/core/colors';
import { Container, Row, Col } from 'reactstrap'
import proImg from '../../assets/images/party-can.png'
import { Loader } from '../../Global/UIComponents/LoaderHoc';
import Scrollbar from "react-scrollbars-custom";
import { isMobile, isTablet } from 'react-device-detect';
import { speedMockData } from '../../assets/data/speedMockData';
import { mapSpeedDataStructure } from '../../Components/CartComponents/Speed/mapper';
import { PageView, ProductCheckout, ProductCheckoutOptions } from '../../Global/helper/react-ga';
import { Form, Field } from 'react-final-form';
import RFReactSelect from '../../Global/FormCompoents/react-select-wrapper';
import validate from './validation/shipValidate';
import { DateTimePicker, TimePicker } from '../../Global/FormCompoents/wrapperComponent';
import CalenderIcon from '@material-ui/icons/CalendarTodayOutlined';
import {
  TextField, FormHelperText, Switch, InputLabel, Checkbox, Radio, RadioGroup, FormControl,
  FormControlLabel, FormLabel, MenuItem, Select
} from '@material-ui/core';
import { ThumbUpSharp } from '@material-ui/icons';
import ReactSelect from 'react-select';
import InfoIcon from '@material-ui/icons/Info';
import Modal from '@material-ui/core/Modal';
import ChangeAddressDialogue from '../../Global/UIComponents/ChangeAddressDialogue';

const styles = theme => ({
  root: {
    background: '#00BFB2',
    // background: 'White',
    height: '50px',
    'border-bottom': '1px solid white',
    'border-radius': '0px 0px 25px 25px',
    // opacity: 0.38
  },
  starInfo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },


});

const colourStyles = {
  control: (styles, state) => ({
    ...styles,
    backgroundColor: 'rgba(255,255,255,0)',
    border: state.isFocused ? 0 : 0,
    borderBottom: '1px solid white',
    boxShadow: state.isFocused ? 0 : 0,
    borderRadius: 0,
    "&:hover": {
      border: state.isFocused ? 0 : 0,
      borderBottom: '1px solid white',
    }

  }),
  option: (styles, state) => ({
    ...styles,
    color: state.isDisabled ? '#cacaca' : 'black',
    // backgroundColor: state.isDisabled ? '#cacaca' : state.isFocused ? 'blue': state.isSelected ? 'blue': null,
    // backgroundColor: 'rgba(255,255,255,0)'
  }),
  singleValue: (styles) => ({ ...styles, color: '#000' }),
  valueContainer: base => ({
    ...base,
    padding: '0px',
  }),
  clearIndicator: base => ({
    ...base,
    padding: '0px',
  }),
  dropdownIndicator: base => ({
    ...base,
    padding: '0px',
  }),
}

let dateBefore21Year = moment().subtract(21, 'years');
let valid = function (current) {
  return current.isBefore(dateBefore21Year);
}
const yesterday = moment().subtract(1, "day");
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

const hotelCategoryOptions = [
  {
    value: 0,
    label: 'All'
  },
  {
    value: 1,
    label: '1 star',


  },
  {
    value: 2,
    label: '2 star'
  },
  {
    value: 3,
    label: '3 star'
  },
  {
    value: 4,
    label: '4 star'
  },
  {
    value: 5,
    label: '5 star'
  }
];

export function updateZipCode(zipcode) {
  console.log('zip code under', zipcode, this._isMounted);
  // this.setState({ zipcode, zipcodeChanged: true });
  // if ( this._isMounted) {
  //   this.setState({ zipcode, zipcodeChanged: true });
  // } 

  const body = cleanEntityData({
    zipcode: zipcode,
    location: localStorage.getItem('location')
  });
  const availableShippingOptions = enrichArrDataToObj({ data: _get(this.props.zipCodeLocator, 'retailers_method', []), field: 'ship_method' });
  this.fetchShippingOptions({ body, availableShippingOptions });

};

class ShipOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryList: [],
      // selectedSpeed: {},
      selectedCardColor: '#00BFB2',
      isLoading: false,
      primarySelected: false,
      retailerOptions: [],
      pinCodeNotSupported: false,
      noRetailer: false,
      timeSlot: [],
      timeslotnotavailable: false,
      selectedRelater: false,
      deliveryTime: "",
      deliverySlot: "",
      retailer: "",
      selectedCategory: hotelCategoryOptions[0],
      modalOpen: false,
      hotelCategories: hotelCategoryOptions,
      zipcode: null,
      zipcodeChanged: false,


    }
    updateZipCode = updateZipCode.bind(this);
    this._isMounted = false;
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



  handleModalOpen = () => {
    this.setState({
      modalOpen: true
    });
  }

  handleModalClose = () => {
    this.setState({
      modalOpen: false
    });
  }


  selectDeliverySpeed({ deliveryList }) {
    let selectedSpeedDelivery = deliveryList && deliveryList.speed && deliveryList.speed.find(del => {
      if (del.isPrimary === true) {
        return del;
      }
    });
    let options = [];
    // if (selectedSpeedDelivery.name === 'Dine-In') {
    //   options = _map(selectedSpeedDelivery.retailers, s => cleanEntityData({
    //     value: _get(s, 'id'),
    //     label: _get(s, 'name')
    //   }));
    // }
    options = _map(selectedSpeedDelivery.retailers, s => cleanEntityData({
      value: _get(s, 'id'),
      label: _get(s, 'name'),
      vendor: _get(s, 'vendor_id')
    }));
    this.setState({
      // ...this.state,
      selectedSpeed: selectedSpeedDelivery,
      selectedSpeedDeliveryId: selectedSpeedDelivery.id,
      retailerOptions: [],
    }, () => {
      this.setState({ retailerOptions: options });
    });
    this.selection['name'] = selectedSpeedDelivery.name;
    return selectedSpeedDelivery;
  }



  fetchShippingOptions({ body, availableShippingOptions }) {
    const shippingOptionsFetchSuccess = (data) => {
      localStorage.setItem("retailer_name", '');

      // console.log( _get(data, 'data.vendordata', []), 'vendor data');
      if (_get(data, 'code', -1) === -1) {
        // console.log('check data');
        this.setState({ pinCodeNotSupported: true });
        this.setState({
          isLoading: false
        });

      }
      else if (_get(data, 'data', []) === []) {
        this.setState({ noRetailer: true })
      }
      else if (_get(data, 'code', -1) === 1) {
        const response = _map(_get(data, 'data.vendordata', []), d => cleanEntityData({
          "id": _get(d, 'loc_id'),
          "vendor_id": _get(d, 'vendor_id'),
          "name": _get(d, 'name'),
          "street1": _get(d, 'street 1'),
          "street2": _get(d, 'street2'),
          "city": _get(d, 'city'),
          "state": _get(d, 'state'),
          "zipcode": _get(d, 'zipcode'),
          "telephone": _get(d, 'telephone'),
          "price_category": _get(d, 'price_category'),

        }));
        const priceCategoryDict = _reduce(response, (acc, val) => {
          const price_cat = _get(val, 'price_category');
          if (price_cat in acc) {
            return acc;
          } else {
            acc[price_cat] = true;
            return acc;
          }
        }, {});

        // console.log('price dict', priceCategoryDict);
        const updatedOptions = _map(hotelCategoryOptions, d => {
          if (_get(d, 'value') in priceCategoryDict) {
            return d;
          } else {
            return {
              ...d,
              isDisabled: true
            }
          }
        });

        // console.log('updated options', updatedOptions);

        const availableSpeed = [
          {
            "id": 1,
            "name": "Dine-In",
            "description": "Dine-In",
            "isPrimary": false,
            "enablePointer": false,
            "retailers": response,
          },

          {
            "id": 3,
            "name": "Delivery",
            "description": "Delivery",
            "isPrimary": false,
            "enablePointer": false,
            "retailers": response,
          },
          {
            "id": 2,
            "name": "Pick-Up",
            "description": "Pick-Up",
            "isPrimary": false,
            "enablePointer": false,
            "retailers": response,
          },

        ];
        let primaryEnabled = false;
        const finalSpeedOptions = _reduce(availableSpeed, (acc, val) => {
          const selectedSpeed = _get(availableShippingOptions, _get(val, 'name'));
          if (!_isEmpty(selectedSpeed)) {
            if (primaryEnabled === false) {
              primaryEnabled = true;
              acc.push({
                ...val,
                isPrimary: true,
                enablePointer: true,

              });
              return acc;
            } else {
              acc.push({
                ...val,
                isPrimary: false,
                enablePointer: true,
              });
              return acc;
            }
          }
          acc.push({
            ...val,
            isPrimary: false,
            enablePointer: false,
          });
          return acc;


        }, []);

        console.log('final speed', finalSpeedOptions);


        const payload = {
          speed: finalSpeedOptions
        }
        this.setState({
          // ...this.state,
          deliveryList: payload,
          isLoading: false,
          hotelCategories: updatedOptions,
          pinCodeNotSupported: false,
        });
        const selectedSpeed = this.selectDeliverySpeed({ deliveryList: payload });
      } else {
        this.setState({
          isLoading: false
        })
      }
    };
    const shippingOptionsFetchError = (err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });

    }
    genericPostData({
      dispatch: this.props.dispatch,
      reqObj: body,
      url: '/api/product/dineinRetailerList',
      constants: {
        init: 'FETCH_SHIPPING_OPTIONS_INIT',
        success: 'FETCH_SHIPPING_OPTIONS_SUCCESS',
        error: 'FETCH_SHIPPING_OPTIONS_ERROR'
      },
      identifier: 'FETCH_SHIPPING_OPTIONS',
      successCb: shippingOptionsFetchSuccess,
      errorCb: shippingOptionsFetchError,
      dontShowMessage: true
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this._isMounted = true;
    const body = cleanEntityData({
      zipcode: localStorage.getItem("zipcode"),
      location: localStorage.getItem('location')
    });

    this.setState({
      isLoading: true,
      zipcode: localStorage.getItem("zipcode"),
    });

    // console.log(this.props.zipCodeLocator, 'checking ');
    const availableShippingOptions = enrichArrDataToObj({ data: _get(this.props.zipCodeLocator, 'retailers_method', []), field: 'ship_method' });
    this.fetchShippingOptions({ body, availableShippingOptions });
    // const shippingOptionsFetchSuccess = (data) => {
    //   console.log( _get(data, 'data.vendordata', []), 'vendor data');
    //   if(_get(data, 'code', -1) === -1){
    //     this.setState({pinCodeNotSupported : true});
    //     this.setState({
    //       isLoading: false
    //     });

    //   }
    //   else if (_get(data, 'data', []) === []){
    //     this.setState({noRetailer : true})
    //   }
    //   else if (_get(data, 'code', -1) === 1) {
    //     const response = _map(_get(data, 'data.vendordata', []), d => cleanEntityData({
    //       "id": _get(d, 'loc_id'),
    //       "name": _get(d, 'name'),
    //       "street1": _get(d, 'street 1'),
    //       "street2": _get(d, 'street2'),
    //       "city": _get(d, 'city'),
    //       "state": _get(d, 'state'),
    //       "zipcode": _get(d, 'zipcode'),
    //       "telephone": _get(d, 'telephone'),
    //       "price_category": _get(d, 'price_category'),

    //     }));
    //     const priceCategoryDict = _reduce(response, (acc, val) => {
    //       const price_cat = _get(val, 'price_category');
    //       if (price_cat in acc) {
    //         return acc;
    //       } else {
    //         acc[price_cat] = true;
    //         return acc;
    //       }
    //     }, {});

    //     // console.log('price dict', priceCategoryDict);
    //     const updatedOptions = _map(hotelCategoryOptions, d => {
    //       if (_get(d, 'value') in priceCategoryDict) {
    //         return d;
    //       } else {
    //         return {
    //           ...d,
    //           isDisabled: true
    //         }
    //       }
    //     });

    //     // console.log('updated options', updatedOptions);

    //     const availableSpeed =  [
    //       {
    //             "id": 1,
    //             "name": "Dine-In",
    //             "description": "Dine-In",
    //             "isPrimary": false,
    //             "enablePointer": false,
    //             "retailers": response,
    //           },

    //           {
    //             "id": 3,
    //             "name": "Delivery",
    //             "description": "Delivery",
    //             "isPrimary": false,
    //             "enablePointer": false,
    //             "retailers": response,
    //           },
    //           {
    //             "id": 2,
    //             "name": "Pick-Up",
    //             "description": "Pick-Up",
    //             "isPrimary": false,
    //             "enablePointer": false,
    //             "retailers": response,
    //           },

    //     ];
    //     let primaryEnabled = false;
    //     const finalSpeedOptions = _reduce(availableSpeed, (acc, val) => {
    //       const selectedSpeed = _get(availableShippingOptions, _get(val, 'name'));
    //       if (!_isEmpty(selectedSpeed)) {
    //         if (primaryEnabled === false) {
    //             primaryEnabled = true;
    //             acc.push({
    //               ...val,
    //               isPrimary: true,
    //               enablePointer: true,

    //             });
    //             return acc;
    //         } else {
    //           acc.push({
    //             ...val,
    //             isPrimary: false,
    //             enablePointer: true,
    //           });
    //           return acc;
    //         }
    //       }
    //       acc.push({
    //         ...val,
    //         isPrimary: false,
    //         enablePointer: false,
    //       });
    //       return acc;


    //     }, []);

    //     console.log('final speed', finalSpeedOptions);



  }

  _changeOpacity = async (selectedId) => {
    const selectedSpeed = _find(_get(this.state.deliveryList, 'speed', []), ['id', selectedId]);
    this.setState({
      selectedSpeedDeliveryId: selectedId,
      selectedSpeed: selectedSpeed,
      primarySelected: true,
      timeSlot: [],
    });








    // const selectedRetailer = this.selectRetailer({ selectedSpeedDelivery: selectedSpeed });
    // this.selectShipping({ selectedRetailer: selectedRetailer, selectedSpeedDelivery: selectedSpeed });

    // if (_get(selectedSpeed, 'name') === '1 Hour Delivery') {
    //   this.selection = {
    //     name: '1 Hour Delivery',
    //     id: 1,
    //     retailerCardHeight: 75,
    //     retailerCardWidth: 150,
    //     retailerNameFontSize: 12,
    //     retailerDeliveryRateFontSize: 10,
    //     retailerPriceFontSize: 16,
    //     retialerAddressFontSize: 10
    //   };
    // } else if (_get(selectedSpeed, 'name') === 'Courier Delivery') {
    //   this.selection = {
    //     name: 'Courier Delivery',
    //     id: 2,
    //     retailerCardHeight: 75,
    //     retailerCardWidth: 150,
    //     retailerNameFontSize: 12,
    //     retailerPriceFontSize: 16,
    //   };
    // } else if (_get(selectedSpeed, 'name') === 'Store Pickup') {
    //   this.selection = {
    //     name: 'Store Pickup',
    //     id: 3,
    //     retailerCardHeight: 200,
    //     retailerCardWidth: 150,
    //     retailerNameFontSize: 16,
    //     retailerPriceFontSize: 16,
    //     retailerAddressFontSize: 10,
    //     retailerDistanceFontSize: 8
    //   }
    // }
  };

  // componentDidUpdate (prevProps, prevState) {
  //   console.log(localStorage.getItem('zipcode'), this.state.zipcode, 'zip code', prevState.zipcode, this.state.zipcodeChanged, this._isMounted);
  //   if (this.state.zipcodeChanged && prevState.zipcode != this.state.zipcode) {
  //     this.setState({ zipcodeChanged: false });
  //     console.log('zip code under condition');
  //     const body = cleanEntityData({
  //       zipcode: localStorage.getItem("zipcode"),
  //       location: localStorage.getItem('location')
  //     });
  //     const availableShippingOptions = enrichArrDataToObj({ data :_get(this.props.zipCodeLocator, 'retailers_method', []), field: 'ship_method'});
  //     this.fetchShippingOptions({ body, availableShippingOptions });
  //   }

  // }
  onSubmit = async values => {
    if (this.state.selectedSpeedDeliveryId != 3) {
      const time = _get(values, 'diningTime');
      const date = _get(values, 'diningDate');
      const dineinTime = moment(`${date} ${time}`, 'YYYY-MM-DDLT').format('MM/DD/YYYY h:mm A')
      localStorage.setItem("dineinTime", dineinTime);


      console.log("<--------------->", values)
      const retailerName = this.state.retailerOptions?.find((x) => x.value == _get(values, 'retailer'))?.label;
      localStorage.setItem("shippingType", _get(this.state.selectedSpeed, 'name', '').toLowerCase());

      localStorage.setItem("retailer", _get(values, 'retailer'));
      localStorage.setItem("retailer_name", retailerName);

      localStorage.setItem("vendor_location_id", _get(values, 'retailer'));

      if (this.state.selectedSpeed?.name == "Pick-Up") {
        localStorage.setItem("delivery", 0);
        localStorage.setItem("dineinpickup", 0);
        localStorage.setItem("pickup", 1);
      }
      else if (this.state.selectedSpeed?.name == "Delivery") {
        localStorage.setItem("delivery", 1);
        localStorage.setItem("dineinpickup", 0);
        localStorage.setItem("pickup", 0);
      }
      else {
        localStorage.setItem("delivery", 0);
        localStorage.setItem("dineinpickup", 1);
        localStorage.setItem("pickup", 0);
      }

      this.props.history.push("/store");
    }
  }
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
    const retailerName = this.state.retailerOptions?.find((x) => x.value == _get(this.state, 'retailer'))?.label;
    localStorage.setItem("shippingType", _get(this.state.selectedSpeed, 'name', '').toLowerCase());

    localStorage.setItem("retailer", _get(this.state, 'retailer'));
    localStorage.setItem("retailer_name", retailerName);

    localStorage.setItem("vendor_location_id", _get(this.state, 'retailer'));

    if (this.state.selectedSpeed?.name == "Pick-Up") {
      localStorage.setItem("delivery", 0);
      localStorage.setItem("dineinpickup", 0);
      localStorage.setItem("pickup", 1);
    }
    else if (this.state.selectedSpeed?.name == "Delivery") {
      localStorage.setItem("delivery", 1);
      localStorage.setItem("dineinpickup", 0);
      localStorage.setItem("pickup", 0);
    }
    else {
      localStorage.setItem("delivery", 0);
      localStorage.setItem("dineinpickup", 1);
      localStorage.setItem("pickup", 0);
    }


  }
  shippingSubmit = () => {
    console.log("<---------->", localStorage.getItem('retailer_name'), localStorage.getItem('retailer'))
    document
      .getElementById('###shipform###')
      .dispatchEvent(new Event('submit', { cancelable: true }))

    this.props.history.push("/store");
  };


  valid(current) {

    return current.isAfter(yesterday);
  }

  handleDateChange = (event) => {
    //  const retailerId= localStorage.getItem("vendor_location_id") ? localStorage.getItem("vendor_location_id") : this.state.retailer;
    const retailerId = this.state.retailerOptions.find(x => x.value == this.state.retailer).vendor;
    this.setState({ deliveryTime: event.target.value })
    genericPostData({
      dispatch: this.props.dispatch,
      reqObj: { "order_date": event.target.value, "vendor_id": retailerId },
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
    console.log(err);

  }
  slotOptionsFetchSuccess = (data) => {
    console.log("<----------------->", data);
    if (data.message === "All Slots are booked. Please try another date.") {
      this.setState({ timeSlot: [], timeslotnotavailable: true })
    }
    else {
      this.setState({ timeSlot: data, timeslotnotavailable: false })
    }



  }
  handleChangeRetailer = (event) => {
    console.log("<-------retailer ChangeAddressDialogue------->", event.target.value)
    this.setState({ retailer: event.target.value, selectedRelater: true })
  }

  updateVendorForCategory = () => {

    const retailers = _get(this.state.selectedSpeed, 'retailers', []);

    const filteredRetailers = _filter(retailers, (val) => {
      if (this.state.selectedCategory.label === 'All') {

        return val;
      } else if (this.state.selectedCategory.value == _get(val, 'price_category')) {
        return val;
      }
    });
    const options = _map(filteredRetailers, s => cleanEntityData({
      value: _get(s, 'id'),
      label: _get(s, 'name'),
      vendor: _get(s, 'vendor_id')

    }));

    this.setState({

      retailerOptions: options
    });

  }

  handleCategoryChange = (event) => {
    this.setState({
      selectedCategory: event
    }, () => {
      this.updateVendorForCategory();
    });

  }
  renderContent = (speed, retailer, shippingMethod, selectDate, availableTime) => {

    let commonContent = <>
      {this.state.noRetailer ? <h1>No retailer available for this location presently</h1> :
        <div className="d-flex flex-column">

          <div className="d-flex flex-column mb-5 ">
            <div className="block-sub-title">Select Speed</div>
            <div className="d-flex flex-lg-wrap CardsWrapper selectShippingType px-2">{speed}</div>
          </div>
          {/* <div className=" d-flex flex-column align-items-center"> */}
          <div className=" d-flex flex-row justify-content-center align-items-center">
            <div className="col-12 col-md-6 positive-relative px-0 mt-5 ">
              {this.state.selectedSpeedDeliveryId != 3 ? <ReactSelect
                isSearchable={true}
                isMulti={false}
                isDisabled={false}
                valueKey="value"
                name="state"
                placeholder='Select'
                // defaultValue={hotelCategoryOptions[0]}
                value={this.state.selectedCategory}
                options={this.state.hotelCategories}
                onChange={this.handleCategoryChange}
                // onBlur={() => onBlur(value)}
                // onFocus={onFocus}
                styles={colourStyles}
              /> : <div />}
            </div>
            {this.state.selectedSpeedDeliveryId != 3 ? <InfoIcon style={{ fontSize: 16 }} className="ml-2" onClick={this.handleModalOpen} /> : <div />}
          </div>
          {!_isEmpty(_get(this.state, 'retailerOptions', [])) ?
            <Form onSubmit={this.onSubmit} validate={validate}
              render={({ handleSubmit }) => (
                <form id="###shipform###" className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>

                  {/* <div className="col-12 col-md-6 positive-relative px-0 mt-5">
                        {this.state.selectedSpeedDeliveryId !=3 ?
                            <Field name="category" component={RFReactSelect} placeholder='CHOOSE RATING OF HOTELS'
                                autoFocus={false} type='text' options={hotelCategoryOptions} search={true} onSelect={this.handleChangeCategory} /> :  
                              //   <div> 
                              //   {!this.state.selectedRelater &&  <InputLabel id="demo-controlled-open-select-label">CHOOSE RATING OF HOTELS: </InputLabel> }     
                              //   <Select
                              //   labelId="demo-controlled-open-select-label"
                              //   id="demo-controlled-open-select"
                              //   label="RETAILER"
                              //   style={{width: "350px"}}
                              //   onChange={this.handleChangeRetailer}
                              // >
                              // { this.state.retailerOptions.map((x)=> 
                              //       <MenuItem value={x.value}>{x.label}</MenuItem>
                              //   ) }
                              // </Select></div>
                              null
                            }
                      </div> */}

                  <div className="col-12 col-md-6 positive-relative px-0 mt-5">
                    {this.state.selectedSpeedDeliveryId != 3 ?
                      <Field name="retailer" component={RFReactSelect} placeholder='RETAILER'
                        autoFocus={false} type='text' options={this.state.retailerOptions} search={true} /> :
                      <div>
                        {!this.state.selectedRelater && <InputLabel id="demo-controlled-open-select-label">RETAILER: </InputLabel>}
                        <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          label="RETAILER"
                          style={{ width: "350px" }}
                          onChange={this.handleChangeRetailer}
                        >
                          {this.state.retailerOptions.map((x) =>
                            <MenuItem value={x.value}>{x.label}</MenuItem>
                          )}
                        </Select></div>}
                  </div>
                  {this.state.selectedSpeedDeliveryId != 3 ?

                    <div className="mt-5 col-12 col-md-6 positive-relative dine-selecttion px-0" >
                      <Field name="diningDate" component={DateTimePicker}
                        // onChange={this.changeTime}
                        // parse={normalizeDate}
                        valid={this.valid}
                        // viewDate={dateBefore21Year}
                        timeFormat={true}
                        // dateFormat="MM/DD/YYYY"
                        // placeholder='Dine-In Time'
                        autoFocus={false}
                        className="locationBorder"
                      />

                    </div> : <div className="mt-5 col-12 col-md-6 positive-relative dine-selecttion px-0" >        <React.Fragment>
                      <TextField
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
                      />
                    </React.Fragment> </div>}
                  {this.state.selectedSpeedDeliveryId != 3 ?
                    <div className="mt-5 col-12 col-md-6 positive-relative px-0 dine-selecttion" >
                      <Field name="diningTime" component={TimePicker}
                        // parse={normalizeDate}
                        valid={this.valid}
                        // viewDate={dateBefore21Year}
                        timeFormat={true}
                        // dateFormat="MM/DD/YYYY"
                        // placeholder='Dine-In Time'
                        autoFocus={false}
                        className="locationBorder"
                      />
                    </div> : <Row className="justify-content-center no-gutters" > {this.state.timeslotnotavailable ? <h3 style={{ marginTop: "15px" }}>All Slots are booked. Please try another date.</h3> :
                      this.state.timeSlot.map((x, index) => <Col style={{ marginTop: "15px" }} sm={{ size: 'auto', }}><Button className="timestyle px-2" outline color="success" size="lg" onClick={(e) => this.onSubmitDelivery(e, x.start, x.end, index)}>
                        {x.start} - {x.end}
                      </Button></Col>)}</Row>}

                </form>)}
            />
            : null}



        </div>
      }
    </>
    return <div>{commonContent}</div>
    // if(isMobile || isTablet){
    // parse={normalizeDate}
    //valid={this.valid}
    // viewDate={dateBefore21Year}
    //timeFormat={true}
    // dateFormat="MM/DD/YYYY"
    // placeholder='Dine-In Time'
    //     return <div>{commonContent}</div>
    // }
    // else{
    // return <Scrollbar  className="leftSecmaxHeight">{commonContent}</Scrollbar>
    // }
  }

  render() {
    // loader
    const { classes } = this.props;
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
    // let retailer = this.state.selectedSpeed && this.state.selectedSpeed.retailers && this.state.selectedSpeed.retailers.map(r => {
    //   return (
    //     <React.Fragment key={r.id}>
    //       <RetailerCard
    //         data={r}
    //         selection={this.selection}
    //         changeRetailerOpacity={this._changeRetailerOpacity}
    //         selectedRetailer={this.state.selectedRetailerId}
    //         selectedCardColor={this.state.selectedCardColor}
    //       />
    //     </React.Fragment>
    //   )
    // });

    // let selectDate = this.state.selectedRetailer && this.state.selectedSpeed && this.state.selectedSpeed.ship_methods && this.state.selectedSpeed.ship_methods[this.state.selectedRetailer.index].map(sm => {
    //   let date;
    //   if (_get(sm, 'dropoff_eta')) {
    //     date = moment(_get(sm, 'dropoff_eta')).format("D MMM");
    //     // console.log(date, 'one hour');
    //   }
    //   return (
    //     <React.Fragment>
    //       <DateCard
    //         data={sm}
    //         date={date}
    //         selectedShippingMethod={this.state.selectedShippingMethodId}
    //         // selectedDate={this.state.selectedDate}
    //         selectedCardColor={this.state.selectedCardColor}
    //         changeShippingMethodOpacity={this._changeShippingMethodOpacity}
    //       />
    //     </React.Fragment>

    //   )
    // });
    // let availableTime;
    // if (_get(this.state, 'selectedSpeed.id', -1) === 1 && !_isEmpty(_get(this.state, 'selectedSpeed.ship_methods', []))) {
    //   // availableTime = '1 PM';
    //   if (_get(this.state, 'selectedShippingMethod.dropoff_eta')) {
    //     availableTime = moment(_get(this.state, 'selectedShippingMethod.dropoff_eta')).format("h A");
    //     // console.log('time', availableTime); 
    //   }

    // }

    // let selectTime = this.state.deliveryList && this.state.deliveryList.time.map(st => {
    //   return (
    //     <TimeCard
    //       data={st}
    //       changeTimeOpacity={this._changeTimeOpacity}
    //       selectedTime={this.state.selectedTime}
    //     />
    // )
    // });


    // let shippingMethod = this.state.selectedRetailer && this.state.selectedSpeed && this.state.selectedSpeed.ship_methods && this.state.selectedSpeed.ship_methods[this.state.selectedRetailer.index].map(sm => {
    //   // console.log('============deliveryDate', sm);
    //   // const deliveryDate = sm.delivery_date.toString();
    //   const date1 = new Date();
    //   const date2 = new Date(sm.delivery_date);

    //   const differenceInTime = date2.getTime() - date1.getTime();
    //   const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    //   const ceiledDays = Math.ceil(differenceInDays);
    //   return (
    //     <React.Fragment key={sm.id}>
    //       <ShippingMethodCard
    //         data={sm}
    //         changeShippingMethodOpacity={this._changeShippingMethodOpacity}
    //         selectedShippingMethod={this.state.selectedShippingMethodId}
    //         selectedCardColor={this.state.selectedCardColor}
    //         estimatedShippingTime={ceiledDays}
    //       />
    //     </React.Fragment>

    //   )
    // });


    // const { classes } = this.props;
    const buttonDisable = !_get(this.state, 'primarySelected');
    const modalbody = (
      <div style={styles.starInfo} className={classes.paper} >
        <h2 id="simple-modal-title">Sample price as per star ratings of hotel</h2>
        <hr />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <h3> old Monk Rum</h3>
          <h3> size - 750 ML</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 1 star</h3>
            <h3>160 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 2 star</h3>
            <h3>192 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 3 star</h3>
            <h3>224 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 4 star</h3>
            <h3>256 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 5 star</h3>
            <h3>288 $</h3>
          </div>
        </div>
        <hr />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <h3> Royal Stage Whiskey</h3>
          <h3> size - 750 ML</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 1 star</h3>
            <h3>180 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 2 star</h3>
            <h3>216 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 3 star</h3>
            <h3>252 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 4 star</h3>
            <h3>288 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 5 star</h3>
            <h3>324 $</h3>
          </div>
        </div>
        <hr />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <h3> 8 PM Premium Whiskey</h3>
          <h3> size - 750 ML</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 1 star</h3>
            <h3>500 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 2 star</h3>
            <h3>600 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 3 star</h3>
            <h3>700 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 4 star</h3>
            <h3>800 $</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
            <h3> 5 star</h3>
            <h3>900 $</h3>
          </div>
        </div>
        {/* <p id="simple-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </p> */}
        {/* <SimpleModal /> */}
      </div>
    );

    return (
      <div className="page-content-container">
        <Container fluid={true}>
          <Row className="no-gutters justify-content-center secMinHeight">

            <Col lg={6} className="order-2 d-flex flex-column order-md-1">
              {!this.state.pinCodeNotSupported ? <div><div className="block-title mb-5">Choose a Delivery Options</div>

                {this.renderContent(speed)}
                {this.state.selectedSpeed ? <div className="text-left mt-5 d-flex justify-content-center" >
                  <Button variant="contained" color="primary" className="bottomActionbutton cartActionBtn" disabled={this.state.selectedSpeedDeliveryId == 3 && (this.state.timeslotnotavailable || _isEmpty(this.state.timeSlot))} onClick={this.shippingSubmit}>
                    <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> CONTINUE
                  </Button>
                </div> : null}</div> : <h1 style={{ textAlign: "center" }}>We are coming soon to this pincode. Please see a list of all pincodes we currently serve.</h1>}
            </Col>
            <Modal
              className={classes.modal}
              open={this.state.modalOpen}
              onClose={this.handleModalClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              {modalbody}
            </Modal>

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
  let zipCodeLocator = _get(state, 'zipCodeLocator.lookUpData.data', {});
  const propzipcode = localStorage.getItem('zipcode');
  return {
    cartFlow,
    userDetails,
    cartTabValidation,
    cartItems,
    zipCodeLocator,
    propzipcode,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(ShipOptions));