<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // This line is crucial
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // 2. CONFIGURE THE CORS MIDDLEWARE HERE
        //$middleware->statefulApi(); // Ensures session-based routes work correctly with Sanctum if needed.

        $middleware->alias([
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        ]);

        // This is the new way to configure CORS for your API
        $middleware->api(prepend: [
            HandleCors::class,
        ]);
        
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    // --- THIS IS THE CORRECT WAY TO ADD THE PROVIDER ---
    // It is chained directly onto the Application configuration object
    // before the ->create() method is called.
    ->withProviders([
        App\Providers\AuthServiceProvider::class,
    ])->create();
