<?php

namespace App\Actions\Boards;

use App\Models\Board;

final class ShowBoardAction
{
    public function execute(Board $board)
    {
        return $board->load(['columns', 'members', 'team']);
    }
}
