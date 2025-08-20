<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Assignment;
use App\Models\Maintenance;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalAssets = Asset::count();
        $assigned = Asset::where('status', 'Assigned')->count();
        $unassigned = Asset::where('status', 'Unassigned')->count();
        $maintenanceDue = Maintenance::where('status', 'Pending')->count();

        return response()->json([
            'total_assets' => $totalAssets,
            'assigned' => $assigned,
            'unassigned' => $unassigned,
            'maintenance_due' => $maintenanceDue,
        ]);
    }
}
