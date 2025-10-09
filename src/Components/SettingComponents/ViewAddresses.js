import React from 'react';
import { connect } from 'react-redux';

import { genericPostData } from "../../Redux/Actions/genericPostData";
import {get as _get , isEmpty as _isEmpty, map as _map, groupBy as _groupBy, reduce as _reduce, orderBy as _orderBy, uniq as _uniq, parseInt as _parseInt, filter as _filter} from 'lodash';
import WithLoading from '../../Global/UIComponents/LoaderHoc';

import { Container, Row, Col } from 'reactstrap';
import { Card, CardBody} from 'reactstrap';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

// import { cleanEntityData, enrichArrDataToObj } from '../../Global/helper/commonUtil';


class ViewAddressComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    componentDidMount() {

    }

    render() {
        return (
            <div style={{ margin: "2% 15%"}}>
                <h3>profile > addresses</h3>
                <h1 style={{ marginTop: '2%'}}>Your Addresses</h1>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                <Card style={{ marginLeft: '1%', marginTop: '1%', width: '350px'}}>
                        <CardBody style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <div >
                                
                            <div className="mb-4" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}><AddCircleOutlineOutlinedIcon style={{ fontSize: 25 }} /> </div> 
                            <div>ADD CARD</div> 
                                
                            </div>
                                            
                        </CardBody>                          
                    </Card>
                    <Card style={{ marginLeft: '1%', marginTop: '1%', maxWidth: '350px'}}>
                        <CardBody >
                            <div >
                                
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 11}}>
                                    <div style={{ fontWeight: 'bold'}}>Prabhanshu Kumar Singh</div>    
                                    <div>#46, slns homes, munnekolala 14th cross, manjunatha layout,</div> 
                                    <div>BENGALURU, KARNATAKA 560037</div>
                                    <div>India</div>
                                    <div>Phone number: ‪9660339787‬</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10%'}}>
                                    <div > <a href="" color='#007185'>Edit</a> </div>
                                    <div style={{marginLeft: '2%'}}>|</div>
                                    <div style={{marginLeft: '2%'}}> Remove</div>
                                </div>
                                
                            </div>
                                            
                        </CardBody>                          
                    </Card>
                    <Card style={{ marginLeft: '1%', marginTop: '1%', maxWidth: '350px'}}>
                        <CardBody >
                            <div >
                                
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 11}}>
                                <div style={{ fontWeight: 'bold'}}>Prabhanshu Kumar Singh</div>    
                                    <div>#46, slns homes, munnekolala 14th cross, manjunatha layout,</div> 
                                    <div>BENGALURU, KARNATAKA 560037</div>
                                    <div>India</div>
                                    <div>Phone number: ‪9660339787‬</div> 
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10%'}}>
                                    <div > <a href="" color='#007185'>Edit</a> </div>
                                    <div style={{marginLeft: '2%'}}>|</div>
                                    <div style={{marginLeft: '2%'}}> Remove</div>
                                </div>
                                
                            </div>
                                            
                        </CardBody>                          
                    </Card>
                    <Card style={{ marginLeft: '1%', marginTop: '1%', maxWidth: '350px'}}>
                        <CardBody >
                            <div >
                                
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 11}}>
                                <div style={{ fontWeight: 'bold'}}>Prabhanshu Kumar Singh</div>    
                                    <div>#46, slns homes, munnekolala 14th cross, manjunatha layout,</div> 
                                    <div>BENGALURU, KARNATAKA 560037</div>
                                    <div>India</div>
                                    <div>Phone number: ‪9660339787‬</div> 
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10%'}}>
                                    <div > <a href="" color='#007185'>Edit</a> </div>
                                    <div style={{marginLeft: '2%'}}>|</div>
                                    <div style={{marginLeft: '2%'}}> Remove</div>
                                </div>
                                
                            </div>
                                            
                        </CardBody>                          
                    </Card>
                    <Card style={{ marginLeft: '1%', marginTop: '1%', maxWidth: '350px'}}>
                        <CardBody >
                            <div >
                                
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 11}}>
                                <div style={{ fontWeight: 'bold'}}>Prabhanshu Kumar Singh</div>    
                                    <div>#46, slns homes, munnekolala 14th cross, manjunatha layout,</div> 
                                    <div>BENGALURU, KARNATAKA 560037</div>
                                    <div>India</div>
                                    <div>Phone number: ‪9660339787‬</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10%'}}>
                                    <div > <a href="" color='#007185'>Edit</a> </div>
                                    <div style={{marginLeft: '2%'}}>|</div>
                                    <div style={{marginLeft: '2%'}}> Remove</div>
                                </div>
                                
                            </div>
                                            
                        </CardBody>                          
                    </Card>
                    <Card style={{ marginLeft: '1%', marginTop: '1%', maxWidth: '350px'}}>
                        <CardBody >
                            <div >
                                
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 11}}>
                                <div style={{ fontWeight: 'bold'}}>Prabhanshu Kumar Singh</div>    
                                    <div>#46, slns homes, munnekolala 14th cross, manjunatha layout,</div> 
                                    <div>BENGALURU, KARNATAKA 560037</div>
                                    <div>India</div>
                                    <div>Phone number: ‪9660339787‬</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10%'}}>
                                    <div > <a href="" color='#007185'>Edit</a> </div>
                                    <div style={{marginLeft: '2%'}}>|</div>
                                    <div style={{marginLeft: '2%'}}> Remove</div>
                                </div>
                                
                            </div>
                                            
                        </CardBody>                          
                    </Card>
                </div>
                
            </div>
        )
    }
}

export default ViewAddressComponent;