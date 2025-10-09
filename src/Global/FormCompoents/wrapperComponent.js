import React from 'react';
import { TextField, FormHelperText , Switch, InputLabel, Checkbox, Radio, RadioGroup, FormControl,
   FormControlLabel, FormLabel, withStyles  } from '@material-ui/core';
import Datetime from 'react-datetime';


const TextInputField = (props) => {

    let { input, label, variant = 'standard', placeholder, autoFocus, initialValues, type, disabled = false,
     meta: { touched, error, pristine }, custom } = props;
    return (
      <div className="position-relative flex-grow-1">
             <TextField
                type={type}                
                label={label}
                disabled={disabled}
                placeholder={initialValues || placeholder}
                error={touched && error ? true : false}
                autoFocus={autoFocus}
                {...input}
                {...custom}
                variant={variant}
                InputLabelProps={{ shrink: true }}
                className='w-100 text-white'
            />
      <div>{touched && error && <div className="text-input error" style={{display: 'inline-flex', }}><FormHelperText >
                {error}
            </FormHelperText></div>}
      </div>
      </div>
    )
}



const SwitchInputField = (props) => {
  let { input, label, variant = 'standard', placeholder, autoFocus, type, disabled = false,
     meta: { touched, error, pristine }, custom } = props;

  return(<React.Fragment>
    <InputLabel className="label-txt fs-13 mb-0" htmlFor={label}><b>{label}</b></InputLabel>
      <Switch
          color="primary"
          id={label}
          {...input}
          checked={input.value ? true : false}
          onChange={(event, value) => input.onChange(value)}
          className="custom-switch"
          
      />
      {touched && error && <React.Fragment>
          <div className="text-input error" style={{display: 'inline-flex', bottom: '-11px',
                  left: '14px'}}><FormHelperText>
                {error}
            </FormHelperText>
          </div>
        </React.Fragment>
      }
  </React.Fragment>
  )
  
}

const CheckBoxInputField = (props) => {
  let { input, label, variant = 'standard', placeholder, autoFocus, type, disabled = false,
     meta: { touched, error, pristine }, custom } = props;
    
  return (<React.Fragment>
     <Checkbox
      
       style={{ fontSize: 24 }}
       id={label}
       {...input}
       checked={input.value ? true : false}
       onChange={(event, value) => input.onChange(value)}
       disabled={disabled}
     />
     <InputLabel className="label-txt fs-13 mb-0" htmlFor={label}>{label}</InputLabel>
     {touched && error && <React.Fragment>
          <div className="text-input error" style={{display: 'inline-flex', marginTop: '10px',
                  marginLeft: '13px'}}><FormHelperText>
                {error}
            </FormHelperText>
          </div>
        </React.Fragment>
      }
   </React.Fragment>)
}

