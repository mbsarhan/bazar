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
        Schema::create('car_ads', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('ads_id') ->constrained('advertisements')->onDelete('cascade');
            $table->string('manufacturer');
            $table->year('model_year'); 
            $table->enum('status', ['جديدة', 'مستعملة', 'متضررة'])->default('مستعملة');
            $table->enum('gear', ['عادي', 'أوتوماتيك', 'الإثنان معا']);
            $table->enum('fule_type', ['بانزين', 'ديزل', 'كهرباء', 'هايبرد']);
            $table->unsignedBigInteger('distance_traveled');
            $table->boolean('negotiable_check')->default(false);
            $table->unique('ads_id'); 

            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_ads');
    }
};
