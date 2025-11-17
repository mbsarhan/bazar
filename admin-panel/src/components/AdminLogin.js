import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/forms.css';

const AdminLogin = () => {
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login({ credential, password });
            // On successful admin login, navigate to the dashboard/manage-ads page
            navigate('/manage-ads');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed.');
            console.log(err);
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
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
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