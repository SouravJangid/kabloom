

import React from 'react';

import { connect } from 'react-redux';
import PartyLocatorMapComponent from '../../Components/PartyLocator/GoogleMapComponent';
import MapStoreComponent from '../../Components/PartyLocator/MapStoreComponent';



class PartyLocatorContainer extends React.Component {

    constructor(props) {
        super(props); 
    }

    

    

    render() {

        
        return (
            <React.Fragment>
                <div style={{ position: 'absolute', height: '80%', width: '100%'}}>
                    <PartyLocatorMapComponent/>

                    <div style={{ position: 'absolute', width: '100%', bottom: 20}}>
                    <MapStoreComponent/>
                    </div>
                    
                    
                    
                </div>
                
                
            </React.Fragment>


        );
    }
}



function mapStateToProps(state) {
    return {
    };
}
export default connect(mapStateToProps)(PartyLocatorContainer);