import React, { PropTypes } from 'react';
import Select from 'react-select';
import _get from 'lodash/get';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';


RFReactSelect.defaultProps = {
  multi: false,
  search: false,
  className: "",
  autoPopulate: true
};


export default function RFReactSelect(props) {
  let { input, meta: { touched, error, pristine }, disabled, onSelect, options = [], defaultValue={}, multi, search,
   className, placeholder, autoPopulate } = props;
   const { name, value, onBlur, onChange, onFocus } = input;
  let transformedValue = transformValue(value, options, multi, autoPopulate);
  if (transformedValue == undefined)
    transformedValue = '';
    
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
      color: 'black',
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
    return (
      <React.Fragment>
        <Select
            isSearchable={search}
            isMulti ={multi}
            isDisabled ={disabled}
            valueKey="value"
            name={name}
            
            placeholder={placeholder || 'Select'}
            value={transformedValue}
            options={options}
            onChange={multi
            ? multiChangeHandler(onChange)
            : singleChangeHandler(onChange, onSelect)
            }
            onBlur={() => onBlur(value)}
            onFocus={onFocus}
            styles={colourStyles}
        />
      <div>{touched && error && <div className="text-input error"><FormHelperText >
            {error}
            </FormHelperText>
        </div>}
      </div>
      </React.Fragment>
  );
}

/**
 * onChange from Redux Form Field has to be called explicity.
 */
function singleChangeHandler(func, onSelect) {
  return function handleSingleChange(value) {
        func(value ? value.value : '');
    // onSelect && onSelect(value ? value : '');
  };
}

/**
 * onBlur from Redux Form Field has to be called explicity.
 */
function multiChangeHandler(func) {
  return function handleMultiHandler(values) {
      const selectedValue = values ? values : []; 
    func(selectedValue.map(value => value.value));
  };
}

/**
 * For single select, Redux Form keeps the value as a string, while React Select 
 * wants the value in the form { value: "grape", label: "Grape" }
 * 
 * * For multi select, Redux Form keeps the value as array of strings, while React Select 
 * wants the array of values in the form [{ value: "grape", label: "Grape" }]
 */
function transformValue(value, options, multi, autoPopulate) {
  if (multi)
    if (multi && typeof value === 'string') return [];

  const filteredOptions = options.filter(option => {
    return multi
      ? value.indexOf(option.value) !== -1
      : option.value === value;
  });
  return multi ? filteredOptions : filteredOptions[0]
}


