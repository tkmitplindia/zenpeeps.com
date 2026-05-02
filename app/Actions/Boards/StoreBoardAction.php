<?php

namespace App\Actions\Boards;

use App\Models\Board;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

final class StoreBoardAction
{
    public function execute(Team $team, string $name, string $description, string $status, array $columns, User $createdBy): Board
    {
        $board =  DB::transaction(function () use ($team, $name, $description, $status, $columns, $createdBy) {
            $board = $team->boards()->create([
                'name' => $name,
                'description' => $description,
                'status' => $status,
                'created_by' => $createdBy->id,
            ]);

            collect($columns)->each(function ($column, $index) use ($board) {
                $board->columns()->create([
                    'name' => $column['name'],
                    'order' => $index + 1,
                ]);
            });

            return $board;
        });

        return $board;
    }
}
