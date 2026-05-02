<?php

namespace App\Actions\BoardColumns;

use App\Models\BoardColumn;

final class ShowBoardColumnAction
{
    public function execute(BoardColumn $boardColumn): BoardColumn
    {
        return $boardColumn;
    }
}
