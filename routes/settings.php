<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectMemberController;
use App\Http\Controllers\ProjectRechargeController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\ProjectBillingController;
use App\Http\Controllers\Settings\ProjectUsageController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'current-project'])->group(function () {
    Route::get('settings/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::patch('settings/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('settings/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    Route::post('settings/projects/{project}/members', [ProjectMemberController::class, 'store'])->name('projects.members.store');
    Route::delete('settings/projects/{project}/members/{user}', [ProjectMemberController::class, 'destroy'])->name('projects.members.destroy');

    Route::post('settings/projects/{project}/recharges', [ProjectRechargeController::class, 'store'])->name('projects.recharges.store');

    Route::get('settings/billing/{project}', [ProjectBillingController::class, 'edit'])->name('projects.billing');
    Route::patch('settings/billing/{project}', [ProjectBillingController::class, 'update'])->name('projects.billing.update');

    Route::get('settings/usage/{project}', [ProjectUsageController::class, 'edit'])->name('projects.usage');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});
