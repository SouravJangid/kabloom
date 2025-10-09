import React from 'react'
import { Form as ReactStrapFrom, FormGroup, Button, Container, Row, Col, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, } from 'reactstrap';
import PaymentCardComponent from './PaymentCard';
import { commonActionCreater } from "../../../Redux/Actions/commonAction";
import { connect } from "react-redux";
import { get as _get, map as _map, find as _find } from 'lodash';
import waterMark from '../../../assets/images/watermark.jpg';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CardComponent from './Card';
import { genericPostData } from "../../../Redux/Actions/genericPostData";import showMessage from '../../../Redux/Actions/toastAction';

const PaymentOptions = [
    // {
    //     id: 1,
    //     name: 'Net banking',
    //     value: 'NB'
    // },
    {
        id: 2,
        name: 'Credit/Debit/ATM cards'
    },
    // {
    //     id: 5,
    //     name: 'Wallet',
    //     value: 'CASH'
    // },
    {
        id: 3,
        name: 'UPI',
        value: 'UPI'
    },
    // {
    //     id: 4,
    //     name: 'EMI',
    //     value: 'EMI'
    // }
    {
        id: 4,
        // name: 'POD'
        name: 'Payment on Delivery',
        value: 'Payment on Delivery'
    },
];

const bankOptions = [
    {
        value: 'ICICI BANK',
        label: 'ICICI BANK'
    },
    {
        value: 'AXIS BANK',
        label: 'AXIS BANK'
    },
    {
        value: 'HDFC BANK',
        label: 'HDFC BANK'
    },
    {
        value: 'SBI BANK',
        label: 'SBI BANK'
    },
    {
        value: 'YES BANK',
        label: 'YES BANK'
    },
    {
        value: 'KOTAK BANK',
        label: 'KOTAK BANK'
    },
    {
        value: 'PNB BANK',
        label: 'PNB BANK'
    }
]

class CardHomeComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedPaymentType: null,
            selectedBankOption: null,
            selectedPaymentMode: null,
            selectedUPI: null,
            upiError: false,
            disableContinueButton: true,
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        // cart tab validation
        
        let cartTabValidation = this.props.cartTabValidation;

        let data = {
            ...cartTabValidation,
            isCardTab: true,
            isFaceTab: false,
            isSummaryTab: false
        };
        this.props.dispatch(commonActionCreater(data, 'CART_TAB_VALIDATION'));

        // cart tab validation end

        // this.fetchCardData();
    }

    handlePaymentOptions = ({ id }) => {
        // console.log('values', id);
        this.setState({
            upiError: false,
            disableContinueButton: true,
            selectedUPI: null
        });
        if ( id === 2) {
            const mode = _find(PaymentOptions, ['id', id]);
            this.setState({
                selectedPaymentType: 'card',
                selectedPaymentMode: '' ,
                disableContinueButton: true
            })
        } else if ( id === 1) {
            const mode = _find(PaymentOptions, ['id', id]);
            // console.log('mode', mode);
            this.setState({
                selectedPaymentType: 'netbanking',
                disableContinueButton: true
            })
        } else if ( id === 3) {
            this.setState({
                selectedPaymentType: 'upi',
                disableContinueButton: true
            })
        } else if ( id === 4) {
            // this.setState({
            //     selectedPaymentType: 'emi',
            //     disableContinueButton: true
            // })

            this.setState({
                selectedPaymentType: 'pod',
                disableContinueButton: false
            })
        }
    }


    updateCartFlowState = () => {
        let cartFlow = this.props.cartFlow;
        console.log(this.state.selectedPaymentMode, 'check 2');
        if (this.state.selectedPaymentType === 'upi') {
            let payment_method = 'upi';
            let data = {
                ...cartFlow,
                
                payment_method,
                upi_address: this.state.selectedUPI
            
            };
            this.props.dispatch(commonActionCreater(data, 'CART_FLOW'));
            // this.props.handleTabOnContinue('face');
            this.props.handleTabOnContinue('checkout');
            
        } else if ( this.state.selectedPaymentType === 'pod'){
            let payment_method = 'pod';
            let data = {
                ...cartFlow,
                
                payment_method,
                payment_mode: payment_method
            
            };
            
            this.props.dispatch(commonActionCreater(data, 'CART_FLOW'));
            // this.props.handleTabOnContinue('face');
            this.props.handleTabOnContinue('checkout');
        }
        
        
    }

    handleNetBankingOptions = (value) => {
        // console.log('selected banking options', value);
        this.setState({
            selectedBankOption: value
        });
    }

    handleContinue = () => {
        
        if (this.state.selectedPaymentType === 'upi') {
            let len = this.state.selectedUPI ? this.state.selectedUPI.toString().length : 0;
            if (len < 5) { 
                this.setState({ upiError: true });
            } else {
                // this.props.handleTabOnContinue('face');
                this.verifyUPI();
                
            }
                
            // console.log('handle continue');
        } else if (this.state.selectedPaymentType === 'pod') {
        
            this.updateCartFlowState();
            // this.props.handleTabOnContinue('checkout');
        }
        
    }

    handleUPIData = (val) => {
        // console.log('upi value', val);
        this.setState({ selectedUPI: val, upiError: false, disableContinueButton: false });
    }
    verifyUPI = () => {
        // console.log('verify upi called');
        // https://apidev.drinkindia.com/payuapi/payu/varifyUpi
        let reqObj = {
            upi_id: this.state.selectedUPI
        }
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: reqObj,
            url: `/payuapi/payu/varifyUpi`,
            // url: '/card/new',
            // constants: {
            //     init: "USER_ADDRESS_INIT",
            //     success: "USER_ADDRESS_SUCCESS",
            //     error: "USER_ADDRESS_ERROR"
            // },
            identifier: "VERIFY_UPI",
            successCb: this.verifyUpiSuccess,
            errorCb: this.verifyUpiError,
            dontShowMessage: true
        });
    };
    verifyUpiSuccess = (data) => {
        // console.log(data, 'verify upi data');
        if (_get(data, 'isVPAValid') !== 1) {
            this.setState({ upiError: true });
        } else {
            
            this.props.dispatch(showMessage({ text: 'UPI verified successfully', isSuccess: true }));
            this.updateCartFlowState();
        }

    };

    verifyUpiError = (err) => {
        // console.log(err, 'verify upi error');
    }

    handleUPIVerification = () => {
        let len = this.state.selectedUPI ? this.state.selectedUPI.toString().length : 0;
        if (len < 5) { 
            this.setState({ upiError: true });
        } else {
            this.verifyUPI();
        }
    }

    renderContent = () => {
        
        const paymentCards = _map(PaymentOptions, p => {
            return(
                <React.Fragment key={p.id}>
                    <PaymentCardComponent
                        data={p}
                        handlePaymentOptions= {this.handlePaymentOptions}
                        selectedPaymentType={this.state.selectedPaymentType}
                        bankOptions={bankOptions}
                        handleNetBankingOptions = {this.handleNetBankingOptions}
                        selectedBankOption={this.state.selectedBankOption}
                        handleUPIData={this.handleUPIData}
                        upiError={this.state.upiError}
                        handleUPIVerification={this.handleUPIVerification}
                    />
                </React.Fragment>
            )
        })
        return (
            <React.Fragment>
               <div>
                   {paymentCards}
               </div>
            </React.Fragment>
        )
    }

    render () {
        // console.log('selected payment type', this.state.selectedPaymentType);
        if (this.state.selectedPaymentType === 'card') {
            return (
                <React.Fragment>
                    <CardComponent
                        {...this.props}
                    />
                </React.Fragment>
            )
        }
        return (
            <React.Fragment>
                {/* <div> working ssssssssssssssssssssss</div>
                <PaymentCardComponent/> */}


                 <div className="page-content-container">
                    <Container fluid={true}>
                        <Row className="no-gutters justify-content-lg-between secMinHeight">
                            <Col lg={5} className="order-1 d-none d-lg-block order-md-2">
                                <div className="productImgSection">
                                    <img src={waterMark} className="imgProduct img-responsive"></img>
                                </div>
                            </Col>
                            <Col lg={6} className="flex-column d-flex">
                                <div className="block-title mb-4">Choose Payment Options</div> 
                                {this.renderContent()}
                                
                                    <div className="text-left mt-4" >
                                        <Button variant="contained" onClick={this.handleContinue} disabled={this.state.disableContinueButton} color="primary" className="bottomActionbutton cartActionBtn" type="submit">
                                            <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> Continue
                                        </Button>
                                    </div>
                                    
                            </Col>

                        </Row>

                    </Container>
                </div>
            </React.Fragment>
            
        )
    }
};

function mapStateToProps(state) {
    let cartTabValidation = _get(state, 'cartTabValidation.lookUpData', {});
    let cartFlow = _get(state, 'cartFlow.lookUpData', {});
    

    
    return {
        
        cartTabValidation,
        cartFlow
       
        
    }
}

export default connect(mapStateToProps)(CardHomeComponent);