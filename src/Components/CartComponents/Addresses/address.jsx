
import React from 'react';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import { Button } from 'reactstrap';
import { OnChange, OnBlur } from 'react-final-form-listeners'


import Scrollbar from "react-scrollbars-custom";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
// import AddressCard from './addressCard';
import AddressCard from './addressCardNew';
import AddAddressCard from './addAddressCard';
import { map as _map, findIndex as _findIndex, get as _get, isEmpty as _isEmpty, find as _find, filter as _filter, reduce as _reduce } from 'lodash';
import { genericPostData } from '../../../Redux/Actions/genericPostData';
import { Form, Field, onChange } from 'react-final-form';
import { TextInputField, SwitchInputField } from '../../../Global/FormCompoents/wrapperComponent';
import RFReactSelect from '../../../Global/FormCompoents/react-select-wrapper';
import { Button as MaterialButtom } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import validate from './validaor/addAddressFormValidator';
import { commonActionCreater } from '../../../Redux/Actions/commonAction';
import { Container, Row, Col } from 'reactstrap'
import proImg from '../../../assets/images/party-can.png';
import watermark from '../../../assets/images/watermark.jpg';

import { stateDropDown } from '../../../assets/data/dropdown';
import { Loader } from '../../../Global/UIComponents/LoaderHoc';
import { cleanEntityData, formatPrice } from '../../../Global/helper/commonUtil';
import { isMobile, isTablet } from 'react-device-detect';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PageView, ProductCheckout, ProductCheckoutOptions } from '../../../Global/helper/react-ga';
import showMessage from '../../../Redux/Actions/toastAction';
import CommonSnackbarComponent from '../../../Global/UIComponents/Snackbar';


const styles = (state) => ({

    addressFormShow: {
        display: state.isAddressFormShown ? 'block' : 'none',
        width: 'auto',

    },
    addressFormHide: {
        display: state.isAddressFormShown ? 'none' : 'block'
    },

});

const options = _map(stateDropDown, s => cleanEntityData({
    value: _get(s, 'abbreviation'),
    label: _get(s, 'name')
}));

