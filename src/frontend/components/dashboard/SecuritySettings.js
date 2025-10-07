import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';
import { Mail, Phone, Lock } from 'lucide-react';
import '../../styles/forms.css';
import '../../styles/MyProfile.css';

const SecuritySettings = () => {
    // --- 1. Get the new updatePassword function from the context ---
    const { user, updatePassword } = useAuth();

    // --- State for Display ---
    const [email, setEmail] = useState(user?.email || 'user@example.com');
    const [phone, setPhone] = useState(user?.phone || '0912345678');
    
    // --- State for Modals ---
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // --- State for Modal Forms ---
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // --- State for Feedback ---
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- Handlers for each simple, one-step modal ---
    const handleEmailUpdate = () => {
        setError('');
        if (!newEmail || !newEmail.includes('@')) {
            setError('يرجى إدخال بريد إلكتروني صالح.');
            return;
        }
        // SIMULATION: API call to update email, then trigger verification
        console.log("Updating email to:", newEmail);
        setEmail(newEmail);
        setSuccessMessage('تم تحديث البريد الإلكتروني بنجاح (قد تحتاج إلى التحقق).');
        closeEmailModal();
    };

    const handlePhoneUpdate = () => {
        setError('');
        if (!newPhone || newPhone.length < 9) {
            setError('يرجى إدخال رقم هاتف صالح.');
            return;
        }
        // SIMULATION: API call to update phone, then trigger verification
        console.log("Updating phone to:", newPhone);
        setPhone(newPhone);
        setSuccessMessage('تم تحديث رقم الهاتف بنجاح (قد تحتاج إلى التحقق).');
        closePhoneModal();
    };

    // --- 2. Replace the old handlePasswordUpdate with this new async version ---
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

            // Call the context function
            const result = await updatePassword(passwordData);
            
            // On success
            setSuccessMessage(result.message || 'تم تغيير كلمة المرور بنجاح!');
            closePasswordModal();
            

        } catch (err) {
            // Axios places validation errors inside error.response.data
            const errorMessage = err.response?.data?.errors?.password?.[0] || 'فشل تحديث كلمة المرور.';
            setError(errorMessage);
        }
    };

    // --- Modal close handlers ---
    const closeEmailModal = () => { setIsEmailModalOpen(false); setNewEmail(''); setError(''); };
    const closePhoneModal = () => { setIsPhoneModalOpen(false); setNewPhone(''); setError(''); };
    const closePasswordModal = () => { setIsPasswordModalOpen(false); setNewPassword(''); setConfirmPassword(''); setError(''); };

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
                    <button className="change-btn" onClick={() => setIsEmailModalOpen(true)}>تعديل</button>
                </div>
                <div className="security-option-item">
                    <div className="option-icon"><Phone size={24} /></div>
                    <div className="option-details">
                        <h3>رقم الهاتف</h3>
                        <p className="current-value">{obscurePhone(phone)}</p>
                    </div>
                    <button className="change-btn" onClick={() => setIsPhoneModalOpen(true)}>تعديل</button>
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

            {/* --- SIMPLE, ONE-STEP MODALS --- */}
            <Modal isOpen={isEmailModalOpen} onClose={closeEmailModal} onConfirm={handleEmailUpdate} title="تعديل البريد الإلكتروني">
                {error && isEmailModalOpen && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label>البريد الإلكتروني الجديد</label>
                    <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                </div>
            </Modal>

            <Modal isOpen={isPhoneModalOpen} onClose={closePhoneModal} onConfirm={handlePhoneUpdate} title="تعديل رقم الهاتف">
                {error && isPhoneModalOpen && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label>رقم الهاتف الجديد</label>
                    <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                </div>
            </Modal>

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