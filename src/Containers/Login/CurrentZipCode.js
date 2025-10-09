import React from 'react';
import { connect } from 'react-redux';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import {Container, Row, Col} from 'reactstrap';
import { Redirect } from 'react-router';
import {  getArrayOutOfServerObject } from '../../Global/helper/commonUtil';
import {genericPostData} from '../../Redux/Actions/genericPostData';


class CurrentZipCodes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            citylist : []
        };
    }

    getDataSuccess = (data) => {
       this.setState({citylist: getArrayOutOfServerObject(data?.avaialbepostcodes)}) 
        
    };

    componentDidMount() {

        let body = {
                "city": this.props.match.params.city,
                "state": this.props.match.params.state 
        }

        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: body,
            url: "connect/citylist/currentservicearea",
            constants: {
                init: 'CURRENT_SERVICE_AREA_INIT',
                success: 'CURRENT_SERVICE_AREA_SUCCESS',
                error: 'CURRENT_SERVICE_AREA_ERROR'
            },
            identifier: "CURRENT_SERVICE_AREA",
            successCb: this.getDataSuccess,
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
                {this.state.citylist.map((citylist, index) => {
                    return (<Row size={2} key={citylist}>
                        
                            {citylist}
                        
                    </Row >)
                })}
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
export default connect(mapStateToProps)(CurrentZipCodes);