<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_ratings', function (Blueprint $table) {
            $table->id();

            // 1. The RATER (the user who gives the rating)
            // References the 'id' column on the 'users' table
            $table->foreignId('rater_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // 2. The RATED (the user who receives the rating)
            // References the 'id' column on the 'users' table
            $table->foreignId('rated_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            
            // 3. The Rating Value
            // Using a tinyInteger for a simple 1-5 star rating, adjust as needed
            $table->unsignedTinyInteger('rating'); 

            $table->timestamps();
            
            // Ensure a user cannot rate the same user more than once
            $table->unique(['rater_id', 'rated_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_ratings');
    }
};
