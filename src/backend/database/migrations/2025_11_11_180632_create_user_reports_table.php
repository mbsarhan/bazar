<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_reports', function (Blueprint $table) {
            $table->id();

            // The user who is submitting the report
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();

            // The user who is being reported
            $table->foreignId('reported_id')->constrained('users')->cascadeOnDelete();

            // The reason for the report (e.g., 'spam', 'fraud')
            $table->string('reason');

            // Detailed description of the issue
            $table->text('description');

            $table->timestamps();

            // Optional: Add a unique constraint to prevent the same user from
            // reporting the same person multiple times for the same reason.
            // For simplicity, we'll handle this in the service layer for now.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_reports');
    }
};
