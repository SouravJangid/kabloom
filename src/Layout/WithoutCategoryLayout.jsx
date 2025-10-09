import React from 'react';
// import { render } from "react-dom";
// import HeaderLayout from './components/common/HeaderNav.jsx';

import Snackbar from '@material-ui/core/Snackbar';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import WithoutCategoryHeaderBar from '../Global/UIComponents/WithoutCategoryHeader';
import Footer from '../Global/UIComponents/Footer';

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {isMobile, isTablet} from 'react-device-detect';
import Scrollbar from "react-scrollbars-custom";
import CommonSnackbarComponent from "../Global/UIComponents/Snackbar";
import { fetchStripeKeys } from '../Global/helper/commonUtil';
import { LoaderOverLay } from '../Global/UIComponents/LoaderHoc';
// const stripePromise = loadStripe("pk_test_51H5Vx4APqWY5toOXxk67rGIo57IiIQKtxavAMSO7jJp2XWTCWYBFGmD6HR22rAaOCfikDLxbEM5yZZejd1eqC7sZ00eYITKvgs");
//const stripePromise = loadStripe("pk_live_YWHAuQZ9QVoqDq3bOdRRz8Rg006Mq0WrB9");
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
// let stripeKey = process.env.REACT_APP_STRIPE_KEY;
// let stripeKey = localStorage.getItem('stripeKey');
// console.log(stripeKey, 'keykey');
// stripeKey = stripeKey.toString();
// console.log(stripeKey, 'check key');

// const stripePromise = loadStripe("pk_test_51P0V0A09ZkycsO60fGomdoexcJBTurm9SsHZed794pMTB3nFRGHxtO1Y8P046bpRaN5sLVGrIUQSuMsdJfi5uX4B00eUjQJnpS");
// const stripePromise = loadStripe(stripeKey);

const styles = theme => ({
  failure: {
    background: 'red',
    fontSize: '1.2rem'
  },
  success: {
    background: 'green',
    fontSize: '1.2rem'
  },

});

class WithoutCategoryLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        showUserMenuOption: false,
        stripePromise: null
    }
}

  showUserMenu = () => {
    this.setState({
        showUserMenuOption: !this.state.showUserMenuOption
    });
  }
  
  hideUserMenu = () => {
    if(this.state.showUserMenuOption === true) {
      this.setState({
        showUserMenuOption: false
      }); 
    }   
  }

  handleRoute() {
    let currentRoute = this.props.match.path;
    switch (currentRoute) {
      case "/splash":
        return <Footer isLoginAndSignupScreen={true} {...this.props} showUserMenu={this.showUserMenu}
        hideUserMenu={this.hideUserMenu} howUserMenuOption={this.state.showUserMenuOption} />;
      case "/cart/:cartflow":
        return <Footer isLoginAndSignupScreen={true} {...this.props} showUserMenu={this.showUserMenu}
        hideUserMenu={this.hideUserMenu}
        showUserMenuOption={this.state.showUserMenuOption}/>;
      default:
        return <Footer isLoginAndSignupScreen={false} {...this.props} showUserMenu={this.showUserMenu}
        hideUserMenu={this.hideUserMenu}
        showUserMenuOption={this.state.showUserMenuOption} />;
    }
  }

  renderContent = (classes) => {
    console.log('stripe key 1', this.stripeKey)
    let commonContent =  <>
    <div  className="noTopMenulayout" onClick={this.hideUserMenu}>
      <WithoutCategoryHeaderBar history={this.props.history} location={this.props.location} showUserMenu={this.showUserMenu}
       showUserMenuOption={this.state.showUserMenuOption}/></div>
    <div className="container-content-section" onClick={this.hideUserMenu}>
    <Elements stripe={this.state.stripePromise}>{this.props.children}</Elements>
     <div>{this.props.message.text && <CommonSnackbarComponent
      message={{ text: this.props.message.text, isSuccess: this.props.message.isSuccess, isOpen: this.props.message.isRemove ? false : true}}
      classes={classes}
      dispatch={this.props.dispatch}
     />}
     </div>
     </div>
     {
     this.handleRoute()
  }
     
   </>
   if(isMobile || isTablet){
   return <div className="mainLayout">{commonContent}</div>
   }
   else{
   return <Scrollbar className="mainLayout">{commonContent}</Scrollbar>
   }
  }
  
  async componentDidMount() {
    window.scrollTo(0, 0);
    try {
      const stripeKey = localStorage.getItem('stripeKey');
      // console.log(stripeKey, 'keys');
      if (!stripeKey) { 
        this.setState({ isLoading: true});
        await fetchStripeKeys()
        let stripeKey = localStorage.getItem('stripeKey');
        const stripePromise = loadStripe(stripeKey);
        this.setState({ isLoading: false, stripePromise: stripePromise});
      } else {
        const stripePromise = loadStripe(stripeKey);
        this.setState({ stripePromise: stripePromise});
      }
    } catch(err) {
      this.setState({ isLoading: false });
    }
  }
  render() {
    let { classes } = this.props;
    console.log(this.state.stripePromise, 'check');
    return (
      <React.Fragment>
        {this.state.isLoading ? <LoaderOverLay /> :
        <>
        {this.renderContent(classes)}
        </>}
      </React.Fragment>
    );
  }


}
function mapStateToProps(state) {
  let message = _get(state, 'ShowToast.message', '');
  return { message }
}
export default connect(mapStateToProps)(withStyles(styles)(WithoutCategoryLayout));