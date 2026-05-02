<?php

namespace App\Actions\Boards;

use App\Models\Board;

final class ShowBoardAction
{
    public function execute(Board $board)
    {
        // TODO Add eager loading for the board, 
        return $board;
    }
}
