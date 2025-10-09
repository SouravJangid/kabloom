




import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import {genericPostData} from '../../Redux/Actions/genericPostData';
import { Button } from 'reactstrap';
import { get as _get, map as _map, find as _find, findIndex as _findIndex, isEmpty as _isEmpty, sortBy as _sortBy, reduce as _reduce, parseInt as _parseInt } from 'lodash';
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
import RFReactSelect  from '../../Global/FormCompoents/react-select-wrapper';
import validate from './validation/shipValidate';
import { DateTimePicker , TimePicker} from '../../Global/FormCompoents/wrapperComponent';
import CalenderIcon from '@material-ui/icons/CalendarTodayOutlined';

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

class WalletShipOptions extends React.Component {
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
      selectedCustomer: null,
      selectedState: null,
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

  

  selectDeliverySpeed({ deliveryList }) {
    let selectedSpeedDelivery = deliveryList && deliveryList.speed && deliveryList.speed.find(del => {
      if (del.isPrimary === true) {
        return del;
      }
    });
    let options = [];
    
    options = _map(selectedSpeedDelivery.retailers, s => cleanEntityData({
      value: _get(s, 'id'),
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

  

  componentDidMount() {
    window.scrollTo(0, 0);
    const customer_id = this.props.history.location.state?.customer_id;
    const intCustomerId = customer_id ? _parseInt(customer_id) : undefined;
    const body = cleanEntityData({
      customer_id: intCustomerId,
      state: this.props.history.location.state?.selectedState,
      price_category: this.props.history.location.state?.selectedCategory.value
    });
    // console.log(this.props.history.location.state?.customer_id, 'checking1');

    this.setState({
      isLoading: true,
      selectedCustomer: this.props.history.location.state?.customer_id,
      selectedState: this.props.history.location.state?.selectedState
    });

    // console.log(this.props.zipCodeLocator, 'checking ');
    const availableShippingOptions = enrichArrDataToObj({ data :_get(this.props.zipCodeLocator, 'retailers_method', []), field: 'ship_method'});

    const shippingOptionsFetchSuccess = (data) => {
      // console.log( _get(data, 'data.vendordata', []));
      // if(_get(data, 'code', -1) === -1){
      //   this.setState({pinCodeNotSupported : true})
        
      // }
      // else if (_get(data, 'data', []) === []){
      //   this.setState({noRetailer : true})
      // }
      if (_isEmpty(data)) {
        this.setState({noRetailer : true});
      }
      // else if (_get(data, 'code', -1) === 1) {
      else if (!_isEmpty(data)) {
        const response = _map(data, d => cleanEntityData({
          "id": _get(d, 'location_id'),
          "name": _get(d, 'vendor_name'),
          "retailer_id": _get(d, 'vendor_id'),
          // "street1": _get(d, 'street 1'),
          // "street2": _get(d, 'street2'),
          // "city": _get(d, 'city'),
          // "state": _get(d, 'state'),
          // "zipcode": _get(d, 'zipcode'),
          // "telephone": _get(d, 'telephone'),
          
        }));

        const availableSpeed =  [
          {
                "id": 1,
                "name": "Dine-In",
                "description": "Dine-In",
                "isPrimary": false,
                "enablePointer": false,
                "retailers": response,
              },
              
            //   {
            //     "id": 3,
            //     "name": "Delivery",
            //     "description": "Delivery",
            //     "isPrimary": false,
            //     "enablePointer": false,
            //     "retailers": response,
            //   },
            //   {
            //     "id": 2,
            //     "name": "Pick-Up",
            //     "description": "Pick-Up",
            //     "isPrimary": false,
            //     "enablePointer": false,
            //     "retailers": response,
            //   },

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

        // console.log('final speed', finalSpeedOptions);


        const payload = {
          speed: finalSpeedOptions
        }
        this.setState({
          // ...this.state,
          deliveryList: payload,
          isLoading: false,
          retailerList: response,
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
      url: '/api/vendorsbyproduct/applyproducts',
      constants: {
        init: 'FETCH_WALLET_SHIPPING_OPTIONS_INIT',
        success: 'FETCH_WALLET_SHIPPING_OPTIONS_SUCCESS',
        error: 'FETCH_WALLET_SHIPPING_OPTIONS_ERROR'
      },
      identifier: 'FETCH_WALLET_SHIPPING_OPTIONS',
      successCb: shippingOptionsFetchSuccess,
      errorCb: shippingOptionsFetchError,
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

    
  };



  onSubmit = async values => {
    const time = _get(values, 'diningTime');
    const date = _get(values, 'diningDate');
    const dineinTime = moment(`${date} ${time}`, 'YYYY-MM-DDLT').format('MM/DD/YYYY h:mm A')
    //  console.log('date time', data);
    const retailer = this.state.retailerList?.find((x)=> x.id ==  _get(values, 'retailer')) ;
    console.log('retailer', retailer)
     localStorage.setItem("shippingType", _get(this.state.selectedSpeed, 'name', '').toLowerCase());
     localStorage.setItem("dineinTime", dineinTime);
     localStorage.setItem("retailer", _get(retailer, 'retailer_id'));
     localStorage.setItem("retailer_name", _get(retailer, 'name'));

     localStorage.setItem("vendor_location_id", _get(values, 'retailer') );

     if(this.state.selectedSpeed?.name == "Pick-Up"){
      localStorage.setItem("delivery", 0);
      localStorage.setItem("dineinpickup", 0);
      localStorage.setItem("pickup", 1);
     }
     else if(this.state.selectedSpeed?.name == "Delivery"){
      localStorage.setItem("delivery", 1);
      localStorage.setItem("dineinpickup", 0);
      localStorage.setItem("pickup", 0);
     }
     else {
      localStorage.setItem("delivery", 0);
      localStorage.setItem("dineinpickup", 1);
      localStorage.setItem("pickup", 0);
     }

     this.props.history.push(`/wallet/product/${_get(values, 'retailer')}`, {date: date, time: time, retailerId: _get(retailer, 'retailer_id')});
  }

  shippingSubmit = () => {
    document
        .getElementById('###shipform###')
        .dispatchEvent(new Event('submit', { cancelable: true }))
  };

  
  valid(current) {
   
    return current.isAfter(yesterday);
  }

  

  renderContent = (speed, retailer, shippingMethod, selectDate, availableTime) => {
    let commonContent = <>
     { this.state.noRetailer ? <h1>No retailer available for this location presently</h1> :
        <div className="d-flex flex-column">

          <div className="d-flex flex-column mb-5 ">
            {/* <div className="block-sub-title">Select Speed</div> */}
            <div className="d-flex flex-lg-wrap CardsWrapper justify-content-center selectShippingType px-2">{speed}</div>
          </div>
          { !_isEmpty(_get(this.state, 'retailerOptions', [])) ? 
            <Form onSubmit={this.onSubmit} validate={validate}
                render={({ handleSubmit }) => (
                  <form id="###shipform###" className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                                                       
                      <div className="col-12 col-md-6 positive-relative px-0 mt-5">
                          <Field name="retailer" component={RFReactSelect} placeholder='RETAILER'
                              autoFocus={false} type='text' options={this.state.retailerOptions} search={true} />
                      </div>
                    
                    <div className="mt-5 col-12 col-md-6 positive-relative px-0 dine-selecttion" >             
                              <Field name="diningDate" component={DateTimePicker}
                                  // parse={normalizeDate}
                                  valid={this.valid}
                                  // viewDate={dateBefore21Year}
                                  timeFormat={true}
                                  // dateFormat="MM/DD/YYYY"
                                  // placeholder='Dine-In Time'
                                  autoFocus={false}
                                  className="locationBorder"
                                  />                      
                    </div>
                    <div className="mt-5 col-12 col-md-6 positive-relative px-0 dine-selecttion" >
                     
                             <Field name="diningTime" component={TimePicker}
                                  // parse={normalizeDate}
                                  valid={this.valid}
                                  // viewDate={dateBefore21Year}
                                  timeFormat={true}
                                  autoFocus={false}
                                  className="locationBorder"
                                  />                        
                    </div>
                  </form>)}
              />
            : null }


          
        </div>
  }
    </>
    return <div>{commonContent}</div>
    
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
    



    console.log('selected speed', speed);
    const buttonDisable = !_get(this.state, 'primarySelected');
    return (
      <div className="page-content-container">
        <Container fluid={true}>
          <Row className="no-gutters justify-content-center  secMinHeight">
            
            <Col lg={6} className="order-2 d-flex flex-column  order-md-1">
           { !this.state.pinCodeNotSupported ? 
           <div >
               <div className="block-title mb-5" style={{ textAlign: 'center'}}>CHOOSE A RETAILER FOR DINE-IN</div>
            
              {this.renderContent(speed)}
              { this.state.selectedSpeed  ? <div className="text-left mt-5 d-flex justify-content-center" >
                <Button variant="contained" color="primary" className="bottomActionbutton cartActionBtn" onClick={this.shippingSubmit}>
                  <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> CONTINUE
                          </Button>
            </div> : null }</div> : <h1 style={{textAlign: "center"}}>We are coming soon to this pincode. Please see a list of all pincodes we currently serve.</h1> }
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
  let zipCodeLocator = _get(state, 'zipCodeLocator.lookUpData.data', {});
  return {
    cartFlow,
    userDetails,
    cartTabValidation,
    cartItems,
    zipCodeLocator,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(WalletShipOptions));