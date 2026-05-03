<?php

namespace App\Http\Controllers;

use App\Actions\BoardItemComments\DestroyBoardItemCommentAction;
use App\Actions\BoardItemComments\StoreBoardItemCommentAction;
use App\Http\Requests\StoreBoardItemCommentRequest;
use App\Models\Board;
use App\Models\BoardItem;
use App\Models\BoardItemComment;
use App\Models\Team;

class BoardItemCommentController extends Controller
{
    public function store(
        Team $current_team,
        Board $board,
        BoardItem $item,
        StoreBoardItemCommentRequest $request,
        StoreBoardItemCommentAction $storeBoardItemCommentAction,
    ) {
        $storeBoardItemCommentAction->execute(
            $item,
            $request->user(),
            $request->validated('body'),
        );

        return back();
    }

    public function destroy(
        Team $current_team,
        Board $board,
        BoardItem $item,
        BoardItemComment $comment,
        DestroyBoardItemCommentAction $destroyBoardItemCommentAction,
    ) {
        $user = request()->user();

        if ($comment->user_id !== $user->id && $user->cannot('update', $item)) {
            abort(403);
        }

        $destroyBoardItemCommentAction->execute($comment);

        return back();
    }
}
