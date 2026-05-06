<?php

namespace App\Console\Commands;

use App\Models\Board;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminBoardShow extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:board_show
                            {--slug= : Board slug or ID}';

    /**
     * The console command description.
     */
    protected $description = 'Show details of a board from the CLI';

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

        $board = Board::withTrashed()->where('id', $slug)->orWhere('slug', $slug)->first();

        if (! $board) {
            $this->error("No board found with slug/ID: {$slug}");

            return static::FAILURE;
        }

        $this->info("Board: {$board->name}");
        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Slug', 'Status', 'Team', 'Created By', 'Created At', 'Deleted At'],
            [
                [
                    $board->id,
                    $board->name,
                    $board->slug,
                    $board->status,
                    $board->team_id,
                    $board->created_by,
                    $board->created_at->format('Y-m-d H:i:s'),
                    $board->deleted_at?->format('Y-m-d H:i:s') ?? 'N/A',
                ],
            ]
        );

        $members = $board->members;

        if ($members->isNotEmpty()) {
            $this->newLine();
            $this->info('Members:');
            $this->table(
                ['ID', 'Name', 'Email'],
                $members->map(fn ($m) => [
                    $m->id,
                    $m->name,
                    $m->email,
                ])->toArray()
            );
        }

        $columns = $board->columns()->orderBy('order')->get();

        if ($columns->isNotEmpty()) {
            $this->newLine();
            $this->info('Columns:');
            $this->table(
                ['ID', 'Name', 'Order', 'Items', 'Created At'],
                $columns->map(fn ($col) => [
                    $col->id,
                    $col->name,
                    $col->order,
                    $col->items()->count(),
                    $col->created_at->format('Y-m-d H:i:s'),
                ])->toArray()
            );
        }

        return static::SUCCESS;
    }
}
