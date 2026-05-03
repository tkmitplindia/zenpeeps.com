<?php

namespace App\Actions\Boards;

use App\Models\Board;

final class ShowBoardAction
{
    public function execute(Board $board)
    {
        return $board->load([
            'team',
            'members:id,name,avatar',
            'columns' => fn ($q) => $q->orderBy('order'),
            'columns.items' => fn ($q) => $q->orderBy('position'),
            'columns.items.assignees:id,name,avatar',
            'columns.items.tags',
        ]);
    }
}
