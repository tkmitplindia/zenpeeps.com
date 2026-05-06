<?php

namespace App\Actions\BoardItems;

use App\Models\Board;
use App\Models\BoardItem;
use Illuminate\Pagination\LengthAwarePaginator;

final class IndexBoardItemsAction
{
    /**
     * Get a paginated list of board items with eager-loaded relations.
     *
     * @return LengthAwarePaginator<BoardItem>
     */
    public function execute(
        Board $board,
        ?string $search = null,
        ?string $sort = 'position',
        ?string $order = 'asc',
        ?string $view = 'grid',
        ?int $limit = 15,
    ): LengthAwarePaginator {
        $query = BoardItem::ofBoard($board)
            ->when($search !== null, function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->with([
                'column',
                'assignees:id,name,avatar',
                'tags',
                'comments',
                'attachments',
                'checklistItems',
            ])
            ->orderBy($sort, $order);

        return $query->paginate($limit);
    }
}
