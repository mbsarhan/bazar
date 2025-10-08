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
        Schema::create('realestate_ads', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('ads_id')->constrained('advertisements')->onDelete('cascade');
            $table->enum('realestate_type',['شقة','فيلا','محل تجاري','مكتب','أرض','مزرعة','شاليه','مستودع','سوق تجاري'])->default( 'شقة');
            $table->string('detailed_address');
            $table->decimal('realestate_size');
            $table->unsignedSmallInteger('bedroom_num')->default(0);
            $table->unsignedSmallInteger('bathroom_num')->default(0);
            $table->unsignedSmallInteger('floor_num')->default(0);
            $table->enum('building_status', ['جاهز', 'على الهيكل', 'قيد الإنشاء'])->default('جاهز');
            $table->enum('cladding_condition', ['جيد', 'جيد جداً', 'سوبر ديلوكس','عادي','بحاجة لتجديد',''])->default('جيد');
            $table->boolean('negotiable_check')->default(false);
            $table->string('video_url')->nullable();
            $table->unique('ads_id'); 

        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('realestate_ads');
    }
};
