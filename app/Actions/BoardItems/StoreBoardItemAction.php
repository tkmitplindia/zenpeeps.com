<?php

namespace App\Actions\BoardItems;

use App\Enums\BoardItemPriority;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\BoardItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class StoreBoardItemAction
{
    /**
     * @param  array<int, string>  $assignees
     * @param  array<int, string>  $tags
     */
    public function execute(
        Board $board,
        BoardColumn $column,
        User $createdBy,
        string $title,
        ?string $description,
        BoardItemPriority $priority,
        ?int $estimatedMinutes,
        ?string $dueDate,
        array $assignees,
        array $tags,
    ): BoardItem {
        return DB::transaction(function () use ($board, $column, $createdBy, $title, $description, $priority, $estimatedMinutes, $dueDate, $assignees, $tags) {
            $item = $board->items()->create([
                'board_column_id' => $column->id,
                'created_by' => $createdBy->id,
                'number' => ($board->items()->withTrashed()->max('number') ?? 0) + 1,
                'position' => ($column->items()->max('position') ?? 0) + 1,
                'title' => $title,
                'description' => $description,
                'priority' => $priority->value,
                'estimated_minutes' => $estimatedMinutes,
                'due_date' => $dueDate,
            ]);

            if (! empty($assignees)) {
                $item->assignees()->sync($assignees);
            }

            foreach ($tags as $name) {
                $item->tags()->create(['name' => $name]);
            }

            return $item;
        });
    }
}
