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
        Schema::table('realestate_ads', function (Blueprint $table) {
            // Add the new hls_url column, which will be filled by the job.
            $table->string('hls_url')->nullable()->after('video_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('realestate_ads', function (Blueprint $table) {
            $table->dropColumn('hls_url');
        });
    }
};
