/* Main Route Imports */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";
/* Redux Imports*/
import { createStore, applyMiddleware, compose } from "redux";
import axiosMiddleWare from "./Redux/axiosMiddleware";

import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import rootReducer from "./Redux/RootReducer";
import { Provider } from "react-redux";
/* Stylesheet */
import "./assets/stylesheets/main.less";
import "bootstrap/dist/css/bootstrap.css";
import "../src/assets/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";

/* Material Date Picker */
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
/*Material UI Imports*/
import { StylesProvider, createGenerateClassName } from "@material-ui/styles";
//import { createGenerateClassName } from '@material-ui/core/styles';
import theme from "./MaterialUiSettings/theme";
import { MuiThemeProvider } from "@material-ui/core/styles";
/*Redux Persist Import */
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";
import { PersistGate } from "redux-persist/integration/react";

/*Layout imports*/
import EmptyLayout from "./Layout/EmptyLayout";
import MainLayout from "./Layout/MainLayout";
import RouteWithLayout from "./Layout/RouteWithLayout";
import UnProtectedRouteWithLayout from "./Layout/UnProtectedRouteWithLayout";

/* Main Route Imports */
import AddressHomeContainer from "./Containers/AddressHomeContainer";
import SplashContainer from "./Containers/Login/SplashContainer";
import LoginContainer from "./Containers/Login/LoginContainer";
import CreateAccountContainer from "./Containers/Login/CreateAccountContainer";
import HoldupContainer from "./Containers/Login/HoldupContainer";
import CartContainer from "./Containers/Cart/CartContainer";
import ContactUsContainer from "./Containers/ContactUs";
import FAQContainer from "./Containers/TermsPolicy/faq";

import * as serviceWorker from "./serviceWorker";
import ProductsContainer from "./Containers/StoreCategory/StoreCategoryContainer";
import OrderStatusContainer from "./Containers/Order/OrderStatus";
import ProductMainSection from "./Containers/Products/ProductMainSection";
import ProductDetails from "./Components/ProductComponents/ProductDetails";
import PartyLocatorContainer from "./Containers/PartyLocator/PartyLocatorContainer";
import SearchProductsContainer from "./Containers/Products/SearchProductsContainer";
import GuestRegisterContainer from "./Containers/GuestRegister/GuestRegisterContainer";
import PrivacyPolicyContainer from "./Containers/TermsPolicy/PrivacyPolicyContainer";
import TermsConditionContainer from "./Containers/TermsPolicy/TermsConditionContainer";
import AboutUsContainer from "./Containers/TermsPolicy/AboutUsContainer";
import RefundPolicyContainer from "./Containers/TermsPolicy/RefundPolicyContainer";
import UpdatePasswordContainer from "./Containers/Login/UpdatePasswordContainer";
import ForgotPasswordContainer from "./Containers/Login/ForgotPasswordContainer";
import NoMatchContainer from "./Containers/NoMatchContainer";
import KycContainer from "./Containers/Login/KycContainer";
import ShipOptions from "./Containers/shipDetails/shipOptions";

// new pages
import StoreContainer from "./Containers/Store/StoreContainer";
import RouteWithoutLayout from "./Layout/RouteWithoutLayout";
import HeaderContainer from "./Containers/HeaderContainer";
import WithoutCategoryLayout from "./Layout/WithoutCategoryLayout";
import WalletShipOptions from "./Containers/shipDetails/walletShipOptions";
import WalletProductListing from "./Containers/Wallet/WalletProductListing";
import PaymentVerificationContainer from "./Containers/Cart/PaymentVerificationContainer";
import PaymentVerificationFailContainer from "./Containers/Cart/PaymentVerficationFailContainer";
import CurrentZipCodes from "./Containers/Login/CurrentZipCode";
import VerifyFace from "./Components/CartComponents/VerifyFace/VerifyFace";

//vendor landing page
import VendorLandingPage from "./Containers/vendor/VendorLandingPage.jsx";

// google analytics
import { initGA } from "./Global/helper/react-ga";

import "./assets/stylesheets/loader.css";

// AWS Amplify

import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import SettingContainer from "./Containers/Setting/SettingContainer";

import genericPostData from "./Redux/Actions/genericPostData";

import { get as _get } from "lodash";
import vendorDetail from "./Containers/VendorDetail/vendorDetail";
import SearchResultsContainer from "./Containers/Products/SearchResultsContainer";

Amplify.configure(awsExports);

// google analytics initialization
initGA(process.env.REACT_APP_GA_CODE);

// commented temporarly

// import socketIOClient from "socket.io-client";
// const endpoint = 'http://127.0.0.1:8000';
// export const socket = socketIOClient(endpoint);

// socket.on('userdetail', data => {
//   socket.emit('adduser', { data: { id: 123, username: 'prabhanshu'}});
// });

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "c",
});

