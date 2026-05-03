<?php

use App\Enums\BoardItemPriority;
use App\Enums\TeamRole;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\BoardItem;
use App\Models\BoardItemChecklistItem;
use App\Models\BoardItemComment;
use App\Models\Team;
use App\Models\User;

function makeBoardForUser(User $user): Board
{
    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => TeamRole::Owner->value]);
    $user->update(['current_team_id' => $team->id]);

    $board = Board::factory()->create([
        'team_id' => $team->id,
        'created_by' => $user->id,
    ]);
    $board->members()->attach($user);

    BoardColumn::factory()->create(['board_id' => $board->id, 'name' => 'To Do', 'order' => 1]);

    return $board->fresh(['team', 'columns']);
}

test('board members can create an item', function () {
    $user = User::factory()->create();
    $board = makeBoardForUser($user);
    $column = $board->columns->first();

    $response = $this->actingAs($user)->post(
        route('boards.items.store', ['current_team' => $board->team, 'board' => $board]),
        [
            'title' => 'Setup UX Storyboard',
            'description' => 'Collect feedback',
            'board_column_id' => $column->id,
            'priority' => BoardItemPriority::High->value,
            'estimated_minutes' => 300,
            'assignees' => [$user->id],
            'tags' => ['Backlog', 'In Progress'],
        ],
    );

    $item = BoardItem::firstOrFail();
    $response->assertRedirect(route('boards.items.show', [
        'current_team' => $board->team,
        'board' => $board,
        'item' => $item,
    ]));

    expect($item->title)->toBe('Setup UX Storyboard')
        ->and($item->priority)->toBe(BoardItemPriority::High)
        ->and($item->number)->toBe(1)
        ->and($item->assignees)->toHaveCount(1)
        ->and($item->tags->pluck('name')->all())->toEqualCanonicalizing(['Backlog', 'In Progress']);
});

test('non-members cannot create items', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $board = makeBoardForUser($owner);

    $stranger->update(['current_team_id' => $board->team_id]);
    $board->team->members()->attach($stranger, ['role' => TeamRole::Member->value]);

    $response = $this->actingAs($stranger)->post(
        route('boards.items.store', ['current_team' => $board->team, 'board' => $board]),
        ['title' => 'X', 'board_column_id' => $board->columns->first()->id],
    );

    $response->assertForbidden();
});

test('board members can view an item', function () {
    $user = User::factory()->create();
    $board = makeBoardForUser($user);
    $item = BoardItem::factory()->forBoard($board)->create();

    $response = $this->actingAs($user)->get(route('boards.items.show', [
        'current_team' => $board->team,
        'board' => $board,
        'item' => $item,
    ]));

    $response->assertOk();
});

test('updating an item patches only the provided fields', function () {
    $user = User::factory()->create();
    $board = makeBoardForUser($user);
    $item = BoardItem::factory()->forBoard($board)->create([
        'title' => 'Original',
        'description' => 'Original description',
    ]);

    $this->actingAs($user)->patch(
        route('boards.items.update', [
            'current_team' => $board->team,
            'board' => $board,
            'item' => $item,
        ]),
        ['description' => 'Updated description'],
    )->assertRedirect();

    expect($item->refresh()->title)->toBe('Original')
        ->and($item->description)->toBe('Updated description');
});

test('item numbers are unique per board', function () {
    $user = User::factory()->create();
    $board = makeBoardForUser($user);
    $column = $board->columns->first();

    foreach (['First', 'Second', 'Third'] as $title) {
        $this->actingAs($user)->post(
            route('boards.items.store', ['current_team' => $board->team, 'board' => $board]),
            ['title' => $title, 'board_column_id' => $column->id],
        );
    }

    expect(BoardItem::pluck('number')->all())->toBe([1, 2, 3]);
});

