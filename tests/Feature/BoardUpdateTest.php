<?php

use App\Enums\BoardStatus;
use App\Enums\TeamRole;
use App\Models\Board;
use App\Models\Team;
use App\Models\User;

function setUpBoardForUpdate(): array
{
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => TeamRole::Owner->value]);
    $user->update(['current_team_id' => $team->id]);

    $board = Board::factory()->create([
        'team_id' => $team->id,
        'created_by' => $user->id,
        'status' => BoardStatus::Active->value,
    ]);
    $board->members()->attach($user);

    return [$user, $team, $board];
}

test('a board member can archive a board via update', function () {
    [$user, $team, $board] = setUpBoardForUpdate();

    $this->actingAs($user)
        ->put(route('boards.update', ['current_team' => $team, 'board' => $board]), [
            'name' => $board->name,
            'description' => $board->description,
            'status' => BoardStatus::Archived->value,
            'members' => [$user->id],
        ])
        ->assertRedirect(route('boards.show', ['current_team' => $team, 'board' => $board]));

    expect($board->fresh()->status)->toBe(BoardStatus::Archived);
});

test('a non-member cannot update a board', function () {
    [, $team, $board] = setUpBoardForUpdate();
    $stranger = User::factory()->create();
    $team->members()->attach($stranger, ['role' => TeamRole::Member->value]);
    $stranger->update(['current_team_id' => $team->id]);

    $this->actingAs($stranger)
        ->put(route('boards.update', ['current_team' => $team, 'board' => $board]), [
            'name' => $board->name,
            'description' => $board->description,
            'status' => BoardStatus::Archived->value,
            'members' => [$stranger->id],
        ])
        ->assertForbidden();

    expect($board->fresh()->status)->toBe(BoardStatus::Active);
});
