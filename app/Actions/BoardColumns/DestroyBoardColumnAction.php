<?php

namespace App\Actions\BoardColumns;

use App\Models\BoardColumn;
use Illuminate\Support\Facades\DB;

final class DestroyBoardColumnAction
{
    public function execute(BoardColumn $boardColumn): void
    {
        DB::transaction(function () use ($boardColumn) {
            $boardColumn->delete();
        });
    }
}
