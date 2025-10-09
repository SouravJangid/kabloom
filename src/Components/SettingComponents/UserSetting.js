
import React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, Button } from 'reactstrap';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import WithLoading from '../../Global/UIComponents/LoaderHoc';
import { get as _get, isEmpty as _isEmpty, map as _map, find as _find, filter as _filter, reduce as _reduce } from 'lodash';
import Switch from '@material-ui/core/Switch';
import { genericPostData } from "../../Redux/Actions/genericPostData";
import UserInfo from './UserInfo';
import AddCard from "../../Components/CartComponents/Card/AddCard.jsx";
import ViewAddressComponent from "./ViewAddresses";
import { cleanEntityData } from '../../Global/helper/commonUtil';
import { stateDropDown } from '../../assets/data/dropdown';
import { Form, Field } from 'react-final-form';
import { TextInputField } from '../../Global/FormCompoents/wrapperComponent';
import RFReactSelect from '../../Global/FormCompoents/react-select-wrapper';
import addressValidate from './validators/addressValidate';

import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import { OnChange, OnBlur } from 'react-final-form-listeners'

// table import
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from '@material-ui/core/TableHead';
import TableRow from "@material-ui/core/TableRow";
import TableCell from '@material-ui/core/TableCell';

const options = _map(stateDropDown, s => cleanEntityData({
    value: _get(s, 'abbreviation'),
    label: _get(s, 'name')
}));

class UserSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userSettingData: {},
            newsLetter: false,
            notification: false,
            addCard: false,
            addresses: [],
            editShippingAddress: false,
            editAddressScroll: false,

        }
        this.formRef = React.createRef(null);

        this.editAddressRef = React.createRef();
    }

    getAddresses = async () => {
        let body = {
            api_token: _get(this.props, 'userDetails.api_token', ''),
            customerid: parseInt(_get(this.props, 'userDetails.customer_id', 0), 10)
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
            successCb: this.userAddressFetchSuccess,
            errorCb: this.userAddressFetchError,
            dontShowMessage: true
        });
    }


    fetchAddressModify = (data) => {
        let addressList = [];
        if (_get(data, 'code') === 1) {
            addressList = _map(_get(data, 'data', []), (d, index) => ({
                type: _get(d, 'address_nickname'),
                name: _get(d, 'name'),
                firstname: _get(d, 'firstname'),
                lastname: _get(d, 'lastname'),
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

            }));
        }
        this.setState({
            addresses: addressList
        });
    }

    userAddressFetchSuccess = (data) => {
        this.fetchAddressModify(data);
    };
    userAddressFetchError = (err) => {
        console.log(err);
        this.setState({
            isLoading: false,
        });
    };



    componentDidMount() {
        window.scrollTo(0, 0);
        if (this.props.tabValue === 0) {
            this.getSettingData();
            this.getAddresses();
        }

    }

    componentDidUpdate() {



        if (this.state.editAddressScroll) {

            this.setState({ editAddressScroll: false });
            this.editAddressRef && this.editAddressRef.current && this.editAddressRef.current.scrollIntoView({ behavior: "smooth" });
        }

        // if (this.state.topScroll) {
        //     console.log('top scroll initiated')
        //     this.setState({ topScroll: false });
        //     this.scrolltoTopRef && this.scrolltoTopRef.current && this.scrolltoTopRef.current.scrollIntoView({ behavior: "smooth" });
        // }

    }

    getSettingData = () => {
        let reqData = { api_token: localStorage.getItem("Token") };
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: reqData,
            url: `api/account/mydashboard`,
            constants: {
                init: "GET_SETTING_DATA_INIT",
                success: "GET_SETTING_DATA_SUCCESS",
                error: "GET_SETTING_DATA_ERROR"
            },
            identifier: "GET_SETTING_DATA",
            successCb: this.settingDataSuccess,
            errorCb: this.settingDataFailure,
            dontShowMessage: true
        })
    }

    settingDataSuccess = (apiData) => {
        if (apiData.code === 1) {
            this.setState({
                userSettingData: apiData.data,
                newsLetter: apiData.data.newsletter_subscription === 1 ? true : false,
                notification: apiData.data.notification === 1 ? true : false
            })
        }
    }

    settingDataFailure = () => {

    }

    handleSwitchChange = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    getFormatExpireMonth = (month) => {
        return month < 10 ? '0' + month : month;
    }

    getFormatExpireYear = (year) => {
        return year.toString().substr(-2);
    }

    getFomatBrand = (brand) => {
        return brand.toUpperCase();
    }

    addCardFunction = () => {
        this.setState({ addCard: true });
    }

    handleContinueFromNewCard = () => {
        this.setState({ addCard: false });
        this.getSettingData();
    }

    handleBackFromNewCard = () => {
        this.setState({ addCard: false });
    }

    viewAddresses = () => {
        // this.props.history.push('/profile/addresses');
        this.props.viewAddresses();
    }



    makeAddressDefault = (id) => {
        this.setState({
            selectedAddressId: id
        });
        let reqData = {
            // api_token: localStorage.getItem("Token"),
            customer_id: this.props.userDetails.customer_id,
            address_id: id
        };
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: reqData,
            url: `/api/customer/setdefaultshippingaddress`,
            constants: {
                init: "MAKEDEFAULT_ADDRESS_INIT",
                success: "MAKEDEFAULT_ADDRESS_SUCCESS",
                error: "MAKEDEFAULT_ADDRESS_ERROR"
            },
            identifier: "MAKEDEFAULT_ADDRESS",
            successCb: this.makeDefaultAddressSuccess,
            errorCb: this.makeDefaultAddressFailure,
            dontShowMessage: true
        });
    }

    makeDefaultAddressSuccess = (data) => {
        if (_get(data, '0.code') === 1) {
            console.log(data, 'default data');
            const updatedAddresses = _reduce(_get(this.state, 'addresses', []), (acc, f) => {
                if (_get(f, 'id') === this.state.selectedAddressId) {
                    const data = {
                        ...f,
                        defaultAddress: '1'
                    };
                    acc.push(data);
                } else if (_get(f, 'defaultAddress') === '1') {
                    const data = {
                        ...f,
                        defaultAddress: '0'
                    };
                    acc.push(data);
                } else {
                    acc.push(f);
                }
                return acc;
            }, []);
            console.log('updated address', updatedAddresses);
            this.setState({ addresses: [], selectedAddressId: null }, () => {
                this.setState({
                    addresses: updatedAddresses
                });
            });
        } else {
            this.setState({ selectedAddressId: null });
            alert(_get(data, '0.message'));
        }
    };

    makeDefaultAddressFailure = (err) => {
        console.log('default address api failure', err);
    }

    findStateForDropDown = (state) => {
        const res = _find(options, ['label', state]);
        console.log('selected dropdonw', res);
        return _get(res, 'value');
    }

    enableEditAddressDetail = (id) => {
        const address = _find(this.state.addresses, ['id', id]);

        console.log('address', address, this.state.addresses);
        const initValues = cleanEntityData({
            firstname: _get(address, 'firstname', ''),
            lastname: _get(address, 'lastname', ''),
            address: _get(address, 'address_1', ''),
            city: _get(address, 'city', ''),
            state: this.findStateForDropDown(_get(address, 'state', '')),
            zip: _get(address, 'zipcode', ''),
            phone: _get(address, 'phone', '')
        });
        // console.log('init values', initValues);
        this.setState({
            editShippingAddress: !this.state.editShippingAddress,
            addressFormData: initValues,
            editAddressScroll: !this.state.editAddressScroll,
            selectedAddress: address,
        })
    }

    editAddressSuccess = (data) => {
        if (_get(data, 'code') == 1) {
            this.setState({
                editShippingAddress: !this.state.editShippingAddress
            });
            this.getAddresses();
        } else {
            alert('something went wrong');
        }

    };


    editAddressFailure = (err) => {
        alert(err);
        this.setState({
            editShippingAddress: !this.state.editShippingAddress
        });
    }

    editAddressDetail = async (values) => {

        let data = await import('../CartComponents/Addresses/mincity.json');
        let foundCity = data.default.find(x => x.z == _get(values, 'zip'));
        if (foundCity && _get(foundCity, 'c', '').toLowerCase().trim() != _get(values, 'city', '').toLowerCase().trim()) {
            this.setState({ saveAddressLoading: false });
            alert("Your Zipcode and City Value Doesn't match.Please Fix and Try Again");
            return;
        }

        let reqData = cleanEntityData({
            api_token: localStorage.getItem("Token"),
            address_id: _get(this.state, 'selectedAddress.id'),
            street: _get(values, 'address'),
            first_name: _get(values, 'firstname'),
            last_name: _get(values, 'lastname'),
            postcode: _get(values, 'zip'),
            city: _get(values, 'city'),
            state: _get(values, 'state'),
            telephone: _get(values, 'phone'),


        });

        console.log('update addresses', reqData);
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: reqData,
            url: `/connect/customer/updateAddress`,
            constants: {
                init: "EDIT_ADDRESS_INIT",
                success: "EDIT_ADDRESS_SUCCESS",
                error: "EDIT_ADDRESS_ERROR"
            },
            identifier: "EDIT_ADDRESS",
            successCb: this.editAddressSuccess,
            errorCb: this.editAddressFailure,
            dontShowMessage: true
        });

        // this.setState({
        //     editShippingAddress: !this.state.editShippingAddress
        // })
    };
    removeAddress = ({ id }) => {
        const updatedAddress = _filter(this.state.addresses, a => {
            if (_get(a, 'id') !== id) {
                return a;
            }
        });

        this.setState({
            addresses: updatedAddress
        });
    };

    deleteAddressSuccess = (data) => {
        if (_get(data, 'code') == 1) {
            this.removeAddress({ id: this.state.deletedAddressId })
        }
    };

    deleteAddressFailure = (data) => {
        console.log('error', data);
    }

    deleteAddress = async (addressId) => {
        this.setState({
            deletedAddressId: addressId
        });
        const reqData = {
            address_id: addressId
        };
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: reqData,
            url: `/connect/customer/deleteAddress`,
            constants: {
                init: "DELETE_ADDRESS_INIT",
                success: "DELETE_ADDRESS_SUCCESS",
                error: "DELETE_ADDRESS_ERROR"
            },
            identifier: "DELETE_ADDRESS",
            successCb: this.deleteAddressSuccess,
            errorCb: this.deleteAddressFailure,
            dontShowMessage: true
        });
    }

    renderAddressItems = (items) => {
        // console.log('items', items); 
        if (!_isEmpty(items)) {
            return (<React.Fragment >
                <Table >
                    <TableHead>
                        <TableRow >
                            <TableCell className="userSetting-table-row">NAME</TableCell>
                            <TableCell className="userSetting-table-row" align="left">ADDRESS</TableCell>
                            <TableCell className="userSetting-table-row" align="right">ACTIONS</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {_map(items, (item, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ width: "20%" }} className="userSetting-table-body">
                                    {/* <div>Prabhanshu Singh</div> */}
                                    {item.name}
                                </TableCell>
                                <TableCell align="left" style={{ width: "30%" }} className="userSetting-table-body">
                                    <div className="d-flex flex-column">
                                        <div>
                                            {item.address_1}
                                            {/* Address 1 */}
                                        </div>
                                        <div>
                                            {item.address_2}
                                            {/* Address 2 */}
                                        </div>
                                        <div>
                                            {item.phone}
                                        </div>

                                    </div>

                                </TableCell>
                                <TableCell align="right" className="" >
                                    {/* <div className='d-flex flex-row userSetting-table-body-action justify-content-end'>
                                    { (_get(item, 'defaultAddress', '0') === '0') ?  <div style={{ color: '#42b7d6', fontSize: '12px !important'}} onClick={() => this.makeAddressDefault(item.id)}>MAKE DEFAULT</div>: null}
                                    <div style={{ color: '#f63', fontSize: '12px !important', marginLeft: 10}} onClick={() => this.enableEditAddressDetail(item.id)}>EDIT</div>
                                    <div style={{ color: 'red', fontSize: '12px !important', marginLeft: 10}} onClick={() => this.deleteAddress(item.id)}>DELETE</div>
                                </div> */}

                                    <div className='d-flex flex-row userSetting-table-body-action justify-content-end'>
                                        {(_get(item, 'defaultAddress', '0') === '0') ? <div style={{ color: '#42b7d6', fontSize: '12px !important' }} onClick={() => this.makeAddressDefault(item.id)}>MAKE DEFAULT</div> : null}
                                        <div style={{ color: '#f63', fontSize: '12px !important', marginLeft: 10 }} onClick={() => this.enableEditAddressDetail(item.id)}>EDIT</div>
                                        <div style={{ color: 'red', fontSize: '12px !important', marginLeft: 10 }} onClick={() => this.deleteAddress(item.id)}>DELETE</div>
                                    </div>

                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment>)
        }
    }

    editAddressSubmit = () => {
        document
            .getElementById('###editAddressform###')
            .dispatchEvent(new Event('submit', { cancelable: true }))
    }

    cancelEditAddressSubmit = () => {
        this.setState({
            editShippingAddress: !this.state.editShippingAddress
        });
    }

    editKycDetail = () => {
        this.props.history.push({ pathname: '/kyc', kycUpdate: true });
    }



    deleteCard = (id) => {
        console.log('checking id', id);
        this.setState({ deletedCardId: id });
        let reqData = {
            api_token: localStorage.getItem("Token"),
            card_id: id
        };
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: reqData,
            url: `/api/account/RemoveCreditCard`,
            constants: {
                init: "DELETE_CARD_INIT",
                success: "DELETE_CARD_SUCCESS",
                error: "DELETE_CARD_ERROR"
            },
            identifier: "DELETE_CARD",
            successCb: this.deleteCardSuccess,
            errorCb: this.deleteCardFailure,
            dontShowMessage: true
        });
    }

    deleteCardSuccess = (data) => {
        if (_get(data, 'code') === 1) {
            // console.log('deleted succesfully')
            const userSetting = _get(this.state, 'userSettingData.list_cards', []);
            const newCards = _filter(_get(this.state, 'userSettingData.list_cards', []), f => {
                if (_get(f, 'id') !== this.state.deletedCardId) {
                    return f;
                }
            });
            const finalUserSetting = {
                ...userSetting,
                list_cards: newCards,
            };
            this.setState({ deletedCardId: null, userSettingData: null }, () => {
                this.setState({ userSettingData: finalUserSetting });
            });

        } else {
            this.setState({ deletedCardId: null });
            alert(_get(data, 'message'));
        }
    }

    deleteCardFailure = (err) => {
        this.setState({ deletedCardId: null })
        // console.log('not deleted', err);
    }
    handleZipChange = (zip) => {
        if (zip.length == 5) {
            import('../CartComponents/Addresses/mincity.json').then(data => {
                let foundCity = data.default.find(x => x.z == zip);
                if (foundCity) {
                    this.formRef.change('city', foundCity.c);
                    this.formRef.change('state', foundCity.s)

                }
            })
        }
        console.log(zip, "handleZipChange");
    }

    renderEditAddressForm = () => {
        return (
            <div>


                <div>
                    <Form onSubmit={this.editAddressDetail} initialValues={this.state.addressFormData} validate={addressValidate}
                        render={({ handleSubmit, form }) => {
                            this.formRef = form;
                            return (
                                <form id="###editAddressform###" onSubmit={handleSubmit}>

                                    <div className="d-flex mt-5 justify-content-between">
                                        <div style={{ width: '45%' }}>
                                            <label for="firstname" className="rawInputLabel">First Name <span style={{ color: 'red' }}>*</span></label>
                                            <Field name="firstname" component={TextInputField}
                                                autoFocus={false} type='text'
                                            // className="ageGateInput"
                                            // style={{ width: "6vw", height: "8vh" }}

                                            />
                                        </div>

                                        <div style={{ width: '45%' }}>
                                            <label for="lastname" className="rawInputLabel">Last Name <span style={{ color: 'red' }}>*</span></label>
                                            <Field name="lastname" component={TextInputField}
                                                autoFocus={false} type='text'
                                            // className="ageGateInput"
                                            // style={{ width: "6vw", height: "8vh" }}

                                            />
                                        </div>

                                        {/* <div style={{ width: '45%' }}>
                                                        <label for="company" className="rawInputLabel">Company </label>
                                                        <Field name="company" component={RawInputField} 
                                                            autoFocus={false} type='text' 
                                                            // className="ageGateInput"
                                                            // style={{ width: "6vw", height: "8vh" }}
                                                            
                                                            />
                                                    </div> */}

                                    </div>
                                    <div className="d-flex mt-5 justify-content-between">
                                        <div style={{ width: '45%' }}>
                                            <label for="address" className="rawInputLabel">Address <span style={{ color: 'red' }}>*</span></label>
                                            <Field name="address" component={TextInputField}
                                                autoFocus={false} type='text' />
                                        </div>
                                        {/* <div style={{ width: '45%' }}>
                                                        <label for="company" className="rawInputLabel">Company </label>
                                                        <Field name="company" component={TextInputField} 
                                                            autoFocus={false} type='text' 
                                                            
                                                            
                                                            />
                                                    </div> */}
                                    </div>
                                    <div className="d-flex mt-5 justify-content-between">
                                        <div style={{ width: '20%' }}>
                                            <label for="zip" className="rawInputLabel">ZIP<span style={{ color: 'red' }}>*</span></label>
                                            <Field name="zip" component={TextInputField}
                                                autoFocus={false} type='number' className='removingArrorFromNumberInput' />
                                            <OnChange name="zip">
                                                {(value, previous) => {
                                                    this.handleZipChange(value)
                                                }}
                                            </OnChange>
                                        </div>
                                        <div style={{ width: '45%' }}>
                                            <label for="city" className="rawInputLabel">City <span style={{ color: 'red' }}>*</span></label>
                                            <Field name="city" component={TextInputField}
                                                autoFocus={false} />
                                        </div>
                                        <div style={{ width: '20%' }}>
                                            <label for="state" className="rawInputLabel">State<span style={{ color: 'red' }}>*</span></label>
                                            <Field name="state" component={RFReactSelect} placeholder='STATE'
                                                autoFocus={false} type='text' options={options} search={true} />
                                        </div>

                                    </div>
                                    <div className="d-flex mt-5 justify-content-between">
                                        <div style={{ width: '50%' }}>
                                            <label for="phone" className="rawInputLabel">Phone <span style={{ color: 'red' }}>*</span></label>
                                            <Field name="phone" component={TextInputField}
                                                autoFocus={false} type='number' className='removingArrorFromNumberInput' />
                                        </div>
                                    </div>


                                </form>)
                        }}
                    />
                </div>
                <div className="mt-5 pb-5">
                    <div className="d-flex flex-row">
                        <Button onClick={this.editAddressSubmit} variant="contained" color="primary" className="bottomActionbutton cartActionBtn" style={{ width: "30%" }}>

                            {this.state.saveCardLoading ? <CircularProgress /> : <> SAVE </>}
                        </Button>
                        <Button onClick={this.cancelEditAddressSubmit} variant="contained" color="primary" className="bottomActionbutton" style={{ width: "30%", marginLeft: '15%', backgroundColor: '#555 !important' }}>

                            {this.state.saveCardLoading ? <CircularProgress /> : <> CANCEL </>}
                        </Button>
                    </div>

                </div>
            </div>
        )
    }


    render() {
        console.log(this.props.userName, "usernameeee")
        let listCard = []
        if (Array.isArray(_get(this.state, 'userSettingData.list_cards', []))) {
            listCard = _get(this.state, 'userSettingData.list_cards', []);
        }
        let renderCardInfo = listCard.map((data, index) => {
            return (<React.Fragment key={data + index}>
                <div style={{ position: 'relative' }}>
                    <Card className="paymentcardContainer">
                        <CardBody className="cardStyles paymentcard align-items-start active w-100">
                            <div className=" d-flex flex-column flex-wrap cardBrand">
                                {this.getFomatBrand(data.brand)}
                            </div>
                            <div className="CradNo">
                                **** **** **** **** {data.card_no}
                            </div>
                            <div className="cardHolderName">
                                KABLOOM                {/*card name chnaged*/}
                                <span>
                                    {this.getFormatExpireMonth(data.card_exp_month) + '/' +
                                        this.getFormatExpireYear(data.card_exp_year)}
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                    < div style={{ position: 'absolute', top: "1rem", right: '1.5rem', cursor: 'pointer' }}>
                        <DeleteIcon style={{ fontSize: '1.5rem', color: 'red' }} onClick={() => this.deleteCard(data.id)} />
                    </div>
                </div>
            </React.Fragment>)
        });

        return (
            <React.Fragment>
                {!this.state.addCard && <React.Fragment>
                    {this.state.userSettingData && <UserInfo userName={this.props.userName} userInfo={this.state.userSettingData} />}
                    <div className="block-sub-title">YOUR PREFRENCES</div>
                    <div className="CardsWrapper">
                        <Card className="userinfoSettingContainer mb-5 ">
                            <CardBody className="cardStyles userPreferenceSetting">
                                <div className=" d-flex  w-100 justify-content-between align-items-center">
                                    <label>NOTIFICATIONS</label>
                                    <Switch
                                        checked={this.state.notification}
                                        onChange={this.handleSwitchChange}
                                        name="notification"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                </div>
                                <div className=" d-flex  w-100 justify-content-between align-items-center">
                                    <label>NEWSLETTER</label>
                                    <Switch
                                        checked={this.state.newsLetter}
                                        onChange={this.handleSwitchChange}
                                        name="newsLetter"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div className="block-sub-title">KYC STATUS</div>
                <Button onClick={this.editKycDetail} variant="contained" color="primary" className="bottomActionbutton cartActionBtn" style={{marginLeft: '2%'}}>
                                        
                                        UPDATE KYC DOCUMENTS
                        </Button>
            </div> */}                         {/* Kyc status commented hided*/}

                    {/* <div className="CardsWrapper">
                <Card className="paymentcardContainer" onClick={() => this.viewAddresses()}>
                    <CardBody className="cardStyles paymentcard addnewcard">
                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                            <div className="mb-4"><LocationOnIcon style={{ fontSize: 50 }} /> </div> 
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 11}}>
                                <div style={{ fontWeight: 'bold'}}>Your Addresses</div>    
                                <div>Edit addresses for orders</div> 
                            </div>
                            
                        </div>
                                         
                    </CardBody>                          
                </Card>
            </div> */}
                    <div>

                        <div className="sectionspacer">
                            <div style={{ fontSize: '3rem ', fontWeight: 200, paddingTop: '8%', paddingBottom: '3%' }}>MY SHIPPING ADDRESS</div>
                            {this.state.addresses ? this.renderAddressItems(this.state.addresses) : null}
                        </div>
                    </div>

                    <div>
                        {this.state.editShippingAddress ?
                            <div style={{ backgroundColor: '#eff0f0' }} ref={this.editAddressRef}>
                                <div className="sectionspacer">
                                    <div style={{ paddingTop: '10%' }}>
                                        <h2>EDIT SHIPPING ADDRESS</h2>
                                    </div>
                                    <div>
                                        {this.renderEditAddressForm()}
                                    </div>

                                </div>
                            </div>

                            : null}
                    </div>

                    {this.props.userName && <div className="block-sub-title">PAYMENT METHOD</div>}
                    <div className="d-flex CardsWrapper flex-wrap  mb-5 ">

                        {this.props.userName && <Card className="paymentcardContainer" onClick={this.addCardFunction}>
                            <CardBody className="cardStyles paymentcard addnewcard">
                                <div className="mb-4"><AddCircleOutlineOutlinedIcon style={{ fontSize: 25 }} /> </div>
                                <div>ADD CARD</div>
                            </CardBody>
                        </Card>}
                        {this.state.userSettingData && this.state.userSettingData.list_cards && renderCardInfo}
                    </div>
                </React.Fragment>}
                <React.Fragment>
                    {this.state.addCard ?
                        <AddCard
                            isUserSettingAddCard={true}
                            handleContinueFromNewCard={this.handleContinueFromNewCard}
                            goBack={this.handleBackFromNewCard}
                        /> : null}
                </React.Fragment>
            </React.Fragment>);
    }
}

const mapStateToProps = (state) => {
    let isLoading = _get(state, 'userSettings.isFetching')
    let userName = _get(state, "userSignInInfo.lookUpData[0].result.cust_name", '');
    let userInfo = _get(state, 'userSignInInfo.lookUpData', []);
    let userDetails = _get(userInfo, '[0].result', {});

    return { isLoading, userName, userDetails }
};

export default connect(mapStateToProps)(WithLoading(UserSetting));