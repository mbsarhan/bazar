// src/frontend/components/dashboard/SecuritySettings.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';
import { Mail, Phone, Lock } from 'lucide-react'; // Icons for our list
import '../../styles/forms.css';
import '../../styles/MyProfile.css'; // We will add the new styles here

const SecuritySettings = () => {
    const { user } = useAuth();

    // --- State for Modals (we will reuse our existing logic) ---
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    
    // ... (All the other state variables for the modal flows remain the same)
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone_number || '');
    // ... etc.

    // ... (All handler functions: handleEmailChangeFlow, handlePasswordSubmit, etc. remain the same)
    // You can copy them from your previous version of MyProfile.js if needed.
    const handleEmailChangeFlow = () => { console.log("Handling Email Change..."); };
    const handlePasswordSubmit = () => { console.log("Handling Password Change..."); };
    const handlePhoneChangeFlow = () => { console.log("Handling Phone Change..."); };
    const closeEmailModal = () => setIsEmailModalOpen(false);
    const closePasswordModal = () => setIsPasswordModalOpen(false);
    const closePhoneModal = () => setIsPhoneModalOpen(false);


    // --- Helper function to partially hide email for display ---
    const obscureEmail = (email) => {
        const [name, domain] = email.split('@');
        if (!name || !domain) return email;
        return `${name.substring(0, 1)}***@${domain}`;
    };

    return (
        <div className="profile-page-wrapper">
            <div className="content-header">
                <h1>إعدادات الأمان</h1>
            </div>

            {/* --- The NEW List-Based Layout --- */}
            <div className="security-options-list">
                {/* Email Option */}
                <div className="security-option-item">
                    <div className="option-icon"><Mail size={24} /></div>
                    <div className="option-details">
                        <h3>البريد الإلكتروني</h3>
                        <p className="current-value">{obscureEmail(email)}</p>
                    </div>
                    <button className="change-btn" onClick={() => setIsEmailModalOpen(true)}>تعديل</button>
                </div>

                {/* Phone Option */}
                <div className="security-option-item">
                    <div className="option-icon"><Phone size={24} /></div>
                    <div className="option-details">
                        <h3>رقم الهاتف</h3>
                        <p className="current-value">{phone}</p>
                    </div>
                    <button className="change-btn" onClick={() => setIsPhoneModalOpen(true)}>تعديل</button>
                </div>

                {/* Password Option */}
                <div className="security-option-item">
                    <div className="option-icon"><Lock size={24} /></div>
                    <div className="option-details">
                        <h3>كلمة المرور</h3>
                        <p className="current-value">********</p>
                    </div>
                    <button className="change-btn" onClick={() => setIsPasswordModalOpen(true)}>تعديل</button>
                </div>
            </div>

            {/* --- Modals (These are now triggered by the buttons above) --- */}
            {/* Note: The logic inside these modals remains the same as your previous MyProfile.js file */}
            <Modal isOpen={isEmailModalOpen} onClose={closeEmailModal} onConfirm={handleEmailChangeFlow} title="تغيير البريد الإلكتروني">
                {/* ... JSX for email change flow ... */}
            </Modal>
            <Modal isOpen={isPhoneModalOpen} onClose={closePhoneModal} onConfirm={handlePhoneChangeFlow} title="تغيير رقم الهاتف">
                {/* ... JSX for phone change flow ... */}
            </Modal>
             <Modal isOpen={isPasswordModalOpen} onClose={closePasswordModal} onConfirm={handlePasswordSubmit} title="تغيير كلمة المرور">
                {/* ... JSX for password change flow ... */}
            </Modal>
        </div>
    );
};

export default SecuritySettings;