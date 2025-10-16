<?php

namespace App\Services;

use App\Models\User;
use App\Models\Advertisement;
use App\Models\CarAds;
use App\Models\CarAdImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage; // 1. IMPORT
use Exception;

class CarAdService
{
    public function createAd(User $user, array $data): array
    {
        // Use a transaction to ensure all or nothing is saved.
        return DB::transaction(function () use ($user, $data) {
            try {
                // 1. Create the base Advertisement
                $advertisement = Advertisement::create([
                    'owner_id'         => $user->id,
                    'title'            => $data['manufacturer']." ".$data['model']." ".$data['model_year'],
                    'price'            => $data['price'],
                    'description'      => $data['description'] ?? null,
                    'transaction_type' => $data['transaction_type'],
                    'governorate'      => $data['governorate'],
                    'city'             => $data['city'],
                ]);

                // 2. Create the Car Ad details
                $carAd = CarAds::create([
                    'ads_id'            => $advertisement->id,
                    'manufacturer'      => $data['manufacturer'],
                    'model'             => $data['model'], // The model was missing from your fillable array
                    'model_year'        => $data['model_year'],
                    'condition'         => $data['condition'],
                    'gear'              => $data['gear'],
                    'fuel_type'         => $data['fuel_type'],
                    'distance_traveled' => $data['distance_traveled'],
                    'negotiable_check'  => $data['negotiable_check'],
                ]);

                // 3. Handle Image Uploads
                $this->uploadImages($carAd, $data);

                return ['message' => 'تم إنشاء إعلانك بنجاح وسيكون متاحاً بعد المراجعة.'];

            } catch (Exception $e) {
                Log::error('Failed to create car ad', ['error' => $e->getMessage()]);
                // The transaction will automatically roll back.
                // Rethrow the exception to return a server error response.
                throw $e;
            }
        });
    }

    private function uploadImages(CarAds $carAd, array $data): void
    {
        // Combine mandatory and extra images for processing
        $imagesToUpload = [
            'front' => $data['front'] ?? null,
            'back'  => $data['back'] ?? null,
            'side1' => $data['side1'] ?? null,
            'side2' => $data['side2'] ?? null,
        ];

        // Process mandatory images
        foreach ($imagesToUpload as $imageFile) {
            if ($imageFile) {
                $path = $imageFile->store('images/cars', 'public');
                CarAdImage::create([
                    'car_ad_id' => $carAd->id,
                    'image_url' => $path,
                ]);
            }
        }
        
        // Process extra images if they exist
        if (!empty($data['extra_images'])) {
            foreach ($data['extra_images'] as $imageFile) {
                $path = $imageFile->store('images/cars', 'public');
                CarAdImage::create([
                    'car_ad_id' => $carAd->id,
                    'image_url' => $path,
                ]);
            }
        }
    }
    /**
     * Get all car ads for a specific user.
     */
    public function getAdsForUser(User $user)
    {
        // 1. Start with the Advertisement model
        return Advertisement::where('owner_id', $user->id)
            // 2. Only get ads that have car details (this filters out real estate ads)
            ->has('carDetails')
            // 3. Eager-load the necessary relationships to prevent N+1 query problems
            ->with(['carDetails', 'carDetails.ImagesForCar'])
            // 4. Order by the most recently created
            ->latest()
            // 5. Get the results
            ->get();
    }
     public function getAdById($ad_id)
    {
        try
        {
            // Use findOrFail to get a single model or throw a 404 error if not found.
            // Eager-load the relationships to prevent N+1 query problems.
            $ad = Advertisement::with(['carDetails', 'carDetails.ImagesForCar', 'owner']) // Eager-load the owner info
                               ->findOrFail($ad_id);
            return $ad;
        }
        catch(Exception $e)
        {
            Log::error('Error showing CarAd info : '.$e->getMessage());
            throw new Exception($e->getMessage());
        }
    }

    public function deleteCarAd(Advertisement $ad): bool // 2. TYPE-HINT the correct model
    {
        /*
        // code with ABD before the latest Ai way
        try{
            $Ad = User::findOrFail($carAd_id) ;
            return $Ad->delete();

        }catch(Exception $e){
            Log::error('Error Deleting Car AD : ' . $e->getMessage()) ;
        }
        */
        return DB::transaction(function () use ($ad) {
            try {
                // 3. Delete associated images from storage
                $ad->load(['carDetails', 'carDetails.ImagesForCar']);

                if ($ad->carDetails && $ad->carDetails->ImagesForCar) {
                    foreach ($ad->carDetails->ImagesForCar as $image) {
                        Storage::disk('public')->delete($image->image_url);
                    }
                }

                // 4. Delete the advertisement record from the database.
                // Cascading deletes will handle the rest.
                return $ad->delete();

            } catch (Exception $e) {
                Log::error('Error Deleting Car Ad', ['ad_id' => $ad->id, 'error' => $e->getMessage()]);
                return false;
            }
        });
    }


