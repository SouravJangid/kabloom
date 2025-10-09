import React from "react";
class CartPriceSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    AddDollarToPrice = (price) => {
        // if (price == null || price == undefined || price == '' || price == 0) {
        if (price == null || price == undefined || price == '') {
            return '';
        }
        else {
            return '$' + price;
        }
    }

    render() {
        let { cartIsFetching } = this.props;
        console.log("props", this.props);
        // let grandTotal = this.props.grandTotal.split(",").join("");
        let driverTipAmount = this.props.driverTipAmount.toString().split(",").join("");
        // let shippingAmount = this.props.shippingAmount.split(",").join("");
        const { delivery_charges, subTotal, taxes, grandTotal, discount } = this.props;
        return (
            <>
                <div className="PriceSummaryChild pb-2">
                    <span>SUBTOTAL</span>
                    {/* {cartIsFetching ? <span>Loading..</span> : <span>{this.props.walletOrder === 'false' ? this.AddDollarToPrice(this.props.subTotal) : this.AddDollarToPrice(this.props.subTotal)}</span>} */}
                    {cartIsFetching ? <span>Loading..</span> : <span>{subTotal ? '$' + subTotal : '$' + 0}</span>}
                </div>
                
                {/* { <div className="PriceSummaryChild pb-2">
                    <span>PACKAGING FEES</span>
                    {cartIsFetching ? <span>Loading..</span> : <span>{this.props.walletOrder === 'false' ? this.AddDollarToPrice(this.props.packaging_fee) : this.AddDollarToPrice(this.props.packaging_fee)}</span>}
                </div>}
                {<div className="PriceSummaryChild pb-2">
                    <span>CONVENIENCE FEES</span>
                    {cartIsFetching ? <span>Loading..</span> : <span>{this.props.walletOrder==='false' ? this.props.processing_fee : this.props.processing_fee}</span>}
                </div>} */}
                
                <div className="PriceSummaryChild pb-2">
                    <span>DISCOUNT</span>
                    {/* {cartIsFetching ? <span>Loading..</span> : <span>{this.props.walletOrder === 'false' ? this.AddDollarToPrice(this.props.discount) : this.AddDollarToPrice(this.props.discount)}</span>} */}
                    {cartIsFetching ? <span>Loading..</span> : <span>{discount ? '$' + discount : '$' + 0}</span>}
                </div>
                {<div className="PriceSummaryChild pb-2">
                    <span>DELIVERY CHARGES</span>
                    {/* {cartIsFetching ? <span>Loading..</span> : <span>{this.props.walletOrder === 'false' ? this.AddDollarToPrice(this.props.delivery_charges) : this.AddDollarToPrice(this.props.delivery_charges)}</span>} */}
                    {cartIsFetching ? <span>Loading..</span> : <span>{delivery_charges ? '$' + delivery_charges : '$' + 0}</span>}
                </div>}
                { <div className="PriceSummaryChild pb-2">
                    <span>TAXES</span>
                    {/* {cartIsFetching ? <span>Loading..</span> : <span>{this.props.walletOrder === 'false' ? this.AddDollarToPrice(this.props.taxes) : this.AddDollarToPrice(this.props.taxes)}</span>} */}
                    {cartIsFetching ? <span>Loading..</span> : <span>{taxes ? '$' + taxes : '$' + 0}</span>}
                </div>}
                <div className="PriceSummaryChild pb-2">
                    <span>TOTAL</span>
                    {/* {cartIsFetching ? <span>Loading..</span> : <span className="cartPrice">{this.props.walletOrder === 'false' ? this.AddDollarToPrice((Number(grandTotal) + Number(driverTipAmount)).toFixed(2)) : this.AddDollarToPrice((Number(grandTotal) + Number(driverTipAmount)).toFixed(2))}</span>} */}
                    {cartIsFetching ? <span>Loading..</span> : <span>{grandTotal ? '$' + grandTotal : '$' + 0}</span>}
                </div>
            </>
        )
    }
}

export default CartPriceSummary;