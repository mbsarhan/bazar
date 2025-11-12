// src/frontend/pages/Conversations.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// FIXED: Re-added ChevronLeft as it is used in the CSS for a back button
import { MessageSquare, Search, Clock, User as UserIcon, ChevronLeft } from 'lucide-react';
import api from '../api';
import '../styles/Conversations.css';
import Echo from 'laravel-echo';

const Conversations = () => {
    const { user: loggedInUser } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (!loggedInUser) {
        navigate('/login');
        return;
    }

    const fetchConversations = async () => {
        try {
            const response = await api.get('/chat/conversations');
            setConversations(response.data);
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchConversations();

    // --- Setup real-time updates ---
    const echo = new Echo({
        broadcaster: 'reverb',
        key: 'rjd1p6mdpoowjxbenvzg',
        wsHost: '127.0.0.1',
        wsPort: 8080,
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
    });

    const channel = `chat.${loggedInUser.id}`;
    echo.channel(channel).listen('.new-message', (event) => {
        setConversations(prev => {
            const updated = [...prev];
            const index = updated.findIndex(conv => conv.user.id === event.sender_id);

            const newLastMessage = {
                body: event.body,
                sender_id: event.sender_id,
                created_at: event.created_at,
            };

            if (index !== -1) {
                // Update existing conversation
                const conv = { ...updated[index] };
                conv.last_message = newLastMessage;
                conv.unread_count = (conv.unread_count || 0) + 1;

                // Move to top
                updated.splice(index, 1);
                updated.unshift(conv);
            } else {
                // New conversation
                updated.unshift({
                    user: event.sender,
                    last_message: newLastMessage,
                    unread_count: 1,
                });
            }

            return updated;
        });
    });

    return () => {
        echo.leave(channel);
    };
}, [loggedInUser, navigate]);

    const filteredConversations = conversations.filter(conv => {
        const fullName = `${conv.user.fname || ''} ${conv.user.lname || ''}`.toLowerCase();
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
                if (minutes < 1) return 'الآن';
                return `منذ ${minutes} دقيقة`;
            }
            return `منذ ${hours} ساعة`;
        } else if (days === 1) {
            return 'أمس';
        } else {
            return date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
        }
    };

    const handleConversationClick = (otherUser) => {
        navigate(`/chat/${otherUser.id}`, { state: { otherUser } });
    };

    if (loading) {
        return (
            <div className="conversations-page">
                {/* FIXED: Changed className to match CSS */}
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>جاري تحميل المحادثات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="conversations-page">
            <div className="conversations-container">
                <div className="conversations-header">
                    {/* FIXED: Rebuilt header structure to match CSS (.header-top, .back-button, h1) */}
                    <div className="header-top">
                        <button className="back-button" onClick={() => navigate(-1)}>
                            <ChevronLeft size={24} />
                        </button>
                        <h1>المحادثات</h1>
                    </div>
                    {/* FIXED: Changed className to match CSS */}
                    <div className="search-bar">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="ابحث عن محادثة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="conversations-list">
                    {filteredConversations.length === 0 && !loading ? (
                        <div className="no-conversations">
                           <MessageSquare size={48} />
                           <h3>لا توجد محادثات</h3>
                           <p>عندما تبدأ محادثة جديدة، ستظهر هنا.</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <div
                                key={conv.user.id}
                                className={`conversation-item ${conv.unread_count > 0 ? 'unread' : ''}`}
                                onClick={() => handleConversationClick(conv.user)}
                            >
                                <div className="conversation-avatar">
                                    <div className="avatar-placeholder">
                                        <UserIcon size={24} />
                                    </div>
                                    {conv.unread_count > 0 && (
                                        <span className="unread-indicator">
                                            {conv.unread_count > 99 ? '99+' : conv.unread_count}
                                        </span>
                                    )}
                                </div>
                                <div className="conversation-content">
                                    <div className="conversation-header-info">
                                        <h3>{`${conv.user.fname || ''} ${conv.user.lname || ''}`}</h3>
                                        {conv.last_message && (
                                            <span className="conversation-time">
                                                <Clock size={14} />
                                                {formatTime(conv.last_message.created_at)}
                                            </span>
                                        )}
                                    </div>
                                    {conv.last_message && (
                                        <p className="last-message">
                                            {conv.last_message.sender_id === loggedInUser.id ? 'أنت: ' : ''}
                                            {conv.last_message.body}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Conversations;