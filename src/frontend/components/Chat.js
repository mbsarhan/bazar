// src/frontend/pages/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation  } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, User as UserIcon, MoreVertical } from 'lucide-react';
import api from '../api';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import '../styles/Chat.css';

window.Pusher = Pusher;

const Chat = () => {
    const { userId } = useParams();
    const { user: loggedInUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [otherUser, setOtherUser] = useState(location.state?.otherUser || null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesContainerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    
    // --- 1. NEW REF for the first unread message ---
    const firstUnreadRef = useRef(null);

    useEffect(() => {
        if (!loggedInUser) {
            navigate('/login');
            return;
        }

        const fetchMessages = async () => {
            setLoading(true); // Ensure loading is true at the start
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

    // --- 2. MODIFIED useEffect for smart scrolling ---
    useEffect(() => {
        // Only trigger scroll logic after the initial message load is complete
        if (loading) {
            return;
        }
        
        // If the special ref for the first unread message has been attached to an element...
        if (firstUnreadRef.current) {
            // ...scroll that element into the center of the view.
            firstUnreadRef.current.scrollIntoView({
                block: 'center',
                behavior: 'auto' // Use 'auto' for initial load for instant positioning
            });
        } else {
            // Otherwise, just scroll to the very bottom.
            scrollToBottom('auto');
        }
    // We only want this to run ONCE after loading is finished.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);


    useEffect(() => {
        // This separate effect handles smooth scrolling for NEW messages (sent or received)
        if (!loading) { // Don't scroll on initial load, let the other effect handle it
             scrollToBottom('smooth');
        }
    }, [messages, loading]);


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

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        const messageContent = newMessage.trim();

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
                sender_id: loggedInUser.id,
            });
            
            setMessages(prev => prev.map(msg => 
                msg.id === optimisticMessage.id ? response.data : msg
            ));
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    // --- 3. MODIFIED scrollToBottom to accept a behavior parameter ---
    const scrollToBottom = (behavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return 'اليوم';
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) return 'أمس';
        return date.toLocaleDateString('ar-SA');
    };

    const groupMessagesByDate = (messages) => {
        const groups = [];
        let currentDate = null;
        messages.forEach(message => {
            const messageDate = formatDate(message.created_at);
            if (messageDate !== currentDate) {
                currentDate = messageDate;
                groups.push({ date: messageDate, messages: [message] });
            } else {
                groups[groups.length - 1].messages.push(message);
            }
        });
        return groups;
    };

    // --- 4. FIND the ID of the first unread message before rendering ---
    let firstUnreadId = null;
    if (!loading && messages.length > 0 && loggedInUser) {
        // Find the first message that was sent TO me and is unread
        const firstUnreadMsg = messages.find(
            msg => msg.read_at === null && msg.receiver_id === loggedInUser.id
        );
        if (firstUnreadMsg) {
            firstUnreadId = firstUnreadMsg.id;
        }
    }


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
                    {/* ... header JSX is unchanged ... */}
                    <button className="chat-back-button" onClick={() => navigate('/conversations')}><ArrowLeft size={24} /></button>
                    <div className="chat-user-info">
                        {otherUser?.profilePicture ? (<img src={otherUser.profilePicture} alt="avatar" className="user-avatar"/>) : (<div className="avatar-placeholder"><UserIcon size={20} /></div>)}
                        <div className="user-details">
                            <h3>{otherUser ? `${otherUser.fname} ${otherUser.lname}` : 'المستخدم'}</h3>
                            <span className="user-status">{otherUser && new Date() - new Date(otherUser.lastSeen) < 300000 ? 'متصل' : 'غير متصل'}</span>
                        </div>
                    </div>
                    <button className="chat-options-button"><MoreVertical size={20} /></button>
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
                                <div className="date-separator"><span>{group.date}</span></div>
                                {group.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        // --- 5. CONDITIONALLY ATTACH the special ref ---
                                        ref={message.id === firstUnreadId ? firstUnreadRef : null}
                                        className={`message ${message.sender_id === loggedInUser.id ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-bubble">
                                            <p className="message-text">{message.body}</p>
                                            <span className="message-time">{formatTime(message.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="message-input-container" onSubmit={sendMessage}>
                    {/* ... form JSX is unchanged ... */}
                    <input ref={inputRef} type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="اكتب رسالتك..." className="message-input" disabled={sending} dir="rtl"/>
                    <button type="submit" className="send-button" disabled={!newMessage.trim() || sending}><Send size={20} /></button>
                </form>
            </div>
        </div>
    );
};

export default Chat;