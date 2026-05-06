<?php

namespace App\Console\Commands;

use App\Models\Team;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminTeamShow extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:team_show
                            {--slug= : Team slug}';

    /**
     * The console command description.
     */
    protected $description = 'Show details of a team from the CLI';

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

        $team = Team::with(['members', 'invitations'])->where('slug', $slug)->first();

        if (! $team) {
            $this->error("No team found with slug: {$slug}");

            return static::FAILURE;
        }

        $this->info("Team: {$team->name}");
        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Slug', 'Is Personal', 'Created At', 'Deleted At'],
            [
                [
                    $team->id,
                    $team->name,
                    $team->slug,
                    $team->is_personal ? 'Yes' : 'No',
                    $team->created_at->format('Y-m-d H:i:s'),
                    $team->deleted_at?->format('Y-m-d H:i:s') ?? 'N/A',
                ],
            ]
        );

        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Email', 'Role'],
            $team->members->map(fn ($member) => [
                $member->id,
                $member->name,
                $member->email,
                $member->pivot->role?->label() ?? 'N/A',
            ])->toArray()
        );

        $pendingInvitations = $team->invitations->whereNull('accepted_at');

        if ($pendingInvitations->isNotEmpty()) {
            $this->newLine();
            $this->table(
                ['Email', 'Role', 'Created At'],
                $pendingInvitations->map(fn ($invitation) => [
                    $invitation->email,
                    $invitation->role->label(),
                    $invitation->created_at->format('Y-m-d H:i:s'),
                ])->toArray()
            );
        }

        return static::SUCCESS;
    }
}
