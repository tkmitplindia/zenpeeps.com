<?php

namespace App\Console\Commands;

use App\Actions\Fortify\CreateNewUser;
use App\Enums\TeamRole;
use App\Models\Team;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminUserCreate extends Command
{
    protected $signature = 'admin:user_create';

    protected $description = 'Create a new user from the CLI';

    public function handle(CreateNewUser $createNewUser): int
    {
        $name = text(
            label: 'Name',
            required: 'Please enter the user name.',
        );

        $email = text(
            label: 'Email',
            required: 'Please enter the user email.',
        );

        $password = text(
            label: 'Password',
            required: 'Please enter a password.',
        );

        $teamSlug = text(
            label: 'Team slug (optional, press Enter to skip)',
            default: '',
        );

        $user = $createNewUser->create([
            'name' => trim($name),
            'email' => trim($email),
            'password' => $password,
        ]);

        if (trim($teamSlug) !== '') {
            $team = Team::where('slug', $teamSlug)->first();

            if ($team) {
                $team->members()->attach($user->id, ['role' => TeamRole::Owner->value]);
                $this->info("Assigned to team: {$team->name}");
            } else {
                $this->warn("Team with slug '{$teamSlug}' not found. User created without team assignment.");
            }
        } else {
            $personalTeam = $user->personalTeam();
            if ($personalTeam) {
                $this->info("Personal team created: {$personalTeam->name}");
            }
        }

        $this->info('User created successfully!');
        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Email'],
            [[$user->id, $user->name, $user->email]]
        );

        return static::SUCCESS;
    }
}
