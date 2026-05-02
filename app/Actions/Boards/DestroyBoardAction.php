<?php

namespace App\Actions\Boards;

use App\Models\Board;
use Illuminate\Support\Facades\DB;

final class DestroyBoardAction
{
    public function execute(Board $board): void
    {
        DB::transaction(function () use ($board) {
            $board->delete();
        });
    }
}