    /**
     * Update a car advertisement based on your detailed plan.
     */
    public function updateAd(Advertisement $ad, array $data): array
    {
        // 1. Load all necessary relationships
        $ad->load(['carDetails', 'carDetails.ImagesForCar']);

        // // 2. Build Snapshots for comparison
        // $currentSnapshot = $this->buildSnapshot($ad);
        // $incomingSnapshot = $this->buildIncomingSnapshot($data, $currentSnapshot);

        // // 3. Compare Snapshots
        // if ($currentSnapshot == $incomingSnapshot) {
        //     return ['message' => 'لا توجد تغييرات لتحديث الإعلان.', 'no_changes' => true];
        // }

        // 4. Perform Update within a Transaction
        DB::transaction(function () use ($ad, $data) {
            // Update Advertisement table
            $ad->update([
                'ad_status'       => 'قيد المراجعة', // Reset status to 'Under Review' on update
                'title'            => $data['manufacturer']." ".$data['model']." ".$data['model_year'],
                'transaction_type' => $data['transaction_type'],
                'price'            => $data['price'],
                'governorate'      => $data['governorate'],
                'city'             => $data['city'],
                'description'      => $data['description'] ?? null,
            ]);
            
            // Update CarAds table
            $ad->carDetails->update([
                'manufacturer'      => $data['manufacturer'],
                'model'             => $data['model'],
                'model_year'        => $data['model_year'],
                'condition'            => $data['condition'],
                'gear'              => $data['gear'],
                'fuel_type'         => $data['fuel_type'],
                'distance_traveled' => $data['distance_traveled'],
                'negotiable_check'  => $data['negotiable_check'],
            ]);

            // 5. Handle Image Changes
            $this->processImageUpdates($ad, $data);
        });

        return [
            'message' => 'تم تحديث الإعلان بنجاح!',
            'redirect_url' => '/dashboard/car-ads',
        ];
    }

    

/**
     * The definitive, corrected image processing logic.
     */
    private function processImageUpdates(Advertisement $ad, array $data): void
    {
        $carAdId = $ad->carDetails->id;

        // --- 1. HANDLE MANDATORY IMAGE UPDATES ---
        $mandatorySlots = ['front', 'back', 'side1', 'side2'];
        
        // This is a simplified assumption. A better schema would have a 'type' column
        // in the images table (e.g., 'front', 'extra'). For now, we'll map by order.
        $existingMandatoryImages = CarAdImage::where('car_ad_id', $carAdId)->orderBy('id', 'asc')->limit(4)->get();

        foreach ($mandatorySlots as $index => $slot) {
            // Check if a NEW file was uploaded for this slot (e.g., 'front')
            if (isset($data[$slot])) {
                // Find the old image for this slot, if it exists
                $oldImage = $existingMandatoryImages->get($index);

                // Store the new image
                $path = $data[$slot]->store('images/cars', 'public');

                if ($oldImage) {
                    // If an old image existed, delete it from storage and update the DB record
                    Storage::disk('public')->delete($oldImage->image_url);
                    $oldImage->update(['image_url' => $path]);
                } else {
                    // If no old image existed for this slot, create a new DB record
                    CarAdImage::create([
                        'car_ad_id' => $carAdId,
                        'image_url' => $path,
                    ]);
                }
            }
        }


        // --- 2. HANDLE REMOVED IMAGES ---
        // This primarily targets extra images now.
        if (!empty($data['removed_images'])) {
            $imagesToDelete = CarAdImage::where('car_ad_id', $carAdId)
                ->whereIn(DB::raw('SUBSTRING_INDEX(image_url, "/", -1)'), $data['removed_images'])
                ->get();
                
            foreach ($imagesToDelete as $image) {
                Storage::disk('public')->delete($image->image_url);
                $image->delete();
            }
        }
        

        // --- 3. HANDLE NEW EXTRA IMAGES ---
        if (!empty($data['extra_images'])) {
            foreach ($data['extra_images'] as $imageFile) {
                $path = $imageFile->store('images/cars', 'public');
                CarAdImage::create([
                    'car_ad_id' => $carAdId,
                    'image_url' => $path,
                ]);
            }
        }
    }   
}