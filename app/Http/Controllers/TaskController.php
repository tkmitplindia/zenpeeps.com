<?php

namespace App\Http\Controllers;

use App\Actions\Task\AddTaskItemAction;
use App\Actions\Task\DestroyTaskAction;
use App\Actions\Task\MoveTaskAction;
use App\Actions\Task\RemoveTaskItemAction;
use App\Actions\Task\ShowTaskAction;
use App\Actions\Task\StartTimerAction;
use App\Actions\Task\StopTimerAction;
use App\Actions\Task\StoreTaskAction;
use App\Actions\Task\ToggleTaskItemAction;
use App\Actions\Task\UpdateTaskAction;
use App\Models\Board;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class TaskController extends Controller
{
    private function currentProject(Request $request): Project
    {
        return Project::findOrFail($request->session()->get('current_project_id'));
    }

    public function show(Request $request, Task $task, ShowTaskAction $action): InertiaResponse
    {
        $this->authorize('view', $task);

        $data = $action->handle($task);

        return Inertia::render('tasks/show', $data);
    }

    public function store(Request $request, StoreTaskAction $action): RedirectResponse
    {
        $this->authorize('create', Task::class);

        $request->validate([
            'board_id' => ['required', 'uuid', 'exists:boards,id'],
            'board_column_id' => ['required', 'uuid', 'exists:board_columns,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['nullable', 'string', 'in:low,medium,high,urgent'],
            'due_date' => ['nullable', 'date'],
            'estimate_minutes' => ['nullable', 'integer', 'min:1'],
            'assignee_ids' => ['nullable', 'array'],
            'assignee_ids.*' => ['uuid', 'exists:users,id'],
        ]);

        $board = Board::findOrFail($request->board_id);
        $task = $action->handle($board, $request->user(), $request->all());

        return to_route('tasks.show', $task);
    }

    public function update(Request $request, Task $task, UpdateTaskAction $action): Response
    {
        $this->authorize('update', $task);

        $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'board_column_id' => ['sometimes', 'uuid', 'exists:board_columns,id'],
            'priority' => ['sometimes', 'string', 'in:low,medium,high,urgent'],
            'due_date' => ['nullable', 'date'],
            'estimate_minutes' => ['nullable', 'integer', 'min:1'],
            'assignee_ids' => ['nullable', 'array'],
            'assignee_ids.*' => ['uuid', 'exists:users,id'],
            'label_ids' => ['nullable', 'array'],
            'label_ids.*' => ['uuid', 'exists:labels,id'],
        ]);

        $action->handle($task, $request->all());

        return response()->noContent();
    }

    public function destroy(Task $task, DestroyTaskAction $action): RedirectResponse
    {
        $this->authorize('delete', $task);

        $boardId = $task->board_id;
        $action->handle($task);

        return to_route('boards.show', $boardId);
    }

    public function move(Request $request, Task $task, MoveTaskAction $action): Response
    {
        $this->authorize('update', $task);

        $request->validate([
            'board_column_id' => ['required', 'uuid', 'exists:board_columns,id'],
            'position' => ['required', 'integer', 'min:0'],
        ]);

        $action->handle($task, $request->board_column_id, $request->integer('position'));

        return response()->noContent();
    }

    public function storeItem(Request $request, Task $task, AddTaskItemAction $action): JsonResponse
    {
        $this->authorize('update', $task);

        $request->validate([
            'text' => ['required', 'string', 'max:500'],
        ]);

        $item = $action->handle($task, $request->string('text'));

        return response()->json($item, 201);
    }

    public function toggleItem(Task $task, TaskItem $item, ToggleTaskItemAction $action): JsonResponse
    {
        $this->authorize('update', $task);

        $item = $action->handle($item);

        return response()->json($item);
    }

    public function destroyItem(Task $task, TaskItem $item, RemoveTaskItemAction $action): Response
    {
        $this->authorize('update', $task);

        $action->handle($item);

        return response()->noContent();
    }

    public function startTimer(Task $task, StartTimerAction $action): JsonResponse
    {
        $this->authorize('update', $task);

        $task = $action->handle($task);

        return response()->json($task);
    }

    public function stopTimer(Task $task, StopTimerAction $action): JsonResponse
    {
        $this->authorize('update', $task);

        $task = $action->handle($task);

        return response()->json($task);
    }
}
