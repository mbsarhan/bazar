// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css'; // ملف أنماط جديد

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddAdClick = () => {
        if (user) {
            navigate('/add-ad');
        } else {
            // سنمرر معلومة إضافية لصفحة تسجيل الدخول
            // لتخبرها إلى أين يجب أن تعود بعد النجاح
            navigate('/login', { state: { redirectTo: '/add-ad' } });
        }
    };

    return (
        <header className="main-header">
            <div className="header-content">
                <Link to="/" className="logo">
                    بازار
                </Link>
                <div className="header-actions">
                    <button onClick={handleAddAdClick} className="add-ad-btn">
                        + أضف إعلاناً
                    </button>
                    {user ? (
                        <Link to="/dashboard" className="user-link">{user.name}</Link>
                    ) : (
                        <Link to="/login" className="login-link">تسجيل الدخول</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;