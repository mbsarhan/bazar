<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Message $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * The event will be broadcast on a private channel that only the
     * intended recipient can listen to.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('chat.' . $this->message->receiver_id),
        ];
    }

    /**
     * The name of the event as it should be broadcast.
     */
    public function broadcastAs(): string
    {
        return 'new-message';
    }

    /**
     * The data that should be broadcast with the event.
     */
    public function broadcastWith(): array
    {
        // Match exactly what your API returns for a message
    return [
        'id' => $this->message->id,
        'body' => $this->message->body,
        'sender_id' => $this->message->sender_id,
        'receiver_id' => $this->message->receiver_id,
        'created_at' => $this->message->created_at,
        'read_at' => $this->message->read_at,
        'sender' => [
            'id' => $this->message->sender->id,
            'fname' => $this->message->sender->fname,
            'lname' => $this->message->sender->lname,
        ],
    ];
    }
}