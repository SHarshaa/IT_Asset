<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use App\Models\Asset;

class MaintenanceController extends Controller
{
    public function index() {
        return Maintenance::with('asset')->get();
    }

    public function store(Request $request) {
        $request->validate([
            'asset_id' => 'required|exists:assets,id',
            'description' => 'required|string',
            'date' => 'required|date',
            'due_date' => 'required|date',
            'status' => 'in:Pending,Completed'
        ]);

        // Create the maintenance
        $maintenance = Maintenance::create($request->all());

        // Fetch the asset
        $asset = Asset::findOrFail($request->asset_id);

        // If the asset is currently assigned, unassign it
        if ($asset->status === 'Assigned') {
            $assignment = \App\Models\Assignment::where('asset_id', $asset->id)
                ->whereNull('date_unassigned') // only the active assignment
                ->first();

            if ($assignment) {
                $assignment->date_unassigned = $request->date; // use maintenance date
                $assignment->save();
            }

            // Update asset status back to Unassigned
            $asset->status = 'Unassigned';
            $asset->save();
        }

        return response()->json($maintenance->load('asset'), 201);
    }

    public function update(Request $request, $id) {
        $maintenance = Maintenance::findOrFail($id);

        $request->validate([
            'status' => 'required|in:Pending,Completed',
        ]);

        $maintenance->update($request->only('status'));
        return response()->json($maintenance->load('asset'));
    }

    public function destroy($id) {
        $maintenance = Maintenance::findOrFail($id);
        $maintenance->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}




