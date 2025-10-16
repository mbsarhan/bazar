<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Models\RealestateAds;
use App\Jobs\ProcessVideoJob; 
use App\Http\Controllers\Controller;
use App\Http\Requests\UploadVideoRequest; 



class VideoUploadController extends Controller
{
    public function store(UploadVideoRequest $request, Advertisement $advertisement)
    {
        // The UploadVideoRequest has already validated the file and that the user owns the ad.
        $videoFile = $request->file('video');

        // Store the original video file in a temporary location.
        // The job will be responsible for processing and then deleting it.
        $originalVideoPath = $videoFile->store('videos/real-estate', 'public');
        

        // 2. We can immediately update the database with a "processing" status or placeholder.
        // This is optional but good practice. It tells the frontend the video is not ready yet.
        // This requires a `video_status` column (e.g., ENUM 'pending', 'processing', 'ready', 'failed')).
        // For simplicity, we'll skip this for now but it's where you'd put it.
        RealestateAds::where('ads_id', $advertisement->id)->update([
            'video_url' => null, // Clear any old URL
            'video_status' => 'processing'
        ]);



        // Dispatch the background job you already created!
        // Pass it the path to the temporary file and the ad ID.
        ProcessVideoJob::dispatch($originalVideoPath, $advertisement->id);

        // 4. Return an IMMEDIATE response to the user.
        // The frontend now knows the upload was successful and processing has started.
        return response()->json([
            'success' => true,
            'message' => 'Video upload successful. Processing has started in the background.',
        ], 202); // 202 Accepted is the perfect HTTP status code for this.
    }

        public function showStatus(Advertisement $advertisement)
    {
        // 1. Eager load the details to get the video_url
        $advertisement->load('realEstateDetails');

        $videoDetails = $advertisement->realEstateDetails;

        // 2. Check if the ad has details and a video_url
        if ($videoDetails && $videoDetails->video_url) {
            // If the URL exists, the job is done. Return the full, ready-to-use URL.
            return response()->json([
                'status' => 'ready',
                'video_url' => \Storage::url($videoDetails->video_url),
            ]);
        } else {
            // If the URL is null, it means the job is still pending or has not started.
            // (You could also check a 'video_status' column here if you implemented one).
            return response()->json([
                'status' => 'processing',
                'video_url' => null,
            ]);
        }
    }
}
