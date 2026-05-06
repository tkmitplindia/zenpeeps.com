<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminUserUpdate extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:user_update
                            {--email= : User email}
                            {--name= : New name}';

    /**
     * The console command description.
     */
    protected $description = 'Update a user from the CLI';

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

        $this->info("Current name: {$user->name}");

        $name = $this->option('name');
        if ($name === null || $name === '') {
            $name = text(
                label: 'New name',
                default: $user->name,
            );
        }

        $user->name = trim($name);
        $user->save();

        $this->info('User updated successfully!');
        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Email'],
            [[$user->id, $user->name, $user->email]]
        );

        return static::SUCCESS;
    }
}
