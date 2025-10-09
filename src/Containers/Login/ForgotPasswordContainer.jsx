

import React from 'react';

import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { Button } from 'reactstrap';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import validate from './Validate/forgotPasswordValidator';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {genericPostData} from '../../Redux/Actions/genericPostData';
import {Container, Row, Col} from 'reactstrap';
import showMessage from '../../Redux/Actions/toastAction';
import { TextInputField } from '../../Global/FormCompoents/wrapperComponent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router';



class ForgotPasswordContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            disableInput: false,
            displayMessage: '',
            isLoading: false
        };
    }


    componentDidMount() {
        window.scrollTo(0, 0);
        
    }
    forgotPasswordSuccess = (data) => {
        if (_get(data, '[0].code', -1) === 1) {
            this.setState({ isLoading: false });
            this.setState({ 
                disableInput: true,
                displayMessage: _get(data, '[0].message')
            });

            
            // this.props.handleSignInReq();
        } else {
            this.setState({ isLoading: false });
            const message = _get(data,'[0].message');
            this.props.dispatch(showMessage({ text: message, isSuccess: false }));
        }
        
    };

    forgotPasswordError = (err) => {
        this.setState({ isLoading: false });
        console.log('error in forget password', err);
    };

    onSubmit = async values => {
        
        this.setState({ isLoading: true });

        let body = {
            email: _get(values, 'email'),
        }

        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: body,
            url: '/api/customer/forgot',
            constants: {
                init: 'POST_FORGOT_PASSWORD_INIT',
                success: 'POST_FORGOT_PASSWORD_SUCCESS',
                error: 'POST_FORGOT_PASSWORD_ERROR'
            },
            identifier: 'POST_FORGOT_PASSWORD',
            successCb: this.forgotPasswordSuccess,
            errorCb: this.forgotPasswordError,
            dontShowMessage: true
        });
        
    }

    render() {
        if (!_isEmpty(_get(this.props.userSignInInfo, '[0].result.api_token', ''))){
            return <Redirect to='/category/ALL'/>;

        };

        return (
            <React.Fragment>
                
                <div className="page-content-container">
                <Container className="container-custom pt-50 mb-50  d-flex flex-column justify-content-center">
                     <Row className="align-items-center mb-5" >
                        <Col  className="text-center" >
                            <h4 className="holduptext">PASSWORD ASSISTANCE</h4>
                            <div className="pt-5 pb-5">
                                <h5>ENTER THE EMAIL ADDRESS ASSOCIATE WITH ACCOUNT</h5> 
                           </div>                  
                        </Col>             
                     </Row>
                        { !this.state.disableInput ?  (<Form  onSubmit={this.onSubmit} validate={validate}
                            render={({ handleSubmit }) => (
                                <form className="d-flex flex-column justify-content-around mb-4" onSubmit={handleSubmit} >
                                <Row>
                                    <Col className="text-center mb-5" >
                                        <Field name="email" component={TextInputField} placeholder='EMAIL'
                                            autoFocus={false} type='text' />
                                    </Col>                        
                                </Row>
                                <Row className="justify-content-center align-items-ceenter mt-4">
                                        <Col xs={12} sm={'auto'} className="d-flex justify-content-center" >
                                        <Button variant="contained" color="primary" className="bottomActionbutton" type="submit">
                                        {this.state.isLoading?<CircularProgress size={24} style={{ color: 'white'}}/> : <><ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> PROCEED</>}
                                        </Button>
                                    </Col>                        
                                </Row>  
                                </form>)}
                                />) :  (<Row className="align-items-center mb-5" >
                                <Col  className="text-center" >
                                        <div className="pt-5 pb-5">
                                    <h4>{this.state.displayMessage}</h4>
                                    </div>  
                                        </Col>             
                                </Row>)
                                } 
                        </Container>
                        </div>
            </React.Fragment>


        );
    }
}



function mapStateToProps(state) {
    return {
    };
}
export default connect(mapStateToProps)(ForgotPasswordContainer);