<?php

namespace App\Actions\BoardItemChecklistItems;

use App\Models\BoardItemChecklistItem;

final class DestroyBoardItemChecklistItemAction
{
    public function execute(BoardItemChecklistItem $checklistItem): void
    {
        $checklistItem->delete();
    }
}
