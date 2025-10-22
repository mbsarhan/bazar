<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StreamingController extends Controller
{
        /**
     * Securely streams files from the public storage disk.
     *
     * @param string $path The path to the file.
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|\Illuminate\Http\JsonResponse
     */
    public function stream(string $path): StreamedResponse|\Illuminate\Http\JsonResponse
    {
        // Security Check: Ensure the file exists on the 'public' disk.
        // This prevents users from accessing files outside the intended directory.
        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        // Return the file as a streamed response. Laravel will automatically
        // handle the correct MIME types and headers for streaming.
        return Storage::disk('public')->response($path);
    }
}
