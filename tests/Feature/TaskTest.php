<?php

use App\Actions\Project\StoreProjectAction;
use App\Actions\Task\AddTaskItemAction;
use App\Actions\Task\ShowTaskAction;
use App\Actions\Task\StartTimerAction;
use App\Actions\Task\StopTimerAction;
use App\Actions\Task\StoreTaskAction;
use App\Actions\Task\ToggleTaskItemAction;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\Task;
use App\Models\TaskItem;
use App\Models\User;

function makeProjectWithBoard(): array
{
    $user = User::factory()->create();
    $project = (new StoreProjectAction)->handle($user, ['name' => 'Test Project']);
    $board = Board::factory()->create(['project_id' => $project->id]);
    $column = BoardColumn::factory()->create(['board_id' => $board->id, 'position' => 0]);

    return compact('user', 'project', 'board', 'column');
}

test('StoreTaskAction creates a task with correct attributes', function () {
    ['user' => $user, 'board' => $board, 'column' => $column] = makeProjectWithBoard();

    $action = new StoreTaskAction;
    $task = $action->handle($board, $user, [
        'board_column_id' => $column->id,
        'title' => 'My Task',
        'priority' => 'high',
    ]);

    expect($task)->toBeInstanceOf(Task::class)
        ->and($task->title)->toBe('My Task')
        ->and($task->priority)->toBe('high')
        ->and($task->board_id)->toBe($board->id);
});

test('AddTaskItemAction creates a task item', function () {
    ['user' => $user, 'board' => $board, 'column' => $column] = makeProjectWithBoard();
    $task = (new StoreTaskAction)->handle($board, $user, [
        'board_column_id' => $column->id,
        'title' => 'My Task',
    ]);

    $item = (new AddTaskItemAction)->handle($task, 'Do something');

    expect($item)->toBeInstanceOf(TaskItem::class)
        ->and($item->text)->toBe('Do something')
        ->and($item->done)->toBeFalse();
});

test('ToggleTaskItemAction toggles the done state', function () {
    ['user' => $user, 'board' => $board, 'column' => $column] = makeProjectWithBoard();
    $task = (new StoreTaskAction)->handle($board, $user, [
        'board_column_id' => $column->id,
        'title' => 'My Task',
    ]);
    $item = (new AddTaskItemAction)->handle($task, 'Do something');

    expect($item->done)->toBeFalse();

    $toggled = (new ToggleTaskItemAction)->handle($item);
    expect($toggled->done)->toBeTrue();

    $toggledBack = (new ToggleTaskItemAction)->handle($toggled);
    expect($toggledBack->done)->toBeFalse();
});

test('Task completion accessor returns correct counts', function () {
    ['user' => $user, 'board' => $board, 'column' => $column] = makeProjectWithBoard();
    $task = (new StoreTaskAction)->handle($board, $user, [
        'board_column_id' => $column->id,
        'title' => 'My Task',
    ]);

    $item1 = (new AddTaskItemAction)->handle($task, 'Item 1');
    (new AddTaskItemAction)->handle($task, 'Item 2');
    (new ToggleTaskItemAction)->handle($item1);

    $task->load('items');
    $completion = $task->completion;

    expect($completion['done'])->toBe(1)
        ->and($completion['total'])->toBe(2);
});

test('StartTimerAction sets time_tracker_started_at', function () {
    ['user' => $user, 'board' => $board, 'column' => $column] = makeProjectWithBoard();
    $task = (new StoreTaskAction)->handle($board, $user, [
        'board_column_id' => $column->id,
        'title' => 'My Task',
    ]);

    expect($task->time_tracker_started_at)->toBeNull();

    $task = (new StartTimerAction)->handle($task);

    expect($task->time_tracker_started_at)->not->toBeNull();
});

test('StopTimerAction accumulates elapsed seconds', function () {
    ['user' => $user, 'board' => $board, 'column' => $column] = makeProjectWithBoard();
    $task = (new StoreTaskAction)->handle($board, $user, [
        'board_column_id' => $column->id,
        'title' => 'My Task',
    ]);

    $task = (new StartTimerAction)->handle($task);
    $task->update(['time_tracker_started_at' => now()->subSeconds(60)]);
    $task->refresh();

    $task = (new StopTimerAction)->handle($task);

    expect($task->elapsed_seconds)->toBeGreaterThanOrEqual(60)
        ->and($task->time_tracker_started_at)->toBeNull();
});

test('ShowTaskAction returns previous and next task', function () {
    ['user' => $user, 'board' => $board, 'column' => $column] = makeProjectWithBoard();

    $action = new StoreTaskAction;
    $task1 = $action->handle($board, $user, ['board_column_id' => $column->id, 'title' => 'Task 1']);
    $task2 = $action->handle($board, $user, ['board_column_id' => $column->id, 'title' => 'Task 2']);
    $task3 = $action->handle($board, $user, ['board_column_id' => $column->id, 'title' => 'Task 3']);

    $result = (new ShowTaskAction)->handle($task2);

    expect($result['previousTask']?->id)->toBe($task1->id)
        ->and($result['nextTask']?->id)->toBe($task3->id);
});

test('tasks.show route renders correctly for project member', function () {
    ['user' => $user, 'board' => $board, 'column' => $column, 'project' => $project] = makeProjectWithBoard();

    $task = (new StoreTaskAction)->handle($board, $user, [
        'board_column_id' => $column->id,
        'title' => 'My Task',
    ]);

    $this->actingAs($user)
        ->withSession(['current_project_id' => $project->id])
        ->get(route('tasks.show', $task))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tasks/show')
            ->has('task')
        );
});
