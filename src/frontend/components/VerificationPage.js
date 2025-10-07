// src/frontend/components/VerificationPage.js
import React, { useState , useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VerificationInput from './VerificationInput';
import '../styles/forms.css';


const TIMER_DURATION = 300;
const VerificationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // --- 1. Determine the verification type from the passed state ---
    const { credential, type } = location.state || {}; // e.g., type = 'email' or 'phone'

    const [timer, setTimer] = useState(() => {
        const expirationTime = localStorage.getItem('verificationTimerExpiresAt');
        if (expirationTime) {
            const remaining = Math.round((parseInt(expirationTime, 10) - Date.now()) / 1000);
            return remaining > 0 ? remaining : 0;
        }
        return TIMER_DURATION; // Start fresh if nothing is stored
    });

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // If there's no stored timer on mount, create one.
        if (!localStorage.getItem('verificationTimerExpiresAt')) {
            const newExpirationTime = Date.now() + TIMER_DURATION * 1000;
            localStorage.setItem('verificationTimerExpiresAt', newExpirationTime);
        }

        // Countdown interval
        const intervalId = setInterval(() => {
            const expirationTime = parseInt(localStorage.getItem('verificationTimerExpiresAt'), 10);
            const remaining = Math.round((expirationTime - Date.now()) / 1000);

            if (remaining > 0) {
                setTimer(remaining);
            } else {
                setTimer(0);
                localStorage.removeItem('verificationTimerExpiresAt'); // Clean up expired timer
                clearInterval(intervalId);
            }
        }, 1000);

        // Cleanup function to clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Run only once on mount

    // This determines what text to show the user
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
            // SIMULATION: API Call to /api/verify
            console.log("Verifying code:", code, "for", credential);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // SIMULATE SUCCESS
            setSuccessMessage('تم تأكيد حسابك بنجاح! سيتم توجيهك لتسجيل الدخول.');
            setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            setError('فشلت عملية التأكيد. الرمز المدخل غير صحيح.');
            setIsSubmitting(false);
        }
    };

    const handleResend = () => {
        // SIMULATION: API call to resend code
        console.log("Resending code...");
        alert('تم إرسال رمز جديد.');

        // Reset the timer
        const newExpirationTime = Date.now() + TIMER_DURATION * 1000;
        localStorage.setItem('verificationTimerExpiresAt', newExpirationTime);
        setTimer(TIMER_DURATION);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    return (
        <div className="centered-page-container">
            <div className="form-container" style={{ maxWidth: '450px' }}>
                <h2>تأكيد حسابك</h2>
                <p className="form-subtitle" style={{ marginBottom: '25px' }}>
                    لقد أرسلنا رمز تأكيد إلى <strong>{verificationMethodText}</strong>:
                    <span style={{ direction: 'ltr', display: 'block', marginTop: '5px' }}>
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
                        <button className="link-style-btn" onClick={handleResend}>
                            إعادة إرسال الرمز
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;