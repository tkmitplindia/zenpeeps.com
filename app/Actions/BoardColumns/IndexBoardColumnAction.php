<?php

namespace App\Actions\BoardColumns;

use App\Models\Board;
use App\Models\BoardColumn;
use Illuminate\Database\Eloquent\Collection;

final class IndexBoardColumnAction
{
    public function execute(Board $board): Collection
    {
        return BoardColumn::ofBoard($board)->get();
    }
}
