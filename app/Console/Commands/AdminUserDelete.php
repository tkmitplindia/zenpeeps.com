<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\text;

class AdminUserDelete extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:user_delete
                            {--email= : User email}
                            {--force : Skip confirmation prompt}';

    /**
     * The console command description.
     */
    protected $description = 'Delete a user from the CLI';

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

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("No user found with email: {$email}");

            return static::FAILURE;
        }

        $this->warn("User: {$user->name} ({$user->email})");
        $this->warn('Teams: '.$user->teams()->count());

        if (! $this->option('force')) {
            $confirmed = confirm(
                label: 'Are you sure you want to delete this user?',
                default: false,
            );

            if (! $confirmed) {
                $this->info('Operation cancelled.');

                return static::SUCCESS;
            }
        }

        $user->delete();

        $this->info('User deleted successfully!');

        return static::SUCCESS;
    }
}
