/* eslint-disable no-undef */

import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import iconImage from '../../assets/images/check-white.png';
import MapStoreComponent from './MapStoreComponent';

const mapStyles = {
    width: '100%',
    height: '100%',
  };

class PartyLocatorMapComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stores: [{lat: 47.49855629475769, lng: -122.14184416996333, id: 11, content: 'check1'},
                    {latitude: 47.359423, longitude: -122.021071, id: 12, content: 'check2'},
                    {latitude: 47.2052192687988, longitude: -121.988426208496, id: 13, content: 'check3'},
                    {latitude: 47.6307081, longitude: -122.1434325, id: 14, content: 'check4'},
                    {latitude: 47.3084488, longitude: -122.2140121, id: 15, content: 'check5'},
                    {latitude: 47.5524695, longitude: -122.0425407, id: 16, content: 'check6'}],
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            title: '',
            selectedMarkerId: null,
            // selected,
          };
        // this.menuItems = Menu(list, selected);
        
    }

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            title: props.name,
            selectedMarkerId: props.id,
          });
    }

    displayMarkers = () => {
        return this.state.stores.map((store, index) => {
        if (this.state.selectedMarkerId && this.state.selectedMarkerId === store.id) {
            return <Marker key={index} id={store.id} position={{
                lat: store.latitude,
                lng: store.longitude
              }}
              icon={{
                 url: iconImage,
                 anchor: new google.maps.Point(32,32),
                 scaledSize: new google.maps.Size(32,32)
               }}
              name={store.content}
              onClick={this.onMarkerClick} 
              />
        } else {
            return <Marker key={index} id={store.id} position={{
                lat: store.latitude,
                lng: store.longitude
              }}
              name={store.content}
              onClick={this.onMarkerClick} 
              />
        }
          
        })
      }
      

    render() {
        
        return (
            <React.Fragment>
                <Map google={this.props.google} zoom={10} initialCenter={{ lat: 47.444, lng: -122.176}} style={mapStyles}>

                    {this.displayMarkers()}

                    <InfoWindow 
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    >
                        <div>
                <h1 style={{ color: 'black'}}>{this.state.title}</h1>
                        </div>
                    </InfoWindow>
                    {/* <MapStoreComponent/> */}
                </Map>  
                             
            </React.Fragment>


        );
    }
}


export default GoogleApiWrapper({
    apiKey: 'AIzaSyB9c1VApe14R3fgjDJmxnlnrAv9uEoHHV0'
  })(PartyLocatorMapComponent)