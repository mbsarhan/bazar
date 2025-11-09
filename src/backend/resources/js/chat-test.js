// resources/js/chat-test.js

// Import the libraries we installed
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Echo
window.Pusher = Pusher;

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let myUserId = null;
    let recipientUserId = null;

    // --- DOM ELEMENTS ---
    const setupContainer = document.getElementById('setup-container');
    const chatContainer = document.getElementById('chat-container');
    const startChatBtn = document.getElementById('start-chat-btn');
    const myIdInput = document.getElementById('my-id');
    const recipientIdInput = document.getElementById('recipient-id');
    
    const chatHeader = document.getElementById('chat-header');
    const messagesContainer = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    
    // --- RENDER FUNCTIONS ---
    const renderMessages = (messages) => {
        messagesContainer.innerHTML = '';
        messages.forEach(msg => {
            const div = document.createElement('div');
            const messageClass = msg.sender_id == myUserId ? 'message-sent' : 'message-received';
            div.className = `message ${messageClass}`;
            div.textContent = msg.body;
            messagesContainer.appendChild(div);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // --- API & LOGIC ---
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/api/chat/messages/${myUserId}/${recipientUserId}`);
            renderMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            messagesContainer.innerHTML = '<p style="color: red;">Could not fetch messages. Check User IDs and console.</p>';
        }
    };
    
    const setupEcho = () => {
        // NOTE: Replace these with your actual Reverb credentials
        const echo = new Echo({
            broadcaster: 'reverb',
            key: 'yxmgb1degwtqf5bvtjh1', 
            wsHost: '127.0.0.1',       
            wsPort: 8080,                
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
        });

        echo.channel(`chat.${myUserId}`)
            .listen('.new-message', (event) => {
                console.log('Real-time message received:', event);
                if (event.sender_id == recipientUserId) {
                    fetchMessages();
                }
            });
        
        console.log(`Listening for messages on channel: chat.${myUserId}`);
    };

    // --- EVENT LISTENERS ---
    startChatBtn.addEventListener('click', () => {
        myUserId = myIdInput.value;
        recipientUserId = recipientIdInput.value;

        if (!myUserId || !recipientUserId) {
            alert('Please enter both User IDs.');
            return;
        }

        setupContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
        chatHeader.textContent = `Chatting with User #${recipientUserId}`;

        fetchMessages();
        setupEcho();
    });

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = chatInput.value;
        if (!body.trim()) return;

        try {
            const payload = { body, sender_id: myUserId };
            await axios.post(`/api/chat/messages/${recipientUserId}`, payload);
            chatInput.value = '';
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. See console for details.');
        }
    });
});