<?php

namespace App\Console\Commands;

use App\Models\Board;
use App\Models\Team;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminBoardList extends Command
{
    protected $signature = 'admin:board_list';

    protected $description = 'List all boards from the CLI';

    public function handle(): int
    {
        $teamSlug = text(
            label: 'Team slug',
            required: 'Please enter the team slug.',
        );

        $team = Team::where('slug', $teamSlug)->first();

        if (! $team) {
            $this->error("No team found with slug: {$teamSlug}");

            return static::FAILURE;
        }

        $status = text(
            label: 'Filter by status (active/archived/leave empty for all)',
            default: '',
        );

        $search = text(
            label: 'Search by name (leave empty for none)',
            default: '',
        );

        $boards = Board::ofTeam($team)
            ->when(trim($status), fn ($q) => $q->where('status', trim($status)))
            ->when(trim($search), fn ($q) => $q->where('name', 'like', '%'.trim($search).'%'))
            ->withCount(['members', 'columns', 'items'])
            ->withTrashed()
            ->orderBy('created_at', 'desc')
            ->get();

        if ($boards->isEmpty()) {
            $this->info('No boards found.');

            return static::SUCCESS;
        }

        $this->info("Boards for team: {$team->name}");
        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Status', 'Members', 'Columns', 'Items', 'Created At', 'Deleted At'],
            $boards->map(fn ($board) => [
                $board->id,
                $board->name,
                $board->status,
                $board->members_count,
                $board->columns_count,
                $board->items_count,
                $board->created_at->format('Y-m-d H:i:s'),
                $board->deleted_at?->format('Y-m-d H:i:s') ?? 'N/A',
            ])->toArray()
        );

        return static::SUCCESS;
    }
}
