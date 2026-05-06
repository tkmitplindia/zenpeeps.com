<?php

namespace App\Console\Commands;

use App\Models\Board;
use App\Models\BoardItem;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminItemList extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:item_list
                            {--board_slug= : Board slug or ID}
                            {--column_id= : Filter by column ID}';

    /**
     * The console command description.
     */
    protected $description = 'List all board items from the CLI';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $boardSlug = $this->option('board_slug');
        if ($boardSlug === null || $boardSlug === '') {
            $boardSlug = text(
                label: 'Board slug or ID',
                required: 'Please enter the board slug or ID.',
            );
        }

        $board = Board::where('id', $boardSlug)->orWhere('slug', $boardSlug)->first();

        if (! $board) {
            $this->error("No board found with slug/ID: {$boardSlug}");

            return static::FAILURE;
        }

        $columnId = $this->option('column_id');
        if ($columnId === null || $columnId === '') {
            $columnId = text(
                label: 'Filter by column ID (leave empty for all columns)',
                default: '',
            );
        }

        $items = BoardItem::where('board_id', $board->id)
            ->when(trim($columnId), fn ($q) => $q->where('board_column_id', trim($columnId)))
            ->with(['column', 'creator', 'assignees', 'tags'])
            ->withTrashed()
            ->orderBy('position')
            ->get();

        if ($items->isEmpty()) {
            $this->info('No items found.');

            return static::SUCCESS;
        }

        $this->info("Items for board: {$board->name}");
        $this->newLine();
        $this->table(
            ['ID', 'Number', 'Title', 'Column', 'Priority', 'Assignees', 'Created At', 'Deleted At'],
            $items->map(fn ($item) => [
                $item->id,
                $item->number,
                $item->title,
                $item->column->name ?? 'N/A',
                $item->priority,
                $item->assignees->pluck('name')->join(', ') ?: 'None',
                $item->created_at->format('Y-m-d H:i:s'),
                $item->deleted_at?->format('Y-m-d H:i:s') ?? 'N/A',
            ])->toArray()
        );

        return static::SUCCESS;
    }
}
