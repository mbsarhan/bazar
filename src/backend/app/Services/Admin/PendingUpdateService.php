<?php

namespace App\Services\Admin;

use App\Models\Advertisement;
use App\Models\CarAdImage;
use App\Models\PendingAdvertisement;
use App\Models\RealestateImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\CarAds;
use App\Models\RealestateAds;

class PendingUpdateService
{
    /**
     * Approves a pending update, applying all changes to the original ad.
     * This is the new, robust, and defensive version.
     */
    public function approve(PendingAdvertisement $pendingUpdate): bool
    {
        return DB::transaction(function () use ($pendingUpdate) {
            // Use findOrFail to ensure the ad still exists before we start
            $ad = Advertisement::findOrFail($pendingUpdate->advertisement_id);
            $ad->load(['carDetails', 'realEstateDetails']);

            // --- 1. APPLY TEXT & NUMERIC DATA CHANGES ---
            $advertisementColumns = [
                'title', 'price', 'description', 'transaction_type', 'governorate', 'city', 'geo_location'
            ];
            // Note: We intentionally leave out 'negotiable_check' from this update
            // because it belongs to the details table.
            $ad->update($pendingUpdate->only($advertisementColumns));
            
            // Conditionally update Car or Real Estate details
            if ($ad->carDetails) {
                $carAdColumns = [
                    'manufacturer', 'model', 'model_year', 'condition', 'gear', 
                    'fuel_type', 'distance_traveled', 'negotiable_check',
                ];
                $ad->carDetails->update($pendingUpdate->only($carAdColumns));
            } 
            elseif ($ad->realEstateDetails) {
                $realEstateColumns = [
                    'realestate_type', 'detailed_address', 'area', 'bedroom_num', 'bathroom_num', 
                    'floor_num', 'building_status', 'cladding_condition', 'negotiable_check',
                ];
                $ad->realEstateDetails->update($pendingUpdate->only($realEstateColumns));
            }

            // --- 2. PROCESS PENDING MEDIA ---
            $media = $pendingUpdate->pending_media;
            $disk = 'public';

            // A. Delete old files that were marked for removal
            if (!empty($media['removed'])) {
                if ($ad->carDetails) {
                    $imagesToDelete = CarAdImage::where('car_ad_id', $ad->carDetails->id)
                        ->whereIn(DB::raw('SUBSTRING_INDEX(image_url, "/", -1)'), $media['removed'])->get();
                } else { // Assumes Real Estate
                    $imagesToDelete = RealestateImage::where('realestate_ad_id', $ad->realEstateDetails->id)
                        ->whereIn(DB::raw('SUBSTRING_INDEX(image_url, "/", -1)'), $media['removed'])->get();
                }

                foreach ($imagesToDelete as $image) {
                    Storage::disk($disk)->delete($image->image_url);
                    $image->delete();
                }
            }

            // B. Move new files from "pending" to their permanent location
            if (!empty($media['new'])) {
                foreach ($media['new'] as $pendingPath) {
                    // Check if the pending file actually exists before trying to move it
                    if (Storage::disk($disk)->exists($pendingPath)) {
                        $permanentPath = str_replace('pending/', '', $pendingPath);
                        Storage::disk($disk)->move($pendingPath, $permanentPath);

                        // Create new image record with the permanent path
                        if ($ad->carDetails) {
                            CarAdImage::create(['car_ad_id' => $ad->carDetails->id, 'image_url' => $permanentPath]);
                        } else {
                            RealestateImage::create(['realestate_ad_id' => $ad->realEstateDetails->id, 'image_url' => $permanentPath]);
                        }
                    } else {
                        Log::warning('Tried to approve a pending update, but a new file was missing.', ['path' => $pendingPath]);
                    }
                }
            }

            // --- 3. FINALIZE ---
            $ad->ad_status = 'فعال';
            $ad->save();
            $pendingUpdate->delete();

            return true;
        });
    }

    /**
     * Rejects a pending update, discarding all proposed changes.
     */
    public function reject(PendingAdvertisement $pendingUpdate): bool
    {
        return DB::transaction(function () use ($pendingUpdate) {
            // 1. Delete all new files from the "pending" storage directory
            if (!empty($pendingUpdate->pending_media['new'])) {
                foreach ($pendingUpdate->pending_media['new'] as $pendingPath) {
                    Storage::disk('public')->delete($pendingPath);
                }
            }

            // 2. Reset the original advertisement's status back to 'active'
            $pendingUpdate->advertisement()->update(['ad_status' => 'فعال']);

            // 3. Delete the pending update record
            $pendingUpdate->delete();

            return true;
        });
    }





    /**
     * Creates a "virtual" Advertisement model from a pending update record.
     * This allows us to reuse our existing API Resources.
     */
    public function buildVirtualAdFromPendingUpdate(PendingAdvertisement $pendingUpdate): Advertisement
    {
        // 1. Create a new, in-memory Advertisement instance and fill it with pending data.
        $virtualAd = new Advertisement();
        $virtualAd->forceFill($pendingUpdate->toArray());
        
        // Manually set the ID to match the original ad for consistency
        $virtualAd->id = $pendingUpdate->advertisement_id;

        // 2. Load the original owner relationship onto the virtual ad.
        $virtualAd->setRelation('owner', $pendingUpdate->advertisement->owner);

        // 3. Conditionally create and attach the correct in-memory details model.
        if ($pendingUpdate->manufacturer) { // This is a Car Ad
            $carDetails = new CarAds();
            $carDetails->forceFill($pendingUpdate->toArray());
            // We need to simulate the images relationship
            $carDetails->setRelation('ImagesForCar', collect()); // Start with empty collection
            $virtualAd->setRelation('carDetails', $carDetails);

        } elseif ($pendingUpdate->realestate_type) { // This is a Real Estate Ad
            $realEstateDetails = new RealestateAds();
            $realEstateDetails->forceFill($pendingUpdate->toArray());
            $realEstateDetails->setRelation('ImageForRealestate', collect());
            $virtualAd->setRelation('realEstateDetails', $realEstateDetails);
        }

        return $virtualAd;
    }
}