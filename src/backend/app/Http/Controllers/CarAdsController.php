<?php

namespace App\Http\Controllers;

use App\Models\CarAds;
use App\Http\Requests\StoreCarAdRequest;
use App\Http\Resources\CarAdResource; // <-- 1. IMPORT THE RESOURCE
use App\Services\CarAdService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\Advertisement;

class CarAdsController extends Controller
{
    protected CarAdService $carAdService;

    public function __construct(CarAdService $carAdService)
    {
        $this->carAdService = $carAdService;
    }
    /**
     * Display a listing of the resource.
     */
    /**
     * Get the car ads for the currently authenticated user.
     */
    public function index(Request $request)
    {
        // 3. Get the authenticated user from the request
        $user = $request->user();

        // 4. Call the service to get the ads
        $ads = $this->carAdService->getAdsForUser($user);

        // 5. Return the data formatted by our API Resource collection
        return CarAdResource::collection($ads);
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
    public function store(StoreCarAdRequest $request)
    {
        // Get the authenticated user
        $user = $request->user();

        // The request class has already validated everything, including files.
        // We can safely pass all validated data to the service.
        $response = $this->carAdService->createAd($user, $request->validated());

        return response()->json($response, 201);
    }

    /**
     * Display the specified resource.
     */
    
    public function show(CarAds $carAds)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CarAds $carAds)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CarAds $carAds)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request,Advertisement $ad)
    {


        // 4. Call the service to perform the deletion
        $success = $this->carAdService->deleteCarAd($ad);

        if ($success) {
            return response()->json(['message' => 'تم حذف الإعلان بنجاح.']);
        }

        return response()->json(['message' => 'فشل حذف الإعلان.'], 500);

    }
}
