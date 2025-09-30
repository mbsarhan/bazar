// src/frontend/components/Header.js (Reverted to simple, consistent version)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddAdClick = () => {
        if (user) {
            navigate('/add-ad');
        } else {
            navigate('/login', { state: { redirectTo: '/add-ad' } });
        }
    };

    const handleLogoClick = () => {
        // This function ensures clicking the logo on the homepage scrolls to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        // The header no longer has any conditional classes
        <header className="main-header">
            <div className="header-content">
                <Link to="/" className="logo" onClick={handleLogoClick}>
                    بازار
                </Link>
                <div className="header-actions">
                    <button onClick={handleAddAdClick} className="add-ad-btn">
                        + أضف إعلاناً
                    </button>
                    {user ? (
                        <Link to="/dashboard" className="user-link">{user.fname}</Link>
                    ) : (
                        <Link to="/login" className="login-link">تسجيل الدخول</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;