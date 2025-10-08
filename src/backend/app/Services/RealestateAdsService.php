<?php
namespace App\Services;

use App\Models\RealestateImage;
use Exception;
use App\Models\User;
use App\Models\Advertisement;
use App\Models\RealestateAds;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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


    public function getAdsForUser($userId)
    {
        try {
            // 1. Fetch Advertisements owned by the user that have Real Estate Details.
            $ads = Advertisement::where('owner_id', $userId)
                ->whereHas('realEstateDetails')
                ->with([
                    // 2. Eager load the realEstateDetails relationship
                    'realEstateDetails' => function ($query) {
                        // CRITICAL: Select only the necessary columns for the relationship:
                        // 'id' (Primary key of RealestateAds for nested relation)
                        // 'ads_id' (Foreign key back to the Advertisement model)
                        $query->select('id', 'ads_id')
                            // 3. Eager load the nested images relationship
                            ->with('ImageForRealestate');
                    },
                ])
                ->get();

            return $ads;
        } catch (Exception $e) {
            Log::error("Error retrieving user's real estate ads (User ID: {$userId}): " . $e->getMessage());
            // Rethrow the exception to be handled by the controller
            throw new Exception("Failed to retrieve user's real estate ads.");
        }
    }


     public function createRealEstateAd(User $user, array $data): array
    {
        return DB::transaction(function () use ($user, $data) {
            try {
                // 1. Create the base Advertisement
                $advertisement = Advertisement::create([
                    'owner_id'         => $user->id,
                    'title'            => $data['title'],
                    'price'            => $data['price'],
                    'description'      => $data['description'] ?? null,
                    'transaction_type' => $data['transaction_type'],
                    'ad_status'        => $data['ad_status'],        // New field
                    'governorate'      => $data['governorate'],
                    'city'             => $data['city'],
                    'views_count'      => 0,                          // New field, initialized to 0
                    'currency_type'    => $data['currency_type'],    // New field
                ]);

                // 2. Create the Real Estate Ad specific details
                $realestateAd = RealestateAds::create([
                    'ads_id'              => $advertisement->id,      // Updated to 'ads_id' based on your model
                    'realestate_type'     => $data['realestate_type'], // New field
                    'detailed_address'    => $data['detailed_address'], // New field
                    'realestate_size'     => $data['realestate_size'],  // New field
                    'bedroom_num'         => $data['bedroom_num'] ?? null, // New field
                    'bathroom_num'        => $data['bathroom_num'] ?? null, // New field
                    'floor_num'           => $data['floor_num'] ?? null,    // New field
                    'building_status'     => $data['building_status'],    // New field
                    'cladding_condition'  => $data['cladding_condition'], // New field
                    'negotiable_check'    => $data['negotiable_check'],   // New field
                    // 'video_url' will be handled by uploadVideo function
                ]);

                // 3. Handle Image Uploads
                $this->uploadImages($realestateAd, $data);
                

                // 4. Handle Video Upload (if present)
                if (isset($data['video']) && $data['video'] instanceof UploadedFile) {
                    $videoPath = $this->uploadVideo($advertisement, $data['video']);
                    // Update the realestateAd with the video URL
                    $realestateAd->update(['video_url' => Storage::url($videoPath)]);
                }

                return [
                    'message' => 'تم إنشاء إعلانك بنجاح وسيكون متاحاً بعد المراجعة.',
                    'ad_id'   => $advertisement->id,
                    'status'  => $advertisement->ad_status // Return status for confirmation
                ];

            } catch (Exception $e) {
                Log::error('Failed to create real estate ad', [
                    'user_id' => $user->id,
                    'data'    => $data,
                    'error'   => $e->getMessage(),
                    'trace'   => $e->getTraceAsString(),
                ]);
                throw $e; // Transaction will automatically roll back
            }
        });
    }


    protected function uploadImages(RealestateAds $realestateAd, array $data): void
    {
        // Combine mandatory and extra images for processing
        $imagesToUpload = [
            'photo1' => $data['photo1'] ?? null,
            'photo2'  => $data['photo2'] ?? null,
        ];

        // Process mandatory images
        foreach ($imagesToUpload as $imageFile) {
            if ($imageFile) {
                $path = $imageFile->store('images/real-estates', 'public');
                RealestateImage::create([
                    'realestate_ad_id' => $realestateAd->id,
                    'image_url' => $path,
                ]);
            }
        }
        
        // Process extra images if they exist
        if (!empty($data['extra_images'])) {
            foreach ($data['extra_images'] as $imageFile) {
                $path = $imageFile->store('images/real-estates', 'public');
                RealestateImage::create([
                    'realestate_ad_id' => $realestateAd->id,
                    'image_url' => $path,
                ]);
            }
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