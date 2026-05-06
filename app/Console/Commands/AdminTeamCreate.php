<?php

namespace App\Console\Commands;

use App\Actions\Teams\CreateTeam;
use App\Models\User;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminTeamCreate extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:team_create';

    /**
     * The console command description.
     */
    protected $description = 'Create a new team from the CLI';

    /**
     * Execute the console command.
     */
    public function handle(CreateTeam $createTeam): int
    {
        $name = text(
            label: 'Team name',
            required: 'Please enter a team name.',
            validate: fn (string $value) => strlen(trim($value)) > 0 ? null : 'Team name is required.',
        );

        $ownerEmail = text(
            label: 'Owner email',
            required: 'Please enter the owner\'s email address.',
        );

        $owner = User::where('email', $ownerEmail)->first();

        if (! $owner) {
            $this->error("No user found with email: {$ownerEmail}");

            return static::FAILURE;
        }

        try {
            $team = $createTeam->handle($owner, trim($name));
        } catch (\Exception $e) {
            $this->error("Failed to create team: {$e->getMessage()}");

            return static::FAILURE;
        }

        $this->info('Team created successfully!');
        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Slug', 'Owner'],
            [[$team->id, $team->name, $team->slug, $owner->email]]
        );

        return static::SUCCESS;
    }
}
