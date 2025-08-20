<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Asset;

class AssetController extends Controller
{
    // Get all assets
    public function index()
    {
        return response()->json(Asset::all());
    }

    // Store new asset
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'status' => 'required|in:Assigned,Unassigned'
        ]);

        $asset = Asset::create($request->all());
        return response()->json($asset, 201);
    }

    // Show single asset
    public function show($id)
    {
        $asset = Asset::findOrFail($id);
        return response()->json($asset);
    }

    // Update asset
    public function update(Request $request, $id)
    {
        $asset = Asset::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:Assigned,Unassigned'
        ]);

        $asset->update($request->all());
        return response()->json($asset);
    }

    // Delete asset
    public function destroy($id)
    {
        $asset = Asset::findOrFail($id);
        $asset->delete();
        return response()->json(['message' => 'Asset deleted']);
    }
}
