<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

            // The user who sent the message
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');

            // The user who should receive the message
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');

            // The message content
            $table->text('body');

            // Timestamp for when the recipient reads the message
            $table->timestamp('read_at')->nullable();

            $table->timestamps(); // for created_at and updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};