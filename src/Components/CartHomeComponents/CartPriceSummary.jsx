import React from "react";

class CartPriceSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        let { cartIsFetching, discount, subTotal, taxes, grandTotal, delivery_charges } = this.props;
        return (
            <>
                <div className="PriceSummaryChild">
                    <span>SUBTOTAL</span>
                    {/* {cartIsFetching ? <span>Loading..</span> : <span>{this.props.walletOrder === 'false' ? '$' + subTotal : 0}</span>} */}
                    {cartIsFetching ? <span>Loading..</span> : <span>{subTotal  ? '$' + subTotal : 0}</span>}
                </div>
                {/* <div className="PriceSummaryChild">
                    <span>TAXES</span>
                    {cartIsFetching ? <span>Loading..</span> :<span>{taxes}</span>}
                </div> */}
                <div className="PriceSummaryChild">
                    <span>DISCOUNT</span>
                    {/* {cartIsFetching ? <span>Loading..</span> : <span>{this.props.walletOrder === 'false' ? '$' + discount : 0}</span>} */}
                    {cartIsFetching ? <span>Loading..</span> : <span>{discount ? '$' + discount : 0}</span>}
                </div>
                <div className="PriceSummaryChild">
                    <span>DELIVERY CHARGES</span>
                    {/* {cartIsFetching ? <span>Loading..</span> : <span>{this.props.walletOrder === 'false' ? '$' + grandTotal : 0}</span>} */}
                    {cartIsFetching ? <span>Loading..</span> : <span>{delivery_charges ? '$' + delivery_charges : 0}</span>}
                </div>
                <div className="PriceSummaryChild">
                    <span>TAX</span>
                    {/* {cartIsFetching ? <span>Loading..</span> : <span>{this.props.walletOrder === 'false' ? '$' + grandTotal : 0}</span>} */}
                    {cartIsFetching ? <span>Loading..</span> : <span>{taxes ? '$' + taxes : 0}</span>}
                </div>
                <div className="PriceSummaryChild">
                    <span>TOTAL</span>
                    {/* {cartIsFetching ? <span>Loading..</span> : <span>{this.props.walletOrder === 'false' ? '$' + grandTotal : 0}</span>} */}
                    {cartIsFetching ? <span>Loading..</span> : <span>{grandTotal ? '$' + grandTotal : 0}</span>}
                </div>
                {/* <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                    Note - Delivery and Bank charges will be added later during checkout
                </div> */}
            </>
        )
    }
}

export default CartPriceSummary;