<?php

namespace App\Console\Commands;

use App\Actions\BoardItems\StoreBoardItemAction;
use App\Enums\BoardItemPriority;
use App\Models\Board;
use App\Models\User;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminItemCreate extends Command
{
    protected $signature = 'admin:item_create';

    protected $description = 'Create a new board item from the CLI';

    public function handle(StoreBoardItemAction $storeBoardItemAction): int
    {
        $boardSlug = text(
            label: 'Board slug or ID',
            required: 'Please enter the board slug or ID.',
        );

        $board = Board::where('id', $boardSlug)->orWhere('slug', $boardSlug)->first();

        if (! $board) {
            $this->error("No board found with slug/ID: {$boardSlug}");

            return static::FAILURE;
        }

        $columns = $board->columns()->orderBy('order')->get();

        if ($columns->isEmpty()) {
            $this->error("Board '{$board->name}' has no columns. Add columns first.");

            return static::FAILURE;
        }

        $this->info("Columns in board '{$board->name}':");
        $this->table(
            ['ID', 'Name', 'Order'],
            $columns->map(fn ($col) => [
                $col->id,
                $col->name,
                $col->order,
            ])->toArray()
        );

        $columnId = text(
            label: 'Column ID',
            required: 'Please enter the column ID.',
        );

        $column = $columns->where('id', $columnId)->first();

        if (! $column) {
            $this->error("Invalid column ID: {$columnId}");

            return static::FAILURE;
        }

        $title = text(
            label: 'Title',
            required: 'Please enter a title.',
        );

        $description = text(
            label: 'Description (leave empty for none)',
            default: '',
        );

        $priorityOptions = array_keys(BoardItemPriority::getOptions());
        $priority = text(
            label: 'Priority ('.implode('/', $priorityOptions).')',
            default: 'medium',
        );

        $estimatedMinutes = text(
            label: 'Estimated minutes (leave empty for none)',
            default: '',
        );

        $dueDate = text(
            label: 'Due date (YYYY-MM-DD, leave empty for none)',
            default: '',
        );

        $assigneeEmails = text(
            label: 'Assignee emails (comma-separated, leave empty for none)',
            default: '',
        );

        $tagNames = text(
            label: 'Tags (comma-separated, leave empty for none)',
            default: '',
        );

        $createdByEmail = text(
            label: 'Created by email',
            required: 'Please enter the creator email.',
        );

        $createdBy = User::where('email', $createdByEmail)->first();

        if (! $createdBy) {
            $this->error("No user found with email: {$createdByEmail}");

            return static::FAILURE;
        }

        $assignees = array_filter(array_map('trim', explode(',', $assigneeEmails)));
        $assigneeIds = User::whereIn('email', $assignees)->pluck('id')->toArray();

        $tags = array_filter(array_map('trim', explode(',', $tagNames)));

        $item = $storeBoardItemAction->execute(
            board: $board,
            column: $column,
            createdBy: $createdBy,
            title: trim($title),
            description: trim($description),
            priority: BoardItemPriority::from(trim($priority)),
            estimatedMinutes: trim($estimatedMinutes) !== '' ? (int) trim($estimatedMinutes) : null,
            dueDate: trim($dueDate) !== '' ? trim($dueDate) : null,
            assignees: $assigneeIds,
            tags: $tags,
        );

        $this->info('Board item created successfully!');
        $this->newLine();
        $this->table(
            ['ID', 'Number', 'Title', 'Column', 'Priority'],
            [[$item->id, $item->number, $item->title, $column->name, $item->priority]]
        );

        return static::SUCCESS;
    }
}
