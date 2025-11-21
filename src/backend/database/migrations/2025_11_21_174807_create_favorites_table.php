<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade'); // delete favorites when user is deleted

            $table->foreignId('advertisement_id')
                ->constrained('advertisements')
                ->onDelete('cascade'); // delete favorites when ad is deleted

            $table->timestamps();

            // A user cannot favorite the same ad twice
            $table->unique(['user_id', 'advertisement_id'], 'favorites_user_ad_unique');

            // Helpful index if you ever need all users that favorited an ad
            $table->index('advertisement_id', 'favorites_advertisement_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};