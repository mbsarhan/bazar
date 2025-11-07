// src/frontend/pages/Conversations.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Search, Clock, User as UserIcon, ChevronLeft } from 'lucide-react';
import { mockUsers, mockMessages, mockAds } from './mockChatData';
import '../styles/Conversations.css';

const Conversations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Simulate loading delay
    setTimeout(() => {
      loadMockConversations();
    }, 500);
  }, [user, navigate]);

  const loadMockConversations = () => {
    // Create conversations from mock data
    const mockConversations = mockUsers.map(mockUser => {
      const messages = mockMessages[mockUser.id] || [];
      const lastMessage = messages[messages.length - 1] || null;
      
      // Count unread messages (where receiver is current user and not read)
      const unreadCount = messages.filter(
        msg => msg.receiver_id === 999 && !msg.read_at
      ).length;
      
      return {
        ...mockUser,
        lastMessage,
        unreadCount,
        adTitle: mockAds[mockUser.id]
      };
    });
    
    // Sort by last message time
    mockConversations.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at);
    });
    
    setConversations(mockConversations);
    setLoading(false);
  };

  const filteredConversations = conversations.filter(conv => {
    const fullName = `${conv.fname || ''} ${conv.lname || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        if (minutes === 0) return 'الآن';
        return `منذ ${minutes} دقيقة`;
      }
      return `منذ ${hours} ساعة`;
    } else if (days === 1) {
      return 'أمس';
    } else if (days < 7) {
      return `منذ ${days} أيام`;
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  const handleConversationClick = (otherUserId) => {
    navigate(`/chat/${otherUserId}`);
  };

  if (loading) {
    return (
      <div className="conversations-page">
        <div className="conversations-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>جاري تحميل المحادثات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="conversations-page">
      <div className="conversations-container">
        <div className="conversations-header">
          <div className="header-top">
            <button 
              className="back-button" 
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={24} />
            </button>
            <h1>المحادثات</h1>
          </div>
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="البحث عن محادثة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              dir="rtl"
            />
          </div>
        </div>

        <div className="conversations-list">
          {filteredConversations.length === 0 && !loading ? (
            <div className="no-conversations">
              <MessageSquare size={64} />
              <h3>لا توجد محادثات</h3>
              <p>ابدأ محادثة جديدة من خلال التواصل مع أصحاب الإعلانات</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {              
              return (
                <div
                  key={conv.id}
                  className={`conversation-item ${conv.unreadCount > 0 ? 'unread' : ''}`}
                  onClick={() => handleConversationClick(conv.id)}
                >
                  <div className="conversation-avatar">
                    {conv.profilePicture ? (
                      <img src={conv.profilePicture} alt="avatar" />
                    ) : (
                      <div className="avatar-placeholder">
                        <UserIcon size={24} />
                      </div>
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="unread-indicator">
                        {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <div className="conversation-content">
                    <div className="conversation-header-info">
                      <h3>{`${conv.fname || ''} ${conv.lname || ''}`}</h3>
                      {conv.lastMessage && (
                        <span className="conversation-time">
                          <Clock size={14} />
                          {formatTime(conv.lastMessage.created_at)}
                        </span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="last-message">
                        {conv.lastMessage.sender_id === 999 ? 'أنت: ' : ''}
                        {conv.lastMessage.body}
                      </p>
                    )}
                    {conv.adTitle && (
                      <span className="ad-reference">
                        بخصوص: {conv.adTitle}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;