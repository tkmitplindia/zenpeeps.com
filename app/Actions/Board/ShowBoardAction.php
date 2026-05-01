<?php

namespace App\Actions\Board;

use App\Models\Board;

class ShowBoardAction
{
    public function handle(Board $board): Board
    {
        return $board->load(['columns.tasks.assignees']);
    }
}
