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
        Schema::create('car_ad_images', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('car_ad_id')->constrained('car_ads')->onDelete('cascade');
            $table->string('image_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_ad_images');
    }
};
