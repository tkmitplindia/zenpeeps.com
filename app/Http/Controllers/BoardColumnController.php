<?php

namespace App\Http\Controllers;

use App\Actions\BoardColumns\DestroyBoardColumnAction;
use App\Actions\BoardColumns\IndexBoardColumnAction;
use App\Actions\BoardColumns\ShowBoardColumnAction;
use App\Actions\BoardColumns\StoreBoardColumnAction;
use App\Actions\BoardColumns\UpdateBoardColumnAction;
use App\Http\Requests\StoreBoardColumnRequest;
use App\Http\Requests\UpdateBoardColumnRequest;
use App\Models\Board;
use App\Models\BoardColumn;

class BoardColumnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Board $board, IndexBoardColumnAction $indexBoardColumnAction)
    {
        if (request()->user()->cannot('view', $board)) {
            abort(403);
        }

        return $indexBoardColumnAction->execute($board);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Board $board)
    {
        if (request()->user()->cannot('create', $board)) {
            abort(403);
        }

        // Typically handled via modal on the board show page
        return back();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBoardColumnRequest $request, Board $board, StoreBoardColumnAction $storeBoardColumnAction)
    {
        $name = $request->validated('name');

        $storeBoardColumnAction->execute($board, $name);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(BoardColumn $boardColumn, ShowBoardColumnAction $showBoardColumnAction)
    {
        if (request()->user()->cannot('view', $boardColumn)) {
            abort(403);
        }

        return $showBoardColumnAction->execute($boardColumn);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BoardColumn $boardColumn)
    {
        if (request()->user()->cannot('update', $boardColumn)) {
            abort(403);
        }

        return to_route('boards.show', $boardColumn->board);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBoardColumnRequest $request, BoardColumn $boardColumn, UpdateBoardColumnAction $updateBoardColumnAction)
    {
        $name = $request->validated('name');

        $updateBoardColumnAction->execute($boardColumn, $name);

        return to_route('boards.show', $boardColumn->board);
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

        return to_route('boards.show', $boardColumn->board);
    }
}
