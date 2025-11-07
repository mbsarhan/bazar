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
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary; 

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
        // $this->videoPath is the "public_id" of the original video on Cloudinary,
        // e.g., 'videos/real-estate/originals/xyz'

        // 1. Define the HLS transformation for Cloudinary
        $transformation = [
            ['quality' => 'auto', 'width' => 1920, 'height' => 1080, 'bitrate' => '5m'],
            ['quality' => 'auto', 'width' => 1280, 'height' => 720, 'bitrate' => '2.5m'],
            ['quality' => 'auto', 'width' => 640, 'height' => 360, 'bitrate' => '800k'],
        ];

        // 2. Get the final HLS URL from Cloudinary. This does NOT re-upload, it just builds the URL.
        // You were correct to use getVideoUrl()
        $hlsUrl = Cloudinary::getVideoUrl($this->videoPath, [
            'resource_type' => 'video',
            'transformation' => $transformation,
        ]);

        // 3. Update the database with the final HLS URL.
        RealestateAds::where('ads_id', $this->adId)->update([
            'hls_url' => $hlsUrl,
            'video_type' => 'application/x-mpegURL',
        ]);

        // 4. Delete the original, unprocessed video from Cloudinary to save space.
        Cloudinary::destroy($this->videoPath, ['resource_type' => 'video']);
    }

    /**
     * Handle a job failure.
     */
   public function failed(?Throwable $exception): void
    {
        // If the job fails, delete the original video that was uploaded
        Cloudinary::destroy($this->videoPath, ['resource_type' => 'video']);

        Log::error('Cloudinary video processing failed for ad ID: ' . $this->adId, [
            'video_public_id' => $this->videoPath,
            'error' => $exception->getMessage(),
        ]);
    }
}