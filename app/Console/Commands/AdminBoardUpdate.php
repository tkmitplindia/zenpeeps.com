<?php

namespace App\Console\Commands;

use App\Actions\Boards\UpdateBoardAction;
use App\Enums\BoardStatus;
use App\Models\Board;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminBoardUpdate extends Command
{
    protected $signature = 'admin:board_update';

    protected $description = 'Update a board from the CLI';

    public function handle(UpdateBoardAction $updateBoardAction): int
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

        $this->info("Current name: {$board->name}");
        $this->info("Current status: {$board->status}");

        $name = text(
            label: 'New name',
            default: $board->name,
        );

        $description = text(
            label: 'New description (leave empty to keep current)',
            default: $board->description ?? '',
        );

        $statusOptions = array_keys(BoardStatus::getOptions());
        $status = text(
            label: 'New status ('.implode('/', $statusOptions).')',
            default: $board->status,
        );

        $board = $updateBoardAction->execute(
            board: $board,
            name: trim($name),
            description: trim($description),
            status: trim($status),
            members: [],
        );

        $this->info('Board updated successfully!');
        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Slug', 'Status'],
            [[$board->id, $board->name, $board->slug, $board->status]]
        );

        return static::SUCCESS;
    }
}
