<?php

namespace App\Console\Commands;

use App\Models\Team;
use Illuminate\Console\Command;

class AdminTeamList extends Command
{
    protected $signature = 'admin:team_list';

    protected $description = 'List all teams from the CLI';

    public function handle(): int
    {
        $teams = Team::withCount(['members', 'boards'])
            ->withTrashed()
            ->orderBy('created_at', 'desc')
            ->get();

        if ($teams->isEmpty()) {
            $this->info('No teams found.');

            return static::SUCCESS;
        }

        $this->table(
            ['ID', 'Name', 'Slug', 'Members', 'Boards', 'Created At', 'Deleted At'],
            $teams->map(fn ($team) => [
                $team->id,
                $team->name,
                $team->slug,
                $team->members_count,
                $team->boards_count,
                $team->created_at->format('Y-m-d H:i:s'),
                $team->deleted_at?->format('Y-m-d H:i:s') ?? 'N/A',
            ])->toArray()
        );

        return static::SUCCESS;
    }
}
