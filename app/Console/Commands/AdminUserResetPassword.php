<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

use function Laravel\Prompts\text;

class AdminUserResetPassword extends Command
{
    protected $signature = 'admin:user_reset_password';

    protected $description = 'Reset a user password from the CLI';

    public function handle(): int
    {
        $email = text(
            label: 'User email',
            required: 'Please enter the user email.',
        );

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("No user found with email: {$email}");

            return static::FAILURE;
        }

        $this->info("User: {$user->name} ({$user->email})");

        $newPassword = text(
            label: 'New password',
            required: 'Please enter a new password.',
        );

        $user->forceFill([
            'password' => Hash::make($newPassword),
        ])->save();

        $this->info('Password reset successfully!');

        return static::SUCCESS;
    }
}
