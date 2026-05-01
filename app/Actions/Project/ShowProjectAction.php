<?php

namespace App\Actions\Project;

use App\Models\Project;

class ShowProjectAction
{
    public function handle(Project $project): Project
    {
        return $project->load(['owner', 'members']);
    }
}
