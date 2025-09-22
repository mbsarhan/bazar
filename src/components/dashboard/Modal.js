// src/components/dashboard/Modal.js
import React from 'react';
import '../../styles/Modal.css'; // ملف أنماط جديد للمودال

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        // 1. الطبقة الخلفية (Overlay)
        <div className="modal-overlay" onClick={onClose}>
            {/* 2. صندوق المودال نفسه */}
            {/* e.stopPropagation() يمنع إغلاق المودال عند الضغط داخله */}
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
                    <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>
                        تأكيد
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;