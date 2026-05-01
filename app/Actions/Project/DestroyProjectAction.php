<?php

namespace App\Actions\Project;

use App\Models\Project;
use Illuminate\Support\Facades\DB;

class DestroyProjectAction
{
    public function handle(Project $project): void
    {
        DB::transaction(fn () => $project->delete());
    }
}
