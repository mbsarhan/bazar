import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePasswordReset } from '../context/PasswordResetContext';
import VerificationInput from './VerificationInput';
import '../styles/forms.css';

const TIMER_DURATION = 120; // 2 minutes to match backend throttle

const VerificationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // The 'intent' comes from SecuritySettings, 'type' and 'credential' come from older flows
    const { credential, type, intent } = location.state || {};
    // 'flow' is a unified variable to determine what the page should be doing.
    const flow = intent || type;

    // Get all necessary functions from contexts
    const { 
        verifyAccountOtp, resendAccountOtp,
        requestEmailChange, verifyEmailChange,
        // Assuming you will add these phone functions to your AuthContext
        // requestPhoneChange, verifyPhoneChange 
    } = useAuth();
    const { verifyResetCode } = usePasswordReset();
    
    // --- STATE FOR THE MULTI-STEP PROCESS ---
    const [verificationStep, setVerificationStep] = useState(1); // 1: Enter new credential, 2: Enter code
    const [newCredential, setNewCredential] = useState(''); // Holds the new email or phone number
    const [code, setCode] = useState('');

    const [timer, setTimer] = useState(0);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        let intervalId = null;
        const checkTimer = () => {
            const expirationTime = localStorage.getItem('verificationTimerExpiresAt');
            if (expirationTime) {
                const remaining = Math.round((parseInt(expirationTime, 10) - Date.now()) / 1000);
                if (remaining > 0) setTimer(remaining);
                else {
                    setTimer(0);
                    localStorage.removeItem('verificationTimerExpiresAt');
                }
            } else setTimer(0);
        };
        checkTimer();
        intervalId = setInterval(checkTimer, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const startTimer = () => {
        const newExpirationTime = Date.now() + TIMER_DURATION * 1000;
        localStorage.setItem('verificationTimerExpiresAt', newExpirationTime.toString());
        setTimer(TIMER_DURATION);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);

        try {
            // --- NEW: Logic for changing email/phone ---
            if (flow === 'change_email') {
                if (verificationStep === 1) { // Step 1: Request the code
                    await requestEmailChange(newCredential);
                    setSuccessMessage(`تم إرسال رمز إلى ${newCredential}.`);
                    setVerificationStep(2);
                    startTimer();
                } else { // Step 2: Verify the code
                    await verifyEmailChange(code);
                    setSuccessMessage('تم تغيير بريدك الإلكتروني بنجاح!');
                    setTimeout(() => navigate('/dashboard/security-settings'), 2000);
                }
            } 
            // Placeholder for phone change logic
            else if (flow === 'change_phone') {
                // This would be the same structure as email change, using requestPhoneChange etc.
                alert("Phone change logic not yet implemented."); // Replace with actual logic
                // await requestPhoneChange(newCredential); ...
            }
            // --- EXISTING: Logic for password reset ---
            else if (flow === 'passwordReset') {
                await verifyResetCode(credential, code);
                navigate('/reset-password', { state: { email: credential, code } });
            } 
            // --- EXISTING: Logic for initial account verification ---
            else {
                await verifyAccountOtp(credential, code);
                localStorage.removeItem('verificationTimerExpiresAt');
                setSuccessMessage('تم تأكيد حسابك بنجاح! سيتم توجيهك لتسجيل الدخول.');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.errors?.code?.[0] || err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'فشلت العملية.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0 || isResending) return;
        setError('');
        setIsResending(true);
        try {
            // Resend logic for the new flows
            if (flow === 'change_email') {
                await requestEmailChange(newCredential); // Resend to the new email
                setSuccessMessage('تم إرسال رمز جديد بنجاح.');
                startTimer();
            } else if (flow === 'change_phone') {
                // await requestPhoneChange(newCredential);
            }
            // Resend logic for the old flow
            else {
                await resendAccountOtp(credential);
                setSuccessMessage('تم إرسال رمز جديد بنجاح.');
                startTimer();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'فشل إرسال الرمز الجديد.');
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

    // If a user lands here without any state, redirect them.
    if (!flow) {
        navigate('/login');
        return null;
    }

    // --- Dynamic Content Rendering ---
    const renderContent = () => {
        // --- NEW: Change Email/Phone Flow ---
        if (flow === 'change_email' || flow === 'change_phone') {
            const isEmail = flow === 'change_email';
            const title = isEmail ? 'تغيير البريد الإلكتروني' : 'تغيير رقم الهاتف';
            
            if (verificationStep === 1) {
                return (
                    <form onSubmit={handleSubmit}>
                        <h2>{title}</h2>
                        <p className="form-subtitle">الرجاء إدخال {isEmail ? 'عنوان بريدك الإلكتروني الجديد' : 'رقم هاتفك الجديد'}.</p>
                        <div className="form-group">
                            <label>{isEmail ? 'البريد الإلكتروني الجديد' : 'رقم الهاتف الجديد'}</label>
                            <input type={isEmail ? 'email' : 'tel'} value={newCredential} onChange={(e) => setNewCredential(e.target.value)} required/>
                        </div>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
                        </button>
                    </form>
                );
            } else { // Step 2
                return (
                    <form onSubmit={handleSubmit}>
                        <h2>أدخل الرمز</h2>
                        <p className="form-subtitle">لقد أرسلنا رمزًا إلى <strong>{newCredential}</strong></p>
                        <div className="form-group"><label>رمز التأكيد</label><VerificationInput onComplete={setCode} /></div>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'جاري التحقق...' : 'تأكيد'}
                        </button>
                    </form>
                );
            }
        }

        // --- EXISTING: Password Reset or Account Verification Flow ---
        return (
            <form onSubmit={handleSubmit}>
                <h2>{flow === 'passwordReset' ? 'تأكيد الرمز' : 'تأكيد حسابك'}</h2>
                <p className="form-subtitle" style={{marginBottom: '25px'}}>
                    لقد أرسلنا رمز تأكيد إلى <strong>{type === 'email' ? 'بريدك الإلكتروني' : 'رقم هاتفك'}</strong>:
                    <span style={{direction: 'ltr', display: 'block', marginTop: '5px'}}><strong>{credential}</strong></span>
                </p>
                <div className="form-group"><label>رمز التأكيد</label><VerificationInput onComplete={setCode} /></div>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'جاري التأكيد...' : (flow === 'passwordReset' ? 'تأكيد' : 'تأكيد الحساب')}
                </button>
            </form>
        );
    };

    return (
        <div className="centered-page-container">
            <div className="form-container" style={{maxWidth: '450px'}}>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                
                {renderContent()}

                {/* Show the resend button only after a code has been requested */}
                {(verificationStep === 2 || (flow !== 'change_email' && flow !== 'change_phone')) && (
                    <div className="form-link" style={{marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '20px', alignItems: 'center'}}>
                        {timer > 0 ? (
                            <p className="timer-text">يمكنك إعادة إرسال الرمز بعد: {formatTime(timer)}</p>
                        ) : (
                            <button className="link-style-btn" onClick={handleResend} disabled={isResending}>
                                {isResending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationPage;