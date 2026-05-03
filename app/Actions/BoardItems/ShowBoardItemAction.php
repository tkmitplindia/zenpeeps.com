<?php

namespace App\Actions\BoardItems;

use App\Models\BoardItem;

final class ShowBoardItemAction
{
    public function execute(BoardItem $item): BoardItem
    {
        return $item->load([
            'board:id,name,team_id',
            'column:id,name,board_id',
            'creator:id,name,avatar',
            'assignees:id,name,avatar',
            'tags',
            'checklistItems',
            'attachments.uploader:id,name,avatar',
            'comments.author:id,name,avatar',
        ]);
    }
}
