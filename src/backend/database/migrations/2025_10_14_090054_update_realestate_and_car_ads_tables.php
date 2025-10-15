<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // --- Rename realestate_size → area ---
        Schema::table('realestate_ads', function (Blueprint $table) {
            if (Schema::hasColumn('realestate_ads', 'realestate_size')) {
                $table->renameColumn('realestate_size', 'area');
            }
        });

        // --- Change fuel_type column to enum ---
        Schema::table('car_ads', function (Blueprint $table) {
            // Change type to enum with the desired values
            $table->enum('fuel_type', ['بنزين', 'ديزل', 'كهرباء', 'هايبرد'])
                  ->default('بنزين')
                  ->change();
        });
    }

    public function down(): void
    {
        // --- Revert realestate_size ---
        Schema::table('realestate_ads', function (Blueprint $table) {
            if (Schema::hasColumn('realestate_ads', 'area')) {
                $table->renameColumn('area', 'realestate_size');
            }
        });

        // --- Revert fuel_type back to string ---
        Schema::table('car_ads', function (Blueprint $table) {
            $table->string('fuel_type')->change();
        });
    }
};
