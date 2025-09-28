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
            $table->year('model_year')->nullable(); 
            $table->enum('status', ['New', 'Used', 'Certified Pre-Owned'])->default('Used');
            $table->enum('gear', ['Manual', 'Automatic', 'Semi-Automatic'])->nullable();
            $table->enum('fule_type', ['Gasoline', 'Diesel', 'Electric', 'Hybrid'])->nullable();
            $table->unsignedBigInteger('distance_traveled')->default(0);
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
