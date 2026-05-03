<?php

namespace App\Actions\BoardItems;

use App\Models\Board;
use Illuminate\Support\Facades\DB;

final class ReorderBoardItemsAction
{
    /**
     * Apply a new ordering of items across one or more columns.
     *
     * Each entry sets the canonical state (column + position) for every item it
     * lists; items not included are left untouched.
     *
     * @param  array<int, array{id: string, items: array<int, string>}>  $columns
     */
    public function execute(Board $board, array $columns): void
    {
        DB::transaction(function () use ($board, $columns) {
            foreach ($columns as $column) {
                foreach ($column['items'] as $position => $itemId) {
                    $board->items()
                        ->whereKey($itemId)
                        ->update([
                            'board_column_id' => $column['id'],
                            'position' => $position + 1,
                        ]);
                }
            }
        });
    }
}
