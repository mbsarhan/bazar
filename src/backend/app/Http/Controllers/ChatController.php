<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    // Fetches a list of users the authenticated user has had conversations with (still needs auth)
    public function getConversations(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $senderIds = Message::where('receiver_id', $user->id)->pluck('sender_id');
        $receiverIds = Message::where('sender_id', $user->id)->pluck('receiver_id');
        $userIds = $senderIds->merge($receiverIds)->unique();
        $conversations = User::whereIn('id', $userIds)->get(['id', 'fname', 'lname']);

        return response()->json($conversations);
    }

    // ✅ Public route: Fetch messages between two users
    public function getMessages($senderId, $recipientId)
    {
        // Ensure both users exist
        $sender = User::find($senderId);
        $recipient = User::find($recipientId);

        if (!$sender || !$recipient) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $messages = Message::where(function ($query) use ($senderId, $recipientId) {
            $query->where('sender_id', $senderId)
                  ->where('receiver_id', $recipientId);
        })->orWhere(function ($query) use ($senderId, $recipientId) {
            $query->where('sender_id', $recipientId)
                  ->where('receiver_id', $senderId);
        })->orderBy('created_at', 'asc')
          ->get();

        return response()->json($messages);
    }

    // ✅ Public route: Send message from senderId to recipientId
    public function sendMessage(Request $request, $recipientId)
    {
        $request->validate([
            'body' => 'required|string',
            'sender_id' => 'required|integer|exists:users,id'
        ]);

        $sender = User::find($request->sender_id);
        $recipient = User::find($recipientId);

        if (!$sender || !$recipient) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $recipient->id,
            'body' => $request->body,
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message, 201);
    }
}
