<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Chat Test</title>

    {{-- This one magical line loads both your CSS and JS correctly --}}
    @vite(['resources/css/chat.css', 'resources/js/chat-test.js'])

</head>
<body>

    <div id="setup-container">
        <h1>Chat Test Setup</h1>
        <p>Enter existing User IDs from your database.</p>
        <div>
            <label for="my-id">Your User ID:</label>
            <input type="number" id="my-id" placeholder="e.g., 1">
        </div>
        <div>
            <label for="recipient-id">Recipient's User ID:</label>
            <input type="number" id="recipient-id" placeholder="e.g., 2">
        </div>
        <button id="start-chat-btn">Start Chatting</button>
    </div>

    <div id="chat-container" class="chat-container" style="display: none;">
        <div id="chat-window" class="chat-window" style="width: 100%;">
            <div id="chat-header" class="chat-header"></div>
            <div id="chat-messages" class="chat-messages"></div>
            <form id="chat-form" class="chat-input-form">
                <input type="text" id="chat-input" placeholder="Type a message..." autocomplete="off">
                <button type="submit">Send</button>
            </form>
        </div>
    </div>
    
</body>
</html>