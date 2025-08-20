<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Assignment;
use App\Models\Asset;

class AssignmentController extends Controller
{
    // Get all assignments (with asset info)
    public function index()
    {
        return response()->json(
            Assignment::with('asset')->orderBy('created_at', 'desc')->get()
        );
    }

    // Get unassigned assets for dropdown
    public function unassignedAssets()
    {
        $assets = Asset::where('status', 'Unassigned')
        ->whereDoesntHave('maintenances', function ($query) {
            $query->where('status', 'Pending'); // Exclude if asset has pending maintenance
        })
        ->get();
        return response()->json($assets);
    }

    // Store new assignment
    public function store(Request $request)
    {
        $request->validate([
            'asset_id' => 'required|exists:assets,id',
            'employee' => 'required|string'
        ]);

        // Create assignment
        $assignment = Assignment::create([
            'asset_id' => $request->asset_id,
            'employee' => $request->employee,
            'date_assigned' => now()
        ]);

        // Update asset status to 'Assigned'
        $asset = Asset::findOrFail($request->asset_id);
        $asset->status = 'Assigned';
        $asset->save();

        return response()->json($assignment, 201);
    }

    // Unassign asset
    public function unassign($id)
    {
        $assignment = Assignment::findOrFail($id);

        // Mark unassign time
        $assignment->date_unassigned = now();
        $assignment->save();

        // Update asset back to 'Unassigned'
        $asset = Asset::findOrFail($assignment->asset_id);
        $asset->status = 'Unassigned';
        $asset->save();

        return response()->json(['message' => 'Asset unassigned successfully']);
    }
}



// public function unassignedAssets()
//     {
//         $assets = Asset::where('status', 'Unassigned')->get();
//         return response()->json($assets);
//     }