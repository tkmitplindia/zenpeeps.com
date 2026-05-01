<?php

namespace App\Actions\Board;

use App\Enums\BoardTemplate;
use App\Models\Board;
use App\Models\Project;
use App\Support\BoardTemplates;
use App\Support\Plans;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StoreBoardAction
{
    /**
     * @param  array{name: string, description?: ?string, template?: string, columns?: string[]}  $data
     */
    public function handle(Project $project, array $data): Board
    {
        $project->loadMissing('limits');

        $plan = Plans::for($project->plan);

        if ($plan->boardLimit > 0) {
            $count = $project->boards()->count();

            if ($count >= $plan->boardLimit) {
                throw ValidationException::withMessages([
                    'name' => "Your plan allows a maximum of {$plan->boardLimit} boards.",
                ]);
            }
        }

        return DB::transaction(function () use ($project, $data): Board {
            $template = BoardTemplate::tryFrom($data['template'] ?? '') ?? BoardTemplate::Custom;

            $position = $project->boards()->max('position') + 1;

            $board = Board::create([
                'project_id' => $project->id,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'template' => $template,
                'position' => $position,
            ]);

            $columns = ! empty($data['columns'])
                ? $data['columns']
                : BoardTemplates::columnsFor($template);

            foreach ($columns as $index => $columnName) {
                $board->columns()->create([
                    'name' => $columnName,
                    'position' => $index,
                ]);
            }

            return $board->load('columns');
        });
    }
}
