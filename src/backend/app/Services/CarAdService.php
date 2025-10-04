<?php

namespace App\Services;

use App\Models\User;
use App\Models\Advertisement;
use App\Models\CarAds;
use App\Models\CarAdImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
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
                    'price'            => $data['price'],
                    'description'      => $data['description'] ?? '',
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
                    'status'            => $data['status'],
                    'gear'              => $data['gear'],
                    'fule_type'         => $data['fule_type'],
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
}