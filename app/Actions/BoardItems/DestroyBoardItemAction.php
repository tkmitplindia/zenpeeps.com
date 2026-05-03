<?php

namespace App\Actions\BoardItems;

use App\Models\BoardItem;
use Illuminate\Support\Facades\DB;

final class DestroyBoardItemAction
{
    public function execute(BoardItem $item): void
    {
        DB::transaction(function () use ($item) {
            $item->delete();
        });
    }
}
