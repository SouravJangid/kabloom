import { mapConstants } from '../../helper/constants';
import { get as _get, map as _map } from 'lodash';

const getAddressGeolocation = async (address) => {
    // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY

    try {
      const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBnFSoxhqGg2GPTZjLHzY3d_FdDQ5vMcoE`);
      const respJson = await resp.json();
      // console.log(JSON.stringify(respJson),  'respJson');
      return respJson;
      
      
    } catch(error) {
      console.log('Goole map Error: ', error)
      return false;
    }
  };

const findAddressDetail = ({ addressData, values}) => {
      let finalAddress = ``;
      let city = _get(values, 'city', '');
      let country = _get(values, 'country', '');
      let state = _get(values, 'state', '');
      let zipcode = _get(values, 'zipcode', '');
      let addressSelectedDone = false;
      _map(_get(addressData, 'results.0.address_components', []), d => {
        
        if(_get(d, 'types').includes(_get(mapConstants, 'address_line_1_end_address_type')) && !addressSelectedDone) {
          city = _get(d, 'long_name');
          addressSelectedDone = true;
          return d;
        } else if (!addressSelectedDone) {
          finalAddress = finalAddress.length ? finalAddress.concat(', ') : ``;
          finalAddress = finalAddress.concat(_get(d, 'long_name'));
          return d;
        } else if (_get(d, 'types').includes(_get(mapConstants, 'state'))) {
          state = _get(d, 'long_name');
          return d;
        } else if (_get(d, 'types').includes(_get(mapConstants, 'country'))) {
          country = _get(d, 'long_name');
          return d;
        } else if (_get(d, 'types').includes(_get(mapConstants, 'zipcode'))) {
          zipcode = _get(d, 'long_name')
          return d;
        }
        return d;

      });
      // console.log(finalAddress, city, state, zipcode, country, '=========================');
      return { street: finalAddress, city, state, zipcode, country }
}

export {
      getAddressGeolocation,
      findAddressDetail,
}