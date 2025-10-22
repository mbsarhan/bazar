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
        Schema::table('pending_advertisement_updates', function (Blueprint $table) {
            // Add the new columns. We can place them after 'transaction_type'.
            $table->unsignedBigInteger('views_count')->default(0)->after('transaction_type');
            $table->string('ad_status')->after('transaction_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pending_advertisement_updates', function (Blueprint $table) {
            $table->dropColumn(['views_count', 'ad_status']);
        });
    }
};
