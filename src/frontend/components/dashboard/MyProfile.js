// src/frontend/components/dashboard/MyProfile.js
import React, { useState , useEffect } from 'react';
import Modal from './Modal';
import '../../styles/forms.css'; // Reusing global form styles
import '../../styles/MyProfile.css'; // New specific styles for this page
import { useAuth } from '../../context/AuthContext';

const MyProfile = () => {
    const { user } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setFirstName(user.fname || '');
            setLastName(user.lname || '');
            setEmail(user.email || '');
            setPhone(user.phone || ''); 
            setIsLoading(false);
        }
    }, [user]);

    // --- State for Modals ---
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false); // 2. Add phone modal state
    
    // ... (other state variables for email and password flows remain the same)
    const [emailChangeStep, setEmailChangeStep] = useState(1);
    const [newEmail, setNewEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // --- NEW: State for Phone Change Flow ---
    const [newPhone, setNewPhone] = useState('');
    const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInfoSubmit = (e) => {
        e.preventDefault();
        clearMessages();
        if (!firstName || !lastName) {
            setError('الاسم الأول واسم العائلة حقول إلزامية.');
            return;
        }
        // In a real app, you would send this to the backend
        console.log('Updating info:', { firstName, lastName });
        setSuccessMessage('تم تحديث المعلومات الشخصية بنجاح!');
    };

    
    const handleEmailChangeFlow = () => {
        clearMessages(true);
        setError('');
        // --- Step 1: Verify Password ---
        if (emailChangeStep === 1) {
            if (!currentPassword) {
                setError('يرجى إدخال كلمة المرور الحالية.');
                return;
            }
            // SIMULATION: In a real app, verify the password on the backend.
            console.log("Verifying password:", currentPassword);
            if (currentPassword === "password") { // Simulate correct password
                setEmailChangeStep(2); // Move to next step
                setCurrentPassword(''); // Clear the field
            } else {
                setError('كلمة المرور غير صحيحة.');
            }
        }
        // --- Step 2: Get New Email & Send Code ---
        else if (emailChangeStep === 2) {
            if (!newEmail || !newEmail.includes('@')) {
                setError('يرجى إدخال بريد إلكتروني صالح.');
                return;
            }
            // SIMULATION: In a real app, send verification code to `newEmail`.
            console.log(`Sending verification code to ${newEmail}...`);
            alert(`تم إرسال رمز التأكيد إلى ${newEmail}. الرمز هو "123456" (للتجربة).`);
            setEmailChangeStep(3); // Move to next step
        }
        // --- Step 3: Verify Code & Finalize ---
        else if (emailChangeStep === 3) {
            if (!verificationCode) {
                setError('يرجى إدخال رمز التأكيد.');
                return;
            }
            // SIMULATION: Verify the code.
            console.log("Verifying code:", verificationCode);
            if (verificationCode === "123456") { // Simulate correct code
                setEmail(newEmail); // Update the email in the UI
                setSuccessMessage('تم تغيير البريد الإلكتروني بنجاح!');
                closeEmailModal();
            } else {
                setError('رمز التأكيد غير صحيح.');
            }
        }
    };

    const handlePasswordSubmit = () => {
        clearMessages(true); // Clear messages inside the modal
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('يرجى ملء جميع حقول كلمة المرور.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('كلمتا المرور الجديدتان غير متطابقتين.');
            return;
        }
        console.log('Changing password...');
        setSuccessMessage('تم تغيير كلمة المرور بنجاح!');
        closePasswordModal();
    };

    const handlePhoneChangeFlow = () => {
        clearMessages(true);
        // For phone, we often just send a code directly without password verification
        // (This is a common pattern, but can be changed if needed)
        
        // --- Step 1: Get New Phone & Send Code ---
        if (emailChangeStep === 1) { // We'll reuse the step logic for simplicity
            if (!newPhone || newPhone.length < 9) {
                setError('يرجى إدخال رقم هاتف صالح.');
                return;
            }
            // SIMULATION: In a real app, send verification code to `newPhone`.
            console.log(`Sending SMS verification code to ${newPhone}...`);
            alert(`تم إرسال رمز التأكيد إلى ${newPhone}. الرمز هو "654321" (للتجربة).`);
            setEmailChangeStep(2);
        }
        // --- Step 2: Verify Code & Finalize ---
        else if (emailChangeStep === 2) {
            if (!phoneVerificationCode) {
                setError('يرجى إدخال رمز التأكيد.');
                return;
            }
            // SIMULATION: Verify the code.
            console.log("Verifying phone code:", phoneVerificationCode);
            if (phoneVerificationCode === "654321") { // Simulate correct code
                setPhone(newPhone); // Update the phone in the UI
                setSuccessMessage('تم تغيير رقم الهاتف بنجاح!');
                closePhoneModal();
            } else {
                setError('رمز التأكيد غير صحيح.');
            }
        }
    };

    const clearMessages = (isModal = false) => {
        setError('');
        if (!isModal) {
            setSuccessMessage('');
        }
    };

    const closeEmailModal = () => {
        setIsEmailModalOpen(false);
        // Reset the flow state for next time
        setTimeout(() => {
            setEmailChangeStep(1);
            setCurrentPassword('');
            setNewEmail('');
            setVerificationCode('');
            setError('');
        }, 300); // Delay to allow modal to fade out
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
        // Reset state for next time
        setTimeout(() => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
        }, 300);
    };

    const closePhoneModal = () => {
        setIsPhoneModalOpen(false);
        setTimeout(() => {
            setEmailChangeStep(1); // Reset step counter
            setNewPhone('');
            setPhoneVerificationCode('');
            setError('');
        }, 300);
    };

    // --- Render the content for the email modal based on the current step ---
    const renderEmailModalContent = () => {
        if (emailChangeStep === 1) {
            return (
                <>
                    <p>لأسباب أمنية، يرجى إدخال كلمة المرور الحالية للمتابعة.</p>
                    <div className="form-group">
                        <label htmlFor="modalCurrentPassword">كلمة المرور الحالية</label>
                        <input type="password" id="modalCurrentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                </>
            );
        }
        if (emailChangeStep === 2) {
            return (
                <>
                    <p>الرجاء إدخال عنوان بريدك الإلكتروني الجديد.</p>
                    <div className="form-group">
                        <label htmlFor="newEmail">البريد الإلكتروني الجديد</label>
                        <input type="email" id="newEmail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                    </div>
                </>
            );
        }
        if (emailChangeStep === 3) {
            return (
                <>
                    <p>لقد أرسلنا رمز تأكيد إلى <strong>{newEmail}</strong>. الرجاء إدخاله أدناه.</p>
                    <div className="form-group">
                        <label htmlFor="verificationCode">رمز التأكيد</label>
                        <input type="text" id="verificationCode" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                    </div>
                </>
            );
        }
    };

    const renderPhoneModalContent = () => {
        if (emailChangeStep === 1) {
            return (
                <>
                    <p>الرجاء إدخال رقم هاتفك الجديد. سنرسل لك رمز تأكيد عبر رسالة نصية قصيرة.</p>
                    <div className="form-group">
                        <label htmlFor="newPhone">رقم الهاتف الجديد</label>
                        <input type="tel" id="newPhone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                    </div>
                </>
            );
        }
        if (emailChangeStep === 2) {
            return (
                <>
                    <p>لقد أرسلنا رمز تأكيد إلى <strong>{newPhone}</strong>. الرجاء إدخاله أدناه.</p>
                    <div className="form-group">
                        <label htmlFor="phoneVerificationCode">رمز التأكيد</label>
                        <input type="text" id="phoneVerificationCode" value={phoneVerificationCode} onChange={(e) => setPhoneVerificationCode(e.target.value)} />
                    </div>
                </>
            );
        }
    };

    if (isLoading) {
        return (
            <div className="profile-page-wrapper">
                <div className="content-header"><h1>معلوماتي الشخصية</h1></div>
                <p>جاري تحميل البيانات...</p>
            </div>
        );
    }

    return (
        <div className="profile-page-wrapper"> 
            <div className="content-header">
                <h1>معلوماتي الشخصية</h1>
            </div>

            {error && <div className="error-message" style={{marginBottom: '20px'}}>{error}</div>}
            {successMessage && <div className="success-message" style={{marginBottom: '20px'}}>{successMessage}</div>}

            {/* --- Personal Information Form --- */}
            <div className="profile-form-container">
                <form onSubmit={handleInfoSubmit}>
                    <fieldset>
                        <legend>المعلومات الشخصية</legend>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">الاسم الأول</label>
                                <input 
                                    type="text" 
                                    id="firstName" 
                                    value={firstName} 
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                             <div className="form-group">
                                <label htmlFor="lastName">اسم العائلة</label>
                                <input 
                                    type="text" 
                                    id="lastName" 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                         <div className="form-group">
                            <label htmlFor="email">البريد الإلكتروني</label>
                            {/* --- The New Email Display --- */}
                            <div className="email-display-wrapper">
                                <input type="email" id="email" value={email} disabled />
                                <button type="button" className="change-btn" onClick={() => setIsEmailModalOpen(true)}>
                                    تغيير
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">رقم الهاتف</label>
                            <div className="email-display-wrapper">
                                <input type="tel" id="phone" value={phone} disabled />
                                <button type="button" className="change-btn" onClick={() => { clearMessages(); setIsPhoneModalOpen(true); }}>تغيير</button>
                            </div>
                        </div>
                        <div className="form-group">
                             <label>كلمة المرور</label>
                             <button type="button" className="change-btn" onClick={() => setIsPasswordModalOpen(true)}>
                                 تغيير كلمة المرور
                             </button>
                         </div>
                         <button type="submit" className="submit-btn">حفظ التغييرات</button>
                    </fieldset>
                </form>
            </div>

            {/* Email Modal */}
            <Modal
                isOpen={isEmailModalOpen}
                onClose={closeEmailModal}
                onConfirm={handleEmailChangeFlow}
                title="تغيير البريد الإلكتروني"
            >
                {/* Display specific error for the modal */}
                {error && isEmailModalOpen && <div className="error-message">{error}</div>}
                {renderEmailModalContent()}
            </Modal>

            {/* Password Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={closePasswordModal}
                onConfirm={handlePasswordSubmit}
                title="تغيير كلمة المرور"
            >
                {error && isPasswordModalOpen && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="currentPassword">كلمة المرور الحالية</label>
                    <div className="input-with-icon">
                        <input type={showPassword ? 'text' : 'password'} id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        <span className={`password-toggle-icon ${showPassword ? 'visible' : 'hidden'}`} onClick={() => setShowPassword(!showPassword)}></span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">كلمة المرور الجديدة</label>
                    <div className="input-with-icon">
                        <input type={showPassword ? 'text' : 'password'} id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <span className={`password-toggle-icon ${showPassword ? 'visible' : 'hidden'}`} onClick={() => setShowPassword(!showPassword)}></span>
                    </div>
                </div>
                 <div className="form-group">
                    <label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</label>
                    <div className="input-with-icon">
                        <input type={showPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <span className={`password-toggle-icon ${showPassword ? 'visible' : 'hidden'}`} onClick={() => setShowPassword(!showPassword)}></span>
                    </div>
                </div>
            </Modal>

            {/* 4. NEW: Phone Change Modal */}
            <Modal isOpen={isPhoneModalOpen} onClose={closePhoneModal} onConfirm={handlePhoneChangeFlow} title="تغيير رقم الهاتف">
                {error && isPhoneModalOpen && <div className="error-message">{error}</div>}
                {renderPhoneModalContent()}
            </Modal>
        </div>
    );
};

export default MyProfile;