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
         try {
            // 1️⃣ Create an HLS version using Cloudinary’s explicit API
            $response = Cloudinary::uploadApi()->explicit($this->videoPath, [
                'resource_type' => 'video',
                'type' => 'upload',
                'eager' => [
                    [
                        'format' => 'm3u8',
                        'streaming_profile' => 'full_hd'
                    ]
                ],
                'eager_async' => false,
            ]);

            $hlsUrl = $response['eager'][0]['secure_url'] ?? null;

            if ($hlsUrl) {
                RealestateAds::where('ads_id', $this->adId)->update([
                    'hls_url' => $hlsUrl,
                    'video_type' => 'application/x-mpegURL',
                ]);
            }

            // (Optional) Delete original to save storage
            Cloudinary::uploadApi()->destroy($this->videoPath, [
                'resource_type' => 'video',
            ]);

        } catch (Throwable $e) {
            Log::error('Cloudinary HLS processing failed for ad ID ' . $this->adId, [
                'video_public_id' => $this->videoPath,
                'error' => $e->getMessage(),
            ]);
            $this->failed($e);
        }
    }

    /**
     * Handle a job failure.
     */
   public function failed(?Throwable $exception): void
    {
         try {
            Cloudinary::uploadApi()->destroy($this->videoPath, [
                'resource_type' => 'video',
            ]);
        } catch (\Exception $e) {
            // no-op
        }

        Log::error('Cloudinary video job failed completely', [
            'adId' => $this->adId,
            'error' => $exception?->getMessage(),
        ]);
    }
}