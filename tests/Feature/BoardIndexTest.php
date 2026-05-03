<?php

use App\Enums\TeamRole;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\BoardItem;
use App\Models\Team;
use App\Models\User;

test('the boards index payload includes counts and members for the grid view', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => TeamRole::Owner->value]);
    $user->update(['current_team_id' => $team->id]);

    $board = Board::factory()->create(['team_id' => $team->id, 'created_by' => $user->id]);
    $board->members()->attach($user);

    BoardColumn::factory()->count(3)->create(['board_id' => $board->id, 'order' => 1]);
    $column = $board->columns()->first();
    foreach ([1, 2] as $n) {
        BoardItem::factory()->create([
            'board_id' => $board->id,
            'board_column_id' => $column->id,
            'created_by' => $user->id,
            'number' => $n,
            'position' => $n,
        ]);
    }

    $this->actingAs($user)
        ->get(route('boards.index', ['current_team' => $team]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('boards/index')
            ->where('boards.data.0.columns_count', 3)
            ->where('boards.data.0.items_count', 2)
            ->has('boards.data.0.members', 1));
});
