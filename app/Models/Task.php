<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Carbon\Carbon;
use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A task card on a kanban board.
 *
 * @property string $id
 * @property string $board_id
 * @property string $board_column_id
 * @property string $project_id
 * @property string $created_by
 * @property string $title
 * @property string|null $description
 * @property int $position
 * @property string $priority
 * @property Carbon|null $due_date
 * @property int|null $estimate_minutes
 * @property int $elapsed_seconds
 * @property Carbon|null $time_tracker_started_at
 * @property Carbon|null $completed_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Board $board
 * @property-read BoardColumn $column
 * @property-read Collection<int, User> $assignees
 * @property-read Collection<int, TaskItem> $items
 * @property-read Collection<int, Label> $labels
 * @property-read array{done: int, total: int} $completion
 */
#[Fillable([
    'board_id', 'board_column_id', 'project_id', 'created_by',
    'title', 'description', 'position', 'priority', 'due_date',
    'estimate_minutes', 'elapsed_seconds', 'time_tracker_started_at', 'completed_at',
])]
class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use HasFactory;

    use HasUuid;
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'time_tracker_started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function column(): BelongsTo
    {
        return $this->belongsTo(BoardColumn::class, 'board_column_id');
    }

    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_assignees');
    }

    public function labels(): BelongsToMany
    {
        return $this->belongsToMany(Label::class, 'task_label');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TaskItem::class)->orderBy('position');
    }

    /**
     * Return the checklist completion counts.
     *
     * @return Attribute<array{done: int, total: int}, never>
     */
    protected function completion(): Attribute
    {
        return Attribute::get(function (): array {
            $items = $this->items;

            return [
                'done' => $items->where('done', true)->count(),
                'total' => $items->count(),
            ];
        });
    }
}
