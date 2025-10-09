import React, { Component } from 'react';
import { Card, CardBody, Button } from 'reactstrap';


const styles = (props) => ({

});


class TimeCard extends Component {
    constructor(props) {
        super(props);
    }
    // _getRootCardClass = () => 'active';
    render() {
        return (
            <React.Fragment>
                <Card className="dateTimerCardscontainer">
                    <CardBody className="cardStyles dateTimerCards active" >
                        <div style={{ fontSize: 15 }}>
                            {this.props.availableTime}
                        </div>
                        <div style={{ fontSize: 12 }}>
                            $ {this.props.fee}
                        </div>
                    </CardBody>
                </Card>

            </React.Fragment>

        );
    }
}

export default TimeCard;