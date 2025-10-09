import React from "react";
import { connect } from "react-redux";
import CartItemsList from "../../Components/CartHomeComponents/CartItemList"
import CouponCode from "../../Components/CartHomeComponents/CouponCode";
import CartPriceSummary from "../../Components/CartHomeComponents/CartPriceSummary"
import { genericPostData } from "../../Redux/Actions/genericPostData";
import _get from "lodash/get";
import { Button } from 'reactstrap';
import LoaderButton from '../../Global/UIComponents/LoaderButton';
import OrderStatus from '../../Components/OrderComponents/OrderStatus';
import { Container } from 'reactstrap';

class OrderStatusContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        // let reqObj = {
        //     "api_token": "1c779ca336234ffc6a98807a6d36140e"
        // };

        // genericPostData({
        //     dispatch: this.props.dispatch,
        //     reqObj,
        //     url: "/api/cart/showcart",
        //     constants: {
        //         init: "CART_ITEMS_INIT",
        //         success: "CART_ITEMS_SUCCESS",
        //         error: "CART_ITEMS_ERROR"
        //     },
        //     identifier: "CART_ITEMS",
        //     successCb: this.cartFetchSuccess,
        //     errorCb: this.cartFetchError
        // })
    };
    // cartFetchSuccess = (data) => {
    //     let coupon_code = _get(data, "[0].coupon_code", "");
    //     this.setState({ coupon_code })
    //     console.log(data, "data")
    // };
    // cartFetchError = (err) => {
    //     console.log(err);
    // };

    
    
    render() {
        
        return (
            <Container fluid={true}> 
                <div style={{ marginLeft: 20, marginTop: 10}}>
                    <div>
                        order status
                    </div>
                    <div style={{ marginTop: 10}}>
                        <OrderStatus/>
                    </div>
                    
                </div>
            
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
    }
}


export default connect(mapStateToProps, null)(OrderStatusContainer);