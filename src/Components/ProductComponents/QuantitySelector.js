/*  QuantitySelector.jsx  */
import React, { useRef, useState, useEffect } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './QuantitySelector.css';

const QuantitySelector = ({
    value = 1,                 // default 1
    onChange = () => { },       // <-- no-op default (fixes lint)
    disabled = false,
    max = 24,
}) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const selectedRef = useRef(null);

    /* ---- Click-outside handler ---- */
    useEffect(() => {
        const handler = e => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    /* ---- Scroll selected item into view ---- */
    useEffect(() => {
        if (open && selectedRef.current) {
            selectedRef.current.scrollIntoView({ block: 'center' });
        }
    }, [open]);

    const toggle = () => !disabled && setOpen(v => !v);

    const select = num => {
        onChange(num);          // <-- direct call, no optional chaining
        setOpen(false);
    };

    const stopProp = e => e.stopPropagation();

    return (
        <div
            ref={wrapperRef}
            className={`quantity-wrapper ${disabled ? 'quantity-disabled' : ''}`}
            onClick={toggle}
            role="button"
            tabIndex={0}
            aria-disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
        >
            <div className="quantity-label">Quantity {value}</div>

            <ExpandMoreIcon
                className="quantity-icon"
                onMouseDown={e => {
                    e.preventDefault();
                    toggle();
                }}
            />

            {open && (
                <ul className="quantity-menu" onClick={stopProp} role="listbox">
                    {Array.from({ length: max }, (_, i) => i + 1).map(n => (
                        <li
                            key={n}
                            ref={n === value ? selectedRef : null}
                            className={`quantity-menu-item ${n === value ? 'selected' : ''}`}
                            onClick={() => select(n)}
                            role="option"
                            aria-selected={n === value}
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