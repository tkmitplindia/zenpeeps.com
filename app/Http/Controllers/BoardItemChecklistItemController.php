<?php

namespace App\Http\Controllers;

use App\Actions\BoardItemChecklistItems\DestroyBoardItemChecklistItemAction;
use App\Actions\BoardItemChecklistItems\StoreBoardItemChecklistItemAction;
use App\Actions\BoardItemChecklistItems\UpdateBoardItemChecklistItemAction;
use App\Http\Requests\StoreBoardItemChecklistItemRequest;
use App\Http\Requests\UpdateBoardItemChecklistItemRequest;
use App\Models\Board;
use App\Models\BoardItem;
use App\Models\BoardItemChecklistItem;
use App\Models\Team;

class BoardItemChecklistItemController extends Controller
{
    public function store(
        Team $current_team,
        Board $board,
        BoardItem $item,
        StoreBoardItemChecklistItemRequest $request,
        StoreBoardItemChecklistItemAction $storeBoardItemChecklistItemAction,
    ) {
        $storeBoardItemChecklistItemAction->execute($item, $request->validated('name'));

        return back();
    }

    public function update(
        Team $current_team,
        Board $board,
        BoardItem $item,
        BoardItemChecklistItem $checklistItem,
        UpdateBoardItemChecklistItemRequest $request,
        UpdateBoardItemChecklistItemAction $updateBoardItemChecklistItemAction,
    ) {
        $updateBoardItemChecklistItemAction->execute($checklistItem, $request->validated());

        return back();
    }

    public function destroy(
        Team $current_team,
        Board $board,
        BoardItem $item,
        BoardItemChecklistItem $checklistItem,
        DestroyBoardItemChecklistItemAction $destroyBoardItemChecklistItemAction,
    ) {
        if (request()->user()->cannot('update', $item)) {
            abort(403);
        }

        $destroyBoardItemChecklistItemAction->execute($checklistItem);

        return back();
    }
}
