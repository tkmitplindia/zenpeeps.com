<?php

namespace App\Console\Commands;

use App\Actions\BoardItems\UpdateBoardItemAction;
use App\Enums\BoardItemPriority;
use App\Models\BoardItem;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminItemUpdate extends Command
{
    protected $signature = 'admin:item_update';

    protected $description = 'Update a board item from the CLI';

    public function handle(UpdateBoardItemAction $updateBoardItemAction): int
    {
        $itemId = text(
            label: 'Board item ID',
            required: 'Please enter the board item ID.',
        );

        $item = BoardItem::where('id', $itemId)->first();

        if (! $item) {
            $this->error("No board item found with ID: {$itemId}");

            return static::FAILURE;
        }

        $this->info("Current: #{$item->number} {$item->title} (Priority: {$item->priority})");

        $title = text(
            label: 'New title',
            default: $item->title,
        );

        $description = text(
            label: 'New description (leave empty to keep current)',
            default: $item->description ?? '',
        );

        $priorityOptions = array_keys(BoardItemPriority::getOptions());
        $priority = text(
            label: 'New priority ('.implode('/', $priorityOptions).')',
            default: $item->priority,
        );

        $estimatedMinutes = text(
            label: 'New estimated minutes (leave empty to keep current)',
            default: $item->estimated_minutes !== null ? (string) $item->estimated_minutes : '',
        );

        $dueDate = text(
            label: 'New due date (YYYY-MM-DD, leave empty to keep current)',
            default: $item->due_date ?? '',
        );

        $attributes = [
            'title' => trim($title),
            'description' => trim($description),
            'priority' => BoardItemPriority::from(trim($priority)),
        ];

        if (trim($estimatedMinutes) !== '') {
            $attributes['estimated_minutes'] = (int) trim($estimatedMinutes);
        } else {
            $attributes['estimated_minutes'] = null;
        }

        if (trim($dueDate) !== '') {
            $attributes['due_date'] = trim($dueDate);
        } else {
            $attributes['due_date'] = null;
        }

        $item = $updateBoardItemAction->execute($item, $attributes);

        $this->info('Board item updated successfully!');
        $this->newLine();
        $this->table(
            ['ID', 'Number', 'Title', 'Priority'],
            [[$item->id, $item->number, $item->title, $item->priority]]
        );

        return static::SUCCESS;
    }
}
