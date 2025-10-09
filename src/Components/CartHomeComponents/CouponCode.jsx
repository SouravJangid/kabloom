import React from "react";
import { Button, Form, FormGroup, Label, Input, FormText,Col } from 'reactstrap';
import { connect} from 'react-redux';
import { genericPostData } from "../../Redux/Actions/genericPostData";
import { createReqObjForCart } from "../../Global/helper/commonUtil";
import _get from "lodash/get";
import CircularProgress from '@material-ui/core/CircularProgress';
import { commonActionCreater } from "../../Redux/Actions/commonAction";


class CouponCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = { coupon_code:props.coupon_code }
    }
    handleAppply = () => {
        this.showCart({ ...createReqObjForCart(), coupon_code: this.state.coupon_code })
    }
    showCart = (reqObj) => {
        this.setState({applyCouponLoading:true})
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj,
            url: "/api/cart/showcart",
            identifier: "",
            // constants: {
            //     init: "CART_ITEMS_INIT",
            //     success: "CART_ITEMS_SUCCESS",
            //     error: "CART_ITEMS_ERROR"
            // },
            // identifier: "CART_ITEMS",
            successCb: this.applyCouponCodeSuccess,
            errorCb: this.applyCouponCodeError,
            dontShowMessage:true
        })
    }
    applyCouponCodeSuccess = (data)=>{
        
        if (_get(data, '0.code') == -1) {
            this.setState({applyCouponLoading:false, errorMessage:  _get(data, '0.message', 'Failed to apply coupon. Please try again.')});
        } else {
            // Dispatch only if condition is met

            // this.props.dispatch(commonActionCreater(data, 'CART_ITEMS'));
            this.props.dispatch({
                type: 'CART_ITEMS_SUCCESS',
                data: data,
                receivedAt: Date.now()
            });
            this.setState({applyCouponLoading:false, errorMessage:  ""});
        }
    }
        
    applyCouponCodeError = (data)=>{
        
        this.setState({applyCouponLoading:false, errorMessage:  _get(data, 'msg')})
        //TODO ERROR HANDLING REAMING
    }
    componentDidUpdate(prevProps)
    {
        if (prevProps.coupon_code != this.props.coupon_code)  //TODO CHECK WITH NARESH CASE SENSTIVITY OF COUPON CODE
        {
            this.setState({coupon_code:this.props.coupon_code})
        }
    }
    onChangeCouponCode = (e) => {
        this.setState({ coupon_code: e.target.value })
    }

    render() {
        return (
            <div>
                <div className="d-flex no-gutters">

                    <Form className="d-flex w-100"> 
                        <div className="d-flex w-100">
                            <Input onChange={this.onChangeCouponCode} value={this.state.coupon_code} type="email" name="email" id="exampleEmail" placeholder="Coupon Code" className="col" />
                            <Button disabled={this.state.applyCouponLoading} style={{ marginLeft: "10px", marginBottom: "2px" }} className="applyBtn" onClick={this.handleAppply}>{this.state.applyCouponLoading?<CircularProgress/>:"Apply"}</Button>
                        </div> 
                                    
                        
                    </Form>
                </div>   
                <div>
                            {this.state.errorMessage && (
                                <FormText color="danger">{this.state.errorMessage}</FormText>
                            )}
                        

                </div>
            </div>
            
            
        )
    }
}

function mapStateToProps(state) {
    let coupon_code = _get(state, "cart.lookUpData[0].coupon_code", "");
    return {
        coupon_code
    }
}

export default connect(mapStateToProps)(CouponCode);