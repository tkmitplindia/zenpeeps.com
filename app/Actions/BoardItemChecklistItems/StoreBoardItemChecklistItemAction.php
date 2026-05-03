<?php

namespace App\Actions\BoardItemChecklistItems;

use App\Models\BoardItem;
use App\Models\BoardItemChecklistItem;

final class StoreBoardItemChecklistItemAction
{
    public function execute(BoardItem $item, string $name): BoardItemChecklistItem
    {
        return $item->checklistItems()->create([
            'name' => $name,
            'order' => ($item->checklistItems()->max('order') ?? 0) + 1,
        ]);
    }
}
