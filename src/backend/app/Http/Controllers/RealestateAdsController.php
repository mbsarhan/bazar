<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\RealestateAds;
use App\Services\RealestateAdsService;
use App\Http\Requests\StoreRealestateAdRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Resources\RealestateAdResource; // Import the resource

class RealestateAdsController extends Controller
{
    protected $realestateAdsService;
       public function __construct(RealestateAdsService $realestateAdsService)
    {
        $this->realestateAdsService = $realestateAdsService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
       // 1. Defensively check if the user is authenticated.
        $user = $request->user();

        if (!$user) {
            // Since this function is designed to return *user-specific* ads, 
            // we must require authentication. We return 401 if no user is found.
            return response()->json([
                'message' => 'Authorization required to view user-specific advertisements.',
                'error' => 'Unauthenticated'
            ], 401);
        }

        // 2. If the user exists, safely get their ID.
        $userId = $user->id;

        try {
            // 3. Call the service method, passing the user ID to fetch their specific ads
            $ads = $this->realestateAdsService->getAdsForUser($userId);

            // 4. Return the list of ads with a 200 OK status
            return response()->json([
                'message' => 'Real Estate Ads retrieved successfully.',
                'ads' => $ads
            ], 200);

        } catch (Exception $e) {
            // 5. Handle any generic error thrown by the service
            // Note: Service logs the detailed error internally.
            return response()->json([
                'message' => 'Failed to retrieve ads due to a server error.',
                'error' => $e->getMessage()
            ], 500);
        }
    }   
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRealestateAdRequest $request)
    {
        $advertisement = $this->realestateAdsService->createAd($request->user(), $request->validated());

        // Return a success response using the new resource
        return (new RealestateAdResource($advertisement))
                ->additional(['message' => 'تم إنشاء إعلانك بنجاح وسيكون متاحاً بعد المراجعة.'])
                ->response()
                ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
            try {
            // Call the service method to find the ad, increment view, and handle internal errors
            $ad = $this->realestateAdsService->showAd($id);

            // Return the ad data with a 200 OK status
            return response()->json([
                'message' => 'Ad retrieved successfully.',
                'ad' => $ad
            ], 200);

        } catch (ModelNotFoundException $e) {
            // Handle 404 Not Found exception thrown by the service
            return response()->json([
                'message' => $e->getMessage(),
                'error' => 'Not Found'
            ], 404);

        } catch (Exception $e) {
            // Handle any other generic error thrown by the service
            return response()->json([
                'message' => 'Failed to retrieve ad due to a server error.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RealestateAds $realestateAds)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RealestateAds $realestateAds)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RealestateAds $realestateAds)
    {
        //
    }
}
