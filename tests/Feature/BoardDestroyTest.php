<?php

use App\Enums\TeamRole;
use App\Models\Board;
use App\Models\Team;
use App\Models\User;

function setUpBoardForDestroy(): array
{
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => TeamRole::Owner->value]);
    $user->update(['current_team_id' => $team->id]);

    $board = Board::factory()->create(['team_id' => $team->id, 'created_by' => $user->id]);
    $board->members()->attach($user);

    return [$user, $team, $board];
}

test('a board member can delete a board when the name confirmation matches', function () {
    [$user, $team, $board] = setUpBoardForDestroy();

    $this->actingAs($user)
        ->delete(route('boards.destroy', ['current_team' => $team, 'board' => $board]), [
            'name' => $board->name,
        ])
        ->assertRedirect(route('boards.index', ['current_team' => $team]));

    expect(Board::find($board->id))->toBeNull();
});

test('the board destroy request fails validation when the name does not match', function () {
    [$user, $team, $board] = setUpBoardForDestroy();

    $this->actingAs($user)
        ->from(route('boards.show', ['current_team' => $team, 'board' => $board]))
        ->delete(route('boards.destroy', ['current_team' => $team, 'board' => $board]), [
            'name' => 'wrong name',
        ])
        ->assertSessionHasErrors('name');

    expect(Board::find($board->id))->not->toBeNull();
});

test('the board destroy request fails validation when the name is missing', function () {
    [$user, $team, $board] = setUpBoardForDestroy();

    $this->actingAs($user)
        ->from(route('boards.show', ['current_team' => $team, 'board' => $board]))
        ->delete(route('boards.destroy', ['current_team' => $team, 'board' => $board]))
        ->assertSessionHasErrors('name');

    expect(Board::find($board->id))->not->toBeNull();
});

test('a non-member cannot delete a board even with the correct name', function () {
    [$owner, $team, $board] = setUpBoardForDestroy();
    $stranger = User::factory()->create();
    $team->members()->attach($stranger, ['role' => TeamRole::Member->value]);
    $stranger->update(['current_team_id' => $team->id]);

    $this->actingAs($stranger)
        ->delete(route('boards.destroy', ['current_team' => $team, 'board' => $board]), [
            'name' => $board->name,
        ])
        ->assertForbidden();

    expect(Board::find($board->id))->not->toBeNull();
});
