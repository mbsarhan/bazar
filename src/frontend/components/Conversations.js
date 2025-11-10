// src/frontend/pages/Conversations.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Search, ChevronLeft, User as UserIcon } from 'lucide-react';
import api from '../api';
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
    }, [user, navigate]);

    const handleConversationClick = (otherUser) => {
        navigate(`/chat/${otherUser.id}`, { state: { otherUser } });
    };

    const filteredConversations = conversations.filter(conv => {
        const fullName = `${conv.fname || ''} ${conv.lname || ''}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

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
                        filteredConversations.map((conv) => (
                            <div
                                key={conv.id}
                                className="conversation-item"
                                onClick={() => handleConversationClick(conv)}
                            >
                                <div className="conversation-avatar">
                                    <div className="avatar-placeholder">
                                        <UserIcon size={24} />
                                    </div>
                                </div>
                                <div className="conversation-content">
                                    <div className="conversation-header-info">
                                        <h3>{`${conv.fname || ''} ${conv.lname || ''}`}</h3>
                                    </div>
                                    <p className="last-message">Click to view chat history</p>
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