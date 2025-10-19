<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            // Drop the old enum column first
            $table->dropColumn('governorate');
        });

        Schema::table('advertisements', function (Blueprint $table) {
            // Add the new string column
            $table->string('governorate')->after('city')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            // Revert back to the enum type if you ever roll back
            $table->dropColumn('governorate');
        });

        Schema::table('advertisements', function (Blueprint $table) {
            $table->enum('governorate', [
                'القامشلي','درعا','السويداء','ريف دمشق','دمشق','حمص',
                'حماة','اللاذقية','طرطوس','حلب','إدلب','دير الزور','الرقة','الحسكة'
            ])->after('city');
        });
    }
};
