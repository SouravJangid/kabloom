import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';

export default class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    render() {

    return(
        <React.Fragment>
            <div className="block-sub-title">YOUR INFORMATION</div>    
                <div className="CardsWrapper">               
                    <Card className="userPreferenceContainer mb-5 ">
                        <CardBody className="cardStyles userInfoSettingCards align-items-start flex-wrap">
                            {this.props.userInfo && <React.Fragment>
                                {this.props.userName && <div className="pb-4"> 
                                 <div className=" d-flex flex-column flex-wrap">
                                    FULL NAME
                                    </div>
                                    <div className="myInfocolor">
                                        {this.props.userInfo.name}
                                    </div>
                                </div>}
                                <div className="pb-4">
                                    <div className=" d-flex flex-column flex-wrap">
                                        PRIMARY ADDRESS
                                    </div>
                                    <div  className="myInfocolor">
                                        {this.props.userInfo.address}
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <div className=" d-flex flex-column flex-wrap">
                                        EMAIL
                                    </div>
                                    <div className="myInfocolor">
                                        {this.props.userInfo.email}
                                    </div>
                                </div>
                                {this.props.userName&&<div className="pb-4">
                                    <div className=" d-flex flex-column flex-wrap">
                                        PASSWORD
                                    </div>
                                    <div  className="myInfocolor">
                                        **********
                                    </div>
                                </div>}
                            </React.Fragment>}                
                        </CardBody>
                    </Card>
                </div>
        </React.Fragment>
        );
    }   
}