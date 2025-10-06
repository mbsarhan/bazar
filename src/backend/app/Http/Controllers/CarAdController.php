<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCarAdRequest;
use App\Http\Resources\CarAdResource; // <-- 1. IMPORT THE RESOURCE
use App\Services\CarAdService;
use Illuminate\Http\Request; // <-- 2. IMPORT THE REQUEST

class CarAdController extends Controller
{
    protected CarAdService $carAdService;

    public function __construct(CarAdService $carAdService)
    {
        $this->carAdService = $carAdService;
    }

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
     * Get the car ads for the currently authenticated user.
     */
    public function indexByUser(Request $request)
    {
        // 3. Get the authenticated user from the request
        $user = $request->user();

        // 4. Call the service to get the ads
        $ads = $this->carAdService->getAdsForUser($user);

        // 5. Return the data formatted by our API Resource collection
        return CarAdResource::collection($ads);
    }
}