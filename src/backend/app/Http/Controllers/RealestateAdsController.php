<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\RealestateAds;
use App\Services\RealestateAdsService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
        
        $userId = $request->user()->id;

        try {
            // 2. Call the service method, passing the user ID to fetch their specific ads
            $ads = $this->realestateAdsService->getAdsForUser($userId);

            // 3. Return the list of ads with a 200 OK status
            return response()->json([
                'message' => 'Real Estate Ads retrieved successfully.',
                'ads' => $ads
            ], 200);

        } catch (Exception $e) {
            // 4. Handle any generic error thrown by the service (logged in service)
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
            // Call the service method to find the ad, increment view, and handle internal errors
            $ad = $this->realestateAdsService->showAd($id);

            // Return the ad data with a 200 OK status
            return response()->json([
                'message' => 'Ad retrieved successfully.',
                'ad' => $ad
            ], 200);
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
