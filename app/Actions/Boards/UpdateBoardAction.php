<?php

namespace App\Actions\Boards;

use App\Models\Board;
use Illuminate\Support\Facades\DB;

final class UpdateBoardAction
{
    public function execute(Board $board, string $name, string $description, string $status): Board
    {
        return DB::transaction(function () use ($board, $name, $description, $status) {
            $board->update([
                'name' => $name,
                'description' => $description,
                'status' => $status,
            ]);

            return $board->refresh();
        });
    }
}
