import _get from "lodash/get";
import _find from "lodash/find";
import { getData } from "./getAction";
import { APPLICATION_BFF_URL } from "../urlConstants";
import showMessage from "./toastAction";

const genericGetData = ({
  dispatch,
  url,
  constants,
  identifier,
  successText,
  successCb,
  successTimeOutCb,
  errorCb,
  errorTimeOutCb,
  dontShowMessage,
}) => {
  const modifiedUrl = url.slice(0, 1) === "/" ? url : `/${url}`;
  let p1 = dispatch(
    getData(`${APPLICATION_BFF_URL}${modifiedUrl}`, identifier, constants)
  );
  p1.then((data) => {
    if (!dontShowMessage) {
      dispatch(
        showMessage({
          text: successText || "Fetched SuccessFully",
          isSuccess: true,
        })
      );
    }
    if (successCb) successCb(data);
    setTimeout(() => {
      dispatch(showMessage({}));
      if (successTimeOutCb) successTimeOutCb();
    }, 10000);
  }).catch(({ err, errCode }) => {
    if (typeof err == "string")
      dispatch(showMessage({ text: err, isSuccess: false }));
    console.log(err);
    if (errCode == 500) {
      if (err.detail)
        dispatch(showMessage({ text: err.detail, isSuccess: false }));
    }

    if (errorCb) errorCb(err, errCode);
    setTimeout(() => {
      dispatch(showMessage({}));
      if (errorTimeOutCb) errorTimeOutCb();
    }, 6000);
  });
  return p1;
};

export default genericGetData;
