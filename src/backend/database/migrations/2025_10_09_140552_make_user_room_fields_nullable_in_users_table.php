<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('realestate_ads', function (Blueprint $table) {
            $table->integer('bedroom_num')->nullable()->change();
            $table->integer('bathroom_num')->nullable()->change();
            $table->integer('floor_num')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('realestate_ads', function (Blueprint $table) {
            $table->integer('bedroom_num')->nullable(false)->change();
            $table->integer('bathroom_num')->nullable(false)->change();
            $table->integer('floor_num')->nullable(false)->change();
        });
    }
};
