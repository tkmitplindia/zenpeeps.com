<?php

namespace App\Actions\Board;

use App\Models\Board;

class DestroyBoardAction
{
    public function handle(Board $board): void
    {
        $board->delete();
    }
}
