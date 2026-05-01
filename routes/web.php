<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
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

        // Tasks
        Route::get('tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');
        Route::post('tasks', [TaskController::class, 'store'])->name('tasks.store');
        Route::patch('tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
        Route::delete('tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
        Route::patch('tasks/{task}/move', [TaskController::class, 'move'])->name('tasks.move');

        // Task Items
        Route::post('tasks/{task}/items', [TaskController::class, 'storeItem'])->name('tasks.items.store');
        Route::patch('tasks/{task}/items/{item}', [TaskController::class, 'toggleItem'])->name('tasks.items.toggle');
        Route::delete('tasks/{task}/items/{item}', [TaskController::class, 'destroyItem'])->name('tasks.items.destroy');

        // Timer
        Route::post('tasks/{task}/timer/start', [TaskController::class, 'startTimer'])->name('tasks.timer.start');
        Route::post('tasks/{task}/timer/stop', [TaskController::class, 'stopTimer'])->name('tasks.timer.stop');
    });
});

require __DIR__.'/settings.php';
