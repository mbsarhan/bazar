import React, { useState } from 'react';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import '../styles/forms.css';

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(''); // This will now always be a string
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); //commented for wating

    const location = useLocation();
    const from = location.state?.redirectTo || '/login';

    const api_url = 'http://127.0.0.1:8000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين.'); // Set as a plain string
            return;
        }

        const isEmail = credential.includes('@');
        const email = isEmail ? credential : '';
        const phone = !isEmail ? credential : '';

        const formData = {
            fname: firstName,
            lname: lastName,
            email: email,
            phone: phone,
            password: password,
            password_confirmation: confirmPassword,
        };

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
                    errorMessage = Object.values(result.errors).flat().join('\n'); // Join with newline characters instead of <br>
                }
                throw new Error(errorMessage);
            }

            setSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
            navigate(from, { replace: true });

        } catch (err) {
            setError(err.message); // Set the error as a plain string
        }
    };

    return (
        <div className="centered-page-container">
            <div className="form-container">
                <h2>إنشاء حساب جديد</h2>
                {/* We render the error directly inside a div, using CSS for formatting */}
                {error && <div className="error-message" style={{ whiteSpace: 'pre-line' }}>{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    {/* The rest of your form JSX remains exactly the same */}
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
                    <button type="submit" className="submit-btn">إنشاء حساب</button>
                </form>
                <div className="form-link">
                    لديك حساب بالفعل؟ <Link to="/login">سجل الدخول</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;