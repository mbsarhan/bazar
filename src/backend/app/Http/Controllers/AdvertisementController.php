<?php

namespace App\Http\Controllers;

use App\Models\advertisement;
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
     * Display the specified resource.
     */
    public function show(advertisement $advertisement)
    {
        //
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
