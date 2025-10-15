<?php

namespace App\Jobs;

// use App\Models\RealestateAds;
// use Illuminate\Queue\SerializesModels;
// use Illuminate\Support\Facades\Storage;
// use Illuminate\Queue\InteractsWithQueue;
// use Illuminate\Foundation\Queue\Queueable;
// use Illuminate\Contracts\Queue\ShouldQueue;
// use Illuminate\Foundation\Bus\Dispatchable;
// use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
// use Throwable;
// class ProcessVideoJob implements ShouldQueue
// {
//    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

//     /**
//      * Create a new job instance.
//      */
//     public function __construct(public string $videoPath, public int $adId){}


//     /**
//      * Execute the job.
//      */
//     public function handle(): void
//     {
//         $disk = 'public';
//         $fileName = pathinfo($this->videoPath, PATHINFO_FILENAME);
//         $folder = "videos/hls/{$fileName}";

//         Storage::disk($disk)->makeDirectory($folder);

//         // Define bitrates (resolution + quality)
//         $formats = [
//             ['name' => '360p', 'width' => 640,  'height' => 360,  'bitrate' => 500],
//             ['name' => '720p', 'width' => 1280, 'height' => 720,  'bitrate' => 1500],
//             ['name' => '1080p','width' => 1920, 'height' => 1080, 'bitrate' => 3000],
//         ];

//         $video = FFMpeg::fromDisk($disk)->open($this->videoPath);

//         foreach ($formats as $f) {
//             $exportPath = "{$folder}/{$f['name']}.m3u8";

//             $video->exportForHLS()
//                 ->addFormat(
//                     (new \FFMpeg\Format\Video\X264('aac', 'libx264'))
//                         ->setKiloBitrate($f['bitrate'])
//                         ->setAudioKiloBitrate(128)
//                 )
//                 ->resize($f['width'], $f['height'])
//                 ->toDisk($disk)
//                 ->save($exportPath);
//         }

//         $masterPlaylistContent = "#EXTM3U\n";
//         foreach ($formats as $f) {
//             $masterPlaylistContent .= "#EXT-X-STREAM-INF:BANDWIDTH=" . ($f['bitrate'] * 1024) . ",RESOLUTION={$f['width']}x{$f['height']}\n";
//             $masterPlaylistContent .= "{$f['name']}.m3u8\n";
//         }

//         // Step B: Save the master playlist to the disk
//         $masterPlaylistPath = "{$folder}/master.m3u8";
//         Storage::disk(name: $disk)->put($masterPlaylistPath, $masterPlaylistContent);

//         // Step C: Save the correct master playlist path to the database
//         RealestateAds::where('ads_id', $this->adId)->update([
//             'video_url' => $masterPlaylistPath, // <-- Use the path directly
//         ]);

//         // Step D: Delete the original file
//         Storage::disk($disk)->delete($this->videoPath);

//         // Save the base .m3u8 path in database
//         // RealestateAds::where('ads_id', $this->adId)->update([
//         //     'video_url' => "{$folder}/master.m3u8",
//         // ]);

//         // Optionally delete the original file to save space
//         Storage::disk($disk)->delete($this->videoPath);
//     }


//     public function failed(?Throwable $exception): void
//     {
//         // 1. Clean up any partially created files to avoid orphaned data.
//         $fileName = pathinfo($this->videoPath, PATHINFO_FILENAME);
//         $folder = "videos/hls/{$fileName}";
//         Storage::disk('public')->deleteDirectory($folder);

//         // 2. You could update the ad's status to indicate a processing failure.
//         // This requires an 'ad_status' or 'video_status' column.
//         // RealestateAds::where('ads_id', $this->adId)->update(['video_status' => 'failed']);

//         // 3. Log the failure for debugging.
//         \Log::error('Video processing failed for ad ID: ' . $this->adId, [
//             'video_path' => $this->videoPath,
//             'error' => $exception->getMessage(),
//         ]);
//     }
// }



use App\Models\RealestateAds;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use Throwable;

class ProcessVideoJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     * Good practice to add this.
     * @var int
     */
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(public string $videoPath, public int $adId)
    {
    }

    /**
     * Execute the job.
     */
// In ProcessVideoJob.php

    public function handle(): void
    {
        $disk = 'public';
        $fileName = pathinfo($this->videoPath, PATHINFO_FILENAME);
        $folder = "videos/hls/{$fileName}";

        Storage::disk($disk)->makeDirectory($folder);

        $formats = [
            ['name' => '360p', 'width' => 640,  'height' => 360,  'bitrate' => 800],
            ['name' => '720p', 'width' => 1280, 'height' => 720,  'bitrate' => 2500],
            ['name' => '1080p','width' => 1920, 'height' => 1080, 'bitrate' => 5000],
        ];

        $hlsExporter = FFMpeg::fromDisk($disk)
                            ->open($this->videoPath)
                            ->exportForHLS();

        foreach ($formats as $f) {
            $format = (new \FFMpeg\Format\Video\X264('aac', 'libx264'))
                        ->setKiloBitrate($f['bitrate']);

            $hlsExporter->addFormat($format, function($video) use ($f) {
                $video->resize($f['width'], $f['height']);
            });
        }
        
        $masterPlaylistPath = "{$folder}/master.m3u8";
        $hlsExporter->toDisk($disk)->save($masterPlaylistPath);

        // --- THIS IS THE KEY CHANGE ---
        // The job is done. Now, update the hls_url field.
        RealestateAds::where('ads_id', $this->adId)->update([
            'hls_url' => $masterPlaylistPath,
        ]);

        // Now that the HLS versions are ready, we can delete the large original file.
        Storage::disk($disk)->delete($this->videoPath);
        // After deleting, the `video_url` in the database will point to a non-existent file,
        // but that's okay, because the frontend will now use the `hls_url`.
    }

    /**
     * Handle a job failure.
     */
    public function failed(?Throwable $exception): void
    {
        // 1. Clean up any partially created files
        $fileName = pathinfo($this->videoPath, PATHINFO_FILENAME);
        $folder = "videos/hls/{$fileName}";
        Storage::disk('public')->deleteDirectory($folder);

        // 2. Also delete the original uploaded file if processing failed
        Storage::disk('public')->delete($this->videoPath);

        // 3. Update the database to reflect the failure (optional but recommended)
        // RealestateAds::where('ads_id', $this->adId)->update(['video_status' => 'failed']);

        // 4. Log the specific error for debugging
        Log::error('Video processing job failed for ad ID: ' . $this->adId, [
            'video_path' => $this->videoPath,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(), // Add the full trace
        ]);
    }
}