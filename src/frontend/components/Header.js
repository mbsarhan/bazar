// src/frontend/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation as useReactRouterLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation, countries } from '../context/LocationContext';
import { Plus, User, LogIn, Menu, X, MapPin, MessageSquare } from 'lucide-react';
import '../styles/Header.css';

const Header = () => {
  const { user } = useAuth();
  const { country, setCountry } = useLocation();
  const navigate = useNavigate();
  const reactRouterLocation = useReactRouterLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastFilterType, setLastFilterType] = useState(() => {
    return localStorage.getItem('lastFilterType') || 'cars';
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      // You can implement unread count if needed in backend
      // For now, we'll skip this or you can add an endpoint
    }
  }, [user]);

  useEffect(() => {
    const searchParams = new URLSearchParams(reactRouterLocation.search);
    const currentType = searchParams.get('type');
    if (currentType === 'cars' || currentType === 'real-estate') {
      localStorage.setItem('lastFilterType', currentType);
      setLastFilterType(currentType);
    }
  }, [reactRouterLocation.search]);

  const homeLink = `/ads?type=${lastFilterType}`;

  const handleAddAdClick = () => {
    const currentPath = reactRouterLocation.pathname;
    if (currentPath.includes('/dashboard')) {
      navigate('/', { state: { fromDashboard: true } });
    } else {
      if (user) {
        navigate('/', { state: { fromAddAd: true } });
      } else {
        navigate('/login', { state: { redirectTo: '/', fromAddAd: true } });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (window.location.pathname.startsWith('/ads')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChatClick = () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/conversations' } });
    } else {
      navigate('/conversations');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo Section */}
        <Link to={homeLink} className="logo-section" onClick={handleLogoClick}>
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.1"/>
              <path d="M16 8L20 12L16 16L12 12L16 8Z" fill="currentColor"/>
              <path d="M16 16L20 20L16 24L12 20L16 16Z" fill="currentColor" opacity="0.7"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-main">ديّلها</span>
            <span className="logo-sub">سوق السيارات والعقارات</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <div className="nav-item country-selector-wrapper">
            <MapPin size={18} className="nav-icon" />
            <select
              value={country.code}
              onChange={(e) => setCountry(e.target.value)}
              className="country-select"
            >
              {Object.values(countries).map((countryOption) => (
                <option key={countryOption.code} value={countryOption.code}>
                  {countryOption.displayName}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleAddAdClick} className="add-ad-button">
            <Plus size={18} />
            <span>أضف إعلاناً</span>
          </button>

          <button onClick={handleChatClick} className="chat-button">
            <MessageSquare size={18} />
            <span>المحادثات</span>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </button>

          {user ? (
            <Link to="/dashboard" className="user-profile-button">
              <User size={18} />
              <span>{user.fname}</span>
            </Link>
          ) : (
            <Link to="/login" className="login-button">
              <LogIn size={18} />
              <span>تسجيل الدخول</span>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-item">
          <MapPin size={18} className="mobile-icon" />
          <select
            value={country.code}
            onChange={(e) => {
              setCountry(e.target.value);
              setIsMobileMenuOpen(false);
            }}
            className="mobile-country-select"
          >
            {Object.values(countries).map((countryOption) => (
              <option key={countryOption.code} value={countryOption.code}>
                {countryOption.displayName}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleAddAdClick} className="mobile-menu-button add-ad">
          <Plus size={20} />
          <span>أضف إعلاناً</span>
        </button>

        <button onClick={handleChatClick} className="mobile-menu-button chat">
          <MessageSquare size={20} />
          <span>المحادثات</span>
          {unreadCount > 0 && (
            <span className="mobile-unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
          )}
        </button>

        {user ? (
          <Link 
            to="/dashboard" 
            className="mobile-menu-button user"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User size={20} />
            <span>{user.fname}</span>
          </Link>
        ) : (
          <Link 
            to="/login" 
            className="mobile-menu-button login"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LogIn size={20} />
            <span>تسجيل الدخول</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;