import React from 'react';
import PropTypes from 'prop-types';
import './RadioGroup.css';

const RadioGroup = ({ name, options, value, onChange, direction = 'row', label ,disabled}) => {
    const handleChange = (event) => {
        if (onChange) onChange(event.target.value);
    };
    
    return (
        <div className={`kb-radio-group ${direction === 'row' ? 'kb-radio-row' : 'kb-radio-column'}`}>
            {label && <div className="kb-radio-group-label">{label}</div>}
            <div className="kb-radio-list">
                {options.map((opt) => {
                    const optionValue = String(opt.value);
                    const id = `${name}-${optionValue}`;
                    
                    return (
                        <label key={optionValue} htmlFor={id} className={`kb-radio ${value === optionValue ? 'is-selected' : ''}`}>
                            <input
                                id={id}
                                type="radio"
                                name={name}
                                value={optionValue}
                                checked={String(value) === optionValue}
                                onChange={handleChange}
                                className="kb-radio-input"
                                disabled={disabled || opt.active === false}
                            />
                            <span className="kb-radio-control" aria-hidden="true" />
                            <span className="kb-radio-label">{opt.label}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

RadioGroup.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.node.isRequired,
        })
    ).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    direction: PropTypes.oneOf(['row', 'column']),
    label: PropTypes.node,
    disabled: PropTypes.bool
};

export default RadioGroup;


