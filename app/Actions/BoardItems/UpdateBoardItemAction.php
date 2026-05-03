<?php

namespace App\Actions\BoardItems;

use App\Models\BoardItem;
use Illuminate\Support\Facades\DB;

final class UpdateBoardItemAction
{
    /**
     * Persist the validated subset of attributes onto a BoardItem.
     *
     * Only keys present in $attributes are touched. Sub-resources (assignees, tags) are
     * synced when their keys are present.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function execute(BoardItem $item, array $attributes): BoardItem
    {
        return DB::transaction(function () use ($item, $attributes) {
            $assignees = $attributes['assignees'] ?? null;
            $tags = $attributes['tags'] ?? null;

            $fillable = collect($attributes)
                ->except(['assignees', 'tags'])
                ->all();

            if (! empty($fillable)) {
                $item->update($fillable);
            }

            if ($assignees !== null) {
                $item->assignees()->sync($assignees);
            }

            if ($tags !== null) {
                $item->tags()->delete();
                foreach ($tags as $name) {
                    $item->tags()->create(['name' => $name]);
                }
            }

            return $item->refresh();
        });
    }
}
