<?php

use App\Enums\TeamRole;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\Team;
use App\Models\User;

function setupBoardWithColumns(User $user, int $count = 3): Board
{
    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => TeamRole::Owner->value]);
    $user->update(['current_team_id' => $team->id]);

    $board = Board::factory()->create(['team_id' => $team->id, 'created_by' => $user->id]);
    $board->members()->attach($user);

    foreach (range(1, $count) as $i) {
        BoardColumn::factory()->create([
            'board_id' => $board->id,
            'name' => "Column {$i}",
            'order' => $i,
        ]);
    }

    return $board->fresh(['team', 'columns']);
}

test('board members can reorder columns', function () {
    $user = User::factory()->create();
    $board = setupBoardWithColumns($user);
    $columns = $board->columns()->orderBy('order')->get();

    // Reverse the order: [c3, c2, c1]
    $reversed = $columns->pluck('id')->reverse()->values()->all();

    $this->actingAs($user)->patch(
        route('boards.columns.reorder', ['current_team' => $board->team, 'board' => $board]),
        ['columns' => $reversed],
    )->assertRedirect();

    $persisted = $board->columns()->orderBy('order')->pluck('id')->all();
    expect($persisted)->toBe($reversed);
});

test('non-members cannot reorder columns', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $board = setupBoardWithColumns($owner);
    $board->team->members()->attach($stranger, ['role' => TeamRole::Member->value]);
    $stranger->update(['current_team_id' => $board->team_id]);

    $this->actingAs($stranger)->patch(
        route('boards.columns.reorder', ['current_team' => $board->team, 'board' => $board]),
        ['columns' => $board->columns->pluck('id')->all()],
    )->assertForbidden();
});

test('reorder rejects ids that do not belong to the board', function () {
    $user = User::factory()->create();
    $board = setupBoardWithColumns($user);
    $otherBoard = Board::factory()->create([
        'team_id' => $board->team_id,
        'created_by' => $user->id,
    ]);
    $foreignColumn = BoardColumn::factory()->create([
        'board_id' => $otherBoard->id,
        'order' => 1,
    ]);

    $this->actingAs($user)->patch(
        route('boards.columns.reorder', ['current_team' => $board->team, 'board' => $board]),
        ['columns' => [$foreignColumn->id]],
    )->assertSessionHasErrors('columns.0');
});
