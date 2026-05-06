<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class AdminUserList extends Command
{
    protected $signature = 'admin:user_list';

    protected $description = 'List all users from the CLI';

    public function handle(): int
    {
        $users = User::withCount(['teams', 'boards'])
            ->withTrashed()
            ->orderBy('created_at', 'desc')
            ->get();

        if ($users->isEmpty()) {
            $this->info('No users found.');

            return static::SUCCESS;
        }

        $this->table(
            ['ID', 'Name', 'Email', 'Teams', 'Boards', 'Verified', 'Created At', 'Deleted At'],
            $users->map(fn ($user) => [
                $user->id,
                $user->name,
                $user->email,
                $user->teams_count,
                $user->boards_count,
                $user->email_verified_at ? 'Yes' : 'No',
                $user->created_at->format('Y-m-d H:i:s'),
                $user->deleted_at?->format('Y-m-d H:i:s') ?? 'N/A',
            ])->toArray()
        );

        return static::SUCCESS;
    }
}
