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
        Schema::table('user_reports', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'dismissed'])->default('pending')->after('description');
            $table->text('review_note')->nullable()->after('status');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->after('review_note');
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_reports', function (Blueprint $table) {
            $table->dropColumn(['status', 'review_note', 'reviewed_by', 'reviewed_at']);
        });
    }
};
