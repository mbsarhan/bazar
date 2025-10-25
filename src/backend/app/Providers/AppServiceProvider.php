<?php

namespace App\Providers;

use App\Models\Advertisement;
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
    }
}
