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
        Schema::create('user_strikes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->comment('The user receiving the strike')->constrained('users')->cascadeOnDelete();
            $table->foreignId('report_id')->comment('The report that caused this strike')->nullable()->constrained('user_reports')->nullOnDelete();
            $table->foreignId('admin_id')->comment('The admin who confirmed the report/strike')->constrained('users')->cascadeOnDelete();
            $table->string('reason')->comment('A short summary of why the strike was given');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_strikes');
    }
};
