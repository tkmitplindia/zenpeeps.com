<?php

namespace App\Actions\Boards;

use App\Models\Board;
use App\Models\Team;
use Illuminate\Pagination\LengthAwarePaginator;

final class IndexBoardAction
{
    /**
     * Get a paginated list of boards for a team.
     *
     * @param  string  $search
     * @param  string  $sort
     * @param  string  $order
     * @param  int  $limit
     */
    public function execute(Team $team, $search, $sort, $order, $limit): LengthAwarePaginator
    {
        $query = Board::ofTeam($team)
            ->when($search !== null, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy($sort, $order);

        return $query->paginate($limit);
    }
}
