<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // <-- Make sure DB Facade is imported

class ChatController extends Controller
{
    // --- THIS IS THE NEW, ENHANCED VERSION ---
    public function getConversations(Request $request)
{
    $user = $request->user();
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }
    $userId = $user->id;

    // 1. Get the ID of the last message for each conversation
    $latestMessages = DB::table('messages')
        ->select(DB::raw('MAX(id) as last_message_id'))
        // Only consider messages where the current user is either the sender or receiver
        ->where(function ($query) use ($userId) {
            $query->where('sender_id', $userId)
                  ->orWhere('receiver_id', $userId);
        })
        // --- THIS IS THE FIX ---
        // Explicitly exclude any messages where the sender and receiver are the same person.
        ->where('sender_id', '!=', DB::raw('receiver_id'))
        // --- END OF FIX ---
        ->groupBy(DB::raw("LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)"));

    // The rest of the function remains exactly the same...
    
    // 2. Get the full message details for those last messages
    $conversations = Message::whereIn('id', $latestMessages)
        ->with(['sender', 'receiver'])
        ->orderBy('created_at', 'desc')
        ->get();

    // 3. Get all unread message counts
    $unreadCounts = Message::select('sender_id', DB::raw('count(id) as count'))
        ->where('receiver_id', $userId)
        ->whereNull('read_at')
        ->groupBy('sender_id')
        ->get()
        ->keyBy('sender_id');

    // 4. Format the final response
    $response = $conversations->map(function ($message) use ($userId, $unreadCounts) {
        $otherUser = $message->sender_id == $userId ? $message->receiver : $message->sender;

        return [
            'user' => [
                'id' => $otherUser->id,
                'fname' => $otherUser->fname,
                'lname' => $otherUser->lname,
            ],
            'last_message' => $message,
            'unread_count' => $unreadCounts->get($otherUser->id)->count ?? 0,
        ];
    });

    return response()->json($response);
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