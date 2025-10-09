import React from 'react';
import { get as _get } from 'lodash';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom'; 
import { Form, Field } from 'react-final-form';
import { TextInputField, SwitchInputField } from '../../Global/FormCompoents/wrapperComponent';
import validate from './validateChangeAddress';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import genericGetData from '../../Redux/Actions/genericGetData';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Row, Col } from 'reactstrap';
import {genericPostData} from '../../Redux/Actions/genericPostData';
import axios from "axios";
import { updateZipCode } from '../../Containers/shipDetails/shipOptions';
import { APPLICATION_BFF_URL } from '../../Redux/urlConstants';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h3">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

class ChangeAddressDialogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    }
  }

  componentDidMount = async() => {
    let res = await axios.get(`https://api.ipstack.com/check?access_key=c6015f473dc3d3a2beb0f6bc11bf4782`);
        // console.log("=====res========", res);
        this.setState({ pincode: res.data.zip });
  }

  onSubmit = async values => {

    const zipcode = values.pincode;
    const retailer = localStorage.getItem("vendor_location_id");
    const courier_type = localStorage.getItem("couriertype");
    (async () => {
            try {
                const response = await fetch(`${APPLICATION_BFF_URL}/connect/index/homepage?store_id=1&zipcode=${zipcode}&loc_id=${retailer}&courier_type=${courier_type}`);
                const data = await response.json();
                if ( data?.errorCode === 1) {
                    this.setState({ message: data?.message || 'Invalid zipcode' });
                    return;
                }
                this.setState({ zipcode: zipcode });
                localStorage.setItem('zipcode', values.pincode);
                this.props.changeValue( true)
                this.props.dispatch({
                    type: "STORE_INFO_SUCCESS",
                    data,
                    receivedAt: Date.now()
                });
                await this.clearCartApi();
                this.props.handleDialogue();

                this.props.history.push('/');

            } catch (err) {
              
            }
        })();
    
  }

  clearCartApi = async () => {
    console.log("=============clearCartApi called================");
    genericPostData({
      dispatch: this.props.dispatch,
      url: `api/cart/clearCart?cus_id=${_get(this.props, 'userDetails.customer_id', 0)}&api_token=${_get(this.props, 'userDetails.api_token', '')}&quote_id=${_get(this.props, 'userDetails.cart_id', '')}`,
      constants: {
        init: "CLEAR_CART_INIT",
        success: "CLEAR_CART_SUCCESS",
        error: "CLEAR_CART_ERROR"
      },
      identifier: "CLEAR_CART",
      successCb: this.clearCartSuccess,
      errorCb: this.clearCartFetchError,
      dontShowMessage: true
    })
  }

  clearCartSuccess = (data) => {
    console.log("inside clear cart success", data);
    // localStorage.removeItem("cart_id"); //removing the cart_id when address is changed
    // window.location.reload(false);
  }

  clearCartFetchError = (data) => {
    console.log("inside clear cart error", data);
  }

  zipcodeLocatorSuccess = async (data) => {
    // console.log(data, 'update data');
    if (data) {
      // this.props.updateSnackBarState();
      // localStorage.setItem('zipcode', this.state.zipcode);
      // console.log(localStorage.getItem('zipcode'), 'update localstorage', this.state.zipcode)
      

      console.log(this.props.location, 'pathname');
      if ( this.props.location.pathname !== '/store') {
        console.log('check', this.props.location.pathname);
        //this.props.history.push('/ship/options');
        this.props.history.push('/store')
      } else {
        window.location.reload();
      }
      // this.props.history.push('/ship/options');
      if ( !this.props.categoryHeader) {
        updateZipCode(localStorage.getItem('zipcode'));
      }
      
      // this.props.handleDialogue();
    }
  }

  zipcodeLocatorFetchError = (data) => { }

  render() {
    return (
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        onClose={this.props.handleDialogue}
        aria-labelledby="customized-dialog-title"
        open={this.props.showDialogueBox}>
        <DialogTitle id="customized-dialog-title" onClose={this.props.handleDialogue}>
          Delivery Pincode
                </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Please enter your pincode to start shopping
            <Form onSubmit={this.onSubmit} validate={validate}
              render={({ handleSubmit }) => (
                <form className="d-flex flex-column justify-content-around mb-4" onSubmit={handleSubmit}>
                  <Row>
                    <Col className="text-center  mt-5 mpb-30 homeInputAddress" >
                      <Field name="pincode" component={TextInputField} placeholder='Enter delivery pincode' defaultValue={this.state.pincode} value={this.state.pincode}
                        autoFocus={false} type='text' />
                      <Button variant="contained" color="primary" className="addressbutton border-0" type="submit">
                        <ArrowForwardIcon style={{ fontSize: 20 }} /></Button>
                    </Col>
                  </Row>
                </form>
              )}
            />
            <div style={{color: 'red', height:'12px'}}>{this.state.message}</div>
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => {
  let userInfo = _get(state, 'userSignInInfo.lookUpData', []);
  let userDetails = _get(userInfo, '[0].result', {});
  return {
    userDetails,
  };
};

export default connect(mapStateToProps)(ChangeAddressDialogue);