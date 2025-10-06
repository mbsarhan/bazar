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
        Schema::create('advertisements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->timestamps();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->decimal('price')->default(0.0);
            $table->longText('description');
            $table->enum('transaction_type',['بيع','أجار','استثمار']);
            $table->enum('ad_status',['فعال','قيد المراجعة','مباع','مؤجر'])->default('قيد المراجعة');
            $table->string('city');
            $table->enum('governorate',['القامشلي','درعا','السويداء','ريف دمشق','دمشق','حمص','حماة','اللاذقية','طرطوس','حلب','إدلب','دير الزور','الرقة','الحسكة']);
            $table->unsignedBigInteger('views_count')->default(0);


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisements');
    }

};
