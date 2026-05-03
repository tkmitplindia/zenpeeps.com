<?php

namespace App\Actions\BoardColumns;

use App\Models\Board;
use Illuminate\Support\Facades\DB;

final class ReorderBoardColumnsAction
{
    /**
     * Apply a new ordering to the board's columns.
     *
     * @param  array<int, string>  $orderedColumnIds  column ids in their new order
     */
    public function execute(Board $board, array $orderedColumnIds): void
    {
        DB::transaction(function () use ($board, $orderedColumnIds) {
            foreach ($orderedColumnIds as $index => $columnId) {
                $board->columns()
                    ->whereKey($columnId)
                    ->update(['order' => $index + 1]);
            }
        });
    }
}
