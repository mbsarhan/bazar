<?php

namespace App\Providers;

use App\Models\Advertisement;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\ServiceProvider;
use App\Observers\AdvertisementObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // --- 3. ADD THIS LINE ---
        // This tells Laravel: "Whenever an Advertisement is created, updated, or deleted,
        // please notify the AdvertisementObserver."
        Advertisement::observe(AdvertisementObserver::class);

        // ⚡ Force rebuild config cache in production
    if (app()->environment('production')) {
        try {
            Artisan::call('config:clear');
            Artisan::call('cache:clear');
        } catch (\Throwable $e) {
            Log::error('Failed to clear cache: ' . $e->getMessage());
        }
    }

    // Optional: log what disk Laravel sees
    Log::info('Default disk: ' . config('filesystems.default'));
    Log::info('Cloud disk: ' . config('filesystems.cloud'));
    Log::info('Disks: ', array_keys(config('filesystems.disks')));
    }
}
