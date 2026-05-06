<?php

namespace App\Console\Commands;

use App\Actions\Boards\DestroyBoardAction;
use App\Models\Board;
use Illuminate\Console\Command;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\text;

class AdminBoardDelete extends Command
{
    protected $signature = 'admin:board_delete';

    protected $description = 'Delete a board from the CLI';

    public function handle(DestroyBoardAction $destroyBoardAction): int
    {
        $slug = text(
            label: 'Board slug or ID',
            required: 'Please enter the board slug or ID.',
        );

        $board = Board::where('id', $slug)->orWhere('slug', $slug)->first();

        if (! $board) {
            $this->error("No board found with slug/ID: {$slug}");

            return static::FAILURE;
        }

        $this->warn("Board: {$board->name} ({$board->slug})");
        $this->warn('Items: '.$board->items()->count());
        $this->warn('Columns: '.$board->columns()->count());

        $confirmed = confirm(
            label: 'Are you sure you want to delete this board?',
            default: false,
        );

        if (! $confirmed) {
            $this->info('Operation cancelled.');

            return static::SUCCESS;
        }

        $destroyBoardAction->execute($board);

        $this->info('Board deleted successfully!');

        return static::SUCCESS;
    }
}
