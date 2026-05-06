<?php

namespace App\Console\Commands;

use App\Actions\BoardItems\UpdateBoardItemAction;
use App\Enums\BoardItemPriority;
use App\Models\BoardItem;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminItemUpdate extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:item_update
                            {--item_id= : Board item ID}
                            {--title= : New title}
                            {--description= : New description}
                            {--priority= : New priority}
                            {--estimated_minutes= : New estimated minutes}
                            {--due_date= : New due date (YYYY-MM-DD)}';

    /**
     * The console command description.
     */
    protected $description = 'Update a board item from the CLI';

    /**
     * Execute the console command.
     */
    public function handle(UpdateBoardItemAction $updateBoardItemAction): int
    {
        $itemId = $this->option('item_id');
        if ($itemId === null || $itemId === '') {
            $itemId = text(
                label: 'Board item ID',
                required: 'Please enter the board item ID.',
            );
        }

        $item = BoardItem::where('id', $itemId)->first();

        if (! $item) {
            $this->error("No board item found with ID: {$itemId}");

            return static::FAILURE;
        }

        $this->info("Current: #{$item->number} {$item->title} (Priority: {$item->priority})");

        $title = $this->option('title');
        if ($title === null || $title === '') {
            $title = text(
                label: 'New title',
                default: $item->title,
            );
        }

        $description = $this->option('description');
        if ($description === null || $description === '') {
            $description = text(
                label: 'New description (leave empty to keep current)',
                default: $item->description ?? '',
            );
        }

        $priorityOptions = array_keys(BoardItemPriority::getOptions());
        $priority = $this->option('priority');
        if ($priority === null || $priority === '') {
            $priority = text(
                label: 'New priority ('.implode('/', $priorityOptions).')',
                default: $item->priority,
            );
        }

        $estimatedMinutes = $this->option('estimated_minutes');
        if ($estimatedMinutes === null || $estimatedMinutes === '') {
            $estimatedMinutes = text(
                label: 'New estimated minutes (leave empty to keep current)',
                default: $item->estimated_minutes !== null ? (string) $item->estimated_minutes : '',
            );
        }

        $dueDate = $this->option('due_date');
        if ($dueDate === null || $dueDate === '') {
            $dueDate = text(
                label: 'New due date (YYYY-MM-DD, leave empty to keep current)',
                default: $item->due_date ?? '',
            );
        }

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
