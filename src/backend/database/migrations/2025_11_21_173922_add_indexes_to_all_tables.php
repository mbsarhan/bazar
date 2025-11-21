<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // advertisements
        Schema::table('advertisements', function (Blueprint $table) {
            if (Schema::hasColumn('advertisements', 'user_id')) {
                $table->index('user_id', 'adv_user_id_idx');
            }
            if (Schema::hasColumn('advertisements', 'status')) {
                $table->index('status', 'adv_status_idx');
            }
            if (Schema::hasColumn('advertisements', 'created_at')) {
                $table->index('created_at', 'adv_created_at_idx');
            }
        });

        // ad_views
        Schema::table('ad_views', function (Blueprint $table) {
            if (Schema::hasColumn('ad_views', 'ad_id')) {
                $table->index('ad_id', 'ad_views_ad_id_idx');
            }
            if (Schema::hasColumn('ad_views', 'user_id')) {
                $table->index('user_id', 'ad_views_user_id_idx');
            }
            if (Schema::hasColumn('ad_views', 'created_at')) {
                $table->index('created_at', 'ad_views_created_at_idx');
            }
        });

        // car_ads
        Schema::table('car_ads', function (Blueprint $table) {
            if (Schema::hasColumn('car_ads', 'user_id')) {
                $table->index('user_id', 'car_ads_user_id_idx');
            }
            if (Schema::hasColumn('car_ads', 'created_at')) {
                $table->index('created_at', 'car_ads_created_at_idx');
            }
        });

        // car_ad_images
        Schema::table('car_ad_images', function (Blueprint $table) {
            if (Schema::hasColumn('car_ad_images', 'car_ad_id')) {
                $table->index('car_ad_id', 'car_ad_images_car_ad_id_idx');
            }
        });

        // daily_ad_counts
        Schema::table('daily_ad_counts', function (Blueprint $table) {
            if (Schema::hasColumn('daily_ad_counts', 'user_id')) {
                $table->index('user_id', 'daily_ad_counts_user_id_idx');
            }
            if (Schema::hasColumn('daily_ad_counts', 'date')) {
                $table->index('date', 'daily_ad_counts_date_idx');
            }
        });

        // password_reset_tokens
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            if (Schema::hasColumn('password_reset_tokens', 'email')) {
                $table->index('email', 'prt_email_idx');
            }
        });

        // pending_advertisements
        Schema::table('pending_advertisements', function (Blueprint $table) {
            if (Schema::hasColumn('pending_advertisements', 'user_id')) {
                $table->index('user_id', 'pending_adv_user_id_idx');
            }
            if (Schema::hasColumn('pending_advertisements', 'status')) {
                $table->index('status', 'pending_adv_status_idx');
            }
        });

        // personal_access_tokens
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            if (Schema::hasColumn('personal_access_tokens', 'tokenable_type') &&
                Schema::hasColumn('personal_access_tokens', 'tokenable_id')) {
                $table->index(['tokenable_type', 'tokenable_id'], 'pat_tokenable_idx');
            }
            if (Schema::hasColumn('personal_access_tokens', 'token')) {
                $table->index('token', 'pat_token_idx');
            }
        });

        // realestate_ads
        Schema::table('realestate_ads', function (Blueprint $table) {
            if (Schema::hasColumn('realestate_ads', 'user_id')) {
                $table->index('user_id', 're_ads_user_id_idx');
            }
            if (Schema::hasColumn('realestate_ads', 'created_at')) {
                $table->index('created_at', 're_ads_created_at_idx');
            }
        });

        // realestate_images
        Schema::table('realestate_images', function (Blueprint $table) {
            if (Schema::hasColumn('realestate_images', 'realestate_ad_id')) {
                $table->index('realestate_ad_id', 're_images_ad_id_idx');
            }
        });

        // users
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'email')) {
                $table->index('email', 'users_email_idx');
            }
            if (Schema::hasColumn('users', 'phone')) {
                $table->index('phone', 'users_phone_idx');
            }
            if (Schema::hasColumn('users', 'created_at')) {
                $table->index('created_at', 'users_created_at_idx');
            }
        });

        // user_ratings
        Schema::table('user_ratings', function (Blueprint $table) {
            if (Schema::hasColumn('user_ratings', 'user_id')) {
                $table->index('user_id', 'user_ratings_user_id_idx');
            }
            if (Schema::hasColumn('user_ratings', 'rated_user_id')) {
                $table->index('rated_user_id', 'user_ratings_rated_user_id_idx');
            }
        });

        // user_reports
        Schema::table('user_reports', function (Blueprint $table) {
            if (Schema::hasColumn('user_reports', 'user_id')) {
                $table->index('user_id', 'user_reports_user_id_idx');
            }
            if (Schema::hasColumn('user_reports', 'reported_user_id')) {
                $table->index('reported_user_id', 'user_reports_reported_user_id_idx');
            }
        });

        // user_strikes
        Schema::table('user_strikes', function (Blueprint $table) {
            if (Schema::hasColumn('user_strikes', 'user_id')) {
                $table->index('user_id', 'user_strikes_user_id_idx');
            }
            if (Schema::hasColumn('user_strikes', 'created_at')) {
                $table->index('created_at', 'user_strikes_created_at_idx');
            }
        });
    }

    public function down(): void
    {
        // Reverse the indexes (names must match the ones in up())

        Schema::table('advertisements', function (Blueprint $table) {
            $table->dropIndex('adv_user_id_idx');
            $table->dropIndex('adv_status_idx');
            $table->dropIndex('adv_created_at_idx');
        });

        Schema::table('ad_views', function (Blueprint $table) {
            $table->dropIndex('ad_views_ad_id_idx');
            $table->dropIndex('ad_views_user_id_idx');
            $table->dropIndex('ad_views_created_at_idx');
        });

        Schema::table('car_ads', function (Blueprint $table) {
            $table->dropIndex('car_ads_user_id_idx');
            $table->dropIndex('car_ads_created_at_idx');
        });

        Schema::table('car_ad_images', function (Blueprint $table) {
            $table->dropIndex('car_ad_images_car_ad_id_idx');
        });

        Schema::table('daily_ad_counts', function (Blueprint $table) {
            $table->dropIndex('daily_ad_counts_user_id_idx');
            $table->dropIndex('daily_ad_counts_date_idx');
        });

        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->dropIndex('prt_email_idx');
        });

        Schema::table('pending_advertisements', function (Blueprint $table) {
            $table->dropIndex('pending_adv_user_id_idx');
            $table->dropIndex('pending_adv_status_idx');
        });

        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropIndex('pat_tokenable_idx');
            $table->dropIndex('pat_token_idx');
        });

        Schema::table('realestate_ads', function (Blueprint $table) {
            $table->dropIndex('re_ads_user_id_idx');
            $table->dropIndex('re_ads_created_at_idx');
        });

        Schema::table('realestate_images', function (Blueprint $table) {
            $table->dropIndex('re_images_ad_id_idx');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_email_idx');
            $table->dropIndex('users_phone_idx');
            $table->dropIndex('users_created_at_idx');
        });

        Schema::table('user_ratings', function (Blueprint $table) {
            $table->dropIndex('user_ratings_user_id_idx');
            $table->dropIndex('user_ratings_rated_user_id_idx');
        });

        Schema::table('user_reports', function (Blueprint $table) {
            $table->dropIndex('user_reports_user_id_idx');
            $table->dropIndex('user_reports_reported_user_id_idx');
        });

        Schema::table('user_strikes', function (Blueprint $table) {
            $table->dropIndex('user_strikes_user_id_idx');
            $table->dropIndex('user_strikes_created_at_idx');
        });
    }
};