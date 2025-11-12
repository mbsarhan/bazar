// src/frontend/pages/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, User as UserIcon, MoreVertical } from 'lucide-react';
import api from '../api';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import '../styles/Chat.css';

window.Pusher = Pusher;

const Chat = () => {
    const { userId } = useParams();
    const { user: loggedInUser, isLoading: isAuthLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [otherUser, setOtherUser] = useState(location.state?.otherUser || null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const hasScrolledRef = useRef(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const firstUnreadRef = useRef(null);

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }
        if (!loggedInUser) {
            navigate('/login');
        }
    }, [isAuthLoading, loggedInUser, navigate]);

    useEffect(() => {
        if (loggedInUser) {
            const markMessagesAsRead = async () => {
                try {
                    await api.post(`/chat/read/${userId}`);
                } catch (error) {
                    console.error('Error marking messages as read:', error);
                }
            };

            const fetchMessages = async () => {
                setIsMessagesLoading(true);
                try {
                    const response = await api.get(`/chat/messages/${userId}/${loggedInUser.id}`);
                    setMessages(response.data);

                    // --- FIXED: Mark messages as read AFTER successfully fetching them ---
                    await markMessagesAsRead();

                } catch (error) {
                    console.error("Error fetching messages:", error);
                } finally {
                    setIsMessagesLoading(false);
                }
            };

            fetchMessages();
        }
    }, [userId, loggedInUser]);

    // Scroll logic for messages
    useEffect(() => {
        if (isMessagesLoading || !loggedInUser || messages.length === 0) return;

        const firstUnreadMsg = messages.find(
            (msg) => msg.read_at === null && msg.receiver_id === loggedInUser.id
        );

        // Case 1: On first load, scroll to first unread if it exists
        if (!hasScrolledRef.current) {
            if (firstUnreadMsg && firstUnreadRef.current) {
                firstUnreadRef.current.scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                });
            } else {
                scrollToBottom('auto');
            }
            hasScrolledRef.current = true; // prevent re-scrolling
            return;
        }

        // Case 2: On new messages — only scroll if the user sent them or if we're near the bottom
        const lastMessage = messages[messages.length - 1];
        const isUserSender = lastMessage?.sender_id === loggedInUser.id;

        const container = messagesEndRef.current?.parentElement;
        const isNearBottom =
            container &&
            container.scrollHeight - container.scrollTop - container.clientHeight < 200;

        if (isUserSender || isNearBottom) {
            scrollToBottom('smooth');
        }
    }, [messages, isMessagesLoading, loggedInUser]);


    useEffect(() => {
        if (!loggedInUser) return;
        const echo = new Echo({
            broadcaster: 'reverb',
            key: 'ccgv9x8aeypbok8hfyor',
            wsHost: '127.0.0.1',
            wsPort: 8080,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
        });
        const channel = `chat.${loggedInUser.id}`;
        echo.channel(channel)
            .listen('.new-message', (event) => {
                if (event.sender_id === Number(userId)) {
                    setMessages(prevMessages => [...prevMessages, event]);
                }
            });
        return () => {
            echo.leave(channel);
        };
    }, [loggedInUser, userId]);

    // Auto-focus message input when user types anywhere
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore keys that shouldn't trigger typing
            const isModifier = e.ctrlKey || e.altKey || e.metaKey;
            if (isModifier) return;

            // Ignore navigation keys like arrows, tab, etc.
            if (["Shift", "Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Escape"].includes(e.key)) {
                return;
            }

            // If the input is not focused, focus it
            if (document.activeElement !== inputRef.current) {
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);


    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;
        setSending(true);
        const messageContent = newMessage.trim();
        const optimisticMessage = { id: `temp-${Date.now()}`, body: messageContent, sender_id: loggedInUser.id, receiver_id: parseInt(userId), created_at: new Date().toISOString() };
        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');
        try {
            const response = await api.post(`/chat/messages/${userId}`, { body: messageContent, sender_id: loggedInUser.id });
            setMessages(prev => prev.map(msg => msg.id === optimisticMessage.id ? response.data : msg));
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const scrollToBottom = (behavior = 'smooth') => { messagesEndRef.current?.scrollIntoView({ behavior }); };
    const formatTime = (timestamp) => { const date = new Date(timestamp); return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }); };
    const formatDate = (timestamp) => { const date = new Date(timestamp); const today = new Date(); if (date.toDateString() === today.toDateString()) return 'اليوم'; const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1); if (date.toDateString() === yesterday.toDateString()) return 'أمس'; return date.toLocaleDateString('ar-SA'); };
    const groupMessagesByDate = (messages) => { const groups = []; let currentDate = null; messages.forEach(message => { const messageDate = formatDate(message.created_at); if (messageDate !== currentDate) { currentDate = messageDate; groups.push({ date: messageDate, messages: [message] }); } else { groups[groups.length - 1].messages.push(message); } }); return groups; };

    let firstUnreadId = null;
    if (!isMessagesLoading && messages.length > 0 && loggedInUser) {
        const firstUnreadMsg = messages.find(msg => msg.read_at === null && msg.receiver_id === loggedInUser.id);
        if (firstUnreadMsg) { firstUnreadId = firstUnreadMsg.id; }
    }

    if (isAuthLoading || isMessagesLoading) {
        return (
            <div className="chat-page">
                <div className="chat-container">
                    <div className="chat-loading">
                        <div className="spinner"></div>
                        <p>جاري تحميل...</p>
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
                    <button className="chat-back-button" onClick={() => navigate('/conversations')}><ArrowLeft size={24} /></button>
                    <div className="chat-user-info">
                        {otherUser?.profilePicture ? (<img src={otherUser.profilePicture} alt="avatar" className="user-avatar" />) : (<div className="avatar-placeholder"><UserIcon size={20} /></div>)}
                        <div className="user-details">
                            <h3>{otherUser ? `${otherUser.fname} ${otherUser.lname}` : 'المستخدم'}</h3>
                            <span className="user-status">{otherUser && new Date() - new Date(otherUser.lastSeen) < 300000 ? 'متصل' : 'غير متصل'}</span>
                        </div>
                    </div>
                    <button className="chat-options-button"><MoreVertical size={20} /></button>
                </div>
                <div className="messages-container">
                    {messageGroups.length === 0 ? (
                        <div className="no-messages"><p>لا توجد رسائل بعد</p><span>ابدأ المحادثة بإرسال رسالة</span></div>
                    ) : (
                        messageGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="message-group">
                                <div className="date-separator"><span>{group.date}</span></div>
                                {group.messages.map((message) => (
                                    <React.Fragment key={message.id}>
                                        {/* Divider before the first unread message */}
                                        {message.id === firstUnreadId && (
                                            <div className="new-messages-divider">
                                                <span>رسائل جديدة</span>
                                            </div>
                                        )}

                                        <div
                                            ref={message.id === firstUnreadId ? firstUnreadRef : null}
                                            className={`message ${message.sender_id === loggedInUser.id ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-bubble">
                                                <p className="message-text">{message.body}</p>
                                                <span className="message-time">{formatTime(message.created_at)}</span>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form className="message-input-container" onSubmit={sendMessage}>
                    <input ref={inputRef} type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="اكتب رسالتك..." className="message-input" disabled={sending} dir="rtl" />
                    <button type="submit" className="send-button" disabled={!newMessage.trim() || sending}><Send size={20} /></button>
                </form>
            </div>
        </div>
    );
};

export default Chat;