import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';
import axios from 'axios';
import { Mail, Phone, Lock } from 'lucide-react';
import '../../styles/forms.css';
import '../../styles/MyProfile.css';

const API_URL = 'http://127.0.0.1:8000/api';

const SecuritySettings = () => {
    const { user } = useAuth();

    // --- State for Display ---
    const [email, setEmail] = useState(user?.email || 'user@example.com');
    const [phone, setPhone] = useState(user?.phone || '0912345678');
    
    // --- State for Modals ---
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailChangeStep, setEmailChangeStep] = useState(1); // 1: Enter new email, 2: Enter code
    const [newEmail, setNewEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // --- State for Modal Forms ---
    const [newPhone, setNewPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // --- State for Feedback ---
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEmailChangeFlow = async () => {
        setError('');
        setIsSubmitting(true);

        // --- Step 1: Request an OTP for the new email address ---
        if (emailChangeStep === 1) {
            try {
                if (!newEmail || !newEmail.includes('@')) {
                    throw new Error('يرجى إدخال بريد إلكتروني صالح.');
                }
                // SIMULATION: Call your backend to send the OTP to `newEmail`
                // await axios.post(`${API_URL}/user/email/send-otp`, { email: newEmail });
                console.log(`Simulating sending OTP to ${newEmail}`);
                alert(`للتجربة، تم إرسال الرمز "123456" إلى ${newEmail}`);

                // On success, move to the next step
                setEmailChangeStep(2);

            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ ما.';
                setError(errorMessage);
            }
        } 
        
        // --- Step 2: Verify the OTP using your existing route ---
        else if (emailChangeStep === 2) {
            try {
                if (!otpCode) {
                    throw new Error('يرجى إدخال رمز التأكيد.');
                }
                
                // This is the payload your existing API route expects
                const payload = { 
                    email: newEmail, 
                    code: otpCode 
                };

                // Use the exact same API route we used on the verification page
                await axios.post(`${API_URL}/email/verify-otp`, payload);

                // On final success:
                setEmail(newEmail);
                setSuccessMessage('تم تغيير البريد الإلكتروني بنجاح!');
                closeEmailModal();

            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || 'الرمز غير صحيح أو انتهت صلاحيته.';
                setError(errorMessage);
            }
        }
        setIsSubmitting(false);
    };

    const closeEmailModal = () => {
        setIsEmailModalOpen(false);
        setTimeout(() => { 
            setEmailChangeStep(1); 
            setNewEmail(''); 
            setOtpCode(''); 
            setError(''); 
        }, 300);
    };

    // --- This function renders the correct content inside the email modal ---
    const renderEmailModalContent = () => {
        if (emailChangeStep === 1) {
            return (
                <>
                    <p>الرجاء إدخال عنوان بريدك الإلكتروني الجديد. سنرسل لك رمز تأكيد إليه.</p>
                    <div className="form-group">
                        <label>البريد الإلكتروني الجديد</label>
                        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                    </div>
                </>
            );
        }
        if (emailChangeStep === 2) {
            return (
                <>
                    <p>لقد أرسلنا رمز تأكيد إلى <strong>{newEmail}</strong>. الرجاء إدخاله أدناه.</p>
                    <div className="form-group">
                        <label>رمز التأكيد</label>
                        <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                    </div>
                </>
            );
        }
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

    const handlePasswordUpdate = () => {
        setError('');
        if (!newPassword || !confirmPassword) {
            setError('يرجى ملء حقلي كلمة المرور.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين.');
            return;
        }
        // SIMULATION: API call to update password
        console.log("Updating password...");
        setSuccessMessage('تم تغيير كلمة المرور بنجاح!');
        closePasswordModal();
    };

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
            <Modal 
                isOpen={isEmailModalOpen} 
                onClose={closeEmailModal} 
                onConfirm={handleEmailChangeFlow} 
                title="تغيير البريد الإلكتروني"
                confirmDisabled={isSubmitting}
            >
                {error && isEmailModalOpen && <div className="error-message">{error}</div>}
                {renderEmailModalContent()}
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