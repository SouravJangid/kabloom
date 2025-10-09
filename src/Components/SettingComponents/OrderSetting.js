
import React from 'react';
import { connect } from 'react-redux';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { genericPostData } from "../../Redux/Actions/genericPostData";
import {get as _get , isEmpty as _isEmpty, map as _map, groupBy as _groupBy, reduce as _reduce, orderBy as _orderBy, uniq as _uniq, parseInt as _parseInt, filter as _filter, set as _set} from 'lodash';
import WithLoading from '../../Global/UIComponents/LoaderHoc';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Container, Row, Col } from 'reactstrap';
import { Tab, Tabs, TabList, TabPanel, } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import proimg from '../../assets/images/watermark.jpg';
// import RSDropdown from '../../Global/FormCompoents/react-select-dropdown';
import Select from 'react-select';
import { stateDropDown } from '../../assets/data/dropdown';
import { cleanEntityData, enrichArrDataToObj } from '../../Global/helper/commonUtil';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

// import RFReactSelect from '../../Global/FormCompoents/react-select-wrapper';


const orderMockData = {
  "code": 1,
  "data": [
    {
      "increment_id": "100027238",
      "grand_total": 3293.12,
      "created_at": "10-06-2021",
      "entity_id": "287",
      "tax": 457.2,
      "delivery_fee": 200,
      "driver_tip": 0,
      "delivery_type": "delivery",
      "discount": 0,
      "status": "processing",
      "items": [
        {
          "product_name": "Grover Chene Grande Reserve Red Wine",
          "product_price": 1990,
          "product_qty": 1,
          "total": 1990
        },
        {
          "product_name": "Sante Shiraz",
          "product_price": 550,
          "product_qty": 1,
          "total": 550
        }
      ]
    },
    {
      "increment_id": "100027216",
      "grand_total": 25.75,
      "created_at": "09-23-2021",
      "entity_id": "265",
      "tax": 0,
      "delivery_fee": 0,
      "driver_tip": 0,
      "delivery_type": "delivery",
      "discount": 0,
      "status": "processing",
      "items": [
        {
          "product_name": "Old Monk Matured XXX Deluxe Rum Very Old Vatted",
          "product_price": 0,
          "product_qty": 1,
          "total": 0
        }
      ]
    },
    {
      "increment_id": "100027215",
      "grand_total": 25.75,
      "created_at": "09-23-2021",
      "entity_id": "264",
      "tax": 0,
      "delivery_fee": 0,
      "driver_tip": 0,
      "delivery_type": "delivery",
      "discount": 0,
      "status": "processing",
      "items": [
        {
          "product_name": "GOLFER`S SHOT BARREL AGED WHISKY",
          "product_price": 0,
          "product_qty": 1,
          "total": 0
        }
      ]
    },
    {
      "increment_id": "100027175",
      "grand_total": 504.7,
      "created_at": "09-11-2021",
      "entity_id": "224",
      "tax": 0,
      "delivery_fee": 100,
      "driver_tip": 0,
      "delivery_type": "pickup",
      "discount": 0,
      "status": "processing",
      "items": [
        {
          "product_name": "Dia White Wine",
          "product_price": 490,
          "product_qty": 1,
          "total": 490
        }
      ]
    },
    {
      "increment_id": "100027174",
      "grand_total": 504.7,
      "created_at": "09-11-2021",
      "entity_id": "223",
      "tax": 0,
      "delivery_fee": 100,
      "driver_tip": 0,
      "delivery_type": "pickup",
      "discount": 0,
      "status": "processing",
      "items": [
        {
          "product_name": "Dia White Wine",
          "product_price": 490,
          "product_qty": 1,
          "total": 490
        }
      ]
    },
    {
      "increment_id": "100027164",
      "grand_total": 556.2,
      "created_at": "09-07-2021",
      "entity_id": "213",
      "tax": 0,
      "delivery_fee": 0,
      "driver_tip": 0,
      "delivery_type": "pickup",
      "discount": 0,
      "status": "accepted",
      "items": [
        {
          "product_name": "Madera Nashik valley Red wine",
          "product_price": 540,
          "product_qty": 1,
          "total": 540
        }
      ]
    },
    {
      "increment_id": "100027163",
      "grand_total": 556.2,
      "created_at": "09-07-2021",
      "entity_id": "212",
      "tax": 0,
      "delivery_fee": 0,
      "driver_tip": 0,
      "delivery_type": "pickup",
      "discount": 0,
      "status": "processing",
      "items": [
        {
          "product_name": "Madera Nashik valley Red wine",
          "product_price": 540,
          "product_qty": 1,
          "total": 540
        }
      ]
    },
    {
      "increment_id": "100027146",
      "grand_total": 607.7,
      "created_at": "08-29-2021",
      "entity_id": "195",
      "tax": 0,
      "delivery_fee": 0,
      "driver_tip": 0,
      "delivery_type": "pickup",
      "discount": 0,
      "status": "processing",
      "items": [
        {
          "product_name": "Officer's Choice Prestige Whisky",
          "product_price": 590,
          "product_qty": 1,
          "total": 590
        }
      ]
    },
    {
      "increment_id": "100027135",
      "grand_total": 490,
      "created_at": "08-24-2021",
      "entity_id": "185",
      "tax": 0,
      "delivery_fee": 0,
      "driver_tip": 0,
      "delivery_type": "dinein",
      "discount": 0,
      "status": "shipped",
      "items": [
        {
          "product_name": "Dia White Wine",
          "product_price": 0,
          "product_qty": 1,
          "total": 0
        }
      ]
    },
    {
      "increment_id": "100027124",
      "grand_total": 150,
      "created_at": "08-11-2021",
      "entity_id": "174",
      "tax": 0,
      "delivery_fee": 0,
      "driver_tip": 0,
      "delivery_type": "dinein",
      "discount": 0,
      "status": "processing",
      "items": [
        {
          "product_name": "Corona Extra  Premium Beer",
          "product_price": 150,
          "product_qty": 1,
          "total": 150
        }
      ]
    },
    {
      "increment_id": "100027123",
      "grand_total": 590,
      "created_at": "08-11-2021",
      "entity_id": "173",
      "tax": 0,
      "delivery_fee": 0,
      "driver_tip": 0,
      "delivery_type": "dinein",
      "discount": 0,
      "status": "processing",
      "items": [
        {
          "product_name": "Class 21 Grain Vodka",
          "product_price": 590,
          "product_qty": 1,
          "total": 590
        }
      ]
    },
    {
      "increment_id": "100027122",
      "grand_total": 580,
      "created_at": "08-11-2021",
      "entity_id": "172",
      "tax": 0,
      "delivery_fee": 0,
      "driver_tip": 0,
      "delivery_type": "dinein",
      "discount": 0,
      "status": "processing",
      "items": [
        {
          "product_name": "Dia White Wine",
          "product_price": 0,
          "product_qty": 1,
          "total": 0
        }
      ]
    },
    {
      "increment_id": "100027100",
      "grand_total": 490,
      "created_at": "07-01-2021",
      "entity_id": "150",
      "tax": 0,
      "delivery_fee": 0,
      "driver_tip": 0,
      "delivery_type": "dinein",
      "discount": 0,
      "status": "processing",
      "items": [
        {
          "product_name": "Dia White Wine",
          "product_price": 490,
          "product_qty": 1,
          "total": 490
        }
      ]
    }
  ],
  "message": "Order Data successful"
}

