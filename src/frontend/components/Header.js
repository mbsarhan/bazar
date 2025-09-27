// src/components/Header.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css'; // ملف أنماط جديد

const Header = () => {
    const { user, isDashboardCollapsed } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isDashboardPage = location.pathname.startsWith('/dashboard');

    const handleAddAdClick = () => {
        if (user) {
            navigate('/add-ad');
        } else {
            // سنمرر معلومة إضافية لصفحة تسجيل الدخول
            // لتخبرها إلى أين يجب أن تعود بعد النجاح
            navigate('/login', { state: { redirectTo: '/add-ad' } });
        }
    };

    const handleLogoClick = () => {
        if (location.pathname === '/') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        // 3. Apply a conditional class to the header
        <header className={`main-header ${isDashboardPage ? 'on-dashboard' : ''} ${isDashboardCollapsed ? 'collapsed' : ''}`}>
            <div className="header-content">
                <Link to="/" className="logo" onClick={handleLogoClick}>
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