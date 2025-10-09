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
]

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

  // selectRetailer({ selectedSpeedDelivery }) {
  //   let selectedRetailer = selectedSpeedDelivery && selectedSpeedDelivery.retailers && selectedSpeedDelivery.retailers.find(del => {
  //     if (del.isPrimary === true) {
  //       return del;
  //     }
  //   });
  //   if (!_isEmpty(selectedRetailer)) {
  //     this.setState({
  //       // ...this.state,
  //       selectedRetailer,
  //       selectedRetailerId: selectedRetailer.id
  //     });
  //   }

  //   return selectedRetailer;
  // };

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
    options = _map(selectedSpeedDelivery.retailers, s => cleanEntityData({
      value: _get(s, 'vendor_id'),
      label: _get(s, 'name')
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

  // selectShipping({ selectedRetailer, selectedSpeedDelivery }) {
  //   let selectedShippingMethod = selectedRetailer && selectedSpeedDelivery && selectedSpeedDelivery.ship_methods && selectedSpeedDelivery.ship_methods[selectedRetailer.index].find(del => {
  //     if (del.isPrimary === true) {
  //       return del;
  //     }
  //   });

  //   if (!_isEmpty(selectedShippingMethod)) {
  //     this.setState({
  //       // ...this.state,
  //       selectedShippingMethod: selectedShippingMethod,
  //       selectedShippingMethodId: selectedShippingMethod.id,
  //       // selectedTime: _get(selectedSpeedDelivery, 'name') === '1 Hour Delivery' ? selectedShippingMethod.id : undefined, // just shipping time is taken as time selection
  //     });
  //     return selectedShippingMethod;
  //   }
  //   return null;

  // }

  // reactGACartItem = () => {
  //   const cart = _map(this.props.cartItems, c => cleanEntityData({
  //     productId: _get(c, 'product_id'),
  //     name: _get(c, 'name'),
  //     quantity: _get(c, 'qty'),
  //     price: _get(c, 'product_price') ? formatPrice(_get(c, 'product_price')) : undefined,
  //     variant: _get(c, 'type')

  //   }));
  //   return cart;
  // }

  fetchShippingOptions({ body, availableShippingOptions }) {
    const shippingOptionsFetchSuccess = (data) => {
      console.log(_get(data, 'data.vendordata', []), 'vendor data');
      if (_get(data, 'code', -1) === -1) {
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

  componentDidMount() {
    window.scrollTo(0, 0);
    const body = cleanEntityData({
      zipcode: localStorage.getItem("zipcode"),
      location: localStorage.getItem('location')
    });

    this.setState({
      isLoading: true,
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


    //     const payload = {
    //       speed: finalSpeedOptions
    //     }
    //     this.setState({
    //       // ...this.state,
    //       deliveryList: payload,
    //       isLoading: false,
    //       hotelCategories: updatedOptions,
    //     });
    //     const selectedSpeed = this.selectDeliverySpeed({ deliveryList: payload });
    //   } else {
    //     this.setState({
    //       isLoading: false
    //     })
    //   }
    // };
    // const shippingOptionsFetchError = (err) => {
    //   console.log(err);
    //   this.setState({
    //     isLoading: false,
    //   });

    // }
    // genericPostData({
    //   dispatch: this.props.dispatch,
    //   reqObj: body,
    //   url: '/api/product/dineinRetailerList',
    //   constants: {
    //     init: 'FETCH_SHIPPING_OPTIONS_INIT',
    //     success: 'FETCH_SHIPPING_OPTIONS_SUCCESS',
    //     error: 'FETCH_SHIPPING_OPTIONS_ERROR'
    //   },
    //   identifier: 'FETCH_SHIPPING_OPTIONS',
    //   successCb: shippingOptionsFetchSuccess,
    //   errorCb: shippingOptionsFetchError,
    //   dontShowMessage: true
    // });



    // const payload = {
    //   "speed": [
    //     {
    //       "id": 1,
    //       "name": "Dining",
    //       "description": "Dining",
    //       "isPrimary": true,
    //       "enablePointer": true,
    //       "retailers": [
    //         {
    //           "id": 1,
    //           "name": "ret 1",
    //           "address": "address 1"
    //         },
    //         {
    //           "id": 2,
    //           "name": "ret 2",
    //           "address": "address 2"
    //         },
    //         {
    //           "id": 3,
    //           "name": "ret 3",
    //           "address": "address 3"
    //         },
    //         {
    //           "id": 4,
    //           "name": "ret 4",
    //           "address": "address 4"
    //         },
    //         {
    //           "id": 5,
    //           "name": "ret 5",
    //           "address": "address 5"
    //         }
    //       ]
    //     },
    //     {
    //       "id": 2,
    //       "name": "Delivery",
    //       "description": "Delivery",
    //       "enablePointer": true,
    //     },
    //     {
    //       "id": 3,
    //       "name": "Pickup",
    //       "description": "Pickup",
    //       "enablePointer": true,
    //     }
    //   ]
    // };
    // const mapRetailers = ({ data }) => _map(data, (d, index) => cleanEntityData({
    //   id: _get(d, 'id'),
    //   name: _get(d, 'name'),
    //   phone: _get(d, 'phone'),
    //   address: _get(d, 'address'),
    //   product_total: _get(d, 'product_total'),
    //   desc: _get(d, 'desc'),
    //   distance: _get(d, 'distance'),
    //   pickup_date: _get(d, 'pickup_date'),
    //   ready_time: _get(d, 'ready_time'),
    //   delivery_fee: _get(d, 'delivery_fee'),
    //   isPrimary: (index === 0) ? true : false,
    //   index

    // }));

    // const mapShipMethods = ({ data }) => {
    //   let shortedShipMethods = _sortBy(data, [function (o) {
    //     if (_get(o, 'amount')) {
    //       let amount = _get(o, 'amount', 0);
    //       let intAmount = parseInt(amount, 10);
    //       return intAmount;
    //     }

    //   }]);
    //   let response = _map(shortedShipMethods, (d, index) => cleanEntityData({
    //     method: _get(d, 'method'),
    //     amount: _get(d, 'amount'),
    //     delivery_date: _get(d, 'delivery_date'),
    //     id: _get(d, 'id') ? _get(d, 'id') : index,
    //     fee: _get(d, 'fee'),
    //     duration: _get(d, 'duration'),
    //     dropoff_eta: _get(d, 'dropoff_eta'),
    //     pickup_date: _get(d, 'pickup_date'),
    //     isPrimary: (index === 0) ? true : false,
    //     index
    //   }));

    //   return response;
    // };

    // const findPrimarySpeed = ({ data, index }) => {
    //   const ship_methods = _map(_get(data, 'ship_methods', []), s => mapShipMethods({ data: s }));
    //   const retailers = mapRetailers({ data: _get(data, 'retailers', []) });
    //   const cleanedShipMethods = cleanEntityData({ ship: ship_methods });
    //   if (_get(data, 'speed_id') !== 3 && !_isEmpty(cleanedShipMethods)) {
    //     this.setState({
    //       primarySelected: true,
    //     });
    //     return true;
    //   } else if (_get(data, 'speed_id') === 3 && !_isEmpty(retailers)) {
    //     this.setState({
    //       primarySelected: true,
    //     });
    //     return true;
    //   } else {
    //     return false;
    //   }
    // };

    // const findPointerEnable = ({ data, index }) => {
    //   const ship_methods = _map(_get(data, 'ship_methods', []), s => mapShipMethods({ data: s }));
    //   const retailers = mapRetailers({ data: _get(data, 'retailers', []) });
    //   const cleanedShipMethods = cleanEntityData({ ship: ship_methods });
    //   if (!_isEmpty(cleanedShipMethods) && _get(data, 'speed_id') !== 3) {
    //     return true;
    //   } else if (!_isEmpty(retailers) && _get(data, 'speed_id') === 3) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    // const deliveryOptionsMetaData = {
    //   'Courier Delivery': '2 ~ 3 DAYS',
    //   '1 Hour Delivery': '~ 1 HOUR',
    //   'Store Pickup': 'READY IN 1 HOUR'
    // };

    // const deliveryOptionsFetchSuccess = (speeddata) => {
    //   const data = mapSpeedDataStructure({ data: speeddata });
    //   // console.log(data, speeddata, 'check');
    //   let deliveryList = {
    //     speed: _map(_get(data, 'speed'), (d, index) => cleanEntityData({
    //       id: _get(d, 'speed_id'),
    //       description: _get(d, 'description'),
    //       duration: _get(deliveryOptionsMetaData, _get(d, 'name')),
    //       name: _get(d, 'name'),
    //       retailers: mapRetailers({ data: _get(d, 'retailers') }),
    //       ship_methods: _map(_get(d, 'ship_methods'), s => mapShipMethods({ data: s })),
    //       isPrimary: _get(this.state, 'primarySelected') ? false : findPrimarySpeed({ data: d, index }),
    //       enablePointer: findPointerEnable({ data: d, index })
    //     })),
    //   };




    // this.setState({
    //   // ...this.state,
    //   deliveryList: payload
    // });
    // const selectedSpeed = this.selectDeliverySpeed({ deliveryList: payload });

    //   const selectedRetailer = this.selectRetailer({ selectedSpeedDelivery: selectedSpeed });

    //   this.selectShipping({ selectedRetailer, selectedSpeedDelivery: selectedSpeed });
    //   this.setState({
    //     isLoading: false
    //   });


    // };



    // const deliveryOptionsFetchError = (err) => {
    //   console.log(err);
    //   this.setState({
    //     isLoading: false
    //   });
    // };

    // let body = {
    //   api_token: "29b31695a37535063507a080d5498ea5",
    //   cart_id:"27364",
    //   delivery_address_id: "13969",
    //   zipcode: '302020'
    // //   api_token: _get(this.props, 'userDetails.api_token', ''),
    // //   cart_id: localStorage.getItem("cart_id"),
    // //   delivery_address_id: _get(this.props, 'cartFlow.selectedAddress', '0'),
    // //   zipcode: localStorage.getItem("zipcode"),
    // }
    // this.setState({
    //   isLoading: true,
    // });
    // genericPostData({
    //   dispatch: this.props.dispatch,
    //   reqObj: body,
    //   url: '/api/shipping',
    //   constants: {
    //     init: 'FETCH_DELIVERY_OPTIONS_INIT',
    //     success: 'FETCH_DELIVERY_OPTIONS_SUCCESS',
    //     error: 'FETCH_DELIVERY_OPTIONS_ERROR'
    //   },
    //   identifier: 'FETCH_DELIVERY_OPTIONS',
    //   successCb: deliveryOptionsFetchSuccess,
    //   errorCb: deliveryOptionsFetchError,
    //   dontShowMessage: true
    // });
  }

  _changeOpacity = async (selectedId) => {
    const selectedSpeed = _find(_get(this.state.deliveryList, 'speed', []), ['id', selectedId]);
    this.setState({
      selectedSpeedDeliveryId: selectedId,
      selectedSpeed: selectedSpeed,
      primarySelected: true
    });
  };

  // _changeRetailerOpacity = (selectedId) => {

  //   const newSelectedRetailer = _find(_get(this.state.selectedSpeed, 'retailers', []), ['id', selectedId]);
  //   if (!_isEmpty(newSelectedRetailer)) {
  //     this.setState({
  //       selectedRetailerId: selectedId,
  //       selectedRetailer: newSelectedRetailer
  //     });
  //   }

  // };

  // _changeShippingMethodOpacity = (selectedId) => {
  //   let selectedShippingMethod = this.state.selectedRetailer && this.state.selectedSpeed && this.state.selectedSpeed.ship_methods && this.state.selectedSpeed.ship_methods[this.state.selectedRetailer.index].find(del => {
  //     if (del.id === selectedId) {
  //       return del;
  //     }
  //   });
  //   this.setState({
  //     selectedShippingMethodId: selectedId,
  //     selectedShippingMethod: selectedShippingMethod

  //   })
  // };

  // _changeTimeOpacity = (selectedId) => {
  //   this.setState({
  //     selectedTime: selectedId
  //   });
  // };

  // reactGACheckoutOptions = () => {
  //   const deliveryDetails = _find(this.state.deliveryList.speed, ['id', this.state.selectedSpeedDeliveryId]);
  //   const cart = this.reactGACartItem();
  //   ProductCheckoutOptions({ cart, step: 2, option: _get(deliveryDetails, 'name') });
  // };

  // handleDeliverySelect = async () => {

  //   this.reactGACheckoutOptions();
  //   ProductCheckout({ cart: this.reactGACartItem(), step: 3, option: 'Payment Options' });
  //   PageView();

  //   // return this.props.handleTabOnContinue('card');
  //   const findShippingId = () => {
  //     if (_get(this.state, 'selectedSpeedDeliveryId') === 2 || _get(this.state, 'selectedSpeedDeliveryId') === 3) {
  //       return -1;
  //     } else {
  //       return _get(this.state, 'selectedShippingMethodId');
  //     }
  //   };
  //   const findShippingMethod = () => {
  //     if (_get(this.state, 'selectedSpeedDeliveryId') === 2) {
  //       return _get(this.state, 'selectedShippingMethod.method');
  //     } else {
  //       return 'none';
  //     }
  //   }
  //   const findShippingAmount = () => {
  //     if (_get(this.state, 'selectedSpeedDeliveryId') === 2) {
  //       return _get(this.state, 'selectedShippingMethod.amount');
  //     } else if (_get(this.state, 'selectedSpeedDeliveryId') === 1) {
  //       return _get(this.state, 'selectedShippingMethod.fee');
  //     }
  //     else {
  //       return '0.00';
  //     }
  //   };

  //   const findPickeUpDate = () => {
  //     let pickupDate;
  //     if (_get(this.state, 'selectedSpeedDeliveryId') === 2) {
  //       pickupDate = !_isEmpty(_get(this.state, 'selectedShippingMethod.pickup_date', '')) ? moment(_get(this.state, 'selectedShippingMethod.pickup_date')).format('YYYY-MM-DD') : 'NA';
  //       return pickupDate;
  //     } else {
  //       const pickupDate = !_isEmpty(_get(this.state, 'selectedRetailer.pickup_date', '')) ? moment(_get(this.state, 'selectedRetailer.pickup_date', '')).format('YYYY-MM-DD') : 'NA';
  //       return pickupDate;
  //     }
  //   };

  //   const findDeliveryDate = () => {
  //     if (_get(this.state, 'selectedSpeedDeliveryId') === 2) {
  //       let delivery_date = _get(this.state, 'selectedShippingMethod.delivery_date', '');
  //       delivery_date = !_isEmpty(delivery_date) ? moment(delivery_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
  //       return delivery_date;
  //     } else if (_get(this.state, 'selectedSpeedDeliveryId') === 1) {
  //       let delivery_date = _get(this.state, 'selectedShippingMethod.dropoff_eta', '');
  //       delivery_date = !_isEmpty(delivery_date) ? moment(delivery_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
  //       return delivery_date;
  //     }
  //     else {
  //       return moment().format('YYYY-MM-DD');
  //     };
  //   };

  //   const deliveryOptions = cleanEntityData({
  //     selectedSpeedID: _get(this.state, 'selectedSpeedDeliveryId'),
  //     selectedRetailerID: _get(this.state, 'selectedRetailerId'),
  //     // selectedShippingMethodID:  _get(this.state, 'selectedSpeedDeliveryId') === 2 ? _get(this.state, 'selectedShippingMethodId') : null,
  //     selectedShippingMethodID: findShippingId(),
  //     selectedShippingMethod: findShippingMethod(),
  //     shippingAmount: findShippingAmount(),
  //     deliveryFee: _get(this.state, 'selectedRetailer.delivery_fee', '0.00'),
  //     deliveryDate: findDeliveryDate(),
  //     pickup_date: findPickeUpDate(),
  //   });

  //   let cartFlow = this.props.cartFlow;
  //   let data = {
  //     ...cartFlow,
  //     ...deliveryOptions,
  //   };
  //   this.props.dispatch(commonActionCreater(data, 'CART_FLOW'));
  //   this.props.handleTabOnContinue('card');

  //   // const selectedSpeedId = _get(this.state, 'selectedSpeedDelivery');
  //   // const selectedSpeed = _find(_get(this.deliveryList, 'speed', []), ['id', selectedSpeedId]);
  //   // if (_get(selectedSpeed, 'name') === 'cold_now') {
  //   //   deliveryOptions = cleanEntityData({
  //   //     selectedSpeed: _get(this.state, 'selectedSpeedDelivery'),
  //   //     selectedRetailer: _get(this.state, 'selectedRetailer'),
  //   //     selectedDate: _get(this.state, 'selectedDate'),
  //   //     selectedTime: _get(this.state, 'selectedTime')
  //   //   });
  //   // } else if (_get(selectedSpeed, 'name') === 'shipped') {
  //   //   deliveryOptions = cleanEntityData({
  //   //     selectedSpeed: _get(this.state, 'selectedSpeedDelivery'),
  //   //     selectedRetailer: _get(this.state, 'selectedRetailer'),
  //   //     selectedShippingMethod: _get(this.state, 'selectedShippingMethod')
  //   //   })
  //   // } else if (_get(selectedSpeed, 'name') === 'pickup') {
  //   //   deliveryOptions = cleanEntityData({
  //   //     selectedSpeed: _get(this.state, 'selectedSpeedDelivery'),
  //   //     selectedRetailer: _get(this.state, 'selectedRetailer')
  //   //   })
  //   // }

  //   // let constants = {
  //   //   init: 'CART_FLOW_CUSTOM_INIT',
  //   // };
  //   // let identifier = 'CART_FLOW';
  //   // let key = 'cartFlow';
  //   // let cartFlow = this.props.cartFlow;
  //   // let data = {
  //   //   ...cartFlow,
  //   //   ...deliveryOptions,
  //   // };
  //   // this.props.dispatch(setCustomKeyData(data, constants, identifier, key))
  //   // this.props.navigation.navigate('Card', {isPaymentCard: true});
  // }
  //  else {
  //  dineinTime = `${this.state.deliveryTime} `
  //}
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
    const retailerId = localStorage.getItem("vendor_location_id") ? localStorage.getItem("vendor_location_id") : this.state.retailer;
    console.log(retailerId)
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
      value: _get(s, 'vendor_id'),
      label: _get(s, 'name')
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



const mapStateToProps = (state) => {
  let cartFlow = _get(state, 'cartFlow.lookUpData', {});
  let userInfo = _get(state, 'userSignInInfo.lookUpData', []);
  let userDetails = _get(userInfo, '[0].result', {});
  let cartTabValidation = _get(state, 'cartTabValidation.lookUpData', {});
  let cartItems = _get(state, "cart.lookUpData[0].result", []);
  let zipCodeLocator = _get(state, 'zipCodeLocator.lookUpData.data', {});
  return {
    cartFlow,
    userDetails,
    cartTabValidation,
    cartItems,
    zipCodeLocator,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(ShipOptions));