const hotelCategoryOptions = [
  {
    value: 0,
    label: 'All'
  },
  {
    value: 1,
    label: '1 star'
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


const options = _map(stateDropDown, s => cleanEntityData({
  value: _get(s, 'abbreviation'),
  label: _get(s, 'name')
}));

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

const orderType = {
  dinein: 'Dine-in',
  delivery: 'Local Delivery',
  pickup: 'Pickup'
}


class OrderSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: [],
      selectedOption: {
        value: 'All',
        label: 'All',
      },
      walletDetails: [],
      statesDropDowns: [
        {
          value: 'All',
          label: 'All',
        }
      ],
      selectedCategory: {
        value: 'All',
        label: 'All',
      },
      totalRemainingLiquor: 0,
      groupedOrder: null,
      hotelCategory: hotelCategoryOptions,
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.tabValue === 1) {
      this.getOrderSettingData();
    }
    // this.setState({
    //     statesDropDowns: [
    //         {
    //             value: 'All', 
    //             label: 'All',
    //         } 
    //     ]
    // });
  }

  getOrderSettingData = () => {
    let reqData = { api_token: localStorage.getItem("Token") };
    genericPostData({
      dispatch: this.props.dispatch,
      reqObj: reqData,
      url: `api/account/myorders`,
      constants: {
        init: "GET_ORDER_SETTING_DATA_INIT",
        success: "GET_ORDER_SETTING_DATA_SUCCESS",
        error: "GET_ORDER_SETTING_DATA_ERROR"
      },
      identifier: "GET_ORDER_SETTING_DATA",
      successCb: this.orderSettingDataSuccess,
      errorCb: this.orderSettingDataFailure,
      dontShowMessage: true
    });
  };

  fetchWalletDetails = async () => {
    let reqData = { customer_id: this.props.customer_id };
    // let reqData = {customer_id: '7099'}
    // console.log('wallet request data', reqData);
    genericPostData({
      dispatch: this.props.dispatch,
      reqObj: reqData,
      url: `/wallet/wallet/index`,
      constants: {
        init: "GET_WALLET_DATA_INIT",
        success: "GET_WALLET_DATA_SUCCESS",
        error: "GET_WALLET_DATA_ERROR"
      },
      identifier: "GET_WALLET_DATA",
      successCb: this.walletDataSuccess,
      errorCb: this.walletDataFailure,
      dontShowMessage: true
    });
  };

  walletDataSuccess = (data) => {

    if (data.code === 1) {
      const walletDetails = this.findWalletDetails({ data: _get(data, 'data', []) });
      console.log('wallet', walletDetails.states, walletDetails.remainingLiquor, walletDetails);
      const states = _uniq(_get(walletDetails, 'states', []));
      const statesObj = enrichArrDataToObj({ data: options, field: 'label' });
      const finalStates = _reduce(states, (acc, val) => {
        if (!_isEmpty(_get(statesObj, val))) {
          acc.push(_get(statesObj, val));
        }
        return acc;
      }, []);
      finalStates.unshift({
        value: 'All',
        label: 'All'
      });
      console.log(statesObj, states, finalStates);
      // choosign hotel categories
      const priceCategoryDict = _reduce(_get(walletDetails, 'data', []), (acc, val) => {
        const price_cat = _get(val, 'price_category');
        if (price_cat in acc) {
          return acc;
        } else {
          acc[price_cat] = true;
          return acc;
        }
      }, {});
      console.log('price dict', priceCategoryDict);

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

      this.setState({
        walletDetails: _get(walletDetails, 'data'),
        statesDropDowns: finalStates,
        hotelCategory: updatedOptions,
        originalWalletDetails: _get(walletDetails, 'data'),
        totalRemainingLiquor: _get(walletDetails, 'remainingLiquor'),
      })
    }
  }

  walletDataFailure = (err) => {
    console.log('error in wallet', err);
  }

    orderSettingDataSuccess = (apiData) => {
        // apiData = orderMockData;
        
        const localDeliveryType = ['local delivery', 'driver', 'farm direct', 'courier delivery']
        if(apiData.code === 1) {
            const modifiedApiData = _reduce(_get(apiData, 'data', []), (acc, val) => {
              // let eachData = val;
              if (localDeliveryType.includes(_get(val, 'items.0.delivery_method', '').toLowerCase() )) {
                
                _set(val, 'items.0.delivery_method', 'Local Delivery')
              }
                acc.push({
                    ...val,
                    delivery_type: _get(val, 'items.0.delivery_method'),
                });
                return acc;
            }, []);
            // console.log(modifiedApiData, 'check 1');
            const groupedOrder = _groupBy(modifiedApiData, 'delivery_type');
            // console.log('grouped order', groupedOrder);
            this.setState({
                // orderData: modifiedApiData,
                orderData: _get(apiData, 'data'),
                groupedOrder: groupedOrder,
            });
            this.fetchWalletDetails();
        }
    }

  // orderSettingDataSuccess = (apiData) => {
  //   // apiData = orderMockData;

  //   if (apiData.code === 1) {
  //     const modifiedApiData = _reduce(_get(apiData, 'data', []), (acc, val) => {
  //       acc.push({
  //         ...val,
  //         delivery_type: _get(val, 'items.0.delivery_method'),
  //       });
  //       return acc;
  //     }, []);
  //     const groupedOrder = _groupBy(modifiedApiData, 'delivery_type');
  //     // console.log('grouped order', groupedOrder);
  //     this.setState({
  //       orderData: modifiedApiData,
  //       groupedOrder: groupedOrder,
  //     });
  //     this.fetchWalletDetails();
  //   }
  // }

  orderSettingDataFailure = () => {

  }
  convertToDecimal = (number) => {
    const convertedNumber = (Math.round(number * 100) / 100).toFixed(2);
    return convertedNumber;
  }

  handleStateDropdown = (selectedOption) => {
    // console.log('selected state', selectedOption, this.state.originalWalletDetails);
    let totalRemaining = 0;
    const selectedStateProduct = _filter(_get(this.state, 'originalWalletDetails', []), (val) => {
      // console.log(val);
      if (_get(selectedOption, 'label') === 'All' && this.state.selectedCategory.label === 'All') {
        totalRemaining += _parseInt(_get(val, 'remaining'));
        return val;
      } else if (_get(selectedOption, 'label') === 'All' && this.state.selectedCategory.label !== 'All') {
        // totalRemaining += _parseInt(_get(val, 'remaining'));
        // return val;
        if (this.state.selectedCategory.value == _get(val, 'price_category')) {
          totalRemaining += _parseInt(_get(val, 'remaining'));
          return val;
        }
      } else if (_get(selectedOption, 'label') !== 'All' && this.state.selectedCategory.label !== 'All') {
        if (this.state.selectedCategory.value == _get(val, 'price_category') && _get(selectedOption, 'label') === _get(val, 'state')) {
          totalRemaining += _parseInt(_get(val, 'remaining'));
          return val;
        }
      } else if (_get(selectedOption, 'label') !== 'All' && this.state.selectedCategory.label === 'All') {
        if (_get(selectedOption, 'label') === _get(val, 'state')) {
          totalRemaining += _parseInt(_get(val, 'remaining'));
          return val;
        }
      }
      // else if (_get(selectedOption, 'label') === _get(val, 'state')) {
      //     totalRemaining += _parseInt(_get(val, 'remaining'));
      //     return val;
      // }
    });
    // console.log('selected products', totalRemaining);

    this.setState({
      selectedOption,
      walletDetails: selectedStateProduct,
      totalRemainingLiquor: totalRemaining,
    })
  };

  handleFilterSelection = () => {
    // let orginalWallet = this.state.originalWalletDetails;
    let totalRemaining = 0;
    if (this.state.selectedCategory.label !== 'All' && this.state.selectedOption.label !== 'All') {
      const selectedState = _filter(_get(this.state, 'originalWalletDetails', []), (val) => {
        // console.log('working', this.state.selectedOption.label);
        if (this.state.selectedOption.label === _get(val, 'state')) {

          return val;
        }
      });
      // console.log(selectedState, 'selected state');
      const selectedPriceCat = _filter(selectedState, (val) => {
        if (this.state.selectedCategory.value == _get(val, 'price_category')) {
          // console.log('working', this.state.selectedOption.label);
          totalRemaining += _parseInt(_get(val, 'remaining'));
          return val;
        }
      });
      // console.log(selectedPriceCat, 'd');
      this.setState(
        {
          walletDetails: [],
          totalRemainingLiquor: totalRemaining,
        }, () => {
          this.setState({
            walletDetails: selectedPriceCat
          })
        }
      )

    } else if (this.state.selectedCategory.label === 'All' && this.state.selectedOption.label !== 'All') {
      const selectedState = _filter(_get(this.state, 'originalWalletDetails', []), (val) => {
        // console.log('working', this.state.selectedOption.label);
        if (this.state.selectedOption.label === _get(val, 'state')) {
          totalRemaining += _parseInt(_get(val, 'remaining'));
          return val;
        }
      });
      // console.log(selectedState, 'selected state');

      // console.log(selectedPriceCat, 'd');
      this.setState(
        {
          walletDetails: [],
          totalRemainingLiquor: totalRemaining,
        }, () => {
          this.setState({
            walletDetails: selectedState
          })
        }
      )
    } else if (this.state.selectedCategory.label !== 'All' && this.state.selectedOption.label === 'All') {
      // const selectedState = _filter(_get(this.state, 'originalWalletDetails', []), (val) => {
      //   // console.log('working', this.state.selectedOption.label);
      //   if(this.state.selectedOption.label === _get(val, 'state')) {

      //     return val;
      //   }
      // });
      // console.log(selectedState, 'selected state');
      const selectedPriceCat = _filter(_get(this.state, 'originalWalletDetails', []), (val) => {
        if (this.state.selectedCategory.value == _get(val, 'price_category')) {
          // console.log('working', this.state.selectedOption.label);
          totalRemaining += _parseInt(_get(val, 'remaining'));
          return val;
        }
      });
      // console.log(selectedPriceCat, 'd');
      this.setState(
        {
          walletDetails: [],
          totalRemainingLiquor: totalRemaining,
        }, () => {
          this.setState({
            walletDetails: selectedPriceCat
          })
        }
      )
    }
  }

  handleCategoryDropdown = (option) => {
    // console.log('options', option);

    this.setState({
      selectedCategory: option
    }, () => {
      this.handleFilterSelection();
    });
  }

  handleRedeem = () => {
    this.props.handleWalletRedeem({ customer_id: this.props.customer_id, state: this.state.selectedOption.label, category: this.state.selectedCategory });
  }
  render() {
    // let renderItems = (items) => items && items.map((item, index) => {
    //   return (<React.Fragment key={index}>
    //     <div className=" d-flex flex-wrap justify-content-between mb-3">
    //       <div className="itemsname" >
    //         {item.product_name}
    //       </div>
    //       <div className="pricingWrapper">
    //         <span className="orderDetaillabel">{item.product_qty}</span>
    //         <span>${item && item.total ?
    //           this.convertToDecimal(item.total) : '0.00'}
    //         </span>
    //       </div>

    //     </div>
    //   </React.Fragment>)
    // })

    // let total_tax = 0;

    let renderItems = (items, total_tax) => {
      let acc = []
      
      if (!_isEmpty(_get(items, 'local_delivery_items', []))) {
        let localItems = [<> <div style={{ marginTop: 5, marginBottom: 10, fontWeight: 'bold', fontSize: '2rem'}}>Local Delivery </div></>]
        _map(_get(items, 'local_delivery_items', []), (item, index) => {
          total_tax += _get(item, 'tax', 0);
          localItems.push(
            <>
              <div className=" d-flex flex-wrap justify-content-between mb-3">
                <div className="itemsname" >
                  {item.product_name}-{_get(item, 'status')}
                </div>
                <div className="pricingWrapper">
                  <span className="orderDetaillabel">{item.product_qty}</span>
                  <span>${item && item.row_total ?
                    this.convertToDecimal(item.row_total) : '0.00'}
                  </span>
                </div>

              </div>
            </>
          )
        })

        acc.push(
          <>
            <div style={{
              border: '1px solid white',  // Add a black border
              // padding: '20px',  // Optional: Add padding
              // margin: '10px',   // Optional: Add margin
              marginTop: '5px',
              paddingLeft: '5px'
            }}>
              {localItems}
            </div>
          </>
        )
      
        
      }
      if (!_isEmpty(_get(items, 'courier_delivery_items', []))) {
        let courierItem = [<> <div style={{ marginTop: 5, marginBottom: 10, fontWeight: 'bold', fontSize: '2rem'}}>Courier Delivery </div></>];
        _map(_get(items, 'courier_delivery_items', []), (item, index) => {
          total_tax += _get(item, 'tax', 0);
          courierItem.push(
            <>
              <div className=" d-flex flex-wrap justify-content-between mb-3">
                <div className="itemsname" >
                  {item.product_name}-{_get(item, 'status')}
                </div>
                <div className="pricingWrapper">
                  <span className="orderDetaillabel">{item.product_qty}</span>
                  <span>${item && item.row_total ?
                    this.convertToDecimal(item.row_total) : '0.00'}
                  </span>
                </div>

              </div>
            </>
          )
        })

        acc.push(
          <>
            <div style={{
              border: '1px solid white',  // Add a black border
              // padding: '20px',  // Optional: Add padding
              // margin: '10px',   // Optional: Add margin
              marginTop: '5px',
              paddingLeft: '5px'
            }}>
              {courierItem}
            </div>
          </>
        )
        
      }

      if (!_isEmpty(_get(items, 'farm_direct_delivery_items', []))) {
        let farmItem = [<> <div style={{ marginTop: 5, marginBottom: 10, fontWeight: 'bold', fontSize: '2rem'}}>Farm Direct </div></>];
        _map(_get(items, 'farm_direct_delivery_items', []), (item, index) => {
          total_tax += _get(item, 'tax', 0);
          farmItem.push(
            <>
              <div className=" d-flex flex-wrap justify-content-between mb-3">
                <div className="itemsname" >
                  {item.product_name}-{_get(item, 'status')}
                </div>
                <div className="pricingWrapper">
                  <span className="orderDetaillabel">{item.product_qty}</span>
                  <span>${item && item.row_total ?
                    this.convertToDecimal(item.row_total) : '0.00'}
                  </span>
                </div>

              </div>
            </>
          )
        })
        acc.push(
          <>
            <div style={{
              border: '1px solid white',  // Add a black border
              // padding: '20px',  // Optional: Add padding
              // margin: '10px',   // Optional: Add margin
              marginTop: '5px',
              paddingLeft: '5px'
            }}>
              {farmItem}
            </div>
          </>
        )
        
      }
      // console.log(acc, 'acc');
      return acc;
      // return (<React.Fragment key={index}>
      //   <div className=" d-flex flex-wrap justify-content-between mb-3">
      //     <div className="itemsname" >
      //       {item.product_name}
      //     </div>
      //     <div className="pricingWrapper">
      //       <span className="orderDetaillabel">{item.product_qty}</span>
      //       <span>${item && item.total ?
      //         this.convertToDecimal(item.total) : '0.00'}
      //       </span>
      //     </div>

      //   </div>
      // </React.Fragment>)
    };

    const calculateTax = (items) => {
      let total_tax = 0;
      _map(_get(items, 'local_delivery_items', []), (item, index) => {
        total_tax += _get(item, 'tax', 0);
        
      })

      _map(_get(items, 'courier_delivery_items', []), (item, index) => {
        total_tax += _get(item, 'tax', 0);
        
      });

      _map(_get(items, 'farm_direct_delivery_items', []), (item, index) => {
        total_tax += _get(item, 'tax', 0);
        
      })

      return total_tax;


    }

    let renderOrder = (grpOrder) => grpOrder && grpOrder.map((data, index) => {
      // console.log(grpOrder, 'order data', total_tax);
      let total_tax = calculateTax(data);
      return (<React.Fragment key={index}>
        <div className="OrderSettingsection">
          <ExpansionPanel
            defaultExpanded={index === 0 ? true : false}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content" id="panel1a-header">
              <div className="d-flex flex-wrap title">
                ORDER #{data.increment_id}
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className="d-flex no-gutters w-100">
                <div className="col-md-12">
                  <div>
                    {/* {renderItems(data.items)} */}
                    {renderItems(data, total_tax)}
                  </div>

                  <div className="row pt-4 d-flex flex-wrap align-items-center">
                    <div className="col-md-12 d-flex justify-content-between align-items-center">
                      <div>
                        <span className="orderStatusText">{data.status}</span>
                      </div>
                      <div className="pricingWrapper flex-column">
                        <div className="d-flex justify-content-between w-100" >
                          <span className="orderDetaillabel">DELIVERY</span>
                          <span className="Orderprice">
                            ${data && data.delivery_fee ? this.convertToDecimal(data.delivery_fee) : '0.00'}</span>
                        </div>
                        {/* <div className="d-flex justify-content-between w-100" >
                          <span className="orderDetaillabel">BANK CHARGE</span>
                          <span className="Orderprice">
                            ${data && data['Bank Charge'] ? this.convertToDecimal(data['Bank Charge']) : '0.00'}</span>
                        </div> */}

                        <div className="d-flex justify-content-between w-100" >
                          <span className="orderDetaillabel">TAX</span>
                          <span className="Orderprice">
                            ${data && data.tax ? this.convertToDecimal(data.tax) : this.convertToDecimal(total_tax)}</span>
                        </div>

                        <div className="d-flex justify-content-between w-100" >
                          <span className="orderDetaillabel">TIP</span>
                          <span className="Orderprice">
                            ${data && data.driver_tip ? this.convertToDecimal(data.driver_tip) : '0.00'}</span>
                        </div>

                        <div className="d-flex justify-content-between w-100" >
                          <span className="orderDetaillabel">DISCOUNT</span>
                          <span className="Orderprice">
                            ${data && data.discount ? this.convertToDecimal(data.discount) : '0.00'}</span>
                        </div>

                        <div className="d-flex justify-content-between w-100" >
                          <span className="orderDetaillabel" style={{ fontWeight: 'bold' }}>TOTAL</span>
                          <span className="ml-2 Orderprice" style={{ fontWeight: 'bold' }} >
                            ${data && data.grand_total ? this.convertToDecimal(data.grand_total) : '0.00'}</span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </React.Fragment>)
    });

    const renderWallet = _map(this.state.walletDetails, (val, index) => {
      return (
        <React.Fragment key={index}>
          <Row className="detailwrapper m-border-bottom">
            <Col xs={3} className="justify-content-center align-items-center d-md-none">
              <img src={proimg} className="img-responsive"></img>
            </Col>
            <Col className="d-md-flex justify-content-md-center align-items-md-center p-0">
              <Col xs={12} md={4} xl={4} className=" d-flex align-items-md-center">
                <div className="d-none d-md-block col-3 p-0"><img src={proimg} className="img-responsive"></img></div>
                <div className="mb-3 mb-md-0 pl-md-3">{_get(val, 'itemName')}</div>
              </Col>
              <Col xs={12} md={2} xl={2}><strong className="d-md-none">Retailer:</strong> {_get(val, 'orderNo')}</Col>
              <Col xs={12} md={2} xl={2}><strong className="d-md-none">Size:</strong> {_get(val, 'ordered')}</Col>
              <Col xs={12} md={2} xl={2}><strong className="d-md-none">Consumed Qty:</strong> <span className="textRed">{_get(val, 'consumed')}</span></Col>
              <Col xs={12} md={2} xl={2}><strong className="d-md-none">Available Qty:</strong> <span className="textGreen">{_get(val, 'remaining')}</span></Col>
            </Col>
          </Row>
        </React.Fragment>

      );
    })

    return (
      <React.Fragment>
        <div className="block-title mb-5">
          {/* <KeyboardBackspaceIcon style={{fontSize:13, marginRight:10}} /> */}
          YOUR ORDERS</div>
        <div className=" dine-in-tabs">
          <Tabs>
            <TabList>
              <Tab>Delivery</Tab>
              {/* <Tab>Pickup</Tab>
              <Tab>Dine-In</Tab> */}
            </TabList>

            <TabPanel>
              <h3 className="mb-4">Delivery Orders</h3>
              {/* <div className="orderSummary">{this.state.groupedOrder && renderOrder(_get(this.state.groupedOrder, orderType.delivery))}</div> */}
              <div className="orderSummary">{this.state.orderData && renderOrder(this.state.orderData)}</div>
            </TabPanel>
            <TabPanel>
              <h3 className="mb-4">Pickup Orders</h3>
              {/* <div className="orderSummary">{this.state.orderData && renderOrder}</div>  */}
              <div className="orderSummary">{this.state.groupedOrder && renderOrder(_get(this.state.groupedOrder, orderType.pickup))}</div>
            </TabPanel>
            <TabPanel>
              <div className="d-flex flex-row align-items-center">
                <h3 className="mb-4">Dine-In</h3>
                <Tooltip title="Selecting state is mandatory" placement="right">
                  <InfoIcon style={{ fontSize: 16 }} className="mb-4 ml-2" />
                </Tooltip>

              </div>

              {/* { this.state.totalRemainingLiquor ? <h3 className="mb-4 d-flex flex-column flex-md-row align-items-md-center"> */}
              <h3 className="mb-4 d-flex flex-column flex-md-row align-items-md-center">

                <div style={{ minWidth: 200, marginLeft: 10, marginRight: 10 }}>
                  <Select
                    isSearchable={true}
                    isMulti={false}
                    isDisabled={false}
                    valueKey="value"
                    name="state"
                    placeholder={'Select'}
                    value={this.state.selectedOption}
                    options={this.state.statesDropDowns}
                    onChange={this.handleStateDropdown}
                    // onBlur={() => onBlur(value)}
                    // onFocus={onFocus}
                    styles={colourStyles}
                  />
                </div>
                <div style={{ minWidth: 200, marginLeft: 10, marginRight: 10 }}>
                  <Select
                    isSearchable={true}
                    isMulti={false}
                    isDisabled={false}
                    valueKey="value"
                    name="state"
                    placeholder='Select'
                    value={this.state.selectedCategory}
                    options={this.state.hotelCategory}
                    onChange={this.handleCategoryDropdown}
                    // onBlur={() => onBlur(value)}
                    // onFocus={onFocus}
                    styles={colourStyles}
                  />
                </div>
                {/* { this.state.totalRemainingLiquor ? <div>Total Available Liquor: <strong>{this.state.totalRemainingLiquor}</strong> 
                            {<ExpandMoreIcon style={{marginLeft:10, marginRight:10}} />}</div> : null } */}
                <div>Total Available Liquor: <strong>{this.state.totalRemainingLiquor}</strong>
                  {<ExpandMoreIcon style={{ marginLeft: 10, marginRight: 10 }} />}</div>
                {(this.state.selectedOption.label === 'All' || this.state.totalRemainingLiquor === 0) ? <button className="btn redeemnowbtn mt-4 mt-md-0" disabled>REDEEM NOW</button> : <button className="btn redeemnowbtn mt-4 mt-md-0" onClick={this.handleRedeem}>REDEEM NOW</button>}
                {/* </h3> : null } */}
              </h3>

              {this.state.totalRemainingLiquor ? <div className="availableproductwrapper mb-5 ">
                <Row className="headingwrapper d-none d-md-flex">
                  <Col xs={12} md={4} xl={4}>Products</Col>
                  <Col xs={12} md={2} xl={2}>Order #</Col>
                  <Col xs={12} md={2} xl={2}>Ordered</Col>
                  <Col xs={12} md={2} xl={2}>Consumed</Col>
                  <Col xs={12} md={2} xl={2}>Remaining</Col>
                </Row>

                {renderWallet}


                {/* <Row className="detailwrapper m-border-bottom">
                            <Col xs={3} className="justify-content-center align-items-center d-md-none">
                                <img src={proimg} className="img-responsive"></img>
                            </Col>
                            <Col className="d-md-flex justify-content-md-center align-items-md-center p-0">
                                <Col xs={12} md={4} xl={4} className=" d-flex align-items-md-center">
                                    <div className="d-none d-md-block col-3 p-0"><img src={proimg} className="img-responsive"></img></div>
                                    <div className="mb-3 mb-md-0 pl-md-3">Johnnie Walker Red Label Blended Scotch Whisky</div>                            
                                </Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Retailer:</strong> tLiqour@ 1 janpath</Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Size:</strong> 750 ML</Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Consumed Qty:</strong> <span className="textRed">350 ML</span></Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Available Qty:</strong> <span className="textGreen">400 ML</span></Col>
                            </Col>
                            </Row>

                            <Row className="detailwrapper m-border-bottom">
                            <Col xs={3} className="justify-content-center align-items-center d-md-none">
                                <img src={proimg} className="img-responsive"></img>
                            </Col>
                            <Col className="d-md-flex justify-content-md-center align-items-md-center p-0">
                                <Col xs={12} md={4} xl={4} className=" d-flex align-items-md-center">
                                    <div className="d-none d-md-block col-3 p-0"><img src={proimg} className="img-responsive"></img></div>
                                    <div className="mb-3 mb-md-0 pl-md-3">Johnnie Walker Red Label Blended Scotch Whisky</div>                            
                                </Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Retailer:</strong> tLiqour@ 1 janpath</Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Size:</strong> 750 ML</Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Consumed Qty:</strong> <span className="textRed">350 ML</span></Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Available Qty:</strong> <span className="textGreen">400 ML</span></Col>
                            </Col>
                            </Row>

                            <Row className="detailwrapper m-border-bottom">
                            <Col xs={3} className="justify-content-center align-items-center d-md-none">
                                <img src={proimg} className="img-responsive"></img>
                            </Col>
                            <Col className="d-md-flex justify-content-md-center align-items-md-center p-0">
                                <Col xs={12} md={4} xl={4} className=" d-flex align-items-md-center">
                                    <div className="d-none d-md-block col-3 p-0"><img src={proimg} className="img-responsive"></img></div>
                                    <div className="mb-3 mb-md-0 pl-md-3">Johnnie Walker Red Label Blended Scotch Whisky</div>                            
                                </Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Retailer:</strong> tLiqour@ 1 janpath</Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Size:</strong> 750 ML</Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Consumed Qty:</strong> <span className="textRed">350 ML</span></Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Available Qty:</strong> <span className="textGreen">400 ML</span></Col>
                            </Col>
                            </Row>

                            <Row className="detailwrapper m-border-bottom">
                            <Col xs={3} className="justify-content-center align-items-center d-md-none">
                                <img src={proimg} className="img-responsive"></img>
                            </Col>
                            <Col className="d-md-flex justify-content-md-center align-items-md-center p-0">
                                <Col xs={12} md={4} xl={4} className=" d-flex align-items-md-center">
                                    <div className="d-none d-md-block col-3 p-0"><img src={proimg} className="img-responsive"></img></div>
                                    <div className="mb-3 mb-md-0 pl-md-3">Johnnie Walker Red Label Blended Scotch Whisky</div>                            
                                </Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Retailer:</strong> tLiqour@ 1 janpath</Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Size:</strong> 750 ML</Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Consumed Qty:</strong> <span className="textRed">350 ML</span></Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Available Qty:</strong> <span className="textGreen">400 ML</span></Col>
                            </Col>
                            </Row>

                            <Row className="detailwrapper m-border-bottom">
                            <Col xs={3} className="justify-content-center align-items-center d-md-none">
                                <img src={proimg} className="img-responsive"></img>
                            </Col>
                            <Col className="d-md-flex justify-content-md-center align-items-md-center p-0">
                                <Col xs={12} md={4} xl={4} className=" d-flex align-items-md-center">
                                    <div className="d-none d-md-block col-3 p-0"><img src={proimg} className="img-responsive"></img></div>
                                    <div className="mb-3 mb-md-0 pl-md-3">Johnnie Walker Red Label Blended Scotch Whisky</div>                            
                                </Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Retailer:</strong> tLiqour@ 1 janpath</Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Size:</strong> 750 ML</Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Consumed Qty:</strong> <span className="textRed">350 ML</span></Col>
                                <Col xs={12} md={2} xl={2}><strong className="d-md-none">Available Qty:</strong> <span className="textGreen">400 ML</span></Col>
                            </Col>
                            </Row> */}





              </div> : null}


              {/* <div className="orderSummary">{this.state.orderData && renderOrder}</div>  */}
              <div className="orderSummary">{this.state.groupedOrder && renderOrder(_get(this.state.groupedOrder, orderType.dinein))}</div>
            </TabPanel>
          </Tabs>
        </div>

      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  let isLoading = _get(state, 'orderSettings.isFetching')
  let customer_id = _get(state, 'userSignInInfo.lookUpData.0.result.customer_id');
  return { isLoading, customer_id }
};

export default connect(mapStateToProps)(WithLoading(OrderSetting));