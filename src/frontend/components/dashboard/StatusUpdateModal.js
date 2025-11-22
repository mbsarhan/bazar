// src/components/dashboard/StatusUpdateModal.js
import React, { useState } from 'react';
import { CheckCircle, XCircle, Package } from 'lucide-react';
import '../../styles/StatusUpdateModal.css';

const StatusUpdateModal = ({ isOpen, onClose, onConfirm, currentStatus, adTitle, error }) => {
    const [selectedStatus, setSelectedStatus] = useState('');

    if (!isOpen) return null;

    const statusOptions = [
        { value: 'فعال', label: 'فعال', icon: <CheckCircle size={24} />, color: '#50C878' },
        { value: 'مباع', label: 'مباع', icon: <Package size={24} />, color: '#e74c3c' },
        { value: 'مؤجر', label: 'مؤجر', icon: <Package size={24} />, color: '#f39c12' }
    ];

    // Filter out current status
    const availableOptions = statusOptions.filter(option => option.value !== currentStatus);

    const handleConfirm = () => {
        if (selectedStatus) {
            onConfirm(selectedStatus);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content status-update-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <XCircle size={24} />
                </button>

                <div className="modal-header">
                    <h2>تغيير حالة الإعلان</h2>
                    <p className="ad-title-preview">{adTitle}</p>
                    <p className="current-status-text">
                        الحالة الحالية: <span className="status-badge">{currentStatus}</span>
                    </p>
                </div>

                <div className="modal-body">
                    <p className="instruction-text">اختر الحالة الجديدة للإعلان:</p>
                    
                    <div className="status-options">
                        {availableOptions.map(option => (
                            <button
                                key={option.value}
                                className={`status-option ${selectedStatus === option.value ? 'selected' : ''}`}
                                onClick={() => setSelectedStatus(option.value)}
                                style={{
                                    '--option-color': option.color
                                }}
                            >
                                <div className="status-icon" style={{ color: option.color }}>
                                    {option.icon}
                                </div>
                                <span className="status-label">{option.label}</span>
                            </button>
                        ))}
                    </div>

                    {error && (
                        <p className="error-message">{error}</p>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="modal-btn cancel-btn" onClick={onClose}>
                        إلغاء
                    </button>
                    <button 
                        className="modal-btn confirm-btn" 
                        onClick={handleConfirm}
                        disabled={!selectedStatus}
                    >
                        تأكيد التغيير
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusUpdateModal;