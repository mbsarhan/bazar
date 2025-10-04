<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCarAdRequest;
use App\Services\CarAdService;

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
}