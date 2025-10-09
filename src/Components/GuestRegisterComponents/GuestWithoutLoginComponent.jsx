

import React from 'react';

import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { Button } from 'reactstrap';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import validate from './validator/guestWithoutLoginValidator';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Redirect } from 'react-router';
import {genericPostData} from '../../Redux/Actions/genericPostData';
import { commonActionCreater } from '../../Redux/Actions/commonAction';
import {Container, Row, Col} from 'reactstrap'
import { TextInputField } from '../../Global/FormCompoents/wrapperComponent';



class GuestWithoutLoginContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    componentDidMount() {
        window.scrollTo(0, 0);
    }
    addGuestEmailSuccess = (data) => {
        if (_get(data, 'code', -1) === 1) {
            let cartId = localStorage.getItem("cart_id");
            let lookupData = _get(this.props.userSignInInfo, '[0]', {});
            let userSignInInfo = [
                {
                    ...lookupData,
                    result: {
                        ...lookupData.result,
                        customer_id: _get(data, 'data.customer_id'),
                        api_token: _get(data, 'data.api_token'),
                        cart_id: cartId,
                    }
                }
            ];
            localStorage.setItem('Token', _get(data, 'data.api_token', ''));
            this.props.dispatch(commonActionCreater(userSignInInfo, 'USER_SIGNIN_SUCCESS'));
            this.props.history.push('/cart');
        }
        
    };

    addGuestEmailError = (err) => {
        console.log('error in guest email proceed', err);
    };

    onSubmit = async values => {
        let cartId = localStorage.getItem("cart_id");

        let body = {
            customer_email: _get(values, 'email'),
            store_id: 1,
            cart_id: cartId
        }

        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: body,
            url: '/api/cart/guestcart',
            constants: {
                init: 'POST_USER_ADDRESSES_INIT',
                success: 'POST_USER_ADDRESSES_SUCCESS',
                error: 'POST_USER_ADDRESSES_ERROR'
            },
            identifier: 'POST_GUEST_EMAIL',
            successCb: this.addGuestEmailSuccess,
            errorCb: this.addGuestEmailError,
            dontShowMessage: true
        });
        
    }

    render() {
        if (!_isEmpty(_get(this.props.userSignInInfo, '[0].result.api_token', ''))){
            return <Redirect to='/category/ALL'/>;

        };

        return (
            <React.Fragment>                
                     <div className="sectionWrapper">
                    <Row className="align-items-center mb-5" >
                        <Col  className="text-center" >
                            <h4 className="holduptext"> CHECKOUT AS GUEST</h4>
                            <h5 className="pt-4 pb-5">ENTER YOUR EMAIL ADDRESS TO PROCEED WITH YOUR ORDER.</h5>
                        </Col>                        
                    </Row>                
                    <Form  onSubmit={this.onSubmit} validate={validate}
                        render={({ handleSubmit }) => (
                            <form className="d-flex flex-column justify-content-around mb-4" onSubmit={handleSubmit} >


                                <Row>
                                <Col className="text-center " >
                                    <Field name="email" component={TextInputField} placeholder='EMAIL'
                                        autoFocus={false} type='text' />
                                    </Col>                        
                            </Row>


                                <Row className="justify-content-center mt-5 align-items-ceenter">
                                     <Col xs={12} sm={'auto'} className="d-flex justify-content-center" >
                                    <Button variant="contained" color="primary" className="bottomActionbutton" type="submit">
                                    <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> PROCEED</Button>
                                    </Col>                        
                            </Row>  
                            </form>)}
                    />
                    </div>
                  
            </React.Fragment>


        );
    }
}



function mapStateToProps(state) {
    let userSignInInfo = _get(state, 'userSignInInfo.lookUpData', []);
    let cartData = _get(state, 'cart.lookUpData', []);
    return {
        userSignInInfo,
        cartData,
    };
}
export default connect(mapStateToProps)(GuestWithoutLoginContainer);