<?php

namespace App\Actions\Boards;

use App\Enums\BoardStatus;
use App\Models\Board;
use App\Models\Team;
use Illuminate\Pagination\LengthAwarePaginator;

final class IndexBoardAction
{
    /**
     * Get a paginated list of boards for a team.
     *
     * @param  string|null  $search
     * @param  BoardStatus|null  $status
     * @param  string|null  $sort
     * @param  string|null  $order
     * @param  int|null  $limit
     *
     * @return LengthAwarePaginator<Board>
     */
    public function execute(Team $team, ?string $search = null, ?BoardStatus $status = null, ?string $sort = 'created_at', ?string $order = 'desc', ?int $limit = 15): LengthAwarePaginator
    {
        $query = Board::ofTeam($team)
            ->when($search !== null, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($status !== null, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy($sort, $order)
            ->with('members:id,name,avatar_url')
            ->withCount('members');

        return $query->paginate($limit);
    }
}
