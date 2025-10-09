import { Form, Field } from 'react-final-form';
import { TextInputField, SwitchInputField } from '../../Global/FormCompoents/wrapperComponent';
import { Button } from '@material-ui/core';
import validate from './Validate/updatePasswordValidator';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import LoginComponent from '../../Components/LoginComponents/login';
import {genericPostData} from '../../Redux/Actions/genericPostData';
import showMessage from '../../Redux/Actions/toastAction';
import { Container, Row, Col } from 'reactstrap';
import WithLoading from '../../Global/UIComponents/LoaderHoc';
import { commonActionCreater } from "../../Redux/Actions/commonAction";
import genericGetData from '../../Redux/Actions/genericGetData';
import queryString from 'query-string';
import { isEmpty as _isEmpty } from 'lodash';




class UpdatePasswordContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // currentStep: 1
        }
    }

    componentDidMount() {

        window.scrollTo(0, 0);
        const parsedQuery = queryString.parse(this.props.location.search);
        if (_isEmpty(_get(parsedQuery, 'token', ''))) {
            this.props.history.push('/');
        }
        this.setState({ query_id: _get(parsedQuery, 'token')});
        
        // const confirmationToken = this.props.location.search;
        // console.log(confirmationToken, 'confrm');

    };

    updatePasswordSuccess = (data) => {
        if (_get(data, 'code', -1) === 1) {
            this.props.history.push('/signIn');
        } else {
            const message = _get(data,'message');
            this.props.dispatch(showMessage({ text: message, isSuccess: false }));
        }
    }

    updatePasswordError = (err) => {
        console.log('error in update password', err);
    }

    onSubmit = async values => {

        let body = {
            // reset_token:'b624548084827ec135bea62ce6bbb9a7',
            reset_token: _get(this.state, 'query_id'),
            new_password: _get(values, 'newPassword'),
            confirm_password: _get(values, 'confirmPassword')
        }

        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: body,
            url: '/api/customer/changepassword',
            constants: {
                init: 'POST_UPDATE_PASSWORD_INIT',
                success: 'POST_UPDATE_PASSWORD_SUCCESS',
                error: 'POST_UPDATE_PASSWORD_ERROR'
            },
            identifier: 'POST_UPDATE_PASSWORD',
            successCb: this.updatePasswordSuccess,
            errorCb: this.updatePasswordError,
            dontShowMessage: true
        });
        
    }

    render() {
        
        return (
            <React.Fragment>
                <div className="WhiteCurveBg">
                    <CssBaseline />
                    <Container className="container-custom d-flex flex-column justify-content-center">
                        <Row className="align-items-center  mb-5" style={{ flex: 2, maxHeight: 130, minHeight: 130 }}>
                            <Col className="text-center" >
                                <h4 className="holduptext">UPDATE PASSWORD</h4>
                            </Col>
                        </Row>


                        <Form onSubmit={this.onSubmit} validate={validate}
                            render={({ handleSubmit }) => (
                                <form className="d-flex flex-column justify-content-around mb-4" onSubmit={handleSubmit}>
                                    <Row>
                                        <Col className="text-center mb-5" >
                                            <Field name="newPassword" component={TextInputField} placeholder='NEW PASSWORD'
                                                autoFocus={false} type='password' />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-center mb-5" >
                                            <Field name="confirmPassword" component={TextInputField} placeholder='CONFIRM PASSWORD'
                                                autoFocus={false} type='password' />
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-center align-items-ceenter">
                                        <Col xs={12} sm={'auto'} className="d-flex justify-content-center" >
                                            <Button variant="contained" color="primary" className="bottomActionbutton" type="submit">
                                                <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" />PROCEED</Button>
                                        </Col>
                                    </Row>

                                </form>)}
                        />
                    </Container>
                </div>
                {/* <Container className="container-custom">
                    <Row>
                        <Col className="text-center" >
                            <Button variant="text" color="secondary" className="txtButton" onClick={this.createAccount} >CREATE ACCOUNT</Button>
                        </Col>
                    </Row>
                </Container> */}
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    
    return {  }
}
export default connect(mapStateToProps)(WithLoading(UpdatePasswordContainer));