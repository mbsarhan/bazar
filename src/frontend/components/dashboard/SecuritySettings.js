import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';

import { Mail, Phone, Lock } from 'lucide-react';
import '../../styles/forms.css';
import '../../styles/MyProfile.css';

const SecuritySettings = () => {
    // We only need updatePassword from the context for this component's direct actions now.
    const { user, updatePassword } = useAuth();
    const navigate = useNavigate(); // 2. Initialize the navigate function

    // --- State for Display ---
    const [email] = useState(user?.email || 'user@example.com');
    const [phone] = useState(user?.phone || '0912345678');
    
    // --- State for Password Modal ---
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // --- State for Feedback ---
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // 3. New handler to navigate to the verification page
    // It accepts an 'intent' to tell the destination page what to do.
    const handleNavigateToVerification = (intent) => {
        // You can add more initial state if the verification page needs it
        navigate('/verification', { 
            state: { 
                intent: intent // e.g., 'change_email' or 'change_phone'
            } 
        });
    };

    const handlePasswordUpdate = async () => {
        setError('');
        setSuccessMessage('');

        if (newPassword !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين.');
            return;
        }

        try {
            const passwordData = {
                password: newPassword,
                password_confirmation: confirmPassword,
            };
            const result = await updatePassword(passwordData);
            setSuccessMessage(result.message || 'تم تغيير كلمة المرور بنجاح!');
            closePasswordModal();
        } catch (err) {
            const errorMessage = err.response?.data?.errors?.password?.[0] || 'فشل تحديث كلمة المرور.';
            setError(errorMessage);
        }
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
        setError('');
    };

    const obscureEmail = (emailStr) => {
        if (!emailStr) return '';
        const [name, domain] = emailStr.split('@');
        if (!name || !domain) return emailStr;
        return `${name.substring(0, 1)}***@${domain}`;
    };

    const obscurePhone = (phoneStr) => {
        if(!phoneStr) return '';
        return `09*****${phoneStr.substring(7,10)}`;
    }

    return (
        <div className="profile-page-wrapper">
            <div className="content-header">
                <h1>إعدادات الأمان</h1>
            </div>
            {successMessage && <div className="success-message" style={{marginBottom: '20px'}}>{successMessage}</div>}

            <div className="security-options-list">
                <div className="security-option-item">
                    <div className="option-icon"><Mail size={24} /></div>
                    <div className="option-details">
                        <h3>البريد الإلكتروني</h3>
                        <p className="current-value">{obscureEmail(email)}</p>
                    </div>
                    {/* 4. Update the onClick handler to navigate */}
                    <button className="change-btn" onClick={() => handleNavigateToVerification('change_email')}>تعديل</button>
                </div>
                <div className="security-option-item">
                    <div className="option-icon"><Phone size={24} /></div>
                    <div className="option-details">
                        <h3>رقم الهاتف</h3>
                        <p className="current-value">{obscurePhone(phone)}</p>
                    </div>
                    {/* 5. Update the onClick handler to navigate */}
                    <button className="change-btn" onClick={() => handleNavigateToVerification('change_phone')}>تعديل</button>
                </div>
                <div className="security-option-item">
                    <div className="option-icon"><Lock size={24} /></div>
                    <div className="option-details">
                        <h3>كلمة المرور</h3>
                        <p className="current-value">********</p>
                    </div>
                    <button className="change-btn" onClick={() => setIsPasswordModalOpen(true)}>تعديل</button>
                </div>
            </div>

            {/* 6. The email and phone modals have been removed. Only the password modal remains. */}
             <Modal isOpen={isPasswordModalOpen} onClose={closePasswordModal} onConfirm={handlePasswordUpdate} title="تغيير كلمة المرور">
                {error && isPasswordModalOpen && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label>كلمة المرور الجديدة</label>
                    <div className="input-with-icon">
                        <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password"/>
                        <span className={`password-toggle-icon ${showPassword ? 'visible' : 'hidden'}`} onClick={() => setShowPassword(!showPassword)}></span>
                    </div>
                </div>
                <div className="form-group">
                    <label>تأكيد كلمة المرور الجديدة</label>
                    <div className="input-with-icon">
                        <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password"/>
                        <span className={`password-toggle-icon ${showPassword ? 'visible' : 'hidden'}`} onClick={() => setShowPassword(!showPassword)}></span>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SecuritySettings;