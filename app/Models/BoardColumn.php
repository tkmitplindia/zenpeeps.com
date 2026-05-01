<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Carbon\Carbon;
use Database\Factories\BoardColumnFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A column within a kanban board.
 *
 * @property string $id
 * @property string $board_id
 * @property string $name
 * @property int $position
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read Board $board
 * @property-read Collection<int, Task> $tasks
 */
#[Fillable(['board_id', 'name', 'position'])]
class BoardColumn extends Model
{
    /** @use HasFactory<BoardColumnFactory> */
    use HasFactory;

    use HasUuid;

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class)->orderBy('position');
    }
}
