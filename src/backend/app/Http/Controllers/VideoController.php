<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use App\Jobs\ProcessVideoJob;
use App\Models\Advertisement;
use App\Models\RealestateAds;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class VideoController extends Controller
{

    public function create(Advertisement $advertisement)
    {
        // Pass the advertisement to the view so we know what we're uploading for.
        return view('upload', ['advertisement' => $advertisement]);
    }

    public function store(Request $request, Advertisement $advertisement)
{
    // 1. Validate the incoming request
    $request->validate([
        'video' => [
            'required',
            'file',
            'mimes:mp4,mov,avi,wmv,webm',
            'max:20480', // 20 MB max size
        ],
    ]);

    $videoFile = $request->file('video');

    try {
        $originalVideoPath = $videoFile->store('videos/real-estate', 'public');
        $disk = 'public';
        $fileName = pathinfo($originalVideoPath, PATHINFO_FILENAME);
        $folder = "videos/hls/{$fileName}";

        Storage::disk($disk)->makeDirectory($folder);

        $formats = [
            ['name' => '360p', 'width' => 640, 'height' => 360, 'bitrate' => 500],
            ['name' => '720p', 'width' => 1280, 'height' => 720, 'bitrate' => 1500],
            ['name' => '1080p', 'width' => 1920, 'height' => 1080, 'bitrate' => 5000],
        ];

        // --- START OF THE CORRECTED LOGIC ---

        $hlsExporter = FFMpeg::fromDisk($disk)
                             ->open($originalVideoPath)
                             ->exportForHLS();

        // Loop through your formats and add each one with its specific resize filter.
        // This prepares the export process.
        foreach ($formats as $f) {
            $format = (new \FFMpeg\Format\Video\X264('aac', 'libx264'))
                        ->setKiloBitrate($f['bitrate']);

            // The closure receives a $video object that you can apply filters to.
            // This is the correct, high-level way to resize for each format.
            $hlsExporter->addFormat($format, function($video) use ($f) {
                $video->resize($f['width'], $f['height']);
            });
        }
        
        // After preparing all formats, execute the save command ONCE.
        // The library will automatically create the master playlist and all segment files.
        $masterPlaylistPath = "{$folder}/master.m3u8";
        $hlsExporter->toDisk($disk)->save($masterPlaylistPath);

        // --- END OF THE CORRECTED LOGIC ---

        // Update the database with the path to the master playlist
        RealestateAds::where('ads_id', $advertisement->id)->update([
            'video_url' => $masterPlaylistPath,
        ]);

        // Clean up the original large video file
        Storage::disk($disk)->delete($originalVideoPath);

        return redirect()->route('video.test', ['advertisement' => $advertisement->id])
                         ->with('success', 'Video uploaded and processed successfully!');

    } catch (Exception $e) {
        Log::error('Synchronous video processing failed for ad ID: ' . $advertisement->id, [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);
        
        return back()->with('error', 'Failed to process the video. Error: ' . $e->getMessage());
    }
}

    
    public function show(Advertisement $advertisement){
            
    // 1. Eager load the real estate details to avoid extra queries.
        $advertisement->load('realEstateDetails');

        // 2. Check if the ad has real estate details and a video URL.
        if (!$advertisement->realEstateDetails || !$advertisement->realEstateDetails->video_url) {
            // If not, abort with a 404 error and a clear message.
            abort(404, 'Video not found for this advertisement.');
        }

        // 3. Get the full public URL for the video.
        // Your job stores a relative path like 'videos/hls/.../master.m3u8'.
        // Storage::url() converts this to a full URL like 'http://.../storage/videos/hls/.../master.m3u8'.
        $videoUrl = Storage::url($advertisement->realEstateDetails->video_url);

        // 4. Return the view and pass the full video URL to it.
        return view('video', [
            'videoUrl' => $videoUrl
        ]);
    }

  

    
}
