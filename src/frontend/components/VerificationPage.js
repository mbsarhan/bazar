import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import VerificationInput from './VerificationInput';
import '../styles/forms.css';

const TIMER_DURATION = 120; // 2 minutes to match backend throttle

const VerificationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { credential, type } = location.state || {};
    
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
                if (remaining > 0) {
                    setTimer(remaining);
                } else {
                    setTimer(0);
                    localStorage.removeItem('verificationTimerExpiresAt');
                }
            } else {
                // If, for any reason, no timer exists, show the resend button.
                setTimer(0);
            }
        };

        checkTimer(); // Check immediately on load
        intervalId = setInterval(checkTimer, 1000); // Check every second

        return () => clearInterval(intervalId);
    }, []); // Run only once

    const verificationMethodText = type === 'email' ? 'بريدك الإلكتروني' : 'رقم هاتفك';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (code.length < 6) {
            setError('يرجى إدخال الرمز المكون من 6 أرقام بالكامل.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = { code };
            if (type === 'email') {
                payload.email = credential;
            } else {
                payload.phone = credential;
            }

            await api.post('/email/verify-otp', payload);
            
            localStorage.removeItem('verificationTimerExpiresAt');
            setSuccessMessage('تم تأكيد حسابك بنجاح! سيتم توجيهك لتسجيل الدخول.');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            let errorMessage = 'فشلت عملية التأكيد.';
            if (err.response?.data) {
                if (err.response.data.errors) {
                    errorMessage = Object.values(err.response.data.errors).flat().join(' ');
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
            }
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0 || isResending) return;

        setError('');
        setSuccessMessage(''); // Clear success message on resend
        setIsResending(true);
        try {
            const payload = {};
            if (type === 'email') {
                payload.email = credential;
            } else {
                payload.phone = credential;
            }

            await api.post('/email/verify-otp/resend', payload);
            
            setSuccessMessage('تم إرسال رمز جديد بنجاح.');

            const newExpirationTime = Date.now() + TIMER_DURATION * 1000;
            localStorage.setItem('verificationTimerExpiresAt', newExpirationTime);
            setTimer(TIMER_DURATION);

        } catch (err) {
            console.error("Failed to resend OTP:", err);
            const errorMessage = err.response?.data?.message || 'فشل إرسال الرمز الجديد. يرجى المحاولة مرة أخرى.';
            setError(errorMessage);
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    return (
        <div className="centered-page-container">
            <div className="form-container" style={{maxWidth: '450px'}}>
                <h2>تأكيد حسابك</h2>
                <p className="form-subtitle" style={{marginBottom: '25px'}}>
                    لقد أرسلنا رمز تأكيد إلى <strong>{verificationMethodText}</strong>:
                    <span style={{direction: 'ltr', display: 'block', marginTop: '5px'}}>
                        <strong>{credential}</strong>
                    </span>
                </p>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>رمز التأكيد</label>
                        <VerificationInput onComplete={setCode} />
                    </div>
                    
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'جاري التأكيد...' : 'تأكيد الحساب'}
                    </button>
                </form>

                <div className="form-link" style={{marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '20px', alignItems: 'center'}}>
                    {timer > 0 ? (
                        <p className="timer-text">يمكنك إعادة إرسال الرمز بعد: {formatTime(timer)}</p>
                    ) : (
                        <button className="link-style-btn" onClick={handleResend} disabled={isResending}>
                            {isResending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;