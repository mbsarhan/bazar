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
        // Rename the table from the old name to the new name
        Schema::rename('pending_advertisement_updates', 'pending_advertisements');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // If you roll back, this will rename it back to the original name
        Schema::rename('pending_advertisements', 'pending_advertisement_updates');
    }
};
