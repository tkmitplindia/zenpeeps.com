<?php

namespace App\Actions\BoardItemChecklistItems;

use App\Models\BoardItemChecklistItem;

final class UpdateBoardItemChecklistItemAction
{
    /**
     * @param  array{name?: string, completed?: bool}  $attributes
     */
    public function execute(BoardItemChecklistItem $checklistItem, array $attributes): BoardItemChecklistItem
    {
        $payload = [];

        if (array_key_exists('name', $attributes)) {
            $payload['name'] = $attributes['name'];
        }

        if (array_key_exists('completed', $attributes)) {
            $payload['completed_at'] = $attributes['completed'] ? now() : null;
        }

        if (! empty($payload)) {
            $checklistItem->update($payload);
        }

        return $checklistItem->refresh();
    }
}
