<?php
namespace App\Services;

use Exception;
use App\Models\User;
use App\Models\Advertisement;
use App\Models\RealestateAds;
use Illuminate\Support\Facades\Log;
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


    public function getAdsForUser($userId)
    {
        try {
            // Fetch all Advertisements belonging to the user ($userId)
            // We must eager load the realEstateDetails and its nested ImageForRealestate
            $ads = Advertisement::where('owner_id', $userId)
                // Filter to only include ads that have related RealestateAds details
                ->whereHas('realEstateDetails')
                ->with('realEstateDetails.ImageForRealestate')
                ->latest() // Order by creation date descending
                ->get();
                
            return $ads;

        } catch (Exception $e) {
            // Log any unexpected error
            Log::error("RealestateAdsService index error: Failed to retrieve ads for user ID {$userId}. Error: {$e->getMessage()}", [
                'user_id' => $userId, 
                'trace' => $e->getTraceAsString()
            ]);
            throw new Exception('An internal error occurred while fetching your real estate ads.');
        }
    }
}