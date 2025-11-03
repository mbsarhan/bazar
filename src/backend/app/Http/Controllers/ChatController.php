<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    // Fetches a list of users the authenticated user has had conversations with
    public function getConversations(Request $request) {
        $user = $request->user();

        // Get IDs of users who sent messages to the current user
        $senderIds = Message::where('receiver_id', $user->id)->pluck('sender_id');
        // Get IDs of users to whom the current user sent messages
        $receiverIds = Message::where('sender_id', $user->id)->pluck('receiver_id');

        // Combine and get unique user IDs
        $userIds = $senderIds->merge($receiverIds)->unique();
        
        $conversations = User::whereIn('id', $userIds)->get(['id', 'fname', 'lname']);
        
        return response()->json($conversations);
    }

    // Fetches the message history between the authenticated user and another user
    public function getMessages(Request $request, User $recipient) {
        $user = $request->user();

        // Mark messages from the recipient as read
        Message::where('sender_id', $recipient->id)
               ->where('receiver_id', $user->id)
               ->whereNull('read_at')
               ->update(['read_at' => now()]);

        $messages = Message::where(function ($query) use ($user, $recipient) {
            $query->where('sender_id', $user->id)->where('receiver_id', $recipient->id);
        })->orWhere(function ($query) use ($user, $recipient) {
            $query->where('sender_id', $recipient->id)->where('receiver_id', $user->id);
        })->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    // Sends a new message from the authenticated user to a recipient
    public function sendMessage(Request $request, User $recipient) {
        $request->validate(['body' => 'required|string']);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $recipient->id,
            'body' => $request->body,
        ]);

        // Broadcast the event
        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message, 201);
    }
}