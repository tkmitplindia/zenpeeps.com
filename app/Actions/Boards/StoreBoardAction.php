<?php

namespace App\Actions\Boards;

use App\Models\Board;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

final class StoreBoardAction
{
    public function execute(Team $team, string $name, string $description, string $status, User $createdBy): Board
    {
        $board =  DB::transaction(function () use ($team, $name, $description, $status, $createdBy) {
            return $team->boards()->create([
                'name' => $name,
                'description' => $description,
                'status' => $status,
                'created_by' => $createdBy->id,
            ]);
        });

        return $board;
    }
}
