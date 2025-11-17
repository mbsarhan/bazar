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
        channels: __DIR__.'/../routes/channels.php',
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
        // --- ADD THIS LINE ---
        // This tells Laravel: "For any route in the 'api' group (defined in api.php),
        // also run our CheckForBan middleware."
        $middleware->appendToGroup('api', \App\Http\Middleware\CheckForBan::class);
        // --- END OF ADDITION ---
        
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
