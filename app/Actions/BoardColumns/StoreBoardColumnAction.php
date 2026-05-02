<?php

namespace App\Actions\BoardColumns;

use App\Models\Board;
use App\Models\BoardColumn;
use Illuminate\Support\Facades\DB;

final class StoreBoardColumnAction
{
    public function execute(Board $board, string $name): BoardColumn
    {
        return DB::transaction(function () use ($board, $name) {
            return BoardColumn::create([
                'board_id' => $board->id,
                'name' => $name,
            ]);
        });
    }
}
