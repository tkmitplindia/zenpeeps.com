<?php

namespace App\Http\Controllers;

use App\Actions\BoardItemAttachments\DestroyBoardItemAttachmentAction;
use App\Actions\BoardItemAttachments\StoreBoardItemAttachmentAction;
use App\Http\Requests\StoreBoardItemAttachmentRequest;
use App\Models\Board;
use App\Models\BoardItem;
use App\Models\BoardItemAttachment;
use App\Models\Team;

class BoardItemAttachmentController extends Controller
{
    public function store(
        Team $current_team,
        Board $board,
        BoardItem $item,
        StoreBoardItemAttachmentRequest $request,
        StoreBoardItemAttachmentAction $storeBoardItemAttachmentAction,
    ) {
        $storeBoardItemAttachmentAction->execute(
            $item,
            $request->user(),
            $request->file('file'),
        );

        return back();
    }

    public function destroy(
        Team $current_team,
        Board $board,
        BoardItem $item,
        BoardItemAttachment $attachment,
        DestroyBoardItemAttachmentAction $destroyBoardItemAttachmentAction,
    ) {
        if (request()->user()->cannot('update', $item)) {
            abort(403);
        }

        $destroyBoardItemAttachmentAction->execute($attachment);

        return back();
    }
}
