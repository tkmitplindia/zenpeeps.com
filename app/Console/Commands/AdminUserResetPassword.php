<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

use function Laravel\Prompts\text;

class AdminUserResetPassword extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:user_reset_password
                            {--email= : User email}
                            {--password= : New password}';

    /**
     * The console command description.
     */
    protected $description = 'Reset a user password from the CLI';

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

        $this->info("User: {$user->name} ({$user->email})");

        $newPassword = $this->option('password');
        if ($newPassword === null || $newPassword === '') {
            $newPassword = text(
                label: 'New password',
                required: 'Please enter a new password.',
            );
        }

        $user->forceFill([
            'password' => Hash::make($newPassword),
        ])->save();

        $this->info('Password reset successfully!');

        return static::SUCCESS;
    }
}
