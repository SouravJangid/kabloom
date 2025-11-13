import React, { useRef, useState, useEffect } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './QuantitySelector.css';

const QuantitySelector = ({
    value = 5,
    onChange,
    disabled = false,
    max = 24,
}) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const selectedRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    useEffect(() => {
        if (open && selectedRef.current) {
            selectedRef.current.scrollIntoView({ block: 'center' });
        }
    }, [open]);

    const toggleMenu = () => {
        if (!disabled) setOpen((v) => !v);
    };

    const selectQty = (num) => {
        onChange && onChange(num);
        setOpen(false);
    };

    const stopProp = (e) => e.stopPropagation();

    return (
        <div
            ref={wrapperRef}
            className={`quantity-wrapper ${disabled ? 'quantity-disabled' : ''}`}
            onClick={toggleMenu}
        >
            <div className="quantity-label">
                Quantity {value}
            </div>

            <ExpandMoreIcon
                className="quantity-icon"
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleMenu();
                }}
            />

            {open && (
                <ul className="quantity-menu" onClick={stopProp}>
                    {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                        <li
                            key={n}
                            ref={n === value ? selectedRef : null}
                            className={`quantity-menu-item ${n === value ? 'selected' : ''}`}
                            onClick={() => selectQty(n)}
                        >
                            Quantity {n}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default QuantitySelector;