// admin-panel/src/components/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/forms.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Call the login function from our context
            await login({ email, password });
            navigate('/'); // Navigate to dashboard on success
        } catch (err) {
            // The context's login function will throw an error on failure
            setError(err.response?.data?.message || 'فشل تسجيل الدخول.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="centered-page-container">
            <div className="form-container">
                <h2 style={{color: '#33363b'}}>لوحة تحكم بازار</h2>
                <p className="form-subtitle">يرجى تسجيل الدخول للمتابعة</p>
                
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">البريد الإلكتروني</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">كلمة المرور</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'جاري الدخول...' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;