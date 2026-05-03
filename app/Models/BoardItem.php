<?php

namespace App\Models;

use App\Enums\BoardItemPriority;
use Carbon\Carbon;
use Database\Factories\BoardItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class BoardItem
 *
 * @property string $id
 * @property string $board_id
 * @property string $board_column_id
 * @property string $created_by
 * @property int $number
 * @property int $position
 * @property string $title
 * @property string|null $description
 * @property BoardItemPriority $priority
 * @property int|null $estimated_minutes
 * @property int $tracked_seconds
 * @property Carbon|null $time_tracker_started_at
 * @property Carbon|null $due_date
 * @property Carbon|null $started_at
 * @property Carbon|null $completed_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property Board $board
 * @property BoardColumn $column
 * @property User $creator
 * @property Collection<int, User> $assignees
 * @property Collection<int, BoardItemTag> $tags
 * @property Collection<int, BoardItemAttachment> $attachments
 * @property Collection<int, BoardItemComment> $comments
 * @property Collection<int, BoardItemChecklistItem> $checklistItems
 *
 * @method BelongsTo<Board> board()
 * @method BelongsTo<BoardColumn> column()
 * @method BelongsTo<User> creator()
 * @method BelongsToMany<User> assignees()
 * @method HasMany<BoardItemTag> tags()
 * @method HasMany<BoardItemAttachment> attachments()
 * @method HasMany<BoardItemComment> comments()
 * @method HasMany<BoardItemChecklistItem> checklistItems()
 * @method static Builder ofBoard(Board $board)
 * @method static Builder ofColumn(BoardColumn $column)
 */
#[Fillable([
    'board_id',
    'board_column_id',
    'created_by',
    'number',
    'position',
    'title',
    'description',
    'priority',
    'estimated_minutes',
    'tracked_seconds',
    'time_tracker_started_at',
    'due_date',
    'started_at',
    'completed_at',
])]
class BoardItem extends Model
{
    /** @use HasFactory<BoardItemFactory> */
    use HasFactory;

    use HasUuids;
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'priority' => BoardItemPriority::class,
            'time_tracker_started_at' => 'datetime',
            'due_date' => 'date',
            'started_at' => 'datetime',
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

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'board_item_assignees');
    }

    public function tags(): HasMany
    {
        return $this->hasMany(BoardItemTag::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(BoardItemAttachment::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(BoardItemComment::class);
    }

    public function checklistItems(): HasMany
    {
        return $this->hasMany(BoardItemChecklistItem::class)->orderBy('order');
    }

    public function isTimerRunning(): bool
    {
        return $this->time_tracker_started_at !== null;
    }

    public function totalTrackedSeconds(): int
    {
        $total = $this->tracked_seconds;

        if ($this->time_tracker_started_at !== null) {
            $total += $this->time_tracker_started_at->diffInSeconds(now());
        }

        return (int) $total;
    }

    #[Scope]
    protected function ofBoard(Builder $query, Board $board): Builder
    {
        return $query->where('board_id', $board->id);
    }

    #[Scope]
    protected function ofColumn(Builder $query, BoardColumn $column): Builder
    {
        return $query->where('board_column_id', $column->id);
    }
}
