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
        Schema::create('realestate_images', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('realestate_ad_id')->constrained('realestate_ads')->onDelete('cascade');
            $table->string('image_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('realestate_images');
    }
};
