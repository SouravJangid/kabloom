import axios from 'axios';
import {APPLICATION_BFF_URL} from '../urlConstants';


const axiosFetcher = ({method,
  url,
  reqObj,
  successCb,
  successText,
  dispatch,
  extraArgs,
  errorCb})=>
{
let requestObject = {};
  requestObject.method = method;
  requestObject.url = `${APPLICATION_BFF_URL}${url}`;

  if (reqObj)
    requestObject.data = {...reqObj};

  requestObject.headers = {
    originURL: window.origin,
    Authorization:`Bearer ${localStorage.getItem("Token")}`,
    'Content-Type': 'application/json',
  }
  console.log(requestObject,"requestObject")

  return axios(
    requestObject
  )
    .then(responseData => {
        successCb(responseData,dispatch,extraArgs)
    })
.catch((err)=>
{
errorCb(err)
})

}
export default axiosFetcher