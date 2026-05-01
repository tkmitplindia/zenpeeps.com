<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Carbon\Carbon;
use Database\Factories\TaskItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A checklist item belonging to a task.
 *
 * @property string $id
 * @property string $task_id
 * @property string $text
 * @property bool $done
 * @property int $position
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read Task $task
 */
#[Fillable(['task_id', 'text', 'done', 'position'])]
class TaskItem extends Model
{
    /** @use HasFactory<TaskItemFactory> */
    use HasFactory;

    use HasUuid;

    protected function casts(): array
    {
        return [
            'done' => 'boolean',
        ];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
