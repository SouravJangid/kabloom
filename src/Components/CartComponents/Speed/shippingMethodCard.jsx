import React, { Component } from 'react';
import { Card, CardBody, Button } from 'reactstrap';


const styles = (props) => ({
});


class ShippingMethodCard extends Component {
    constructor(props) {
        super(props);
    }

    _getRootCardClass = ({ selectedId, id }) => {
        if (id === selectedId) {
            return "cardStyles shippingCards active";
        }
        return "cardStyles shippingCards";

    };
    render() {
        return (
            <React.Fragment>
                <Card className="shippingCardscontainer">
                    <CardBody className={this._getRootCardClass({ selectedId: this.props.selectedShippingMethod, id: this.props.data.id })} onClick={() => this.props.changeShippingMethodOpacity(this.props.data.id)}>
                        <div className="cardTitle shippingCardTitle">
                            {this.props.data.method}
                        </div>
                        <div className="inner-content py-3">
                            Estimated ~{this.props.estimatedShippingTime} Days
                        </div>
                        <div className="cardPrice">
                            $ {this.props.data.amount}
                        </div>
                        {/* <div>
                                {this.props.data.address}
                            </div> */}
                    </CardBody>
                </Card>
            </React.Fragment>

        );
    }
}

export default ShippingMethodCard;