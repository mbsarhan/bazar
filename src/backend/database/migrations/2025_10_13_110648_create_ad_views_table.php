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
        Schema::create('ad_views', function (Blueprint $table) {
            $table->id();
            // This correctly links to the parent 'advertisements' table
            $table->foreignId('advertisement_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->unsignedInteger('views')->default(0); // Start with 1 on creation
            $table->timestamps();
            // Ensure only one record exists per ad, per day
            $table->unique(['advertisement_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_views');
    }
};
