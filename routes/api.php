<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\DashboardController;

Route::get('/assets', [AssetController::class, 'index']);
Route::post('/assets', [AssetController::class, 'store']);
Route::get('/assets/{id}', [AssetController::class, 'show']);
Route::put('/assets/{id}', [AssetController::class, 'update']);
Route::delete('/assets/{id}', [AssetController::class, 'destroy']);

Route::get('/assignments', [AssignmentController::class, 'index']);
Route::get('/assignments/unassigned-assets', [AssignmentController::class, 'unassignedAssets']);
Route::post('/assignments', [AssignmentController::class, 'store']);
Route::get('/maintenances', [MaintenanceController::class, 'index']);
Route::post('/maintenances', [MaintenanceController::class, 'store']);
Route::put('/maintenances/{id}', [MaintenanceController::class, 'update']);
Route::delete('/maintenances/{id}', [MaintenanceController::class, 'destroy']);
Route::get('/dashboard-stats', [DashboardController::class, 'stats']);

// ⭐ New route for unassign
Route::post('/assignments/{id}/unassign', [AssignmentController::class, 'unassign']);
