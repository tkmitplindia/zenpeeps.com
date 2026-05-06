<?php

namespace App\Http\Controllers;

use App\Actions\BoardItems\DestroyBoardItemAction;
use App\Actions\BoardItems\IndexBoardItemsAction;
use App\Actions\BoardItems\ReorderBoardItemsAction;
use App\Actions\BoardItems\ShowBoardItemAction;
use App\Actions\BoardItems\StoreBoardItemAction;
use App\Actions\BoardItems\UpdateBoardItemAction;
use App\Enums\BoardItemPriority;
use App\Http\Requests\BoardItemDestroyRequest;
use App\Http\Requests\ReorderBoardItemsRequest;
use App\Http\Requests\StoreBoardItemRequest;
use App\Http\Requests\UpdateBoardItemRequest;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\BoardItem;
use App\Models\Team;

class BoardItemController extends Controller
{
    public function index(Team $current_team, Board $board, IndexBoardItemsAction $indexBoardItemsAction)
    {
        $user = request()->user();

        if ($user->cannot('view', $board)) {
            abort(403);
        }

        $board->load('team');

        $search = request('search');
        $sort = request('sort', 'position');
        $order = request('order', 'asc');
        $view = request('view', 'grid');
        $limit = request('limit', 15);

        $items = $indexBoardItemsAction->execute($board, $search, $sort, $order, $view, $limit);


        return inertia('boards/items/index', [
            'board' => $board,
            'members' => $board->members,
            'columns' => $board->columns()->orderBy('order')->get(),
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'order' => $order,
            ],
            'view' => $view,
            'items' => $items,
        ]);
    }

    public function create(Team $current_team, Board $board)
    {
        $user = request()->user();

        if ($user->cannot('create', [BoardItem::class, $board])) {
            abort(403);
        }

        return inertia('boards/items/create', [
            'board' => $board,
            'columns' => $board->columns()->orderBy('order')->get(),
            'members' => $board->members,
        ]);
    }

    public function store(
        Team $current_team,
        Board $board,
        StoreBoardItemRequest $request,
        StoreBoardItemAction $storeBoardItemAction,
    ) {
        $user = $request->user();

        /** @var BoardColumn $column */
        $column = $board->columns()->findOrFail($request->validated('board_column_id'));

        $item = $storeBoardItemAction->execute(
            $board,
            $column,
            $user,
            $request->validated('title'),
            $request->validated('description'),
            BoardItemPriority::from($request->validated('priority', BoardItemPriority::Medium->value)),
            $request->validated('estimated_minutes'),
            $request->validated('due_date'),
            $request->validated('assignees', []),
            $request->validated('tags', []),
        );

        return to_route('boards.items.show', [
            'current_team' => $current_team,
            'board' => $board->id,
            'item' => $item,
        ]);
    }

    public function show(
        Team $current_team,
        Board $board,
        BoardItem $item,
        ShowBoardItemAction $showBoardItemAction,
    ) {
        if (request()->user()->cannot('view', $item)) {
            abort(403);
        }

        $item = $showBoardItemAction->execute($item);

        return inertia('boards/items/show', [
            'board' => $board,
            'item' => $item,
            'columns' => $board->columns()->orderBy('order')->get(),
            'members' => $board->members,
        ]);
    }

    public function update(
        Team $current_team,
        Board $board,
        BoardItem $item,
        UpdateBoardItemRequest $request,
        UpdateBoardItemAction $updateBoardItemAction,
    ) {
        $updateBoardItemAction->execute($item, $request->validated());

        return back();
    }

    public function reorder(
        Team $current_team,
        Board $board,
        ReorderBoardItemsRequest $request,
        ReorderBoardItemsAction $reorderBoardItemsAction,
    ) {
        $reorderBoardItemsAction->execute($board, $request->validated('columns'));

        return back();
    }

    public function destroy(
        BoardItemDestroyRequest $request,
        Team $current_team,
        Board $board,
        BoardItem $item,
        DestroyBoardItemAction $destroyBoardItemAction,
    ) {
        $request->validated();

        $destroyBoardItemAction->execute($item);

        return to_route('boards.items.index', [
            'current_team' => $current_team,
            'board' => $board->id,
        ]);
    }
}