const DateTimePicker = (props) => {
  let { input, label,placeholder, autoFocus, type, disabled = false, timeFormat = false, valid,
         meta: { touched, error, } ,...rest} = props;

  const timeconstraint = { hours: { min: 10, max: 16 }};
  
  return (
    <React.Fragment>
      <TextField
        id="datetime-local"
        label="Select Date"
        type="date"
        inputProps={{ placeholder: placeholder, disabled: disabled }} 
        // {...custom} 
        isValidDate={valid}
        timeConstraints={ timeconstraint}
        value={input.value} 
        {...input}
        timeFormat={timeFormat}
        dateFormat={true}
        closeOnSelect="true"
        {...rest}
        sx={{ width: '550px' }}
        InputLabelProps={{
          shrink: true,
        }}
      />
        {touched && error && <React.Fragment>
          <div className="text-input error" style={{display: 'inline-flex', marginTop: '10px',
                  marginLeft: '13px'}}><FormHelperText>
                {error}
            </FormHelperText>
          </div>
        </React.Fragment>
      }
     {/*  <Datetime 
      inputProps={{ placeholder: placeholder, disabled: disabled }} 
      // {...custom} 
      isValidDate={valid}
      timeConstraints={ timeconstraint}
      defaultTime="23:59:59"
      value={input.value} 
      {...input}
      timeFormat={timeFormat}
      dateFormat={true}
      closeOnSelect="true"
      {...rest}
       />
      
      {touched && error && <React.Fragment>
          <div className="text-input error" style={{display: 'inline-flex', marginTop: '10px',
                  marginLeft: '13px'}}><FormHelperText>
                {error}
            </FormHelperText>
          </div>
        </React.Fragment>
      } */}
    </React.Fragment>
  )
}
const DateTimePickerMain = (props) => {
  let { input, label,placeholder, autoFocus, type, disabled = false, timeFormat = false, valid,
         meta: { touched, error, } ,...rest} = props;

  const timeconstraint = { hours: { min: 10, max: 16 }};
  
  return (
    <React.Fragment>
     
<Datetime 
      inputProps={{ placeholder: placeholder, disabled: disabled }} 
      // {...custom} 
      isValidDate={valid}
      timeConstraints={ timeconstraint}
      defaultTime="23:59:59"
      value={input.value} 
      {...input}
      timeFormat={timeFormat}
      dateFormat={true}
      closeOnSelect="true"
      {...rest}
       />
      
      {touched && error && <React.Fragment>
          <div className="text-input error" style={{display: 'inline-flex', marginTop: '10px',
                  marginLeft: '13px'}}><FormHelperText>
                {error}
            </FormHelperText>
          </div>
        </React.Fragment>
      } 
    </React.Fragment>
  )
}
const TimePicker = (props) => {
  let { input, label,placeholder, autoFocus, type, disabled = false, timeFormat = false, valid,
         meta: { touched, error, } ,...rest} = props;

  const timeconstraint = { hours: { min: 10, max: 16 }};
  
  return (
    <React.Fragment>
      <TextField
        id="datetime-local"
        label="Select Time"
        type="time"
        inputProps={{ placeholder: placeholder, disabled: disabled }} 
        // {...custom} 
        isValidDate={valid}
        defaultValue="07:30"
        timeConstraints={ timeconstraint}
        value={input.value} 
        {...input}
        timeFormat={timeFormat}
        dateFormat={true}
        closeOnSelect="true"
        {...rest}
        sx={{ width: '550px' }}
        InputLabelProps={{
          shrink: true,
        }}
      />
        {touched && error && <React.Fragment>
          <div className="text-input error" style={{display: 'inline-flex', marginTop: '10px',
                  marginLeft: '13px'}}><FormHelperText>
                {error}
            </FormHelperText>
          </div>
        </React.Fragment>
      }
     {/*  <Datetime 
      inputProps={{ placeholder: placeholder, disabled: disabled }} 
      // {...custom} 
      isValidDate={valid}
      timeConstraints={ timeconstraint}
      defaultTime="23:59:59"
      value={input.value} 
      {...input}
      timeFormat={timeFormat}
      dateFormat={true}
      closeOnSelect="true"
      {...rest}
       />
      
      {touched && error && <React.Fragment>
          <div className="text-input error" style={{display: 'inline-flex', marginTop: '10px',
                  marginLeft: '13px'}}><FormHelperText>
                {error}
            </FormHelperText>
          </div>
        </React.Fragment>
      } */}
    </React.Fragment>
  )
}

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

const RadioBtnInput = (props) => {
  let { input, label, autoFocus, type, disabled = false, radioBtnOptions = [], classes,
    meta: { touched, error, } } = props;

  return <React.Fragment>
    <div className="">
          <div component="fieldset" className="d-flex flex-row align-items-center">
            <div component="legend" className="mr-1 mr-md-5" >{label}</div>
            <RadioGroup
              aria-label="radioBtn"
              className="d-flex flex-row"
              {...input}
            >
              {
                radioBtnOptions.map(option => <FormControlLabel value={option.value} className="m-0 ml-1 ml-md-4  selectGender" control={<Radio />}
                   label={option.label} />)
              }
            </RadioGroup>
          </div>
    </div>
    {touched && error && <React.Fragment>
          <div className="text-input error" style={{display: 'inline-flex', marginTop: '10px',
                  marginLeft: '13px'}}><FormHelperText>
                {error}
            </FormHelperText>
          </div>
        </React.Fragment>
    }
  </React.Fragment>
}

// const Captcha = (props) => {
//   let {meta: { touched, error, } } = props;

//   return <React.Fragment>
//     <ReCAPTCHA
//       sitekey={props.sitekey}
//       onChange={response => props.input.onChange(response)}
//     />
//     {touched && error && <React.Fragment>
//           <div className="text-input error" style={{display: 'inline-flex', marginTop: '10px',
//                   marginLeft: '13px'}}><FormHelperText>
//                 {error}
//             </FormHelperText>
//           </div>
//         </React.Fragment>
//     }
//   </React.Fragment>
// }


export default withStyles(styles)(RadioBtnInput);

export {
    TextInputField,
    SwitchInputField,
    CheckBoxInputField,
    DateTimePicker,
    DateTimePickerMain,
    RadioBtnInput,
    TimePicker
    // Captcha
}