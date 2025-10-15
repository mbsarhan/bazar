<?php
namespace App\Services;

use Exception;
use App\Models\User;
use App\Jobs\ProcessVideoJob;
use App\Models\Advertisement;
use App\Models\RealestateAds;
use App\Models\RealestateImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RealestateAdsService{
   
    public function showAd(int $id)
    {
        try {
            // 1. Find the parent ad (Advertisement) by ID, and eagerly load the related real estate details and images.
            $ad = Advertisement::with('realEstateDetails.ImageForRealestate')->findOrFail($id);

            // 2. Check if this ad actually has real estate details (to confirm it's not a car ad, for example)
            if (!$ad->realEstateDetails) {
                 // Throw a specific ModelNotFoundException if the AD ID exists but is not a real estate type
                 throw new ModelNotFoundException("The requested Ad (ID: {$id}) is not a Real Estate listing.");
            }


            return $ad;

        } catch (ModelNotFoundException $e) {
            // Throw a specific exception for the controller to handle a 404 response
            // This catches both failure to find the Ad ID and the ad not being a Real Estate type.
            throw $e;
            
        } catch (Exception $e) {
            // Log any other unexpected errors and re-throw a generic exception
            Log::error("RealestateAdsService show error: {$e->getMessage()}", ['id' => $id, 'trace' => $e->getTraceAsString()]);
            throw new Exception("An internal error occurred while retrieving the ad.");
        }
    }


    public function getAdsForUser(User $user)
    {
        try {
            // 1. Fetch Advertisements owned by the user that have Real Estate Details.
            $ads = Advertisement::where('owner_id', $user->id)
                ->has('realEstateDetails') // Ensure it's a real estate ad
            // Eager-load all necessary relationships for the API Resource
            ->with(['realEstateDetails.ImageForRealestate', 'owner'])
            ->latest() // Order by newest first
            ->get();

            return $ads;
        } catch (Exception $e) {
            Log::error("Error retrieving user's real estate ads (User ID: {$user->id}): " . $e->getMessage());
            // Rethrow the exception to be handled by the controller
            throw new Exception("Failed to retrieve user's real estate ads.");
        }
    }


     public function createAd(User $user, array $data): Advertisement
    {
        return DB::transaction(function () use ($user, $data) {
            try {
                $advertisement = Advertisement::create([
                    'owner_id'         => $user->id,
                    'title'            => $data['title'],
                    'price'            => $data['price'],
                    'description'      => $data['description'],
                    'transaction_type' => $data['transaction_type'],
                    'governorate'      => $data['governorate'],
                    'city'             => $data['city'],
                    'ad_status'        => 'قيد المراجعة',
                ]);

                $originalVideoPath = null;
                if (isset($data['video']) && $data['video'] instanceof UploadedFile) {
                    // Store the original video file. Its path is now ready for instant playback.
                    $originalVideoPath = $data['video']->store('videos/real-estate/originals', 'public');
                    
                    // Dispatch the background job to transcode this video.
                    // We pass the original path and the main Advertisement ID.
                    ProcessVideoJob::dispatch($originalVideoPath, $advertisement->id);
                }

                $realestateAd = RealestateAds::create([
                    'ads_id'              => $advertisement->id,
                    'realestate_type'     => $data['realestate_type'],
                    'detailed_address'    => $data['detailed_address'],
                    'realestate_size'     => $data['realestate_size'],
                    'bedroom_num'         => $data['bedroom_num'] ?? null,
                    'bathroom_num'        => $data['bathroom_num'] ?? null,
                    'floor_num'           => $data['floor_num'] ?? null,
                    'building_status'     => $data['building_status'],
                    'cladding_condition'  => $data['cladding_condition'],
                    'negotiable_check'    => $data['negotiable_check'],
                    'video_url'           => $originalVideoPath,
                    'hls_url'             => null,
                ]);

                $this->uploadImages($realestateAd, $data['images']);

                return $advertisement;

            } catch (Exception $e) {
                Log::error('Failed to create real estate ad', ['error' => $e->getMessage()]);
                throw $e;
            }
        });
    }


    // This method now accepts the images array directly
    private function uploadImages(RealestateAds $realestateAd, array $images): void
    {
        foreach ($images as $imageFile) {
            $path = $imageFile->store('images/real-estate', 'public');
            RealestateImage::create([
                'realestate_ad_id' => $realestateAd->id,
                'image_url' => $path,
            ]);
        }
    }


     protected function uploadVideo(Advertisement $advertisement, UploadedFile $video_file): string
    {
        try {
            $fileName = uniqid('ad_video_') . '.' . $video_file->getClientOriginalExtension();
            // Store the video in a specific directory (e.g., 'realestate_ads/{ad_id}/videos')
            $path = $video_file->storeAs("videos/real-estate", $fileName, 'public');

            if (!$path) {
                throw new Exception("Failed to store video file.");
            }
            return $path;
        } catch (Exception $e) {
            Log::error('Failed to upload video for ad', [
                'advertisement_id' => $advertisement->id,
                'error'            => $e->getMessage(),
                'trace'            => $e->getTraceAsString(),
            ]);
            throw $e; // Re-throw to ensure transaction rollback
        }
    }


    public function deleteRealEstateAd(Advertisement $ad): bool // 2. TYPE-HINT the correct model
    {
        return DB::transaction(function () use ($ad) {
            try {
                // 3. Delete associated images from storage
                $ad->load(['realEstateDetails', 'realEstateDetails.ImageForRealestate']);

                if ($ad->realEstateDetails && $ad->realEstateDetails->ImageForRealestate) {
                    foreach ($ad->realEstateDetails->ImageForRealestate as $image) {
                        Storage::disk('public')->delete($image->image_url);
                    }
                }

                // --- 3.2: Delete associated Video file from storage ---
                // بما أن video_url هو حقل مباشر على RealestateAds، فإننا نتحقق منه ونحذفه
                if ($ad->realEstateDetails && $ad->realEstateDetails->video_url) {
                    // $ad->realEstateDetails هو نموذج RealestateAds
                    Storage::disk('public')->delete($ad->realEstateDetails->video_url); 
                }

                // 4. Delete the advertisement record from the database.
                // Cascading deletes will handle the rest.
                return $ad->delete();

            } catch (Exception $e) {
                Log::error('Error Deleting RealEstate Ad', ['ad_id' => $ad->id, 'error' => $e->getMessage()]);
                return false;
            }
        });
    }
}