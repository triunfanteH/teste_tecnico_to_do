<?php

use App\Http\Controllers\Api\V1\ColumnController;
use App\Http\Controllers\Api\V1\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::apiResource('columns', ColumnController::class);
    Route::apiResource('tasks', TaskController::class);
});