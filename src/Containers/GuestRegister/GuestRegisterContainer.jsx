

import React from 'react';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import { Redirect } from 'react-router';

import {Container, Row, Col} from 'reactstrap'

import { connect } from 'react-redux';
import GuestWithoutLoginComponent from '../../Components/GuestRegisterComponents/GuestWithoutLoginComponent';
import GuestSignInComponent from '../../Components/GuestRegisterComponents/GuestSignInComponent';
import GuestSignUpComponent from '../../Components/GuestRegisterComponents/GuestSignUpComponent';
import GuestForgetPasswordComponent from '../../Components/GuestRegisterComponents/GuestForgetPasswordComponent';
// import PartyLocatorMapComponent from '../../Components/PartyLocator/GoogleMapComponent';
// import MapStoreComponent from '../../Components/PartyLocator/MapStoreComponent';



class GuestRegisterContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            handleSignUp: false,
            handleSignIn: true,
            handleForgetPassword: false
        }
    }


    handleSignUpReq = () => {
        this.setState({
            handleSignUp: true,
            handleSignIn: false,
            handleForgetPassword: false
        });
    }

    handleSignInReq = () => {
        this.setState({
            handleSignIn: true,
            handleSignUp: false,
            handleForgetPassword: false
        });
    }

    handleForgetPasswordReq = () => {
        this.setState({
            handleSignIn: false,
            handleForgetPassword: true,
            handleSignUp: false
        });
    }

    

    

    render() {
        if (!_isEmpty(_get(this.props.userSignInInfo, '[0].result.api_token', ''))){
            return <Redirect to='/store'/>;

        };

        
        return (
            <React.Fragment>
                    {/* <div >
                            <GuestWithoutLoginComponent 
                                {...this.props} 
                            />
                    </div> */}
                <div className="page-content-container">

                <Row className="justify-content-center pt-50 mb-50 secMinHeight">                    
                        {this.state.handleSignUp ? 
                            <GuestSignUpComponent
                                {...this.props}
                                handleSignInReq={this.handleSignInReq}
                            /> : this.state.handleSignIn ? 
                            <GuestSignInComponent
                                {...this.props}
                                handleSignUpReq={this.handleSignUpReq}
                                handleForgetPasswordReq={this.handleForgetPasswordReq}
                            /> : this.state.handleForgetPassword ?
                            <GuestForgetPasswordComponent
                                {...this.props}
                                handleSignInReq={this.handleSignInReq}
                            /> : null
                            }
                    {/* <Col lg={'auto'} className="my-5 my-lg-0 my-xl-0">
                            <div className="divider"></div>
                    </Col>
                    <Col  xs={12} lg={5} className="d-flex justify-content-center mb-5 mb-md-0 ">
                        <GuestWithoutLoginComponent 
                            {...this.props} 
                        />
                    </Col> */}
                </Row>
                    </div>
                    
                
                
                
                
            </React.Fragment>


        );
    }
}



function mapStateToProps(state) {
    let userSignInInfo = _get(state, 'userSignInInfo.lookUpData', []);
    return {
        userSignInInfo
    };
}
export default connect(mapStateToProps)(GuestRegisterContainer);