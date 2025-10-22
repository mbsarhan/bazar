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
        $table->string('video_type')->nullable()->after('hls_url');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('realestate_ads', function (Blueprint $table) {
            $table->dropColumn('video_type');
        });
    }
};
