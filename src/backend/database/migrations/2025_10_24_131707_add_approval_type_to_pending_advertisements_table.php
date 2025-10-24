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
        Schema::table('pending_advertisements', function (Blueprint $table) {
            // This column will distinguish between a new ad and an edit.
            $table->enum('approval_type', ['new', 'update'])->default('update')->after('advertisement_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pending_advertisements', function (Blueprint $table) {
            $table->dropColumn('approval_type');
        });
    }
};
