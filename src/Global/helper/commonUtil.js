import cleanDeep from 'clean-deep';
import _ from 'lodash';
import moment from 'moment-timezone';
import CryptoJS from 'crypto-js';


import axios from 'axios';

import { get as _get } from  'lodash';
const getArrayOutOfServerObject = (obj) => {
    let arr = []
    Object.keys(obj).forEach(x => {
        if (x == '0' || Number(x)) {
            arr.push(obj[x]);
        }
    });
    return arr
}

const cleanEntityData = (data) => {
    let cleanData = {};
    try{
        cleanData = cleanDeep(data);
    } catch (e) {
        console.log(e);
    }
    return cleanData;
}

const createReqObjForCart = ()=>{
    let reqObj = {}
    if(localStorage.getItem("Token"))
    reqObj = {
        "api_token": localStorage.getItem("Token"),
        "cart_id":localStorage.getItem("cart_id")
    };
    else{
        reqObj = {
            "cart_id":localStorage.getItem("cart_id")
        };
    }
    return reqObj;
};

const formatPrice = (price) => {
    const newPrice = price.replace(/,/g, '');
    return Number(newPrice);
};

const enrichArrDataToObj = ({ data, field = ''}) => _.reduce(data, (acc, val) => ({ ...acc, [_.get(val, field)]: val }), {});


const deliveryMethods = Object.freeze({
    'Same Day': 'Local',
    'Next Day': 'Courier',
    'Farm Direct': 'Farm Direct'
});

const productListingDeliveryMethods = Object.freeze({
    'Same Day': 'Local',
    'Next Day': 'Courier',
    'Farm Direct': 'Farm Direct'
});

const deliveryMethodsAbb = Object.freeze({
    'Same Day': 'local',
    'Next Day': 'courier',
    'Farm Direct': 'farm-direct'
});


const deliveryMethodsAbbReverse = Object.freeze({
    'local': 'Same Day',
    'courier': 'Next Day',
    'farm-direct': 'Farm Direct'
});

const presentDateInEST = () => {
    const normalizedLocalTimeInEST = moment.tz("America/New_York").set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      });
    return normalizedLocalTimeInEST;
}

const oneDateLaterInEST = () => {
    const normalizedLocalTimeInEST = moment.tz("America/New_York").set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      });

    const oneDayLater = normalizedLocalTimeInEST.clone().add(1, 'days');
    return oneDayLater;
}



function decryptString(encryptedBase64, key) {
    // Decode Base64 to get IV and ciphertext
    const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedBase64);
    const iv = encryptedBytes.clone();
    iv.sigBytes = 16; // IV is 16 bytes
    const ciphertext = encryptedBytes.clone();
    ciphertext.words = ciphertext.words.slice(4); // Skip first 16 bytes (IV)
    ciphertext.sigBytes -= 16;

    // Ensure key is 32 bytes (pad with null bytes if needed)
    const keyPadded = CryptoJS.enc.Utf8.parse(key.padEnd(32, '\0'));

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        keyPadded,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// fetch stripe keys

const fetchStripeKeys = async () => {


  
    const stripeKey = localStorage.getItem('stripeKey');
    console.log(stripeKey, 'keys');
    if (!stripeKey) {
      console.log('called');
      const requestObject = {
        method: 'post',
        url: '/api/api/account/stripeDetails',
        data: {
          store_id: 1
        }
      }
      try {
        const responseData = await axios( requestObject )
        const strypeKeys = decryptString(_get(responseData, 'data.data.publishable_key'), '83f54db11a60bf30a9329f1dd94ba9a1');
        // console.log(strypeKeys, 'keys working');
        localStorage.setItem('stripeKey', strypeKeys);
      } catch (err) {
            console.log('Error while fetch stripe key', err);
      }
        

    }
    
  }






export {
    cleanEntityData,
    createReqObjForCart,
    formatPrice,
    enrichArrDataToObj,
    getArrayOutOfServerObject,
    deliveryMethods,
    deliveryMethodsAbb,
    deliveryMethodsAbbReverse,
    presentDateInEST,
    oneDateLaterInEST,
    productListingDeliveryMethods,
    decryptString,
    fetchStripeKeys
}