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
        DB::statement("
            ALTER TABLE `car_ads`
            CHANGE `status` `condition`
            ENUM('جديدة','مستعملة','متضررة')
            COLLATE 'utf8mb4_unicode_ci'
            NOT NULL
            DEFAULT 'مستعملة';
        ");

        DB::statement("
            ALTER TABLE `car_ads`
            CHANGE `fule_type` `fuel_type`
            VARCHAR(255)
            COLLATE 'utf8mb4_unicode_ci'
            NULL;
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE `car_ads`
            CHANGE `condition` `status`
            ENUM('جديدة','مستعملة','متضررة')
            COLLATE 'utf8mb4_unicode_ci'
            NOT NULL
            DEFAULT 'مستعملة';
        ");

        DB::statement("
            ALTER TABLE `car_ads`
            CHANGE `fuel_type` `fule_type`
            VARCHAR(255)
            COLLATE 'utf8mb4_unicode_ci'
            NULL;
        ");
    }
};
