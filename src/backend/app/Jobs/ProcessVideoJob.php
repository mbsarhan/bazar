<?php

namespace App\Jobs;


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
    public $timeout = 600;

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
            'video_type' => 'application/x-mpegURL',
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