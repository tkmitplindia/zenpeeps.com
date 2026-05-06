<?php

namespace App\Console\Commands;

use App\Models\Team;
use Illuminate\Console\Command;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\text;

class AdminTeamDelete extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:team_delete
                            {--slug= : Team slug}
                            {--force : Skip confirmation prompt}';

    /**
     * The console command description.
     */
    protected $description = 'Delete a team from the CLI';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $slug = $this->option('slug');
        if ($slug === null || $slug === '') {
            $slug = text(
                label: 'Team slug',
                required: 'Please enter the team slug.',
            );
        }

        $team = Team::where('slug', $slug)->first();

        if (! $team) {
            $this->error("No team found with slug: {$slug}");

            return static::FAILURE;
        }

        $this->warn("Team: {$team->name} ({$team->slug})");
        $this->warn('Members: '.$team->members()->count());

        if (! $this->option('force')) {
            $confirmed = confirm(
                label: 'Are you sure you want to delete this team?',
                default: false,
            );

            if (! $confirmed) {
                $this->info('Operation cancelled.');

                return static::SUCCESS;
            }
        }

        $team->invitations()->delete();
        $team->memberships()->delete();
        $team->delete();

        $this->info('Team deleted successfully!');

        return static::SUCCESS;
    }
}
