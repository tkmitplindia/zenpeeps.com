<?php

namespace App\Models;

use App\Enums\BoardTemplate;
use App\Models\Concerns\HasUuid;
use Carbon\Carbon;
use Database\Factories\BoardFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A kanban board belonging to a project.
 *
 * @property string $id
 * @property string $project_id
 * @property string $name
 * @property string|null $description
 * @property BoardTemplate $template
 * @property int $position
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Project $project
 * @property-read Collection<int, BoardColumn> $columns
 * @property-read Collection<int, Task> $tasks
 */
#[Fillable(['project_id', 'name', 'description', 'template', 'position'])]
class Board extends Model
{
    /** @use HasFactory<BoardFactory> */
    use HasFactory;

    use HasUuid;
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'template' => BoardTemplate::class,
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function columns(): HasMany
    {
        return $this->hasMany(BoardColumn::class)->orderBy('position');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
