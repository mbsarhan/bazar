<?php

namespace App\Jobs;

use App\Models\RealestateAds;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class ProcessVideoJob implements ShouldQueue
{
   use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public string $videoPath, public int $adId){}


    /**
     * Execute the job.
     */
    public function handle(): void
    {
               $disk = 'public';
        $fileName = pathinfo($this->videoPath, PATHINFO_FILENAME);
        $folder = "videos/hls/{$fileName}";

        Storage::disk($disk)->makeDirectory($folder);

        // Define bitrates (resolution + quality)
        $formats = [
            ['name' => '360p', 'width' => 640,  'height' => 360,  'bitrate' => 500],
            ['name' => '720p', 'width' => 1280, 'height' => 720,  'bitrate' => 1500],
            ['name' => '1080p','width' => 1920, 'height' => 1080, 'bitrate' => 3000],
        ];

        $video = FFMpeg::fromDisk($disk)->open($this->videoPath);

        foreach ($formats as $f) {
            $exportPath = "{$folder}/{$f['name']}.m3u8";

            $video->exportForHLS()
                ->addFormat(
                    (new \FFMpeg\Format\Video\X264('aac', 'libx264'))
                        ->setKiloBitrate($f['bitrate'])
                        ->setAudioKiloBitrate(128)
                )
                ->resize($f['width'], $f['height'])
                ->toDisk($disk)
                ->save($exportPath);
        }

        // Save the base .m3u8 path in database
        RealestateAds::where('ads_id', $this->adId)->update([
            'video_url' => "{$folder}/master.m3u8",
        ]);

        // Optionally delete the original file to save space
        Storage::disk($disk)->delete($this->videoPath);
    }
}
