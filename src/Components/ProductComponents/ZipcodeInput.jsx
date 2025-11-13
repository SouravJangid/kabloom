import React,{ useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../UI/Input';
import './ZipcodeInput.css';

const ZipcodeInput = ({ zipcode, onChange, onCheck, loading, verified = false, placeholder = 'Enter Zipcode', zipcodeLength = 5, message: propMessage = '' }) => {
    const [currZipCode, setCurrZipcode] = useState(zipcode || '');
    const [message, setMessage] = useState(propMessage);
    const [isPropMessageActive, setIsPropMessageActive] = useState(!!propMessage);

    // Show propMessage whenever it changes, unless user edits input
    useEffect(() => {
        if (propMessage) {
            setMessage(propMessage);
            setIsPropMessageActive(true);
        }
    }, [propMessage]);

    // Update message on loading or input change, but only if not showing propMessage
    useEffect(() => {
        if (!isPropMessageActive) {
            if (loading) {
                setMessage('Verifying...');
            } else if (currZipCode.length < zipcodeLength) {
                setMessage(`Enter ${zipcodeLength}-digit zipcode to enable fields`);
            } else {
                setMessage('');
            }
        }
    }, [loading, currZipCode, zipcodeLength, isPropMessageActive]);

    const handleZipChange = (e) => {
        const digitsOnly = (e.target.value || '').replace(/\D/g, '').slice(0, zipcodeLength);
        setCurrZipcode(digitsOnly);
        // On user edit, revert to input-driven message
        setIsPropMessageActive(false);
    };

    return (
        <div className="zipcode-input-wrapper">
            <div style={{ display: 'flex', flexDirection: 'row', gap: 15 }}>
                <Input
                    value={currZipCode}
                    onChange={handleZipChange}
                    placeholder={placeholder}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={zipcodeLength}
                    ariaLabel="Enter zipcode"
                    className={`zipcode-input ${verified ? 'verified' : ''}`}
                />
                <button className="btnA" onClick={() => onCheck(currZipCode)} disabled={currZipCode.length < zipcodeLength || loading}>
                    Submit
                </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="zipcode-helper">{message}</div>
                {/* {verified && <div className="zipcode-verified" aria-live="polite"><span className="verified-icon" aria-hidden="true">✓</span><span className="visually-hidden">Verified</span></div>} */}
            </div>
        </div>
    );
};

ZipcodeInput.propTypes = {
    zipcode: PropTypes.string,
    onChange: PropTypes.func,
    onCheck: PropTypes.func,
    loading: PropTypes.bool,
    placeholder: PropTypes.string,
    message: PropTypes.string
};

export default ZipcodeInput;
