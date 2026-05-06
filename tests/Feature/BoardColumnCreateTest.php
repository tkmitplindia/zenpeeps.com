<?php

use App\Enums\TeamRole;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\Team;
use App\Models\User;

function setupBoardForColumnCreate(User $user): Board
{
    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => TeamRole::Owner->value]);
    $user->update(['current_team_id' => $team->id]);

    $board = Board::factory()->create(['team_id' => $team->id, 'created_by' => $user->id]);
    $board->members()->attach($user);

    BoardColumn::factory()->create(['board_id' => $board->id, 'name' => 'To Do', 'order' => 1]);
    BoardColumn::factory()->create(['board_id' => $board->id, 'name' => 'Done', 'order' => 2]);

    return $board->fresh(['team']);
}

test('board members can render the column create page', function () {
    $user = User::factory()->create();
    $board = setupBoardForColumnCreate($user);

    $this->actingAs($user)
        ->get(route('boards.columns.create', ['current_team' => $board->team, 'board' => $board]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('boards/columns/create')
            ->where('board.id', $board->id));
});

test('non-members cannot view the create page', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $board = setupBoardForColumnCreate($owner);
    $board->team->members()->attach($stranger, ['role' => TeamRole::Member->value]);
    $stranger->update(['current_team_id' => $board->team_id]);

    $this->actingAs($stranger)
        ->get(route('boards.columns.create', ['current_team' => $board->team, 'board' => $board]))
        ->assertForbidden();
});

test('a column can be created and lands at the end', function () {
    $user = User::factory()->create();
    $board = setupBoardForColumnCreate($user);

    $this->actingAs($user)->post(
        route('boards.columns.store', ['current_team' => $board->team, 'board' => $board]),
        ['name' => 'In Review'],
    )->assertRedirect(route('boards.items.index', ['current_team' => $board->team, 'board' => $board->id]));

    $created = BoardColumn::where('name', 'In Review')->firstOrFail();
    expect($created->board_id)->toBe($board->id)
        ->and($created->order)->toBe(3);
});

test('column names must be unique within a board', function () {
    $user = User::factory()->create();
    $board = setupBoardForColumnCreate($user);

    $this->actingAs($user)->post(
        route('boards.columns.store', ['current_team' => $board->team, 'board' => $board]),
        ['name' => 'To Do'],
    )->assertSessionHasErrors('name');
});

test('column names may repeat across different boards', function () {
    $user = User::factory()->create();
    $boardA = setupBoardForColumnCreate($user);

    // Build a sibling board on the same team but without seeded columns so the
    // store path is the only way "To Do" appears on it.
    $boardB = Board::factory()->create([
        'team_id' => $boardA->team_id,
        'created_by' => $user->id,
    ]);
    $boardB->members()->attach($user);

    $this->actingAs($user)->post(
        route('boards.columns.store', ['current_team' => $boardA->team, 'board' => $boardB]),
        ['name' => 'To Do'],
    )->assertSessionHasNoErrors();

    expect($boardA->columns()->where('name', 'To Do')->exists())->toBeTrue()
        ->and($boardB->columns()->where('name', 'To Do')->exists())->toBeTrue();
});
