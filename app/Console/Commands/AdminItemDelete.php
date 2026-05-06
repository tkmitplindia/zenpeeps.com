<?php

namespace App\Console\Commands;

use App\Actions\BoardItems\DestroyBoardItemAction;
use App\Models\BoardItem;
use Illuminate\Console\Command;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\text;

class AdminItemDelete extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:item_delete
                            {--item_id= : Board item ID}
                            {--force : Skip confirmation prompt}';

    /**
     * The console command description.
     */
    protected $description = 'Delete a board item from the CLI';

    /**
     * Execute the console command.
     */
    public function handle(DestroyBoardItemAction $destroyBoardItemAction): int
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

        $this->warn("Item #{$item->number}: {$item->title}");

        if (! $this->option('force')) {
            $confirmed = confirm(
                label: 'Are you sure you want to delete this item?',
                default: false,
            );

            if (! $confirmed) {
                $this->info('Operation cancelled.');

                return static::SUCCESS;
            }
        }

        $destroyBoardItemAction->execute($item);

        $this->info('Board item deleted successfully!');

        return static::SUCCESS;
    }
}
