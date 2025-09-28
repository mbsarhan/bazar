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
        Schema::create('realestate_ads', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('ads_id')->constrained('advertisements')->onDelete('cascade');
            $table->string('realestate_type');
            $table->string('detailed-address');
            $table->decimal('realestate-size');
            $table->unsignedSmallInteger('bedroom_num')->default(0);
            $table->unsignedSmallInteger('bathroom_num')->default(0);
            $table->unsignedSmallInteger('floor_num')->default(0);
            $table->enum('building_status', ['Ready', 'Under Construction', 'Shell'])->default('Ready');
            $table->string('cladding_condition');
            $table->boolean('negotiable-check')->default(false);
            $table->string('video-url');
            $table->unique('ads_id'); 

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('realestate_ads');
    }
};
