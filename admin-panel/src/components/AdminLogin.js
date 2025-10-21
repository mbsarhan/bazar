import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/forms.css';

const AdminLogin = () => {
    const { login, admin } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This useEffect is no longer needed here, as the PublicRoute in App.js handles the redirect.
    // useEffect(() => {
    //     if (admin) {
    //         navigate('/');
    //     }
    // }, [admin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // This calls the login function from your AuthContext.
            // The navigation will happen automatically when the 'admin' state changes
            // and the Protected/Public routes re-evaluate.
            await login({ email, password });
            
            // We can still navigate here for an immediate redirect
            navigate('/');

        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
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