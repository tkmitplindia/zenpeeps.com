<?php

namespace App\Console\Commands;

use App\Enums\BoardStatus;
use App\Models\Board;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminBoardArchive extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:board_archive
                            {--slug= : Board slug or ID}
                            {--force : Skip already-archived check}';

    /**
     * The console command description.
     */
    protected $description = 'Archive a board from the CLI';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $slug = $this->option('slug');
        if ($slug === null || $slug === '') {
            $slug = text(
                label: 'Board slug or ID',
                required: 'Please enter the board slug or ID.',
            );
        }

        $board = Board::where('id', $slug)->orWhere('slug', $slug)->first();

        if (! $board) {
            $this->error("No board found with slug/ID: {$slug}");

            return static::FAILURE;
        }

        if ($board->status === BoardStatus::Archived->value) {
            $this->info('Board is already archived.');

            return static::SUCCESS;
        }

        $board->update(['status' => BoardStatus::Archived->value]);

        $this->info("Board '{$board->name}' archived successfully!");

        return static::SUCCESS;
    }
}
