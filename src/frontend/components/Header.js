// src/frontend/components/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation as useReactRouterLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation, countries } from '../context/LocationContext';
import { Plus, User, LogIn, MapPin, MessageSquare, ChevronDown } from 'lucide-react'; // Added ChevronDown
import '../styles/Header.css';

const Header = () => {
  const { user } = useAuth();
  const { country, setCountry } = useLocation();
  const navigate = useNavigate();
  const reactRouterLocation = useReactRouterLocation();
  const headerRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastFilterType, setLastFilterType] = useState(() => {
    return localStorage.getItem('lastFilterType') || 'cars';
  });
  
  // Get last selected mobile button from localStorage, default to 'add-ad'
  const [selectedMobileButton, setSelectedMobileButton] = useState(() => {
    return localStorage.getItem('selectedMobileButton') || 'add-ad';
  });

  // Effect to set the --header-height CSS variable
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      }
    };

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

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
    if (user) {
      navigate('/add-ad-choice');
    } else {
      navigate('/login', { state: { redirectTo: '/add-ad-choice' } });
    }
    setIsMobileMenuOpen(false);
    setSelectedMobileButton('add-ad');
    localStorage.setItem('selectedMobileButton', 'add-ad');
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
    setSelectedMobileButton('chat');
    localStorage.setItem('selectedMobileButton', 'chat');
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
    setSelectedMobileButton('profile');
    localStorage.setItem('selectedMobileButton', 'profile');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get the current button config based on selected state
  const getMobileButtonConfig = () => {
    switch (selectedMobileButton) {
      case 'chat':
        return {
          icon: MessageSquare,
          text: 'المحادثات',
          onClick: toggleMobileMenu,
          className: 'chat',
          showBadge: unreadCount > 0
        };
      case 'profile':
        return {
          icon: user ? User : LogIn,
          text: user ? user.fname : 'تسجيل الدخول',
          onClick: toggleMobileMenu,
          className: user ? 'user' : 'login',
          showBadge: false
        };
      default: // 'add-ad'
        return {
          icon: Plus,
          text: 'أضف إعلاناً',
          onClick: toggleMobileMenu,
          className: 'add-ad',
          showBadge: false
        };
    }
  };

  const currentButton = getMobileButtonConfig();
  const ButtonIcon = currentButton.icon;

  return (
    <header ref={headerRef} className={`modern-header ${isMobileMenuOpen ? 'menu-open' : ''} ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo Section */}
        <Link to={homeLink} className="logo-section" onClick={handleLogoClick}>
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.1" />
              <path d="M16 8L20 12L16 16L12 12L16 8Z" fill="currentColor" />
              <path d="M16 16L20 20L16 24L12 20L16 16Z" fill="currentColor" opacity="0.7" />
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
            <img
              src={country.flag}
              alt={country.name}
              style={{ width: 20, height: 14, marginRight: 6 }}
            />
            <select
              value={country.code}
              onChange={(e) => setCountry(e.target.value)}
              className="country-select"
            >
              {Object.values(countries).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.displayName}
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

        {/* Mobile Menu Toggle - Shows Last Clicked Button */}
        <button
          className={`mobile-menu-toggle ${currentButton.className}`}
          onClick={currentButton.onClick}
        >
          <ButtonIcon size={20} />
          <span>{currentButton.text}</span>
          {currentButton.showBadge && (
            <span className="mobile-toggle-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          {/* Chevron Icon Added Here */}
          <ChevronDown 
            size={18} 
            className={`dropdown-chevron ${isMobileMenuOpen ? 'open' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-item">
          <MapPin size={18} className="mobile-icon" />
          <img
            src={country.flag}
            alt={country.name}
            style={{ width: 20, height: 14, marginRight: 6 }}
          />
          <select
            value={country.code}
            onChange={(e) => {
              setCountry(e.target.value);
              setIsMobileMenuOpen(false);
            }}
            className="mobile-country-select"
          >
            {Object.values(countries).map((c) => (
              <option key={c.code} value={c.code}>
                {c.displayName}
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
          <button onClick={handleProfileClick} className="mobile-menu-button user">
            <User size={20} />
            <span>{user.fname}</span>
          </button>
        ) : (
          <button onClick={handleProfileClick} className="mobile-menu-button login">
            <LogIn size={20} />
            <span>تسجيل الدخول</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;