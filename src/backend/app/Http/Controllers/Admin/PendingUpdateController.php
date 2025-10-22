<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PendingAdvertisementUpdate;
use App\Services\Admin\PendingUpdateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\Admin\PendingUpdateResource;
use Exception;

class PendingUpdateController extends Controller
{
    protected PendingUpdateService $pendingUpdateService;

    public function __construct(PendingUpdateService $pendingUpdateService)
    {
        $this->pendingUpdateService = $pendingUpdateService;
    }




    /**
     * Display a paginated listing of pending updates.
     */
    public function index(Request $request)
    {
        if (!$request->user()->admin) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // --- UPDATE THIS LINE to include the owner ---
        $pendingUpdates = PendingAdvertisementUpdate::with('advertisement.owner:id,fname,lname')
                                                    ->latest()
                                                    ->paginate(15);

        // Return a paginated resource collection
        return PendingUpdateResource::collection($pendingUpdates);
    }




    public function approve(Request $request, PendingAdvertisementUpdate $pendingUpdate)
    {
        if (!$request->user()->admin) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $success = $this->pendingUpdateService->approve($pendingUpdate);

            if ($success) {
                return response()->json(['message' => 'The advertisement update has been approved successfully.']);
            }
            
            // This line is good for catching logical failures within the service
            throw new Exception('Approval process did not return true.');

        } catch (Exception $e) {
            // --- THIS IS THE CRITICAL DEBUGGING STEP ---
            // We will now log the *entire exception* to the log file.
            Log::error('ADMIN APPROVAL FAILED - EXCEPTION CAUGHT IN CONTROLLER', [
                'pending_update_id' => $pendingUpdate->id,
                'error_message'     => $e->getMessage(),
                'file'              => $e->getFile(),
                'line'              => $e->getLine(),
                'trace'             => $e->getTraceAsString(), // The full stack trace
            ]);
            // ---------------------------------------------
            
            // We still return the generic error to the user for security.
            return response()->json(['message' => 'An error occurred during the approval process.'], 500);
        }
    }

    /**
     * Reject a pending advertisement update.
     */
    public function reject(Request $request, PendingAdvertisementUpdate $pendingUpdate)
    {
        // --- AUTHORIZATION ---
        if (!$request->user()->admin) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $success = $this->pendingUpdateService->reject($pendingUpdate);

            if ($success) {
                return response()->json(['message' => 'The advertisement update has been rejected.']);
            }

            throw new Exception('Rejection process failed to complete.');

        } catch (Exception $e) {
            Log::error('Admin rejection failed', [
                'pending_update_id' => $pendingUpdate->id,
                'error' => $e->getMessage()
            ]);
            return response()->json(['message' => 'An error occurred during the rejection process.'], 500);
        }
    }
}