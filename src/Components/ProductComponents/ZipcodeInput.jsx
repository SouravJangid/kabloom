import React, { useState, useCallback, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import './ZipcodeInput.css';

const ZIPCODE_LENGTH = 5;

const ZipcodeInput = ({
  zipcode: propZipcode = '',
  onCheck,
  onZipChange,
  loading = false,
  verified = false,
  message: propMessage = '',
}) => {
  const [zipcode, setZipcode] = useState(propZipcode);
  const [error, setError] = useState('');

  useEffect(() => setZipcode(propZipcode), [propZipcode]);
  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipcode(val);
    setError('');

    // RESET VERIFICATION IF USER TYPES
    if (onZipChange && val !== propZipcode) {
      onZipChange();
    }
  };
  const handleSubmit = useCallback(() => {
    if (zipcode.length !== ZIPCODE_LENGTH) {
      setError(`Enter ${ZIPCODE_LENGTH} digits`);
      return;
    }
    setError('');
    if (onZipChange) onZipChange();
    onCheck(zipcode);
  }, [zipcode, onCheck, onZipChange]);

  return (
    <div className="zipcode-input-wrapper">
      <div className="zipcode-input-row">
        <TextField
          variant="outlined"
          value={zipcode}
          onChange={handleChange}
          placeholder=""
          className="zipcode-input"
          inputProps={{ maxLength: 5 }}
          disabled={loading}
        />
        <Button
          variant="contained"
          className="zipcode-submit-btn"
          onClick={handleSubmit}
          disabled={loading || zipcode.length !== ZIPCODE_LENGTH}
        >
          {loading ? <CircularProgress size={14} color="inherit" /> : 'Submit'}
        </Button>
      </div>

           {error && <div className="zipcode-error">{error}</div>}
      {propMessage && !verified && <div className="zipcode-error">{propMessage}</div>}

     {(verified || (localStorage.getItem('zipcode') === zipcode && zipcode.length === ZIPCODE_LENGTH)) && (
      <Typography variant="body2" className="zipcode-success">
        <LocationOnIcon className="zipcode-location-icon" />
        Deliver to Boston {zipcode}
      </Typography>
    )}
    </div>
  );
};

export default ZipcodeInput;