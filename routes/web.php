<?php

use App\Http\Controllers\BoardColumnController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardItemAttachmentController;
use App\Http\Controllers\BoardItemChecklistItemController;
use App\Http\Controllers\BoardItemCommentController;
use App\Http\Controllers\BoardItemController;
use App\Http\Controllers\BoardItemTimeTrackerController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');

        Route::resource('boards', BoardController::class);
        Route::patch('boards/{board}/columns/reorder', [BoardColumnController::class, 'reorder'])
            ->name('boards.columns.reorder');
        Route::resource('boards.columns', BoardColumnController::class)
            ->only(['store', 'update', 'destroy'])
            ->scoped(['boardColumn' => 'column']);

        Route::patch('boards/{board}/items/reorder', [BoardItemController::class, 'reorder'])
            ->name('boards.items.reorder');
        Route::resource('boards.items', BoardItemController::class)
            ->only(['create', 'store', 'show', 'update', 'destroy'])
            ->scoped(['item' => 'id']);

        Route::resource('boards.items.comments', BoardItemCommentController::class)
            ->only(['store', 'destroy'])
            ->scoped(['item' => 'id', 'comment' => 'id']);

        Route::resource('boards.items.attachments', BoardItemAttachmentController::class)
            ->only(['store', 'destroy'])
            ->scoped(['item' => 'id', 'attachment' => 'id']);

        Route::resource('boards.items.checklist-items', BoardItemChecklistItemController::class)
            ->only(['store', 'update', 'destroy'])
            ->parameters(['checklist-items' => 'checklistItem'])
            ->scoped(['item' => 'id', 'checklistItem' => 'id']);

        Route::post('boards/{board}/items/{item}/time-tracker/start', [BoardItemTimeTrackerController::class, 'start'])
            ->name('boards.items.time-tracker.start')
            ->scopeBindings();
        Route::post('boards/{board}/items/{item}/time-tracker/stop', [BoardItemTimeTrackerController::class, 'stop'])
            ->name('boards.items.time-tracker.stop')
            ->scopeBindings();
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
