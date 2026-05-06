<?php

namespace App\Console\Commands;

use App\Actions\Boards\StoreBoardAction;
use App\Enums\BoardStatus;
use App\Models\Team;
use App\Models\User;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminBoardCreate extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'admin:board_create
                            {--team_slug= : Team slug}
                            {--name= : Board name}
                            {--description= : Board description}
                            {--status= : Board status (active/archived)}
                            {--creator_email= : Creator email}';

    /**
     * The console command description.
     */
    protected $description = 'Create a new board from the CLI';

    /**
     * Execute the console command.
     */
    public function handle(StoreBoardAction $storeBoardAction): int
    {
        $teamSlug = $this->option('team_slug');
        if ($teamSlug === null || $teamSlug === '') {
            $teamSlug = text(
                label: 'Team slug',
                required: 'Please enter the team slug.',
            );
        }

        $team = Team::where('slug', $teamSlug)->first();

        if (! $team) {
            $this->error("No team found with slug: {$teamSlug}");

            return static::FAILURE;
        }

        $name = $this->option('name');
        if ($name === null || $name === '') {
            $name = text(
                label: 'Board name',
                required: 'Please enter a board name.',
            );
        }

        $description = $this->option('description');
        if ($description === null || $description === '') {
            $description = text(
                label: 'Description (leave empty for none)',
                default: '',
            );
        }

        $statusOptions = array_keys(BoardStatus::getOptions());
        $status = $this->option('status');
        if ($status === null || $status === '') {
            $status = text(
                label: 'Status ('.implode('/', $statusOptions).')',
                default: 'active',
            );
        }

        $createdByEmail = $this->option('creator_email');
        if ($createdByEmail === null || $createdByEmail === '') {
            $createdByEmail = text(
                label: 'Created by email',
                required: 'Please enter the creator email.',
            );
        }

        $createdBy = User::where('email', $createdByEmail)->first();

        if (! $createdBy) {
            $this->error("No user found with email: {$createdByEmail}");

            return static::FAILURE;
        }

        $board = $storeBoardAction->execute(
            team: $team,
            name: trim($name),
            description: trim($description),
            status: trim($status),
            columns: [],
            members: [],
            createdBy: $createdBy,
        );

        $this->info('Board created successfully!');
        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Slug', 'Status', 'Team'],
            [[$board->id, $board->name, $board->slug, $board->status, $team->name]]
        );

        return static::SUCCESS;
    }
}
