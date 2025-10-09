import React from "react";
import queryString from "query-string";
import { get as _get } from 'lodash';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';




class PaymentVerificationFailContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentVerifyHtml: null
        };
    };

    componentDidMount () {
        // console.log('payment html', this.props.history.location.state?.paymentVerifyHtml);
        const queries = queryString.parse(this.props.location.search);
        this.setState({ queryObject: queries });
       
    }

    render () {
        return (
            <React.Fragment>
                <Container style={{ marginTop: '10%'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: "100%"}}>
                        <div>
                            Payment failed
                        </div>
                        <div>
                            Order ID: {_get(this.state.queryObject, 'orderId')}
                        </div>
                        <Button variant="contained" color="primary" className="mt-4 bottomActionbutton cartActionBtn" onClick={() => this.props.history.push("/store")}>
                            Start Shopping
                        </Button>

                        
                    </div>
                </Container>
                
            </React.Fragment>
        )
    }
};

export default PaymentVerificationFailContainer;