// src/frontend/components/Header.js
import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { Link, useNavigate, useLocation as useReactRouterLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation, countries } from '../context/LocationContext';
import { Plus, User, LogIn, MapPin, MessageSquare, ChevronDown, Bell, X } from 'lucide-react'; // Added ChevronDown
import api from '../api'; // <--- IMPORT THE CUSTOM API INSTANCE
import Echo from 'laravel-echo'; // Added this import
import Pusher from 'pusher-js';
import '../styles/Header.css';

// Configure Pusher for Reverb globally (required for Echo to work)
window.Pusher = Pusher;

const Header = () => {
  const { user } = useAuth();
  const { country, setCountry } = useLocation();
  const navigate = useNavigate();
  const reactRouterLocation = useReactRouterLocation();
  const headerRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  // State for Real-time Notification Toast
  const [notification, setNotification] = useState(null); // { sender: string, body: string } | null
  const [lastFilterType, setLastFilterType] = useState(() => {
    return localStorage.getItem('lastFilterType') || 'cars';
  });
  
  // Get last selected mobile button from localStorage, default to 'add-ad'
  const [selectedMobileButton, setSelectedMobileButton] = useState(() => {
    return localStorage.getItem('selectedMobileButton') || 'add-ad';
  });



  // --- 1. Define Fetch Count Function (Memoized) ---
  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const response = await api.get('/chat/unread-count');
      if (response.data && typeof response.data.count !== 'undefined') {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching unread messages count:", error);
    }
  }, [user]);

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

  // --- 2. Initial Fetch & Polling Fallback ---
  useEffect(() => {
    fetchUnreadCount(); // Initial fetch
    
    // Poll as a fallback every 60s
    let intervalId;
    if (user) {
      intervalId = setInterval(fetchUnreadCount, 60000); 
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, fetchUnreadCount]);

  // --- 3. WebSocket Listener (Reverb/Echo) ---
  useEffect(() => {
    if (!user) return;

    // Initialize Echo with Reverb configuration
    const echo = new Echo({
        broadcaster: 'reverb',
        key: 'rjd1p6mdpoowjxbenvzg', // Your App Key
        wsHost: '127.0.0.1',         // Your Host
        wsPort: 8080,                // Your Port
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
    });

    const channelName = `chat.${user.id}`; // Usually 'chat.' + User ID

    // Listen for the event
    echo.channel(channelName)
        // Note: Assuming your backend event is broadcastAs 'new-message' 
        // OR using the default class name. Adjust the string below if needed.
        // Based on your snippet:
        .listen('.new-message', (event) => {
            console.log("New Message Received:", event);

            // 1. Refresh the red badge number immediately
            fetchUnreadCount();

            // 2. Trigger the "Cool Notification"
            // We verify the sender is NOT the current user (just in case)
            if (event && event.sender_id !== user.id) {
                setNotification({
                    sender: event.sender ? event.sender.fname : 'New Message',
                    body: event.body || 'You received a new message',
                    id: event.id // Helper for navigation if needed
                });

                // 3. Clear notification automatically after 3.5 seconds (allow animation time)
                setTimeout(() => {
                    setNotification(null);
                }, 3500);
            }
        });

    // Cleanup: Leave channel on unmount
    return () => {
        echo.leave(channelName);
    };
  }, [user, fetchUnreadCount]);

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
    setNotification(null); // clear notification if clicking chat
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
    <>
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
    {/* --- NOTIFICATION TOAST UI (Updated Colors) --- */}
      {notification && (
        <div className="message-notification-toast" onClick={handleChatClick}>
          <div className="toast-icon">
            {/* Keep Icon White because the bg circle is now your green gradient */}
            <Bell size={18} color="white" />
          </div>
          <div className="toast-content">
            <span className="toast-sender">{notification.sender}</span>
            <span className="toast-body">
               {notification.body ? (notification.body.length > 35 ? notification.body.substring(0, 35) + '...' : notification.body) : 'رسالة جديدة'}
            </span>
          </div>
          {/* CHANGE: Color to #666 to see it on white bg */}
          <button className="toast-close" onClick={(e) => { e.stopPropagation(); setNotification(null); }}>
            <X size={16} color="#666" />
          </button>
        </div>
      )}
    </>
  );
};

export default Header;