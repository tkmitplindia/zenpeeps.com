<?php

namespace App\Console\Commands;

use App\Models\BoardItem;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminItemShow extends Command
{
    protected $signature = 'admin:item_show';

    protected $description = 'Show details of a board item from the CLI';

    public function handle(): int
    {
        $itemId = text(
            label: 'Board item ID',
            required: 'Please enter the board item ID.',
        );

        $item = BoardItem::withTrashed()
            ->where('id', $itemId)
            ->first();

        if (! $item) {
            $this->error("No board item found with ID: {$itemId}");

            return static::FAILURE;
        }

        $this->info("Item #{$item->number}: {$item->title}");
        $this->newLine();
        $this->table(
            ['Field', 'Value'],
            [
                ['ID', $item->id],
                ['Number', $item->number],
                ['Board', $item->board_id],
                ['Column', $item->board_column_id],
                ['Priority', $item->priority],
                ['Status', $item->completed_at ? 'Completed' : ($item->started_at ? 'In Progress' : 'Pending')],
                ['Description', $item->description ?? 'N/A'],
                ['Estimated Minutes', $item->estimated_minutes ?? 'N/A'],
                ['Tracked Seconds', $item->tracked_seconds],
                ['Due Date', $item->due_date ?? 'N/A'],
                ['Created By', $item->created_by],
                ['Created At', $item->created_at->format('Y-m-d H:i:s')],
                ['Started At', $item->started_at?->format('Y-m-d H:i:s') ?? 'N/A'],
                ['Completed At', $item->completed_at?->format('Y-m-d H:i:s') ?? 'N/A'],
                ['Deleted At', $item->deleted_at?->format('Y-m-d H:i:s') ?? 'N/A'],
            ]
        );

        $assignees = $item->assignees;

        if ($assignees->isNotEmpty()) {
            $this->newLine();
            $this->info('Assignees:');
            $this->table(
                ['ID', 'Name', 'Email'],
                $assignees->map(fn ($a) => [
                    $a->id,
                    $a->name,
                    $a->email,
                ])->toArray()
            );
        }

        $tags = $item->tags;

        if ($tags->isNotEmpty()) {
            $this->newLine();
            $this->info('Tags:');
            $this->table(
                ['ID', 'Name'],
                $tags->map(fn ($t) => [
                    $t->id,
                    $t->name,
                ])->toArray()
            );
        }

        $checklistItems = $item->checklistItems;

        if ($checklistItems->isNotEmpty()) {
            $this->newLine();
            $this->info('Checklist Items:');
            $this->table(
                ['ID', 'Name', 'Completed'],
                $checklistItems->map(fn ($c) => [
                    $c->id,
                    $c->name,
                    $c->completed_at ? 'Yes' : 'No',
                ])->toArray()
            );
        }

        return static::SUCCESS;
    }
}
