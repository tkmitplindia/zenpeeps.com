<?php

namespace App\Actions\BoardItemComments;

use App\Models\BoardItem;
use App\Models\BoardItemComment;
use App\Models\User;

final class StoreBoardItemCommentAction
{
    public function execute(BoardItem $item, User $author, string $body): BoardItemComment
    {
        return $item->comments()->create([
            'user_id' => $author->id,
            'body' => $body,
        ]);
    }
}
