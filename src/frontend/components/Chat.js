// src/frontend/pages/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation  } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, User as UserIcon, MoreVertical } from 'lucide-react';
import api from '../api'; // <-- IMPORT YOUR CUSTOM AXIOS INSTANCE
import Echo from 'laravel-echo'; // <-- IMPORT ECHO
import Pusher from 'pusher-js'; // <-- IMPORT PUSHER
import '../styles/Chat.css';

window.Pusher = Pusher; // Make Pusher globally available for Echo

const Chat = () => {
    const { userId } = useParams();
    const { user: loggedInUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // To get state passed from Conversations page

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState(location.state?.otherUser || null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    // <-- FIX: Declare all necessary refs at the top of the component.
    const messagesContainerRef = useRef(null);
    
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // --- 1. DATA FETCHING FROM REAL API ---
    useEffect(() => {
        if (!loggedInUser) {
            navigate('/login');
            return;
        }

        const fetchMessages = async () => {
            try {
                const response = await api.get(`/chat/messages/${userId}/${loggedInUser.id}`);
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [userId, loggedInUser, navigate]);

    // --- 2. REAL-TIME LISTENER SETUP WITH ECHO ---
    useEffect(() => {
        // Don't subscribe until we have the logged-in user's info
        if (!loggedInUser) return;

        // Initialize Echo
        const echo = new Echo({
            broadcaster: 'reverb',
            key: 'dm0akxfkvqz9xaqmkaek', // Use your Vite env variables
            wsHost: '127.0.0.1',
            wsPort: 8080,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
        });

        // Subscribe to the PRIVATE channel for the logged-in user
        const channel = `chat.${loggedInUser.id}`;
        echo.channel(channel)
            .listen('.new-message', (event) => {
                console.log('Real-time message received:', event);

                // Add the new message to the chat ONLY if it's from the person we're currently chatting with
                if (event.sender_id == userId) {
                    setMessages(prevMessages => [...prevMessages, event]);
                }
            });
        
        console.log(`Subscribed to private channel: ${channel}`);

        // Clean up the subscription when the component unmounts
        return () => {
            console.log(`Leaving channel: ${channel}`);
            echo.leave(channel);
        };

    }, [loggedInUser, userId]); // Re-subscribe if the logged-in user or chat partner changes

    // --- 3. SEND MESSAGE TO REAL API ---
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        const messageContent = newMessage.trim();

        // Optimistic UI update: show the message immediately
        const optimisticMessage = {
            id: `temp-${Date.now()}`,
            body: messageContent,
            sender_id: loggedInUser.id,
            receiver_id: parseInt(userId),
            created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');

        try {
            const response = await api.post(`/chat/messages/${userId}`, {
                body: messageContent,
                sender_id: loggedInUser.id, // <-- add this line
            });
            
            // Replace the temporary message with the real one from the server
            setMessages(prev => prev.map(msg => 
                msg.id === optimisticMessage.id ? response.data : msg
            ));
        } catch (error) {
            console.error("Error sending message:", error);
            // Optionally remove the optimistic message on failure
            setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
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