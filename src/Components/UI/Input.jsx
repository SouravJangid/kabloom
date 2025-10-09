import React from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = React.forwardRef(({ value, onChange, placeholder, type = 'text', inputMode, pattern, maxLength, className = '', ariaLabel, onKeyDown, disabled }, ref) => (
    <input
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        inputMode={inputMode}
        pattern={pattern}
        maxLength={maxLength}
        className={`app-input ${className}`}
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        disabled={disabled}
    />
));

Input.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    inputMode: PropTypes.string,
    pattern: PropTypes.string,
    maxLength: PropTypes.number,
    className: PropTypes.string,
    ariaLabel: PropTypes.string,
    onKeyDown: PropTypes.func,
    disabled: PropTypes.bool
};

export default Input;
