// src/frontend/components/Header.js (Reverted to simple, consistent version)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation as useReactRouterLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation, countries } from '../context/LocationContext';
import '../styles/Header.css';
import { Globe } from 'lucide-react';

const Header = () => {
    const { user } = useAuth();
    const { country, setCountry } = useLocation();
    const navigate = useNavigate();
    const reactRouterLocation = useReactRouterLocation();

    const [lastFilterType, setLastFilterType] = useState(() => {
        // On initial load, try to get it from localStorage, default to 'cars'
        return localStorage.getItem('lastFilterType') || 'cars';
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(reactRouterLocation.search);
        const currentType = searchParams.get('type');
        
        // If the URL has a type (e.g., '/ads?type=real-estate'), save it.
        if (currentType === 'cars' || currentType === 'real-estate') {
            localStorage.setItem('lastFilterType', currentType);
            setLastFilterType(currentType);
        }
    }, [reactRouterLocation.search]);

    const homeLink = `/ads?type=${lastFilterType}`;

    const handleAddAdClick = () => {
        if (user) {
            navigate('/add-ad');
        } else {
            navigate('/login', { state: { redirectTo: '/add-ad' } });
        }
    };

    const handleLogoClick = () => {
        // We still keep this to scroll to top if already on an ads page
        if (window.location.pathname.startsWith('/ads')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        // The header no longer has any conditional classes
        <header className="main-header">
            <div className="header-content">
                <Link to={homeLink} className="logo" onClick={handleLogoClick}>
                    ديّلها
                </Link>
                <div className="header-actions">
                    <div className="country-selector">
                        <Globe size={20} />
                        <select
                            value={country.code}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            {Object.values(countries).map((countryOption) => (
                                <option key={countryOption.code} value={countryOption.code}>
                                    {/* --- THIS IS THE FIX --- */}
                                    {/* Display the Arabic name to the user */}
                                    {countryOption.displayName}
                                </option>
                            ))}
                        </select>
                    </div>
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