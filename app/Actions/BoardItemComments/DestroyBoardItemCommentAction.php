<?php

namespace App\Actions\BoardItemComments;

use App\Models\BoardItemComment;

final class DestroyBoardItemCommentAction
{
    public function execute(BoardItemComment $comment): void
    {
        $comment->delete();
    }
}
