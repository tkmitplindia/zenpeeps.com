<?php

namespace App\Actions\Boards;

use App\Models\Board;
use Illuminate\Support\Facades\DB;

final class UpdateBoardAction
{
    public function execute(Board $board, string $name, string $description, string $status, array $members = []): Board
    {
        return DB::transaction(function () use ($board, $name, $description, $status, $members) {
            $board->update([
                'name' => $name,
                'description' => $description,
                'status' => $status,
            ]);

            if (! empty($members)) {
                $board->members()->sync($members);
            } else {
                $board->members()->detach();
            }

            return $board->refresh();
        });
    }
}
