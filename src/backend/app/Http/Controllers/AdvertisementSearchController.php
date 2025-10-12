<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\SearchAdvertisementsRequest;
use App\Http\Resources\AdvertisementResource;
use App\Services\AdvertisementSearchService;
class AdvertisementSearchController extends Controller
{
    protected AdvertisementSearchService $searchService;

    public function __construct(AdvertisementSearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Handle the incoming search request for advertisements.
     */
    public function search(SearchAdvertisementsRequest $request)
    {
        $results = $this->searchService->search($request->validated());

        return response()->json($results);
    }
}
