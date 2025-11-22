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



    public function markAsRead(Request $request, $senderId)
    {
        $user = $request->user();
        $receiverId = $user->id;

        $startTime = microtime(true);

        // 🔹 1. Find the highest unread message ID (latest unread)
        $latestUnreadId = \DB::table('messages')
            ->where('sender_id', $senderId)
            ->where('receiver_id', $receiverId)
            ->whereNull('read_at')
            ->orderByDesc('id')
            ->limit(1)
            ->value('id');

        if (!$latestUnreadId) {
            return response()->json([
                'status' => 'success',
                'updated_count' => 0,
                'message' => 'No unread messages found.',
                'time_ms' => round((microtime(true) - $startTime) * 1000, 2),
            ]);
        }

        // 🔹 2. Bulk-update all unread messages up to that ID
        $updated = \DB::table('messages')
            ->where('sender_id', $senderId)
            ->where('receiver_id', $receiverId)
            ->whereNull('read_at')
            ->where('id', '<=', $latestUnreadId)
            ->update(['read_at' => now()]);

        $duration = round((microtime(true) - $startTime) * 1000, 2);

        return response()->json([
            'status' => 'success',
            'updated_count' => $updated,
            'latest_unread_id' => $latestUnreadId,
            'time_ms' => $duration,
        ]);
    }
    public function markSingleMessageAsRead(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $messageId = (int) $id;

        // Try to atomically mark the message as read (only if receiver is current user and read_at is null)
        $updated = DB::table('messages')
            ->where('id', $messageId)
            ->where('receiver_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        // If nothing was updated, figure out why and return a helpful response
        if (!$updated) {
            // Does the message exist?
            $exists = DB::table('messages')->where('id', $messageId)->exists();
            if (!$exists) {
                return response()->json(['status' => 'error', 'message' => 'Message not found'], 404);
            }

            // Is the current user the receiver?
            $isReceiver = DB::table('messages')
                ->where('id', $messageId)
                ->where('receiver_id', $user->id)
                ->exists();

            if (!$isReceiver) {
                return response()->json(['status' => 'error', 'message' => 'You are not the receiver of this message'], 403);
            }

            // If we reach here, message exists and user is receiver but nothing updated => already read
            $readAt = DB::table('messages')->where('id', $messageId)->value('read_at');

            return response()->json([
                'status' => 'success',
                'message' => 'Message already read.',
                'message_id' => $messageId,
                'read_at' => $readAt,
            ]);
        }

        // Fetch and return the updated read_at
        $readAt = DB::table('messages')->where('id', $messageId)->value('read_at');

        return response()->json([
            'status' => 'success',
            'message' => 'Message marked as read.',
            'message_id' => $messageId,
            'read_at' => $readAt,
        ]);
    }


    // ✅ New Method: Get total count of unread messages for the current user
    public function getGlobalUnreadCount(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['count' => 0]);
        }

        // Count messages where I am the receiver and I haven't read them
        $count = DB::table('messages')
            ->where('receiver_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }
}