<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\Advertisement;
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
        try {
            // Get the authenticated user from the request object
        $user = $request->user();

        // Call the service to get the ads
        $ads = $this->realestateAdsService->getAdsForUser($user);

        // Return the data formatted as a collection by our API Resource
        return RealestateAdResource::collection($ads);

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
            //
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
    public function destroy(Advertisement $ad)
    {
        // 4. Call the service to perform the deletion
        $success = $this->realestateAdsService->deleteRealEstateAd($ad);

        if ($success) {
            return response()->json(['message' => 'تم حذف الإعلان بنجاح.']);
        }

        return response()->json(['message' => 'فشل حذف الإعلان.'], 500);

    }
    
}
