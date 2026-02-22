import React, { useEffect } from 'react';
import './Popup.css';

const Popup = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto close after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    return (
        <div className={`popup-container ${type}`}>
            <div className="popup-content">
                <span className="popup-icon">
                    {type === 'error' && '⚠️'}
                    {type === 'success' && '✅'}
                    {type === 'warning' && '⚡'}
                </span>
                <span className="popup-message">{message}</span>
                <button className="popup-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default Popup;
