<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminUserVerifyEmail extends Command
{
    protected $signature = 'admin:user_verify_email';

    protected $description = 'Mark a user email as verified from the CLI';

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

        if ($user->email_verified_at) {
            $this->info("Email already verified at: {$user->email_verified_at}");

            return static::SUCCESS;
        }

        $user->email_verified_at = now();
        $user->save();

        $this->info('Email verified successfully!');

        return static::SUCCESS;
    }
}
