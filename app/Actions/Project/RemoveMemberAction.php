<?php

namespace App\Actions\Project;

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RemoveMemberAction
{
    public function handle(Project $project, User $member): void
    {
        if ($member->id === $project->owner_id) {
            throw ValidationException::withMessages([
                'member' => 'The project owner cannot be removed.',
            ]);
        }

        DB::transaction(fn () => $project->members()->detach($member->id));
    }
}
