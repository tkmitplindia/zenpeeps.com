<?php

namespace App\Http\Controllers;

use App\Actions\Boards\DestroyBoardAction;
use App\Actions\Boards\IndexBoardAction;
use App\Actions\Boards\ShowBoardAction;
use App\Actions\Boards\StoreBoardAction;
use App\Actions\Boards\UpdateBoardAction;
use App\Enums\BoardStatus;
use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;
use App\Models\Board;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(IndexBoardAction $indexBoardAction)
    {
        $user = request()->user();

        if (!$user->can('viewAny', Board::class)) {
            abort(403);
        }

        $team = $user->current_team;
        $search = request('search');
        $sort = request('sort', 'created_at');
        $order = request('order', 'desc');
        $limit = request('limit', 15);
        $view = request('view', 'grid');

        $data = $indexBoardAction->execute($team, $search, $sort, $order, $limit);

        return inertia('boards/Index', [
            'data' => $data,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'order' => $order,
                'limit' => $limit,
            ],
            'view' => $view,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (request()->user()->cannot('create', Board::class)) {
            abort(403);
        }

        return inertia('boards/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBoardRequest $request, StoreBoardAction $storeBoardAction)
    {
        $user = request()->user();
        $team = $user->current_team;

        $name = $request->validated('name');
        $description = $request->validated('description');
        $status = $request->validated('status', BoardStatus::Active->value);

        $board = $storeBoardAction->execute(
            $team,
            $name,
            $description ?? '',
            $status,
            $user
        );

        return to_route('boards.show', $board);
    }

    /**
     * Display the specified resource.
     */
    public function show(Board $board, ShowBoardAction $showBoardAction)
    {
        if (request()->user()->cannot('view', $board)) {
            abort(403);
        }

        $board = $showBoardAction->execute($board);

        return inertia('boards/show', [
            'board' => $board,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Board $board)
    {
        if (request()->user()->cannot('update', $board)) {
            abort(403);
        }

        return inertia('boards/edit', [
            'board' => $board,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBoardRequest $request, Board $board, UpdateBoardAction $updateBoardAction)
    {
        if (request()->user()->cannot('update', $board)) {
            abort(403);
        }

        $name = $request->validated('name');
        $description = $request->validated('description');
        $status = $request->validated('status', BoardStatus::Active->value);

        $updateBoardAction->execute(
            $board,
            $name,
            $description ?? '',
            $status
        );

        return to_route('boards.show', $board);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Board $board, DestroyBoardAction $destroyBoardAction)
    {
        if (request()->user()->cannot('delete', $board)) {
            abort(403);
        }

        $destroyBoardAction->execute($board);

        return to_route('boards.index');
    }
}
