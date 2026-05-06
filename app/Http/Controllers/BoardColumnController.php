<?php

namespace App\Http\Controllers;

use App\Actions\BoardColumns\DestroyBoardColumnAction;
use App\Actions\BoardColumns\ReorderBoardColumnsAction;
use App\Actions\BoardColumns\StoreBoardColumnAction;
use App\Actions\BoardColumns\UpdateBoardColumnAction;
use App\Http\Requests\ReorderBoardColumnsRequest;
use App\Http\Requests\StoreBoardColumnRequest;
use App\Http\Requests\UpdateBoardColumnRequest;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\Team;

class BoardColumnController extends Controller
{
    /**
     * Show the form for creating a new column.
     */
    public function create(Team $current_team, Board $board)
    {
        if (request()->user()->cannot('update', $board)) {
            abort(403);
        }

        return inertia('boards/columns/create', [
            'board' => $board,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        Team $current_team,
        Board $board,
        StoreBoardColumnRequest $request,
        StoreBoardColumnAction $storeBoardColumnAction,
    ) {
        $storeBoardColumnAction->execute($board, $request->validated('name'));

        return to_route('boards.items.index', [
            'current_team' => $current_team,
            'board' => $board->id,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBoardColumnRequest $request, BoardColumn $boardColumn, UpdateBoardColumnAction $updateBoardColumnAction)
    {
        $name = $request->validated('name');

        $updateBoardColumnAction->execute($boardColumn, $name);

        return to_route('boards.items.index', [
            'current_team' => $boardColumn->board->team,
            'board' => $boardColumn->board->id,
        ]);
    }

    /**
     * Persist a new order for a board's columns.
     */
    public function reorder(
        Team $current_team,
        Board $board,
        ReorderBoardColumnsRequest $request,
        ReorderBoardColumnsAction $reorderBoardColumnsAction,
    ) {
        $reorderBoardColumnsAction->execute($board, $request->validated('columns'));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BoardColumn $boardColumn, DestroyBoardColumnAction $destroyBoardColumnAction)
    {
        if (request()->user()->cannot('delete', $boardColumn)) {
            abort(403);
        }

        $destroyBoardColumnAction->execute($boardColumn);

        return to_route('boards.items.index', [
            'current_team' => $boardColumn->board->team,
            'board' => $boardColumn->board->id,
        ]);
    }
}
