import React, { useEffect, useState } from "react";
import { Form as ReactStrapFrom, FormGroup, Button, Container, Row, Col, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, } from 'reactstrap';
import Select from 'react-select';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    
  upiTextField: {
    width: '60%'
  },
  


});

const colourStyles = {
    control: (styles, state) => ({ 
      ...styles, 
      backgroundColor: 'rgba(255,255,255,0)', 
      border: state.isFocused ? 0 : 0, 
      borderBottom: '1px solid white',
      boxShadow: state.isFocused ? 0 : 0, 
      borderRadius: 0,
      "&:hover": {
        border: state.isFocused ? 0 : 0,
        borderBottom: '1px solid white',
      }
    
    }),
    option: (styles, state) => ({
      ...styles,
      color: state.isDisabled ? '#cacaca' : 'black',
      // backgroundColor: 'rgba(255,255,255,0)'
    }),
    singleValue: (styles) => ({ ...styles, color: '#000' }),
    valueContainer: base => ({
      ...base,    
      padding: '0px',
    }),
    clearIndicator: base => ({
      ...base,
      padding: '0px',
    }),
    dropdownIndicator: base => ({
      ...base,
      padding: '0px',
    }),
  }




const PaymentCardComponent = (props) => {
    // const [selectedOption, setSelectedOption] = useState(null);
    // console.log('selected payment Type', props.selectedPaymentType);
    const [upiInput, setUpiInput] = useState(null);
    // const [upiError, setUpiError] = useState(false);

    const handleUpiInput = (e) => {
      // console.log('upi input', e.target.value);
      let val = e.target.value;
      setUpiInput(e.target.value);
      props.handleUPIData(val);
      // setUpiError(false);

    }


    // const handleUPIVerification = () => {
    //   props.handleUPIVerification();

    // }
    const { classes } = props;
    return (
        <Card style={{ margin:10, cursor: 'pointer'}} onClick={() => props.handlePaymentOptions({ id: props.data.id})}>
            <CardBody className="cardStyles addnewcard" >
                
                <div>{props.data.name}</div>
                { (props.selectedPaymentType === 'netbanking' && props.data.id === 1) ? 
                    <div style={{ width: '50%'}}>
                        <Select
                                    isSearchable={true}
                                    isMulti ={false}
                                    isDisabled ={false}
                                    valueKey="value"
                                    name="state"
                                    placeholder={'Select'}
                                    value={props.selectedBankOption}
                                    options={props.bankOptions}
                                    onChange={props.handleNetBankingOptions}
                                    // onBlur={() => onBlur(value)}
                                    // onFocus={onFocus}
                                    styles={colourStyles}
                                />
                    </div>
                : null }
                { (props.selectedPaymentType === 'upi' && props.data.id === 3) ? 
                    <div style={{ display: 'flex', flexDirection: 'row'}}>
                          <div style={{ display: 'flex', flexDirection: 'column', minWidth: "60%"}}>
                      
                            <TextField
                                  className={classes.upiTextField}
                                  autoFocus
                                  margin="dense"
                                  id="upi"
                                  label="Please enter your UPI ID"
                                  type="text"
                                  placeholder="EX: MobileNumber@upi"
                                  onChange={handleUpiInput }
                                  
                            />
                            { props.upiError ? <span style={{ color: 'red'}}>please provide valid UPI ID </span> : null }
                            </div>
                            {/* <div>
                                    <div className="text-left mt-4" >
                                          <Button variant="contained" onClick={handleUPIVerification}  color="primary" className = " smallActionbutton cartActionBtn" type="submit">
                                            
                                            Verify
                                        </Button>
                                    </div>
                            </div> */}
                    
                      
                        
                        

                    </div>
                : null}
                
            </CardBody>
        </Card>
    )
}

export default (withStyles(styles)(PaymentCardComponent));