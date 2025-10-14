<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Advertisement;
use App\Models\UserRating;
use App\Http\Resources\AdvertisementResource;
use App\Http\Resources\ReviewResource;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PublicProfileController extends Controller
{
    public function show(Request $request, $userId)
{
    $user = User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'المستخدم غير موجود.'], 404);
    }

    $viewer = $request->user('sanctum');

    if ($viewer && $viewer->id === $user->id) {
        return response()->json(['message' => 'لا يمكنك عرض ملفك الشخصي العام.'], 403);
    }

    $userInfo = [
        'id' => $user->id,
        'name' => "{$user->fname} {$user->lname}",
        'memberSince' => Carbon::parse($user->created_at)->translatedFormat('F Y'),
    ];

    $reviewsReceived = UserRating::where('rated_id', $user->id)
        ->with('rater:id,fname,lname')
        ->latest()
        ->get();

    $reviewData = [
        'averageRating' => round($user->review ?? 0, 1),
        'totalReviews' => $reviewsReceived->count(),
        'reviews' => ReviewResource::collection($reviewsReceived),
    ];

    $activeAds = Advertisement::where('owner_id', $user->id)
        ->where('ad_status', 'فعال')
        ->with(['carDetails.ImagesForCar', 'realEstateDetails.ImageForRealestate'])
        ->latest()
        ->get();

    return response()->json([
        'user' => $userInfo,
        'reviews' => $reviewData,
        'ads' => AdvertisementResource::collection($activeAds),
    ]);
}
}