<?php

namespace App\Console\Commands;

use App\Models\Board;
use App\Models\BoardItem;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminItemMove extends Command
{
    protected $signature = 'admin:item_move';

    protected $description = 'Move a board item to a different column from the CLI';

    public function handle(): int
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

        $this->info("Item #{$item->number}: {$item->title}");
        $this->info("Current column: {$item->column->name} (ID: {$item->board_column_id})");

        $board = Board::where('id', $item->board_id)->first();

        if (! $board) {
            $this->error('Board not found for this item.');

            return static::FAILURE;
        }

        $columns = $board->columns()->orderBy('order')->get();

        if ($columns->isEmpty()) {
            $this->error("Board '{$board->name}' has no columns.");

            return static::FAILURE;
        }

        $this->newLine();
        $this->info("Available columns in board '{$board->name}':");
        $this->table(
            ['ID', 'Name', 'Order'],
            $columns->map(fn ($col) => [
                $col->id,
                $col->name,
                $col->order,
            ])->toArray()
        );

        $targetColumnId = text(
            label: 'Target column ID',
            required: 'Please enter the target column ID.',
        );

        $targetColumn = $columns->where('id', $targetColumnId)->first();

        if (! $targetColumn) {
            $this->error("Invalid column ID: {$targetColumnId}");

            return static::FAILURE;
        }

        $item->update([
            'board_column_id' => $targetColumn->id,
            'position' => ($board->items()->where('board_column_id', $targetColumn->id)->max('position') ?? 0) + 1,
        ]);

        $this->info("Item moved to '{$targetColumn->name}' successfully!");

        return static::SUCCESS;
    }
}
