<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Carbon\Carbon;
use Database\Factories\LabelFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * A label that can be applied to tasks on a board.
 *
 * @property string $id
 * @property string $board_id
 * @property string $name
 * @property string $color
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read Board $board
 * @property-read Collection<int, Task> $tasks
 */
#[Fillable(['board_id', 'name', 'color'])]
class Label extends Model
{
    /** @use HasFactory<LabelFactory> */
    use HasFactory;

    use HasUuid;

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'task_label');
    }
}
