<?php

namespace App\Console\Commands;

use App\Models\Team;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminTeamUpdate extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:team_update';

    /**
     * The console command description.
     */
    protected $description = 'Update an existing team from the CLI';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $slug = text(
            label: 'Team slug',
            required: 'Please enter the team slug.',
        );

        $team = Team::where('slug', $slug)->first();

        if (! $team) {
            $this->error("No team found with slug: {$slug}");

            return static::FAILURE;
        }

        $this->info("Current team name: {$team->name}");

        $newName = text(
            label: 'New team name',
            default: $team->name,
        );

        $team->update(['name' => trim($newName)]);

        $this->info('Team updated successfully!');
        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Slug'],
            [[$team->id, $team->name, $team->slug]]
        );

        return static::SUCCESS;
    }
}
