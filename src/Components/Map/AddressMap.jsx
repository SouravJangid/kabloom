import React from "react";
import { View, Text, PermissionsAndroid, TouchableOpacity, Alert, Platform, ScrollView, TextInput, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import theme from '../../theme';
import { Container, Item, Input, Header, Body, Content, Title, Button, Radio, ListItem, Left, Right, Switch } from 'native-base';
import { findAddressDetail, getAddressGeolocation } from './mapUtility';
import { get as _get } from 'lodash';
import AsyncStorage from "@react-native-community/async-storage";


export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.marker = null;
        this.state = {
            loading: true,
            markerData: new AnimatedRegion({
                // latitude: 12.9514316, // address lat 
                // longitude: 77.694168, // address lng
                latitude: this.props.selected_lat, // address lat 
                longitude: this.props.selected_lng, // address lng
                latitudeDelta: 0.012, // fix value
                longitudeDelta: 0.012, // fix value
            }),
            mapData: {
                // latitude: 12.9514316,
                // longitude: 77.694168,
                latitude: this.props.selected_lat, // address lat 
                longitude: this.props.selected_lng, // address lng
                latitudeDelta: 0.015, 
                longitudeDelta: 0.0121,
            },
            latitude: 0,
            longitude: 0,
            coordinates: [],
            city: '',
            state: '',
            zipCode: '',
            country: '',
            marginBottom: 1,
            isMapReady: false,
            newAddress: {}
        };
    }

    forceUpdate() {
        // PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        // ).then(granted => {
        //   this.setState({ marginBottom: 0 });
        // });
        this.setState({ marginBottom: 0 });
          
    }
    async componentDidMount() {
        // const that = this;
        // Geolocation.getCurrentPosition(
        //     position => {
        //         that.setState({
        //             loading: false,
        //             latitude: position.coords.latitude,
        //             longitude: position.coords.longitude,
        //             mapData: { latitude: position.coords.latitude, longitude: position.coords.longitude },
        //             markerData: { latitude: position.coords.latitude, longitude: position.coords.longitude },
        //             coordinates: that.state.coordinates.concat({
        //                 latitude: position.coords.latitude,
        //                 longitude: position.coords.longitude
        //             })
        //         });
        //     },
        //     error => {
        //         Alert.alert(error.message.toString());
        //     },
        //     {
        //         showLocationDialog: true,
        //         enableHighAccuracy: true,
        //         timeout: 20000,
        //         maximumAge: 0
        //     }
        // );

    }
    handleRegionChange = async mapData => {
        var newCoordinate = {
            latitude: mapData.latitude,
            longitude: mapData.longitude,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
        };

        if (Platform.OS === 'android') {
            if (this.marker) {
                this.marker.animateMarkerToCoordinate(newCoordinate, 2000);//  number of duration between points
            }
        } else {
            this.state.markerData.timing(newCoordinate).start();
        }
        const address = await getAddressGeolocation(`${mapData.latitude},${mapData.longitude}`);
        const finalAddress = findAddressDetail({ addressData: address});
        
        
        // console.log('final address', finalAddress);

        this.setState({
            mapData,
            loading: false,
            newAddress: finalAddress
        });
    };

    onMapLayout = () => {
        this.setState({ isMapReady: true });
      };

      handleConfirm = async() => {
        // const address = await getAddressGeolocation(`${this.state.mapData.latitude},${this.state.mapData.longitude}`);
        const selectedZipcode = await AsyncStorage.getItem('zipcode');
        if (selectedZipcode !== _get(this.state.newAddress, 'zipcode', '')) {
            Alert.alert(`Choosen zipcode ${_get(this.state.newAddress, 'zipcode', '')} is not matching with selected zip code `);
            return;
        }
        // console.log(this.state.newAddress);
        this.props.handleLocConfirmation(this.state.mapData, this.state.newAddress);
      }


    render() {
        const { mapData, markerData, loading } = this.state;
        //console.log('new lang', latitude, 'long', longitude); 
        return (
            
                
                    <View style={{ flex: 1 }}>
                        <View style={[styles.container, { position: 'relative'}]}>
                            {
                                
                                    <MapView
                                        provider={PROVIDER_GOOGLE}
                                        style={[styles.map]}
                                        //customMapStyle={mapStyle}
                                        region={mapData}
                                        initialRegion={mapData}
                                        // showsUserLocation={true}
                                        showsMyLocationButton={true}
                                        followsUserLocation={true}
                                        showsCompass={true}
                                        scrollEnabled={true}
                                        zoomEnabled={true}
                                        pitchEnabled={true}
                                        rotateEnabled={true}
                                        onMapReady={this.onMapLayout}
                                        onRegionChangeComplete={this.handleRegionChange}
                                    >
                                        {this.state.isMapReady ? <Marker.Animated
                                            draggable
                                            ref={marker => {
                                                this.marker = marker;
                                            }}
                                            coordinate={markerData}
                                        /> : null }
                                    </MapView>
                            }


                        </View>
                {/* <View style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', padding: 10 }}>
                            <Text>
                                City
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={this.onChangeLatitude}
                                value={this.state.city.toString()}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', padding: 10 }}>
                            <Text>
                                State
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={this.onChangeLongitude}
                                value={this.state.state.toString()}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', padding: 10 }}>
                            <Text>
                                ZipCode
                            </Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                onChangeText={this.onChangeLongitude}
                                value={this.state.zipCode.toString()}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', padding: 10 }}>
                            <Text>
                                Country
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={this.onChangeLongitude}
                                value={this.state.country.toString()}
                            />
                        </View>
                    </ScrollView>
                </View> */}
                {/* <View>
                    <Text style={{ color: 'white'}}>{_get(this.state.newAddress, 'street', '')}</Text>
                </View> */}

                <View style={{ marginTop: 10}}>
                    <View style={{ marginBottom: 5}}>
                        <Text style={{ color: 'white'}}>{_get(this.state.newAddress, 'street', '')},{_get(this.state.newAddress, 'city')} </Text>
                    </View>
                    <Button
                        full
                        success
                        style={theme.letsPartyButton}
                        onPress={this.handleConfirm}
                        >
                        <Text style={{ color: '#000' }}> SAVE NEW ADDRESS </Text>
                    </Button>
                </View>
                
                
            </View>
            
                
            

        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '80%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
});