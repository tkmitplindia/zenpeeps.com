<?php

namespace App\Http\Controllers;

use App\Actions\Board\DestroyBoardAction;
use App\Actions\Board\IndexBoardAction;
use App\Actions\Board\MoveTaskAction;
use App\Actions\Board\ShowBoardAction;
use App\Actions\Board\StoreBoardAction;
use App\Actions\Board\UpdateBoardAction;
use App\Enums\BoardTemplate;
use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;
use App\Models\Board;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BoardController extends Controller
{
    private function currentProject(Request $request): Project
    {
        return Project::findOrFail($request->session()->get('current_project_id'));
    }

    public function index(Request $request, IndexBoardAction $action): Response
    {
        $this->authorize('viewAny', Board::class);

        return Inertia::render('boards/index', [
            'boards' => $action->handle($this->currentProject($request)),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Board::class);

        return Inertia::render('boards/create', [
            'templates' => array_map(fn (BoardTemplate $t) => $t->value, BoardTemplate::cases()),
        ]);
    }

    public function store(StoreBoardRequest $request, StoreBoardAction $action): RedirectResponse
    {
        $this->authorize('create', Board::class);

        $project = $this->currentProject($request);

        $board = $action->handle($project, $request->validated());

        return to_route('boards.show', $board);
    }

    public function show(Board $board, ShowBoardAction $action): Response
    {
        $this->authorize('view', $board);

        return Inertia::render('boards/show', [
            'board' => $action->handle($board),
        ]);
    }

    public function edit(Board $board): Response
    {
        $this->authorize('update', $board);

        $board->load('columns');

        return Inertia::render('boards/edit', [
            'board' => $board,
        ]);
    }

    public function update(UpdateBoardRequest $request, Board $board, UpdateBoardAction $action): RedirectResponse
    {
        $this->authorize('update', $board);

        $action->handle($board, $request->validated());

        return to_route('boards.show', $board);
    }

    public function moveTask(Request $request, Board $board, Task $task, MoveTaskAction $action): \Illuminate\Http\Response
    {
        $this->authorize('view', $board);

        $request->validate([
            'board_column_id' => ['required', 'uuid'],
            'position' => ['required', 'integer', 'min:0'],
        ]);

        $action->handle($board, $task, $request->board_column_id, $request->integer('position'));

        return response()->noContent();
    }

    public function destroy(Board $board, DestroyBoardAction $action): RedirectResponse
    {
        $this->authorize('delete', $board);

        $action->handle($board);

        return to_route('boards.index');
    }
}
