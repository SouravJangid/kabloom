import React, { useState, useEffect } from 'react';
import './QuantitySelector.css';

const QuantitySelector = ({ value = 1, onChange,disabled = false }) => {
    const [quantity, setQuantity] = useState(value);

    // Update internal state when prop value changes
    useEffect(() => {
        setQuantity(value);
    }, [value]);

    const handleQuantityChange = (action) => {
        let newQuantity = quantity;
        
        if (action === "add" && quantity < 24) {
            newQuantity += 1;
        } else if (action === "less" && quantity > 1) {
            newQuantity -= 1;
        }
        
        updateQuantity(newQuantity);
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value);
        setQuantity(value);
    };

    const handleInputBlur = (e) => {
        let newQuantity = parseInt(e.target.value) || 1;
        
        // Ensure quantity is within bounds
        if (newQuantity < 1) {
            newQuantity = 1;
        } else if (newQuantity > 24) {
            newQuantity = 24;
        }
        
        updateQuantity(newQuantity);
    };

    const updateQuantity = (newQuantity) => {
        setQuantity(newQuantity);
        if (onChange) {
            onChange(newQuantity);
        }
    };

    return (
        <div className="quantity-controls">
            <button
                type="button"
                onClick={() => handleQuantityChange('less')}
                disabled={quantity <= 1 || disabled}
            >
                -
            </button>
            <input
                type="number"
                value={quantity}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                min="1"
                max="24"
                disabled={disabled}
                className="input-number-no-spinners"
            />
            <button
                type="button"
                onClick={() => handleQuantityChange('add')}
                disabled={quantity >= 24 || disabled}
            >
                +
            </button>
        </div>
    );
};

export default QuantitySelector;
