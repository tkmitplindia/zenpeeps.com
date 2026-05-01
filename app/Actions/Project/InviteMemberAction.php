<?php

namespace App\Actions\Project;

use App\Enums\ProjectRole;
use App\Mail\ProjectInvitationMail;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class InviteMemberAction
{
    public function handle(Project $project, User $inviter, string $email, ProjectRole $role): void
    {
        DB::transaction(function () use ($project, $inviter, $email, $role): void {
            $invitee = User::firstWhere('email', $email);

            if ($invitee && $project->members()->where('users.id', $invitee->id)->exists()) {
                throw ValidationException::withMessages([
                    'email' => 'This user is already a member of the project.',
                ]);
            }

            if ($invitee) {
                $project->members()->attach($invitee->id, [
                    'id' => (string) Str::orderedUuid(),
                    'role' => $role->value,
                    'joined_at' => now(),
                ]);
            }

            Mail::to($email)->send(new ProjectInvitationMail(
                project: $project,
                inviter: $inviter,
                role: $role,
                alreadyRegistered: $invitee !== null,
            ));
        });
    }
}