test('time tracker accumulates seconds across start and stop', function () {
    $user = User::factory()->create();
    $board = makeBoardForUser($user);
    $item = BoardItem::factory()->forBoard($board)->create();

    $startedAt = now()->subSeconds(120);
    $item->update(['time_tracker_started_at' => $startedAt]);

    $this->actingAs($user)->post(route('boards.items.time-tracker.stop', [
        'current_team' => $board->team,
        'board' => $board,
        'item' => $item,
    ]))->assertRedirect();

    $item->refresh();
    expect($item->time_tracker_started_at)->toBeNull()
        ->and($item->tracked_seconds)->toBeGreaterThanOrEqual(120);
});

test('starting the tracker also stamps started_at on first run', function () {
    $user = User::factory()->create();
    $board = makeBoardForUser($user);
    $item = BoardItem::factory()->forBoard($board)->create(['started_at' => null]);

    $this->actingAs($user)->post(route('boards.items.time-tracker.start', [
        'current_team' => $board->team,
        'board' => $board,
        'item' => $item,
    ]))->assertRedirect();

    $item->refresh();
    expect($item->time_tracker_started_at)->not->toBeNull()
        ->and($item->started_at)->not->toBeNull();
});

test('comments can be created and removed by their author', function () {
    $user = User::factory()->create();
    $board = makeBoardForUser($user);
    $item = BoardItem::factory()->forBoard($board)->create();

    $this->actingAs($user)->post(route('boards.items.comments.store', [
        'current_team' => $board->team,
        'board' => $board,
        'item' => $item,
    ]), ['body' => 'Looks great!'])->assertRedirect();

    $comment = BoardItemComment::firstOrFail();
    expect($comment->body)->toBe('Looks great!');

    $this->actingAs($user)->delete(route('boards.items.comments.destroy', [
        'current_team' => $board->team,
        'board' => $board,
        'item' => $item,
        'comment' => $comment,
    ]))->assertRedirect();

    expect(BoardItemComment::count())->toBe(0);
});

test('checklist items appear on the show payload under snake_case key', function () {
    $user = User::factory()->create();
    $board = makeBoardForUser($user);
    $item = BoardItem::factory()->forBoard($board)->create();
    $item->checklistItems()->create(['name' => 'Conduct market research', 'order' => 1]);

    $this->actingAs($user)
        ->get(route('boards.items.show', [
            'current_team' => $board->team,
            'board' => $board,
            'item' => $item,
        ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('boards/items/show')
            ->where('item.checklist_items.0.name', 'Conduct market research'));
});

test('checklist items toggle completed state', function () {
    $user = User::factory()->create();
    $board = makeBoardForUser($user);
    $item = BoardItem::factory()->forBoard($board)->create();

    $this->actingAs($user)->post(route('boards.items.checklist-items.store', [
        'current_team' => $board->team,
        'board' => $board,
        'item' => $item,
    ]), ['name' => 'Conduct market research'])->assertRedirect();

    $checklistItem = BoardItemChecklistItem::firstOrFail();
    expect($checklistItem->completed_at)->toBeNull();

    $this->actingAs($user)->patch(route('boards.items.checklist-items.update', [
        'current_team' => $board->team,
        'board' => $board,
        'item' => $item,
        'checklistItem' => $checklistItem,
    ]), ['completed' => true])->assertRedirect();

    expect($checklistItem->refresh()->completed_at)->not->toBeNull();
});

test('items appear on the board show page payload', function () {
    $user = User::factory()->create();
    $board = makeBoardForUser($user);
    $item = BoardItem::factory()->forBoard($board)->create(['title' => 'Visible task']);

    $this->actingAs($user)
        ->get(route('boards.show', ['current_team' => $board->team, 'board' => $board]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('boards/show')
            ->where('columns.0.items.0.id', $item->id)
            ->where('columns.0.items.0.title', 'Visible task'));
});

test('deleting an item removes it', function () {
    $user = User::factory()->create();
    $board = makeBoardForUser($user);
    $item = BoardItem::factory()->forBoard($board)->create();

    $this->actingAs($user)->delete(route('boards.items.destroy', [
        'current_team' => $board->team,
        'board' => $board,
        'item' => $item,
    ]))->assertRedirect();

    expect(BoardItem::count())->toBe(0);
});
