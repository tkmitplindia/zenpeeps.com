<?php

namespace App\Console\Commands;

use App\Models\Board;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminBoardRestore extends Command
{
    protected $signature = 'admin:board_restore';

    protected $description = 'Restore a soft-deleted board from the CLI';

    public function handle(): int
    {
        $slug = text(
            label: 'Board slug or ID',
            required: 'Please enter the board slug or ID.',
        );

        $board = Board::withTrashed()->where('id', $slug)->orWhere('slug', $slug)->first();

        if (! $board) {
            $this->error("No board found with slug/ID: {$slug}");

            return static::FAILURE;
        }

        if (! $board->trashed()) {
            $this->info("Board '{$board->name}' is not deleted (current status: {$board->status}).");

            return static::SUCCESS;
        }

        $board->restore();

        $this->info("Board '{$board->name}' restored successfully!");

        return static::SUCCESS;
    }
}
