// src/frontend/components/dashboard/Modal.js
import React from 'react';
import '../../styles/Modal.css';

// 1. Accept the new 'confirmDisabled' prop, with a default value of false
const Modal = ({ isOpen, onClose, onConfirm, title, children, confirmDisabled = false }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button className="modal-btn modal-btn-cancel" onClick={onClose}>
                        إلغاء
                    </button>
                    {/* 2. Apply the 'disabled' attribute to the button based on the prop */}
                    <button 
                        className="modal-btn modal-btn-confirm" 
                        onClick={onConfirm}
                        disabled={confirmDisabled}
                    >
                        {/* 3. Optional: Change button text while disabled */}
                        {confirmDisabled ? 'جاري...' : 'تأكيد'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;