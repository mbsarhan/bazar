<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * GET /api/favorites
     * List current user's favorite advertisements.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $favorites = Advertisement::whereHas('favorites', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with(['carDetails.ImagesForCar', 'realEstateDetails.ImageForRealestate', 'owner'])
            ->latest()
            ->get();

        return response()->json([
            'data' => $favorites,
        ]);
    }

    /**
     * POST /api/favorites
     * Body: { "advertisement_id": 123 }
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'advertisement_id' => 'required|integer|exists:advertisements,id',
        ]);

        // create if not exists (unique constraint protects from duplicates)
        $favorite = Favorite::firstOrCreate([
            'user_id'          => $user->id,
            'advertisement_id' => $data['advertisement_id'],
        ]);

        return response()->json([
            'message'  => 'Added to favorites',
            'favorite' => $favorite,
        ], 201);
    }

    /**
     * DELETE /api/favorites
     * Body: { "advertisement_id": 123 }
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'advertisement_id' => 'required|integer|exists:advertisements,id',
        ]);

        $deleted = Favorite::where('user_id', $user->id)
            ->where('advertisement_id', $data['advertisement_id'])
            ->delete();

        return response()->json([
            'message' => $deleted ? 'Removed from favorites' : 'Not found in favorites',
        ]);
    }


    public function status(Request $request)
{
    $user = $request->user();

    $data = $request->validate([
        'advertisement_id' => 'required|integer|exists:advertisements,id',
    ]);

    $exists = \App\Models\Favorite::where('user_id', $user->id)
        ->where('advertisement_id', $data['advertisement_id'])
        ->exists();

    return response()->json([
        'is_favorite' => $exists,
    ]);
}
}