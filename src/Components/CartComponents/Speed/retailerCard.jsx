import React, { Component } from 'react';
import { Card, CardBody, Button } from 'reactstrap';


const styles = (props) => ({

});


class RetailerCard extends Component {
    constructor(props) {
        super(props);
    }

    _getRootCardClass = ({ selectedId, id }) => {
        if (id === selectedId) {
            return "cardStyles retailerCards active";
        }
        return "cardStyles retailerCards";
    };
    render() {
        return (
            <React.Fragment>
                <Card className="retailerCardscontainer">
                    <CardBody className={this._getRootCardClass({ selectedId: this.props.selectedRetailer, id: this.props.data.id })} onClick={() => this.props.changeRetailerOpacity(this.props.data.id)}>
                        <div className="retailerTitle mb-3">
                            {this.props.data.name}
                        </div>
                        {this.props.selection.name === 'Store Pickup' ?
                            <div className="cardAddress py-2">
                                {this.props.data.address}
                            </div>
                            : null}
                        {this.props.selection.name === 'Store Pickup' ?
                            <div className="storeDistance py-2" >
                                {this.props.data.distance}
                            </div>
                            : null}
                        <div className="cardPrice py-2">
                            $ {this.props.data.product_total}
                        </div>
                    </CardBody>
                </Card>
            </React.Fragment>

        );
    }
}

export default RetailerCard;