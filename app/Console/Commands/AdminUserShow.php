<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminUserShow extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:user_show
                            {--email= : User email}';

    /**
     * The console command description.
     */
    protected $description = 'Show details of a user from the CLI';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->option('email');
        if ($email === null || $email === '') {
            $email = text(
                label: 'User email',
                required: 'Please enter the user email.',
            );
        }

        $user = User::with(['teams', 'boards', 'currentTeam'])
            ->where('email', $email)
            ->first();

        if (! $user) {
            $this->error("No user found with email: {$email}");

            return static::FAILURE;
        }

        $this->info("User: {$user->name}");
        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Email', 'Email Verified', '2FA Status', 'Current Team', 'Created At', 'Updated At'],
            [
                [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->email_verified_at ? 'Yes' : 'No',
                    $user->two_factor_secret ? 'Enabled' : 'Disabled',
                    $user->currentTeam?->name ?? 'None',
                    $user->created_at->format('Y-m-d H:i:s'),
                    $user->updated_at->format('Y-m-d H:i:s'),
                ],
            ]
        );

        $userTeams = $user->teams;

        if ($userTeams->isNotEmpty()) {
            $this->newLine();
            $this->info('Teams:');
            $this->table(
                ['Team ID', 'Team Name', 'Role'],
                $userTeams->map(fn ($team) => [
                    $team->id,
                    $team->name,
                    $team->pivot->role?->label() ?? 'N/A',
                ])->toArray()
            );
        }

        return static::SUCCESS;
    }
}
