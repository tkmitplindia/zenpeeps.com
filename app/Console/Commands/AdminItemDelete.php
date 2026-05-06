<?php

namespace App\Console\Commands;

use App\Actions\BoardItems\DestroyBoardItemAction;
use App\Models\BoardItem;
use Illuminate\Console\Command;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\text;

class AdminItemDelete extends Command
{
    protected $signature = 'admin:item_delete';

    protected $description = 'Delete a board item from the CLI';

    public function handle(DestroyBoardItemAction $destroyBoardItemAction): int
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

        $this->warn("Item #{$item->number}: {$item->title}");

        $confirmed = confirm(
            label: 'Are you sure you want to delete this item?',
            default: false,
        );

        if (! $confirmed) {
            $this->info('Operation cancelled.');

            return static::SUCCESS;
        }

        $destroyBoardItemAction->execute($item);

        $this->info('Board item deleted successfully!');

        return static::SUCCESS;
    }
}
