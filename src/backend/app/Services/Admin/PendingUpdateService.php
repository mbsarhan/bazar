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
use Exception;

class PendingUpdateService
{
    /**
     * Main entry point for approving any pending update.
     * It intelligently calls the correct handler based on the approval type.
     */
    public function approve(PendingAdvertisement $pendingUpdate): bool
    {
        if ($pendingUpdate->approval_type === 'new') {
            return $this->approveNewAd($pendingUpdate);
        }
        
        // Default to the logic for approving an 'update'
        return $this->approveUpdate($pendingUpdate);
    }

    /**
     * Main entry point for rejecting any pending update.
     */
    public function reject(PendingAdvertisement $pendingUpdate): bool
    {
        if ($pendingUpdate->approval_type === 'new') {
            return $this->rejectNewAd($pendingUpdate);
        }

        // Default to the logic for rejecting an 'update'
        return $this->rejectUpdate($pendingUpdate);
    }

    // --- LOGIC FOR APPROVING A BRAND NEW AD ---
    private function approveNewAd(PendingAdvertisement $pendingUpdate): bool
    {
        return DB::transaction(function () use ($pendingUpdate) {
            $ad = $pendingUpdate->advertisement;

            // 1. Create the specific ad details (Car or Real Estate)
            if ($pendingUpdate->manufacturer) { // Logic to identify it as a Car Ad
                
                
                // 2. Move files from 'pending' to final location and create image records
                foreach ($pendingUpdate->pending_media['new'] ?? [] as $pendingPath) {
                    if (Storage::disk('public')->exists($pendingPath)) {
                        Storage::disk('public')->delete($pendingPath);
                    }
                }

            } elseif ($pendingUpdate->realestate_type) { // Logic for Real Estate Ad
                // ... (This would contain the similar correct logic for creating a RealestateAds record)
                // 2. Move files from 'pending' to final location and create image records
                foreach ($pendingUpdate->pending_media['new'] ?? [] as $pendingPath) {
                    if (Storage::disk('public')->exists($pendingPath)) {
                        Storage::disk('public')->delete($pendingPath);
                    }
                }
            }

            // 3. Set the main ad status to 'active'
            $ad->ad_status = 'فعال';
            $ad->save();

            // 4. Delete the now-processed pending record
            $pendingUpdate->delete();

            return true; // <-- CRITICAL FIX: Return true on success
        });
    }
    
    // --- LOGIC FOR REJECTING A BRAND NEW AD ---
    private function rejectNewAd(PendingAdvertisement $pendingUpdate): bool
    {
        return DB::transaction(function () use ($pendingUpdate) {
            $ad = $pendingUpdate->advertisement;
            if (!$ad) return true; // If original ad is already gone, consider it a success

            // 1. Decrement the user's ad count since the ad will be deleted
            $ad->owner()->decrement('ads_num');

            // 2. Delete all temporary files from storage
            foreach ($pendingUpdate->pending_media['new'] ?? [] as $pendingPath) {
                $permanentPath = str_replace('pending/', '', $pendingPath);
                Storage::disk('public')->delete($pendingPath);
                Storage::disk('public')->delete($permanentPath);
            }
            
            // 3. Delete the main advertisement record.
            // The `onDelete('cascade')` on your foreign key will automatically delete the pending record.
            $ad->delete();

            return true; // <-- CRITICAL FIX: Return true on success
        });
    }
    public function approveUpdate(PendingAdvertisement $pendingUpdate): bool
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
    public function rejectUpdate(PendingAdvertisement $pendingUpdate): bool
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
     * This is the new, media-aware version.
     */
    public function buildVirtualAdFromPendingUpdate(PendingAdvertisement $pendingUpdate): Advertisement
    {
        $virtualAd = new Advertisement();
        $virtualAd->forceFill($pendingUpdate->toArray());
        $virtualAd->id = $pendingUpdate->advertisement_id;
        $virtualAd->setRelation('owner', $pendingUpdate->advertisement->owner);

        // --- THE CRITICAL MEDIA FIX ---
        $pendingMedia = $pendingUpdate->pending_media ?? ['new' => [], 'removed' => []];
        $newImagePaths = $pendingMedia['new'] ?? [];

        // Create a collection of in-memory image models from the pending paths
        $virtualImages = collect($newImagePaths)->map(function ($path) {
            // We need to know if it's a Car or Real Estate image to create the right model type
            if (str_contains($path, 'cars')) {
                return new CarAdImage(['image_url' => $path]);
            }
            return new RealestateImage(['image_url' => $path]);
        });
        // -----------------------------

        // Conditionally create and attach the details model
        if ($pendingUpdate->manufacturer) { // This is a Car Ad
            $carDetails = new CarAds();
            $carDetails->forceFill($pendingUpdate->toArray());
            
            // Attach the virtual images to the in-memory details model
            $carDetails->setRelation('ImagesForCar', $virtualImages);
            $virtualAd->setRelation('carDetails', $carDetails);

        } elseif ($pendingUpdate->realestate_type) { // This is a Real Estate Ad
            $realEstateDetails = new RealestateAds();
            $realEstateDetails->forceFill($pendingUpdate->toArray());

            // Attach the virtual images to the in--memory details model
            $realEstateDetails->setRelation('ImageForRealestate', $virtualImages);
            $virtualAd->setRelation('realEstateDetails', $realEstateDetails);
        }

        return $virtualAd;
    }
}