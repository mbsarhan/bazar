// src/frontend/components/SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/forms.css';

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

    const api_url = 'http://127.0.0.1:8000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين.');
            return;
        }

        const isEmail = credential.includes('@');
        const registrationType = isEmail ? 'email' : 'phone';
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
            const response = await fetch(`${api_url}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                let errorMessage = result.message || 'فشل إنشاء الحساب.';
                if (result.errors) {
                    errorMessage = Object.values(result.errors).flat().join('\n');
                }
                throw new Error(errorMessage);
            }

            // --- THIS IS THE CORRECTED LOGIC ---
            // On successful registration, navigate to the verification page
            navigate('/verify-account', { 
                state: { 
                    credential: credential,
                    type: registrationType 
                } 
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false); // Re-enable the button
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