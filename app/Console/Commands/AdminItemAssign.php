<?php

namespace App\Console\Commands;

use App\Models\BoardItem;
use App\Models\User;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class AdminItemAssign extends Command
{
    protected $signature = 'admin:item_assign';

    protected $description = 'Assign a user to a board item from the CLI';

    public function handle(): int
    {
        $itemId = text(
            label: 'Board item ID',
            required: 'Please enter the board item ID.',
        );

        $item = BoardItem::where('id', $itemId)->first();

        if (! $item) {
            $this->error("No board item found with ID: {$itemId}");

            return static::FAILURE;
        }

        $this->info("Item #{$item->number}: {$item->title}");

        $currentAssignees = $item->assignees;

        if ($currentAssignees->isNotEmpty()) {
            $this->newLine();
            $this->info('Current assignees:');
            $this->table(
                ['ID', 'Name', 'Email'],
                $currentAssignees->map(fn ($a) => [
                    $a->id,
                    $a->name,
                    $a->email,
                ])->toArray()
            );
        }

        $assigneeEmails = text(
            label: 'Assignee emails (comma-separated)',
            required: 'Please enter the assignee email(s).',
        );

        $emails = array_filter(array_map('trim', explode(',', $assigneeEmails)));
        $users = User::whereIn('email', $emails)->get();

        if ($users->isEmpty()) {
            $this->error('No users found with the provided email(s).');

            return static::FAILURE;
        }

        $assigneeIds = $users->pluck('id')->toArray();

        $currentIds = $currentAssignees->pluck('id')->toArray();
        $synced = array_unique(array_merge($currentIds, $assigneeIds));

        $item->assignees()->sync($synced);

        $this->info('Assignee(s) added successfully!');

        return static::SUCCESS;
    }
}
