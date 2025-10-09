import { APPLICATION_BFF_URL } from '../urlConstants';
import { postData } from './postAction'
import _get from 'lodash/get';
import showMessage from './toastAction';

export function genericPostData({ dispatch, reqObj, url, constants, identifier, successText, successCb, successTimeOutCb, errorCb, errorTimeOutCb, dontShowMessage }) {
    
    const modifiedUrl = url.slice(0,1) === '/' ? url : `/${url}`;
    if(!constants){
        constants = {
            init:`${identifier}_INIT`,
            success:`${identifier}_SUCCESS`,
            error:`${identifier}_ERROR`
        }
    }
    let modifiedReqObj = {
        ...reqObj,
        store_id: 1,
    }
    let p1 =  dispatch(
        postData(`${APPLICATION_BFF_URL}${modifiedUrl}`, modifiedReqObj, identifier, constants)
    )
    p1.then((data) => {
        if (!dontShowMessage) {
            dispatch(showMessage({ text: successText || 'Updated SuccessFully', isSuccess: true }));
        }
        if (successCb)
            successCb(data);
        // this.basicDataFetcher();

        setTimeout(() => {
            dispatch(showMessage({}));
            if (successTimeOutCb)
                successTimeOutCb()
        }, 10000);

    })
        .catch(({err,errCode}) => {
            if (typeof err == 'string')
                dispatch(showMessage({ text: err, isSuccess: false }));
            console.log(err);
            if (errCode == 500) {
                if (err.detail)
                    dispatch(showMessage({ text: err.detail, isSuccess: false }));

            }

            if (errorCb)
                errorCb(err,errCode)
            setTimeout(() => {
                dispatch(showMessage({}));
                if (errorTimeOutCb)
                    errorTimeOutCb()
            }, 6000);
        });
        return p1
}

export const postDataAsync = (dispatch, {reqObj,url,constants,identifier,dontShowMessage}) =>{
    console.log("postDataAsync called",{reqObj,url,constants,identifier,dontShowMessage});
    return new Promise((resolve, reject) => {
      genericPostData({
        dispatch,
        reqObj,
        url: url,
        constants: constants,
        identifier: identifier,
        successCb: (data) => resolve(data),
        errorCb: (err) => reject(err),
        dontShowMessage: !!dontShowMessage,
      });
    });
};