<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Advertisement;
use App\Services\AdvertisementService;
use App\Http\Resources\AdvertisementResource;
use Illuminate\Support\Facades\DB; // <-- 1. IMPORT DB FACADE
use Illuminate\Validation\Rule;
use App\Http\Resources\Admin\AdminAdListResource; // <-- 1. IMPORT

class AdvertisementController extends Controller
{
    protected AdvertisementService $advertisementService;

    public function __construct(AdvertisementService $advertisementService)
    {
        $this->advertisementService = $advertisementService;
    }
   /**
     * Display a paginated listing of public advertisements.
     */
    public function index(Request $request) // <-- The Request is already here
    {
        // Pass the entire request object to the service.
        $ads = $this->advertisementService->getPublicListing($request);
         // --- 2. ADD VALIDATION FOR ALL FILTERS ---
        $request->validate([
            'type' => ['nullable', 'string', Rule::in(['car', 'real_estate'])],
            'geo_location' => ['nullable', 'string', Rule::in(['Syria', 'Saudi Arabia'])],
            'sort_by' => [ // <-- ADD THIS NEW RULE
                'nullable', 
                'string', 
                Rule::in(['newest-first', 'oldest-first', 'price-asc', 'price-desc'])
            ],
        ]);
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

    public function incrementView(Request $request, Advertisement $ad)
    {
        // --- 2. UPDATE THE LOGIC ---
        $user = $request->user('sanctum');

        if (!$user || $user->id !== $ad->owner_id) {
            // A. The original increment for the total count (still useful)
            $ad->increment('views_count');

            // B. Your brilliant updateOrInsert logic for daily tracking
            DB::table('ad_views')->updateOrInsert(
                ['advertisement_id' => $ad->id, 'date' => today()],
                ['views' => DB::raw('views + 1')]
            );
        }

        return response()->noContent();
    }




        /**
     * Update advertisement status.
     * Endpoint: PATCH /api/advertisements/{ad}/status
     */
    public function updateStatus(Request $request, Advertisement $ad)
    {
        // 1. Verify Ownership
        // We use stricter checking here to ensure safety
        if ($ad->owner_id !== $request->user()->id) {
            return response()->json([
                'message' => 'غير مصرح لك بتعديل هذا الإعلان.'
            ], 403);
        }

        // 2. Validate incoming status
        // Ensure the values exactly match what MyCarAds.js sends
        $request->validate([
            'status' => 'required|string|in:مباع,مؤجر,فعال'
        ]);

        // 3. Logic Check: Prevent changing status if currently "Pending Review"
        if ($ad->ad_status === 'قيد المراجعة') {
            return response()->json([
                'message' => 'لا يمكن تغيير حالة الإعلان لأنه قيد المراجعة حالياً.'
            ], 400);
        }

        // 4. Logic Check: Optimistic Locking / Redundancy check
        // If the status is already the same, just return success
        if ($ad->ad_status === $request->status) {
            return response()->json([
                'message' => 'حالة الإعلان محدثة بالفعل.',
                'ad' => $ad
            ]);
        }

        // 5. Update status in Database
        // We map 'status' from request to 'ad_status' in database
        $ad->update([
            'ad_status' => $request->status
        ]);

        return response()->json([
            'message' => 'تم تحديث حالة الإعلان بنجاح.',
            'ad' => $ad
        ]);
    }



    /**
     * Display a listing of advertisements for the admin panel.
     */
    public function adminIndex(Request $request)
    {
        // Authorization is handled by the 'admin' middleware on the route group

        $ads = $this->advertisementService->getAdminListing($request);

        // Return the data formatted through our new AdminAdListResource
        return AdminAdListResource::collection($ads);
    }





    /**
     * Permanently delete a specified advertisement as an Admin.
     */
    public function adminDestroy(Request $request, Advertisement $ad)
    {
        // Authorization is already handled by the 'admin' middleware on the route group.
        // No extra check is needed here unless you have more specific rules.

        $success = $this->advertisementService->deleteAdAsAdmin($ad);

        if ($success) {
            return response()->json(['message' => 'Advertisement and all its data deleted successfully.']);
        }

        return response()->json(['message' => 'Failed to delete the advertisement.'], 500);
    }
}
