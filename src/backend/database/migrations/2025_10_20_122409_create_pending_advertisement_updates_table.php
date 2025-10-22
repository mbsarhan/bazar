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
        Schema::create('pending_advertisement_updates', function (Blueprint $table) {
            $table->id();
            // Link to the original advertisement
            $table->foreignId('advertisement_id')->constrained()->onDelete('cascade');
            
            // --- Common Advertisement Fields ---
            $table->string('title')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->text('description')->nullable();
            $table->string('transaction_type');
            $table->string('governorate');
            $table->string('city');
            $table->string('geo_location')->nullable();
            $table->boolean('negotiable_check');

            // --- Car Ad Specific Fields (nullable) ---
            $table->string('manufacturer')->nullable();
            $table->string('model')->nullable();
            $table->year('model_year')->nullable();
            $table->string('condition')->nullable(); // Renamed from 'status'
            $table->string('gear')->nullable();
            $table->string('fuel_type')->nullable();
            $table->unsignedBigInteger('distance_traveled')->nullable();

            // --- Real Estate Ad Specific Fields (nullable) ---
            $table->string('realestate_type')->nullable();
            $table->string('detailed_address')->nullable();
            $table->decimal('area')->nullable(); // Renamed from 'realestate_size'
            $table->unsignedSmallInteger('bedroom_num')->nullable();
            $table->unsignedSmallInteger('bathroom_num')->nullable();
            $table->unsignedSmallInteger('floor_num')->nullable();
            $table->string('building_status')->nullable();
            $table->string('cladding_condition')->nullable();
            
            // --- Media Tracking ---
            // Store new file paths and removed file info as JSON
            $table->json('pending_media')->nullable(); // e.g., {"new_images": [...], "removed_images": [...], "new_video": "..."}

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pending_advertisement_updates');
    }
};
