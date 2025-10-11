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
        Schema::table('car_ads', function (Blueprint $table) {
            $table->renameColumn('status','condition');
            $table->renameColumn('fule_type','fuel_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('car_ads', function (Blueprint $table) {
            $table->renameColumn('condition','status');
            $table->renameColumn('fuel_type','fule_type');
        });
    }
};
