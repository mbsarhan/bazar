<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCarAdRequest;
use App\Http\Resources\CarAdResource; // <-- 1. IMPORT THE RESOURCE
use App\Services\CarAdService;
use Illuminate\Http\Request; // <-- 2. IMPORT THE REQUEST
use App\Models\Advertisement;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // <-- 1. IMPORT THE TRAIT
use Illuminate\Support\Facades\Gate; // 1. IMPORT THE GATE FACADE

class CarAdController extends Controller
{

    use AuthorizesRequests; // <-- 2. USE THE TRAIT
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Advertisement $advertisement)
    {
        // --- THIS IS THE NEW, EXPLICIT AUTHORIZATION CHECK ---

        // 2. Get the currently authenticated user.
        //$user = auth()->user();
        // Call the service to perform the deletion.


        // 3. Explicitly check if the user "can" perform the "delete" action
        // on this specific $advertisement model.
        // This will call your CarAdPolicy behind the scenes.
        /*
        if (!Gate::forUser($user)->allows('delete', $advertisement)) {
            // If the policy returns false, manually return a 403 Forbidden response.
            return response()->json(['message' => 'This action is unauthorized.'], 403);
        }
        */
        $response = $this->carAdService->deleteAd($advertisement);

        return response()->json($response);
    }
}