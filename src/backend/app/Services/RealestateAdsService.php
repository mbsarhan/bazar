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
use Illuminate\Http\Request; // <-- 1. IMPOR
use App\Models\PendingAdvertisement; // <-- 1. IMPORT

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


    public function getAdsForUser(User $user, Request $request)
    {
        
            // 1. Fetch Advertisements owned by the user that have Real Estate Details.
            $query = Advertisement::where('owner_id', $user->id)
                ->has('realEstateDetails'); // Ensure it's a real estate ad
            if ($request->has('status') && $request->query('status') !== 'all') {
            $status = $request->query('status');
            // Add a where clause to filter by the ad_status
            $query->where('ad_status', $status);
        }
        
        // Eager-load relationships and order the final query
        return $query->with(['realEstateDetails', 'realEstateDetails.ImageForRealestate'])
            ->latest()
            ->get();
    }


     public function createAd(User $user, array $data): Advertisement
    {
        return DB::transaction(function () use ($user, $data) {
            try {
                $advertisement = Advertisement::create([
                    'owner_id'         => $user->id,
                    'title'            => $data['title'],
                    'price'            => $data['price'],
                    'geo_location'     => $data['geo_location'],
                    'description'      => $data['description'] ?? null,
                    'transaction_type' => $data['transaction_type'],
                    'governorate'      => $data['governorate'],
                    'city'             => $data['city'],
                    'ad_status'        => 'قيد المراجعة',
                ]);

                $originalVideoPath = null;
                $videoMimeType = null;
                if (isset($data['video']) && $data['video'] instanceof UploadedFile) {
                    $videoFile = $data['video'];
                    // Store the original video file. Its path is now ready for instant playback.
                    $originalVideoPath = $data['video']->store('videos/real-estate/originals', 'public');
                    $videoMimeType = $videoFile->getMimeType();
                    
                    // Dispatch the background job to transcode this video.
                    // We pass the original path and the main Advertisement ID.
                    ProcessVideoJob::dispatch($originalVideoPath, $advertisement->id);
                }

                $realestateAd = RealestateAds::create([
                    'ads_id'              => $advertisement->id,
                    'realestate_type'     => $data['realestate_type'],
                    'detailed_address'    => $data['detailed_address'],
                    'area'                => $data['area'],
                    'bedroom_num'         => $data['bedroom_num'] ?? null,
                    'bathroom_num'        => $data['bathroom_num'] ?? null,
                    'floor_num'           => $data['floor_num'] ?? null,
                    'building_status'     => $data['building_status'],
                    'cladding_condition'  => $data['cladding_condition'],
                    'negotiable_check'    => $data['negotiable_check'],
                    'video_url'           => $originalVideoPath,
                    'hls_url'             => null,
                    'video_type'          => $videoMimeType,
                ]);

                $this->uploadImages($realestateAd, $data['images']);


                // 2. Handle new file uploads - store them in the "pending" directory
            $pendingMedia = ['new' => [], 'removed' => []]; // No removed images for a new ad
            $fileKeys = ['images'];
            foreach ($fileKeys as $key) {
                if (isset($data[$key])) {
                    $files = is_array($data[$key]) ? $data[$key] : [$data[$key]];
                    foreach ($files as $file) {
                        $path = $file->store('pending/images/real-estate', 'public');
                        $pendingMedia['new'][] = $path;
                    }
                }
            }

            if (isset($data['video']) && $data['video'] instanceof UploadedFile) {
                $path = $data['video']->store('pending/videos/real-estate', 'public');
                $pendingMedia['new_video'] = $path; // Store separately for clarity
            }



            // 3. Create the pending record with the full ad snapshot
            PendingAdvertisement::create([
                'advertisement_id' => $advertisement->id,
                'approval_type'    => 'new', // <-- Mark this as a 'new' ad approval

                // Advertisement fields
                'title'            => $data['title'],
                'price' => $data['price'],
                'description' => $data['description'] ?? null,
                'transaction_type' => $data['transaction_type'],
                'governorate' => $data['governorate'],
                'city' => $data['city'],
                'geo_location' => $data['geo_location'],
                'negotiable_check' => $data['negotiable_check'],
                'views_count' => 0, // Set defaults
                'ad_status' => 'قيد المراجعة',
                
                // Real-Estate ad fields
                'ads_id'              => $advertisement->id,
                'realestate_type'     => $data['realestate_type'],
                'detailed_address'    => $data['detailed_address'],
                'area'                => $data['area'],
                'bedroom_num'         => $data['bedroom_num'] ?? null,
                'bathroom_num'        => $data['bathroom_num'] ?? null,
                'floor_num'           => $data['floor_num'] ?? null,
                'building_status'     => $data['building_status'],
                'cladding_condition'  => $data['cladding_condition'],
                


                
                'pending_media' => $pendingMedia,
            ]);


                // --- ADD THIS LINE ---
                $user->increment('ads_num');


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


                $owner = $ad->owner;



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
                $deleted = $ad->delete() ;

                // --- ADD THIS LOGIC ---
            if ($deleted && $owner) {
                $owner->decrement('ads_num');
            }
                return $deleted;

            } catch (Exception $e) {
                Log::error('Error Deleting RealEstate Ad', ['ad_id' => $ad->id, 'error' => $e->getMessage()]);
                return false;
            }
        });
    }




    /**
     * Creates a pending update request for a Real Estate ad.
     */
    public function requestUpdate(Advertisement $ad, array $data): array
    {
        return DB::transaction(function () use ($ad, $data) {
            // Ensure the specific details for the ad are loaded
            $ad->load('realEstateDetails');

            // 1. Clear any old pending update for this ad to prevent duplicates
            $ad->pendingUpdate()->delete();

            // 2. Merge the original data with the new incoming data
            $originalAdData = $ad->toArray();
            $originalRealEstateData = $ad->realEstateDetails->toArray();
            $pendingData = array_merge($originalAdData, $originalRealEstateData, $data);

            // 3. Handle new file uploads by storing them in a temporary "pending" directory
            $pendingMedia = ['new' => [], 'removed' => $data['removed_media'] ?? []];

            if (!empty($data['images'])) {
                foreach ($data['images'] as $file) {
                    $path = $file->store('pending/images/real-estate', 'public');
                    $pendingMedia['new'][] = $path;
                }
            }
            if (isset($data['video']) && $data['video'] instanceof UploadedFile) {
                $path = $data['video']->store('pending/videos/real-estate', 'public');
                $pendingMedia['new_video'] = $path; // Store separately for clarity
            }

            // 4. Add the final required fields to our data array
            $pendingData['advertisement_id'] = $ad->id;
            $pendingData['pending_media'] = $pendingMedia;
            $pendingData['views_count'] = $ad->views_count; // <-- Save the current view count
            $pendingData['ad_status'] = $ad->ad_status;     // <-- Save the current status

            // 5. Create the new pending update record with the complete snapshot
            PendingAdvertisement::create($pendingData);

            // 6. Set the original ad's status to "pending review"
            $ad->ad_status = 'قيد المراجعة';
            $ad->save();

            return ['message' => 'تم إرسال تعديلاتك للمراجعة بنجاح.'];
        });
    }



    /**
     * Update a Real Estate Advertisement.
     */
    public function updateAd(Advertisement $ad, array $data): array
    {
        // For simplicity, we will skip the "no changes" check for now,
        // as it's very complex with files. We will perform the update.
        // A success message is sufficient for the user.
        
        DB::transaction(function () use ($ad, $data) {
            // 1. Update the parent Advertisement table
            $ad->update([
                'ad_status'        => 'قيد المراجعة',
                'title'            => $data['title'],
                'transaction_type' => $data['transaction_type'],
                'price'            => $data['price'],
                'governorate'      => $data['governorate'],
                'city'             => $data['city'],
                'description'      => $data['description'] ?? null,
            ]);

            // 2. Handle Media Updates (Delete old files first)
            $this->processMediaUpdates($ad, $data);
            
            // 3. Update the RealestateAds details table
            $ad->realEstateDetails->update([
                'realestate_type'     => $data['realestate_type'],
                'detailed_address'    => $data['detailed_address'],
                'area'                => $data['area'],
                'bedroom_num'         => $data['bedroom_num'] ?? null,
                'bathroom_num'        => $data['bathroom_num'] ?? null,
                'floor_num'           => $data['floor_num'] ?? null,
                'building_status'     => $data['building_status'],
                'cladding_condition'  => $data['cladding_condition'],
                'negotiable_check'    => $data['negotiable_check'],
            ]);
        });

        return [
            'message' => 'تم تحديث الإعلان بنجاح!',
            'redirect_url' => '/dashboard/real-estate-ads',
        ];
    }

    private function processMediaUpdates(Advertisement $ad, array $data): void
    {
        $realEstateAd = $ad->realEstateDetails;

        // --- 1. Delete Removed Media ---
        if (!empty($data['removed_media'])) {
            // Delete removed images
            $imagesToDelete = RealestateImage::where('realestate_ad_id', $realEstateAd->id)
                ->whereIn(DB::raw('SUBSTRING_INDEX(image_url, "/", -1)'), $data['removed_media'])
                ->get();

            foreach ($imagesToDelete as $image) {
                Storage::disk('public')->delete($image->image_url);
                $image->delete();
            }

            // Delete removed video (if its filename is in the array)
            if ($realEstateAd->video_url && in_array(basename($realEstateAd->video_url), $data['removed_media'])) {
                Storage::disk('public')->delete($realEstateAd->video_url);
                $realEstateAd->video_url = null;
                $realEstateAd->save();
            }
        }

        // --- 2. Add New Images ---
        if (!empty($data['images'])) {
            foreach ($data['images'] as $imageFile) {
                $path = $imageFile->store('images/real-estate', 'public');
                RealestateImage::create([
                    'realestate_ad_id' => $realEstateAd->id,
                    'image_url' => $path,
                ]);
            }
        }

        // --- 3. Add/Replace Video ---
        if (isset($data['video']) && $data['video'] instanceof UploadedFile) {
            // Delete the old video if it exists
            if ($realEstateAd->video_url) {
                Storage::disk('public')->delete($realEstateAd->video_url);
            }
            // Store the new one and update the record
            $videoPath = $data['video']->store('videos/real-estate', 'public');
            $realEstateAd->video_url = $videoPath;
            $realEstateAd->save();
        }
    }
}