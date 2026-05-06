<?php

namespace App\Console\Commands;

use App\Actions\BoardItems\ReorderBoardItemsAction;
use App\Models\Board;
use App\Models\BoardItem;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminItemReorder extends Command
{
    protected $signature = 'admin:item_reorder';

    protected $description = 'Reorder board items across columns from the CLI';

    public function handle(ReorderBoardItemsAction $reorderBoardItemsAction): int
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
            $this->error("Board '{$board->name}' has no columns.");

            return static::FAILURE;
        }

        $this->newLine();
        $this->info("Current item order in board '{$board->name}':");

        $rows = [];

        foreach ($columns as $column) {
            $items = $board->items()->where('board_column_id', $column->id)
                ->orderBy('position')
                ->get();

            if ($items->isEmpty()) {
                $rows[] = [$column->name.' (empty)', '', ''];

                continue;
            }

            foreach ($items as $index => $item) {
                $rows[] = [
                    $column->name,
                    $index + 1,
                    "#{$item->number} {$item->title}",
                ];
            }
        }

        $this->table(
            ['Column', 'Position', 'Item'],
            $rows
        );

        $this->newLine();
        $this->warn('Enter the new order for each column.');
        $this->warn('Enter item IDs separated by commas for each column.');
        $this->warn('Enter "skip" to leave a column unchanged.');

        $columnsOrder = [];

        foreach ($columns as $column) {
            $input = text(
                label: "New order for column '{$column->name}' (item IDs comma-separated or 'skip')",
                default: 'skip',
            );

            if (trim($input) === 'skip') {
                continue;
            }

            $itemIds = array_filter(array_map('trim', explode(',', $input)));

            $validIds = BoardItem::whereIn('id', $itemIds)
                ->where('board_id', $board->id)
                ->where('board_column_id', $column->id)
                ->pluck('id')
                ->toArray();

            if (empty($validIds)) {
                $this->warn("No valid item IDs found for column '{$column->name}'. Skipping.");

                continue;
            }

            $columnsOrder[] = [
                'id' => $column->id,
                'items' => $validIds,
            ];
        }

        if (empty($columnsOrder)) {
            $this->info('No changes made.');

            return static::SUCCESS;
        }

        $reorderBoardItemsAction->execute($board, $columnsOrder);

        $this->info('Items reordered successfully!');

        return static::SUCCESS;
    }
}
