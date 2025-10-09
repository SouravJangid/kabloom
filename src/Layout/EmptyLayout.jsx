import React from 'react';
// import HeaderLayout from './components/common/HeaderNav.jsx';

import Snackbar from '@material-ui/core/Snackbar';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Footer from '../Global/UIComponents/Footer';
import Logo from '../assets/images/drinksbucket-logo.png';
import {Container, Row, Col} from 'reactstrap'
import { LoaderOverLay } from '../Global/UIComponents/LoaderHoc';
import { fetchStripeKeys } from '../Global/helper/commonUtil';

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

class EmptyLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        isLoading: false
    }
  }
  async componentDidMount() {
    
    try {
      const stripeKey = localStorage.getItem('stripeKey');
      console.log(stripeKey, 'keys');
      if (!stripeKey) { 
        this.setState({ isLoading: true});
        await fetchStripeKeys()
        this.setState({ isLoading: false});
      }
    } catch(err) {
      this.setState({ isLoading: false });
    }
    
  }
  render() {
    let { classes } = this.props;
    return (
      <React.Fragment>
          {this.state.isLoading ? <LoaderOverLay/> : 
            <div className="emptyLayout">      
            <div className="container-content-section-empty-layout">
              {this.props.children}
            </div>
            <Footer isLoginAndSignupScreen={true} {...this.props} />
            <div>{this.props.message.text && <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              open={true}
              autoHideDuration={6000}
              onClose={() => { }}
              ContentProps={{
                'aria-describedby': 'message-id',
                classes: {
                  root: this.props.message.isSuccess ? classes.success : classes.failure
                }
              }}
              message={<span id="message-id">{this.props.message.text}</span>}
            />}
            </div>
          </div>
          }
      </React.Fragment>
      
    );
  }


}
function mapStateToProps(state) {
  let message = _get(state, 'ShowToast.message', '');
  return { message }
}
export default connect(mapStateToProps)(withStyles(styles)(EmptyLayout));