const middleware = [thunk, axiosMiddleWare];
if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger());
}
const persistConfig = {
  key: "DRINKINDIA",
  storage,
  stateReconciler: hardSet,
  blacklist: ["form", "ShowToast"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store;

if (process.env.NODE_ENV !== "production") {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(...middleware))
  );
} else {
  store = createStore(persistedReducer, applyMiddleware(...middleware));
}

export const persistor = persistStore(store);

// @todo: drive url routes from a config file for central control
ReactDOM.render(
  //   <div>
  //     <Favicon url="/src/assets/images/favicon.ico" />

  <StylesProvider generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <SnackbarProvider
          maxSnack={8}
          autoHideDuration={4000}
          style={{ width: "100%" }}
        >
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Router>
                <Switch>
                  {/* <UnProtectedRouteWithLayout Layout={EmptyLayout} exact path="/" Component={HoldupContainer} /> */}
                  <UnProtectedRouteWithLayout
                    Layout={EmptyLayout}
                    exact
                    path="/currentZipCodes/:city/:state"
                    Component={CurrentZipCodes}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/vendor/florist"
                    Component={vendorDetail}
                  />
                  <RouteWithLayout
                    Layout={EmptyLayout}
                    exact
                    path="/signIn"
                    Component={LoginContainer}
                  />
                  <RouteWithLayout
                    Layout={WithoutCategoryLayout}
                    exact
                    path="/ship/options"
                    Component={ShipOptions}
                  />
                  <RouteWithLayout
                    Layout={EmptyLayout}
                    exact
                    path="/createAccount"
                    Component={CreateAccountContainer}
                  />
                  <RouteWithLayout
                    Layout={EmptyLayout}
                    exact
                    path="/kyc"
                    Component={KycContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/splash"
                    Component={SplashContainer}
                  />
                  <RouteWithLayout
                    Layout={WithoutCategoryLayout}
                    exact
                    path="/cart"
                    Component={CartContainer}
                  />
                  <RouteWithLayout
                    Layout={WithoutCategoryLayout}
                    exact
                    path="/cart/:cartflow"
                    Component={AddressHomeContainer}
                  />
                  {/* <RouteWithLayout Layout={EmptyLayout} exact path="/holdup" Component={HoldupContainer} /> */}
                  {/* <RouteWithLayout Layout={MainLayout} exact path="/cart/address" Component={AddressHomeContainer} /> */}
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/store/search"
                    Component={ProductsContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/store/category/:categoryName/:categoryType/:categoryId"
                    Component={ProductsContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/wallet/product/:retailerId"
                    Component={WalletProductListing}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/store/category/:categoryType/:categoryId/:productID"
                    Component={ProductDetails}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/store/:productID"
                    Component={ProductDetails}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/home"
                    Component={ProductMainSection}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/setting/:settingParam"
                    Component={SettingContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/order/status"
                    Component={OrderStatusContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/party/locator"
                    Component={PartyLocatorContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/search"
                    Component={SearchProductsContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/guest/register"
                    Component={GuestRegisterContainer}
                  />
                  <UnProtectedRouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/privacy-policy"
                    Component={PrivacyPolicyContainer}
                  />
                  <UnProtectedRouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/terms-conditions"
                    Component={TermsConditionContainer}
                  />
                  <UnProtectedRouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/about-us"
                    Component={AboutUsContainer}
                  />
                  <UnProtectedRouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/refund-policy"
                    Component={RefundPolicyContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/account/resetpassword"
                    Component={UpdatePasswordContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/forgot/password"
                    Component={ForgotPasswordContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/contact-us"
                    Component={ContactUsContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/faq"
                    Component={FAQContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/wallet/shipping"
                    Component={WalletShipOptions}
                  />

                  {/* new route */}
                  <UnProtectedRouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/"
                    Component={StoreContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/store"
                    Component={StoreContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/verifyFace"
                    Component={VerifyFace}
                  />

                  {/*Vendor Landing Page routes*/}
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/vendor/:vendorId"
                    Component={VendorLandingPage}
                  />
                  {/* <RouteWithLayout Layout={MainLayout} exact path="/vendor/:vendorId/deliveryInfo" Component={DeliveryInfoPage} />
                  <RouteWithLayout Layout={MainLayout} exact path="/vendor/:vendorId/review" Component={Reviews} />
                  <RouteWithLayout Layout={MainLayout} exact path="/vendor/:vendorId/about"Component={AboutPage}/> */}

                  <RouteWithoutLayout
                    exact
                    path="/header"
                    Component={HeaderContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/payment/success"
                    Component={PaymentVerificationContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/payment/fail"
                    Component={PaymentVerificationFailContainer}
                  />
                  <RouteWithLayout
                    Layout={MainLayout}
                    exact
                    path="/search/results"
                    Component={SearchResultsContainer}
                  />
                  <RouteWithLayout
                    Layout={EmptyLayout}
                    path="*"
                    Component={NoMatchContainer}
                  />
                </Switch>
              </Router>
            </PersistGate>
          </Provider>
        </SnackbarProvider>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  </StylesProvider>,
  //   </div>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
