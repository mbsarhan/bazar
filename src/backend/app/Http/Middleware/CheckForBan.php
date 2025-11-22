<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth; // Import the Auth facade

class CheckForBan
{
     /**
     * Handle an incoming request.
     *
     * This middleware checks if the authenticated user is currently banned.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Check if a user is actually logged in. If not, this middleware doesn't apply.
        if (Auth::check()) {

            // 2. Get the authenticated user instance.
            $user = Auth::user();

            // 3. Use the `isBanned()` helper method we created in the User model.
            // This method checks if `banned_until` is not null and is a future date.
            if ($user->isBanned()) {
                
                // 4. If the user is banned, immediately stop the request and return an error.
                // 403 Forbidden is the correct HTTP status code for this.
                return response()->json([
                    'message' => 'Your account is suspended.',
                    // Provide the expiry date so the frontend can display a countdown.
                    'banned_until' => $user->banned_until->toIso8601String(), 
                ], 403);
            }
        }
        
        // 5. If the user is not banned (or not logged in), allow the request to continue.
        return $next($request);
    }
}
