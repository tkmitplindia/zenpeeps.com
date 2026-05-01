<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::post('projects/{project}/select', [ProjectController::class, 'select'])->name('projects.select');

    Route::middleware(['current-project'])->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');

        Route::resource('boards', BoardController::class);
        Route::patch('boards/{board}/tasks/{task}/move', [BoardController::class, 'moveTask'])->name('boards.tasks.move');
    });
});

require __DIR__.'/settings.php';
