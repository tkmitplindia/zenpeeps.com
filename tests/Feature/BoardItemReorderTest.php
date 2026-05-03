<?php

use App\Enums\TeamRole;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\BoardItem;
use App\Models\Team;
use App\Models\User;

function setupBoardWithItems(User $user): array
{
    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => TeamRole::Owner->value]);
    $user->update(['current_team_id' => $team->id]);

    $board = Board::factory()->create(['team_id' => $team->id, 'created_by' => $user->id]);
    $board->members()->attach($user);

    $todo = BoardColumn::factory()->create(['board_id' => $board->id, 'name' => 'To Do', 'order' => 1]);
    $done = BoardColumn::factory()->create(['board_id' => $board->id, 'name' => 'Done', 'order' => 2]);

    $items = collect([1, 2, 3])->map(fn ($n) => BoardItem::factory()->create([
        'board_id' => $board->id,
        'board_column_id' => $todo->id,
        'created_by' => $user->id,
        'number' => $n,
        'position' => $n,
        'title' => "Task {$n}",
    ]));

    return [$board, $todo, $done, $items];
}

test('items can be reordered within a column', function () {
    $user = User::factory()->create();
    [$board, $todo, , $items] = setupBoardWithItems($user);

    $newOrder = $items->reverse()->pluck('id')->values()->all();

    $this->actingAs($user)->patch(
        route('boards.items.reorder', ['current_team' => $board->team, 'board' => $board]),
        ['columns' => [['id' => $todo->id, 'items' => $newOrder]]],
    )->assertRedirect();

    $persisted = BoardItem::where('board_column_id', $todo->id)
        ->orderBy('position')
        ->pluck('id')
        ->all();
    expect($persisted)->toBe($newOrder);
});

test('items can move between columns', function () {
    $user = User::factory()->create();
    [$board, $todo, $done, $items] = setupBoardWithItems($user);

    $movedId = $items[1]->id;
    $remainingTodo = [$items[0]->id, $items[2]->id];

    $this->actingAs($user)->patch(
        route('boards.items.reorder', ['current_team' => $board->team, 'board' => $board]),
        ['columns' => [
            ['id' => $todo->id, 'items' => $remainingTodo],
            ['id' => $done->id, 'items' => [$movedId]],
        ]],
    )->assertRedirect();

    $moved = $items[1]->fresh();
    expect($moved->board_column_id)->toBe($done->id)
        ->and($moved->position)->toBe(1);

    $stayed = $items[0]->fresh();
    expect($stayed->position)->toBe(1);
});

test('non-members cannot reorder items', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    [$board, $todo, , $items] = setupBoardWithItems($owner);
    $board->team->members()->attach($stranger, ['role' => TeamRole::Member->value]);
    $stranger->update(['current_team_id' => $board->team_id]);

    $this->actingAs($stranger)->patch(
        route('boards.items.reorder', ['current_team' => $board->team, 'board' => $board]),
        ['columns' => [['id' => $todo->id, 'items' => $items->pluck('id')->all()]]],
    )->assertForbidden();
});

test('reorder rejects items that do not belong to the board', function () {
    $user = User::factory()->create();
    [$board, $todo] = setupBoardWithItems($user);

    $otherBoard = Board::factory()->create([
        'team_id' => $board->team_id,
        'created_by' => $user->id,
    ]);
    $otherColumn = BoardColumn::factory()->create(['board_id' => $otherBoard->id]);
    $foreignItem = BoardItem::factory()->create([
        'board_id' => $otherBoard->id,
        'board_column_id' => $otherColumn->id,
        'created_by' => $user->id,
        'number' => 1,
        'position' => 1,
    ]);

    $this->actingAs($user)->patch(
        route('boards.items.reorder', ['current_team' => $board->team, 'board' => $board]),
        ['columns' => [['id' => $todo->id, 'items' => [$foreignItem->id]]]],
    )->assertSessionHasErrors('columns.0.items.0');
});
