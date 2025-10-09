import React from "react";
import queryString from "query-string";
import { get as _get } from 'lodash';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';


class PaymentVerificationContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentVerifyHtml: null,
            queryObject: {}
        };
    };

    componentDidMount () {
        // console.log(this.props.location.search.get('orderId'), 'query params');
        const queries = queryString.parse(this.props.location.search);
        this.setState({ queryObject: queries });
        // console.log('payment html', this.props.history.location.state?.paymentVerifyHtml);
        // this.setState(
        //     {
        //         // paymentVerifyHtml: this.props.history.location.state?.paymentVerifyHtml
        //         paymentVerifyHtml: data
        //     }
        // );
    }

    render () {
        return (
            <React.Fragment>
                {/* <div dangerouslySetInnerHTML={{__html: this.state.paymentVerifyHtml}}>

                </div> */}
                <Container style={{ marginTop: '10%'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: "100%"}}>
                        <div>
                            Order placed successfully   
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

export default PaymentVerificationContainer;