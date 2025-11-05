// src/frontend/pages/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, User as UserIcon, MoreVertical } from 'lucide-react';
import { mockUsers, mockMessages } from './mockChatData';
import '../styles/Chat.css';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Simulate loading delay
    setTimeout(() => {
      loadMockData();
    }, 300);
  }, [userId, user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMockData = () => {
    // Find the user
    const foundUser = mockUsers.find(u => u.id === parseInt(userId));
    if (foundUser) {
      setOtherUser(foundUser);
    }
    
    // Load messages for this user
    const userMessages = mockMessages[parseInt(userId)] || [];
    setMessages(userMessages);
    setLoading(false);
    
    // Mark messages as read (mock)
    const updatedMessages = userMessages.map(msg => {
      if (msg.receiver_id === 999 && !msg.read_at) {
        return { ...msg, read_at: new Date().toISOString() };
      }
      return msg;
    });
    setMessages(updatedMessages);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage('');
    
    // Create new message
    const newMsg = {
      id: Date.now(),
      body: messageContent,
      sender_id: 999, // Mock current user ID
      receiver_id: parseInt(userId),
      created_at: new Date().toISOString(),
      read_at: null
    };
    
    // Add to messages
    setMessages(prev => [...prev, newMsg]);
    
    // Simulate sending delay
    setTimeout(() => {
      setSending(false);
      inputRef.current?.focus();
    }, 500);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'اليوم';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'أمس';
    }
    
    return date.toLocaleDateString('ar-SA');
  };

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    
    messages.forEach(message => {
      const messageDate = formatDate(message.created_at);
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          date: messageDate,
          messages: [message]
        });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });
    
    return groups;
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="chat-container">
          <div className="chat-loading">
            <div className="spinner"></div>
            <p>جاري تحميل المحادثة...</p>
          </div>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <button 
            className="chat-back-button" 
            onClick={() => navigate('/conversations')}
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="chat-user-info">
            {otherUser?.profilePicture ? (
              <img 
                src={otherUser.profilePicture} 
                alt="avatar" 
                className="user-avatar"
              />
            ) : (
              <div className="avatar-placeholder">
                <UserIcon size={20} />
              </div>
            )}
            <div className="user-details">
              <h3>{otherUser ? `${otherUser.fname} ${otherUser.lname}` : 'المستخدم'}</h3>
              <span className="user-status">
                {otherUser && new Date() - new Date(otherUser.lastSeen) < 300000 
                  ? 'متصل' 
                  : 'غير متصل'}
              </span>
            </div>
          </div>

          <button className="chat-options-button">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="messages-container" ref={messagesContainerRef}>
          {messageGroups.length === 0 ? (
            <div className="no-messages">
              <p>لا توجد رسائل بعد</p>
              <span>ابدأ المحادثة بإرسال رسالة</span>
            </div>
          ) : (
            messageGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="message-group">
                <div className="date-separator">
                  <span>{group.date}</span>
                </div>
                {group.messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`message ${
                      message.sender_id === 999 ? 'sent' : 'received'
                    }`}
                  >
                    <div className="message-bubble">
                      <p className="message-text">{message.body}</p>
                      <span className="message-time">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-input-container" onSubmit={sendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="message-input"
            disabled={sending}
            dir="rtl"
          />
          <button 
            type="submit" 
            className="send-button" 
            disabled={!newMessage.trim() || sending}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;