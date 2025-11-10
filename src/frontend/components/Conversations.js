// src/frontend/pages/Conversations.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Clock, Search, ChevronLeft, User as UserIcon } from 'lucide-react';
import api from '../api';
import '../styles/Conversations.css';

const Conversations = () => {
    const { user: loggedInUser } = useAuth(); // Renamed for clarity
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
    }, [loggedInUser, navigate]);

    const handleConversationClick = (otherUser) => {
        navigate(`/chat/${otherUser.id}`, { state: { otherUser } });
    };

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

    // <-- FIX: The loading state JSX was missing. It is now restored.
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
                        <button className="back-button" onClick={() => navigate(-1)}>
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
                        // --- THIS IS THE UPDATED MAPPING LOGIC ---
                        filteredConversations.map((conv) => (
                            <div
                                key={conv.user.id}
                                className={`conversation-item ${conv.unread_count > 0 ? 'unread' : ''}`}
                                onClick={() => handleConversationClick(conv.user)}
                            >
                                <div className="conversation-avatar">
                                    {/* Replace with conv.user.profilePicture if you add it */}
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
                                            {/* Check if the logged-in user sent the last message */}
                                            {conv.last_message.sender_id === loggedInUser.id ? 'أنت: ' : ''}
                                            {conv.last_message.body}
                                        </p>
                                    )}
                                    {/* We can add ad reference back later if needed */}
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