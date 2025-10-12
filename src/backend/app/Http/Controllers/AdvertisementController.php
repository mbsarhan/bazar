<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use Illuminate\Http\Request;
use App\Services\AdvertisementService;
use App\Http\Resources\AdvertisementResource;

class AdvertisementController extends Controller
{
    protected AdvertisementService $advertisementService;

    public function __construct(AdvertisementService $advertisementService)
    {
        $this->advertisementService = $advertisementService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ads = $this->advertisementService->getPublicListing();

        // Return the paginated data, formatted through our unified resource
        return AdvertisementResource::collection($ads);
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
     * Display a single specified advertisement.
     * This method is public.
     */
    public function show(Advertisement $ad) // <-- 2. USE ROUTE MODEL BINDING
    {
        // 3. Eager-load all possible relationships needed by the resource.
        $ad->load(['owner', 'carDetails.ImagesForCar', 'realEstateDetails.ImageForRealestate']);

        // 4. Return the data formatted by our powerful, unified resource.
        return new AdvertisementResource($ad);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(advertisement $advertisement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, advertisement $advertisement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(advertisement $advertisement)
    {
        //
    }
}
