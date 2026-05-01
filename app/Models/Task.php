<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Carbon\Carbon;
use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A task card on a kanban board.
 *
 * @property string $id
 * @property string $board_id
 * @property string $board_column_id
 * @property int $project_id
 * @property int $created_by
 * @property string $title
 * @property string|null $description
 * @property int $position
 * @property Carbon|null $due_date
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Board $board
 * @property-read BoardColumn $column
 * @property-read Collection<int, User> $assignees
 */
#[Fillable(['board_id', 'board_column_id', 'project_id', 'created_by', 'title', 'description', 'position', 'due_date'])]
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
}
