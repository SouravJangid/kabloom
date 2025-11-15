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
  onCheck,          // (zip:string) => void
  onZipChange,      // () => void
  loading = false,
  verified = false,
  message: propMessage = '',
}) => {
  const [zipcode, setZipcode] = useState(propZipcode);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // local guard

  // Sync with parent when a successful verify updates the prop
  useEffect(() => setZipcode(propZipcode), [propZipcode]);

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, ZIPCODE_LENGTH);
    setZipcode(val);
    setError('');
    // Reset verification instantly
    if (onZipChange && val !== propZipcode) onZipChange();
  };

  // ---- SUBMIT WITH CLICK GUARD ----
  const handleSubmit = useCallback(() => {
    if (isSubmitting || loading) return;               // prevent double-click
    if (zipcode.length !== ZIPCODE_LENGTH) {
      setError(`Enter ${ZIPCODE_LENGTH} digits`);
      return;
    }
    setError('');
    setIsSubmitting(true);
    onCheck(zipcode);                                 // call parent → API
    // parent will set deliveryLoading=true; when it finishes it will set isSubmitting=false via state reset
  }, [zipcode, onCheck, onZipChange, isSubmitting, loading]);

  // Reset local guard when parent finishes (success or error)
  useEffect(() => {
    if (!loading) setIsSubmitting(false);
  }, [loading]);

  return (
    <div className="zipcode-input-wrapper">
      <div className="zipcode-input-row">
        <TextField
          variant="outlined"
          value={zipcode}
          onChange={handleChange}
          placeholder="Enter zipcode"
          className="zipcode-input"
          inputProps={{ maxLength: 5 }}
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          className="zipcode-submit-btn"
          onClick={handleSubmit}
          disabled={loading || isSubmitting || zipcode.length !== ZIPCODE_LENGTH}
        >
          {loading ? <CircularProgress size={14} color="inherit" /> : 'Submit'}
        </Button>
      </div>

      {error && <div className="zipcode-error">{error}</div>}
      {propMessage && !verified && <div className="zipcode-error">{propMessage}</div>}

      {/* SUCCESS */}
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