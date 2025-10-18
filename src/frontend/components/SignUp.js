// src/frontend/components/SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/forms.css';
import api from '../api';

const TIMER_DURATION = 120;

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Added for button state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين.');
            return;
        }

        const isEmail = credential.includes('@');
        const registrationType = 'account'; 
        const email = isEmail ? credential : null; // Use null for empty fields for backend clarity
        const phone = !isEmail ? credential : null;

        const formData = {
            fname: firstName,
            lname: lastName,
            email: email,
            phone: phone,
            password: password,
            password_confirmation: confirmPassword,
        };

        setIsSubmitting(true);
        try {
            // Using your api instance for the registration call
            await api.post('/register', formData);

            // --- THIS IS THE GUARANTEED FIX ---
            // 1. On successful registration, immediately set the timer's expiration time.
            const newExpirationTime = Date.now() + TIMER_DURATION * 1000;
            localStorage.setItem('verificationTimerExpiresAt', newExpirationTime);
            // --- END OF FIX ---

            // 2. Navigate to the verification page, passing the necessary state
            navigate('/verification', { 
                state: { 
                    credential: credential,
                    type: registrationType 
                } 
            });

        } catch (err) {
            let errorMessage = 'فشل إنشاء الحساب.';
            if (err.response?.data) {
                if (err.response.data.errors) {
                    errorMessage = Object.values(err.response.data.errors).flat().join('\n');
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
            }
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="centered-page-container">
            <div className="form-container">
                <h2>إنشاء حساب جديد</h2>
                {error && <div className="error-message" style={{ whiteSpace: 'pre-line' }}>{error}</div>}
                
                {/* Removed the success message as we are navigating away */}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">الاسم الأول</label>
                            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">اسم العائلة</label>
                            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="credential">البريد الإلكتروني أو رقم هاتف سوري</label>
                        <input type="text" id="credential" value={credential} onChange={(e) => setCredential(e.target.value)} placeholder="example@mail.com or 09********" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">كلمة المرور</label>
                        <div className="input-with-icon">
                            <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <span className={`password-toggle-icon ${showPassword ? 'visible' : 'hidden'}`} onClick={() => setShowPassword(!showPassword)}></span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                        <div className="input-with-icon">
                            <input type={showPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            <span className={`password-toggle-icon ${showPassword ? 'visible' : 'hidden'}`} onClick={() => setShowPassword(!showPassword)}></span>
                        </div>
                    </div>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء حساب'}
                    </button>
                </form>
                <div className="form-link">
                    لديك حساب بالفعل؟ <Link to="/login">سجل الدخول</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;