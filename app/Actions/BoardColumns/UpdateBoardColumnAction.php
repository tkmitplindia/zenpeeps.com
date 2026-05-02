<?php

namespace App\Actions\BoardColumns;

use App\Models\BoardColumn;
use Illuminate\Support\Facades\DB;

final class UpdateBoardColumnAction
{
    public function execute(BoardColumn $boardColumn, string $name): BoardColumn
    {
        return DB::transaction(function () use ($boardColumn, $name) {
            $boardColumn->update([
                'name' => $name,
            ]);

            return $boardColumn->refresh();
        });
    }
}