class Address extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAddress: 0,
            userAddress: [],
            isAddressFormShown: false,
            selectedCardColor: 'green',
            isLoading: false,
        }
        this.formRef = React.createRef(null);

    }



    fetchAddressModify = (data) => {
        let addressList = [];
        if (_get(data, 'code') === 1) {
            addressList = _reduce(_get(data, 'data', []), (acc, d) => {
                if (_get(d, 'address_type') == 'shipping') {
                    const addData = {
                        type: _get(d, 'address_nickname'),
                        name: _get(d, 'name'),
                        id: _get(d, 'address_id'),
                        street_1: _get(d, 'street1'),
                        street_2: _get(d, 'street2'),
                        city: _get(d, 'city'),
                        state: _get(d, 'state'),
                        country: _get(d, 'country'),
                        zipcode: _get(d, 'zipcode'),
                        phone: _get(d, 'telephone'),
                        defaultAddress: _get(d, 'default_address'),
                        isPrimary: (_get(d, 'default_address') === "1") ? true : false,
                        // address: _get(d, 'street2') ? `${_get(d, 'street1')}, ${_get(d, 'street2')},${_get(d, 'city')}, ${_get(d, 'state')}, ${_get(d, 'zipcode')}` : `${_get(d, 'street1')},${_get(d, 'city')}, ${_get(d, 'state')}, ${_get(d, 'zipcode')}`
                        address_1: _get(d, 'street2') ? `${_get(d, 'street1')}, ${_get(d, 'street2')}` : `${_get(d, 'street1')}`,
                        address_2: `${_get(d, 'city')}, ${_get(d, 'state')} ${_get(d, 'zipcode')}`
                    }
                    acc.push(addData)
                }

                return acc;

            }, []);

        }


        const primaryAddressIndex = _findIndex(addressList, ['isPrimary', true]);
        const splicedData = (primaryAddressIndex !== -1) ? addressList.splice(primaryAddressIndex, 1) : undefined;
        if (splicedData) {
            addressList.unshift(splicedData[0]);
        }

        const selectedAddress = addressList.find(add => {
            if (add.isPrimary === true) {
                return add;
            }
        })

        this.setState({
            selectedAddress: _get(selectedAddress, 'id'),
            userAddress: addressList,
            isLoading: false,
            isAddressSelected: _isEmpty(selectedAddress) ? false : true
        });
    };

    fetchAddress = () => {
        this.setState({
            isLoading: true,
        });
        const userAddressFetchSuccess = (data) => {
            this.fetchAddressModify(data);
        };
        const userAddressFetchError = (err) => {
            console.log(err);
            this.setState({
                isLoading: false,
            });
        };
        let body = {
            api_token: _get(this.props, 'userDetails.api_token', ''),
            customerid: parseInt(_get(this.props, 'userDetails.customer_id', 0), 10),
            address_type: 'shipping'
        };
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: body,
            url: `/connect/customer/getaddresses?customerid=${_get(this.props, 'userDetails.customer_id', 0)}`,
            // url: '/card/new',
            constants: {
                init: "USER_ADDRESS_INIT",
                success: "USER_ADDRESS_SUCCESS",
                error: "USER_ADDRESS_ERROR"
            },
            identifier: "USER_ADDRESS",
            successCb: userAddressFetchSuccess,
            errorCb: userAddressFetchError,
            dontShowMessage: true
        });
    };

    handleCardClick = (selectedId,zipcode) => {
        if(localStorage.getItem("zipcode")!= zipcode){
           window.alert("Selection not Allowed as Shipping Zipcode dosen't Match with Shopping Zipcode");
           return;
        }
        this.setState({
            selectedAddress: selectedId,
            isAddressSelected: true
        });
    };

    handleAddAddress = () => {
        this.setState({
            isAddressFormShown: this.state.isAddressFormShown ? false : true
        });
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({loading:true})
        import('./mincity.json').then(data => {
            this.setState({loading:false})
            let foundCity = data.default.find(x => x.z == localStorage.getItem("zipcode"));
            if (foundCity) {
                this.setState({city:foundCity.c,state:foundCity.s});

            }
        })

        if (!_isEmpty(this.props.userDetails)) {

            this.fetchAddress();
        }
        let data = {
            isAddressTab: true,
            isSpeedTab: false,
            iscardTab: false,
            isFaceTab: false,
            isSummaryTab: false
        };
        this.props.dispatch(commonActionCreater(data, 'CART_TAB_VALIDATION'));



        // if(this.props.sessionRedirectToLogin){
        //     this.setState({currentStep:3});
        //     this.props.dispatch(commonActionCreater(false,'SESSION_START_REDIRECT_TO_LOGIN'));
        // }
    };

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

    addUserAddressSuccess = (data) => {
        if (_get(data, 'code') === 1) {
            this.setState({
                isAddressFormShown: this.state.isAddressFormShown ? false : true,
                saveAddressLoading: false
            });
            this.fetchAddress();
        } else {
            this.setState({ saveAddressLoading: false });
        }

    };

    addUserAddressError = (err) => {
        this.setState({ saveAddressLoading: false });
        console.log(err)
    };

    onSubmit = async values => {
        this.setState({ saveAddressLoading: true });
        let data = await import('./mincity.json');
        let foundCity = data.default.find(x => x.z == _get(values, 'zip'));
        if(foundCity && _get(foundCity,'c','').toLowerCase().trim() !=_get(values, 'city','').toLowerCase().trim()){
            this.setState({ saveAddressLoading: false });
            alert("Your Zipcode and City Value Doesn't match.Please Fix and Try Again");
            return;
        }

        let body = {
            'first_name': _get(values, 'firstName'),
            'last_name': _get(values, 'lastName'),
            'street1': _get(values, 'address'),
            'street2': _get(values, 'address2'),
            'city': _get(values, 'city'),
            'state': _get(values, 'state'),
            'zipcode': _get(values, 'zip'),
            'nickname': _get(values, 'addressNickname'),
            'telephone': _get(values, 'phone'),
            'default_address': _get(values, 'defaultAddress') ? '1' : '0',
            'country': 'US',
            'address_type': 'shipping'

        };
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: body,
            url: `/connect/customer/addaddress?customerid=${_get(this.props, 'userDetails.customer_id', 0)}`,
            constants: {
                init: 'POST_USER_ADDRESSES_INIT',
                success: 'POST_USER_ADDRESSES_SUCCESS',
                error: 'POST_USER_ADDRESSES_ERROR'
            },
            identifier: 'POST_USER_ADDRESSES',
            successCb: this.addUserAddressSuccess,
            errorCb: this.addUserAddressError,
            dontShowMessage: true
        });


    };

    reactGACheckoutOptions = () => {
        const addressDetails = _find(this.state.userAddress, ['id', this.state.selectedAddress]);
        const cart = this.reactGACartItem();
        ProductCheckoutOptions({ cart, step: 1, option: _get(addressDetails, 'type') });
    };


    handleCardSelect = () => {
        // console.log('check 112')
        const state = _get(this.props, "zipCodeInfo.state");
        const city = _get(this.props, "zipCodeInfo.city");
        // const zipcode = _get(this.props, "zipCodeInfo.address").match(/\d/g).join("");
        // const zipcode = _get(this.props, "zipCodeInfo.zipcode");
        const zipcode = localStorage.getItem('zipcode');
        const addressDetails = _find(this.state.userAddress, ['id', this.state.selectedAddress]);

        // console.log(state, city, zipcode, addressDetails, 'check 2234')

        
        // if (state?.toUpperCase() != addressDetails?.state?.toUpperCase()) {
        //     this.props.dispatch(showMessage({ text: 'Delivery State Doesnot match with selected product state', isSuccess: false }));
        // }
        // if (city?.toUpperCase() != addressDetails?.city?.toUpperCase()) {
        //     this.props.dispatch(showMessage({ text: 'Delivery city Doesnot match with selected product city', isSuccess: false }));
        // }
        if (zipcode != addressDetails?.zipcode) {
            this.props.dispatch(showMessage({ text: 'Delivery zipcode Doesnot match with selected product zipcode', isSuccess: false }));
        }
        else {
            // console.log('check 112')
            this.reactGACheckoutOptions();
            ProductCheckout({ cart: this.reactGACartItem(), step: 2, option: 'Delivery Options' });
            PageView();

            let cartFlow = this.props.cartFlow;
            let data = {
                ...cartFlow,
                selectedAddress: this.state.selectedAddress,
            };
            this.props.dispatch(commonActionCreater(data, 'CART_FLOW'));
            // this.props.handleTabOnContinue('speed');
            this.props.handleTabOnContinue('card');
        }
    }

    handleGoBack = () => {
        this.setState({
            isAddressFormShown: this.state.isAddressFormShown ? false : true
        });
    }
    handleZipChange = (zip) => {
        if (zip.length == 5) {
            import('./mincity.json').then(data => {
                let foundCity = data.default.find(x => x.z == zip);
                if (foundCity) {
                    this.formRef.change('city', foundCity.c);
                    this.formRef.change('state', foundCity.s)

                }
            })
        }
        console.log(zip, "handleZipChange");
    }

    renderContent = (addresses) => {
        let commonContent = <>
            <div className="scrollerwrapper" >
                <div style={styles(this.state).addressFormHide}>

                    <div className="d-flex flex-wrap CardsWrapper">
                        <AddAddressCard handleAddAddress={this.handleAddAddress} />
                        {addresses}
                    </div>

                </div>
                <div style={styles(this.state).addressFormShow}>

                    <Form enableReinitialize={true}
                        initialValues={{ zip: localStorage.getItem('zipcode'),city:this.state.city,state:this.state.state }} onSubmit={this.onSubmit} validate={validate}
                        render={({ handleSubmit, form }) => {
                            this.formRef = form;

                            return (
                                <form id="###addressform###" onSubmit={handleSubmit}>
                                    <div className="block-title d-flex justify-content-between align-items-center mb-4">
                                        <span className="d-flex align-items-center">
                                            <Field name="defaultAddress" component={SwitchInputField} label='DEFAULT ADDRESS' />
                                        </span>
                                    </div>
                                    <div className="d-flex mt-5">
                                        <div style={{ width: '50%', marginRight: 50 }}>
                                            <Field name="firstName" component={TextInputField} placeholder='FIRST NAME'
                                                autoFocus={false} type='text' />
                                        </div>
                                        <div style={{ width: '50%' }}>
                                            <Field name="lastName" component={TextInputField} placeholder='LAST NAME'
                                                autoFocus={false} type='text' />
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <Field name="address" component={TextInputField} placeholder='ADDRESS'
                                            autoFocus={false} type='text' />
                                    </div>
                                    <div className="mt-5">
                                        <Field name="address2" component={TextInputField} placeholder='ADDRESS 2'
                                            autoFocus={false} type='text' />
                                    </div>
                                    <div className="d-flex mt-5">
                                        {/* <Field name="state" component={TextInputField} placeholder='STATE'
                                        autoFocus={false} type='text' />
                                        <Field name="zip" component={TextInputField} placeholder='ZIP'
                                        autoFocus={false} type='text' />         */}
                                        <div style={{ width: '50%', marginRight: 50, position: 'relative' }}>
                                            <Field name="zip" component={TextInputField} placeholder='ZIP'
                                                autoFocus={false} type='text' />
                                            <OnChange name="zip">
                                                {(value, previous) => {
                                                    this.handleZipChange(value)
                                                }}
                                            </OnChange>
                                        </div>
                                        <div style={{ width: '50%' }}>
                                            <Field name="city" component={TextInputField} placeholder='CITY'
                                                autoFocus={false} type='text' />

                                        </div>


                                    </div>
                                    <div className="mt-5">
                                        <Field name="state" component={RFReactSelect} placeholder='STATE'
                                            autoFocus={false} type='text' options={options} search={true} />
                                    </div>

                                    <div className="mt-5">
                                        <Field name="addressNickname" component={TextInputField} placeholder='ADDRESS NICKNAME'
                                            autoFocus={false} type='text' />
                                    </div>
                                    <div className="mt-5">
                                        <Field name="phone" component={TextInputField} placeholder='phone'
                                            autoFocus={false} type='text' />
                                    </div>

                                </form>)
                        }}
                    />
                </div>
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

    addressSubmit = () => {
        document
            .getElementById('###addressform###')
            .dispatchEvent(new Event('submit', { cancelable: true }))
    }
    render() {
        const { isLoading } = this.state;
        if (isLoading) {
            return <Loader />
        }
        const { classes } = this.props;
        let addresses = this.state.userAddress.map(a => {
            return (
                <React.Fragment key={a.id}>
                    <AddressCard
                        data={a}
                        handleCardClick={this.handleCardClick}
                        selectedAddress={this.state.selectedAddress}
                        selectedCardColor={this.state.selectedCardColor}
                    />
                </React.Fragment>

            );
        });




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
                            <Col lg={6} className="d-flex flex-column order-2 order-md-1">
                                {!this.state.isAddressFormShown ? <div className="block-title mb-5">Select a Shipping Address</div> : <div>
                                    <div className="bread-crumb mb-4"><KeyboardBackspaceIcon style={{ fontSize: 13, marginRight: 10 }} onClick={this.handleGoBack} />ADDRESS</div>
                                    <div className="block-title mb-5">ADD NEW ADDRESSES</div>
                                </div>}
                                {this.renderContent(addresses)}

                                {!this.state.isAddressFormShown ? <div className="text-left mt-5" >
                                    <Button variant="contained" color="primary" className="bottomActionbutton cartActionBtn" disabled={!_get(this.state, 'isAddressSelected', false)} onClick={this.handleCardSelect}>
                                        <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> SAVE & CONTINUE
                                    </Button>
                                </div> :
                                    <div className="text-left mt-5" >
                                        <Button onClick={this.addressSubmit} variant="contained" color="primary" className="bottomActionbutton cartActionBtn">
                                            {this.state.saveAddressLoading ? <CircularProgress /> : <><ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> SAVE ADDRESS</>}
                                        </Button>
                                    </div>}
                            </Col>

                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    let cartItems = _get(state, "cart.lookUpData[0].result", []);
    let cartFlow = _get(state, 'cartFlow.lookUpData', {});
    let userInfo = _get(state, 'userSignInInfo.lookUpData', []);
    let zipCodeInfo = _get(state, 'zipCodeLocator.lookUpData.data', {});
    zipCodeInfo = zipCodeInfo[0];

    let userDetails = _get(userInfo, '[0].result', {});
    return {
        cartFlow,
        userDetails,
        cartItems,
        zipCodeInfo
    };
};

export default connect(mapStateToProps)(Address);