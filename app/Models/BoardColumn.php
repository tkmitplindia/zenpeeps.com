<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\BoardColumnFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class BoardColumn
 *
 *
 * @property string $id
 * @property string $board_id
 * @property string $name
 * @property int $order
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property Board $board
 * @property Collection<int, BoardItem> $items
 *
 * @method BelongsTo<Board> board()
 * @method HasMany<BoardItem> items()
 * @method static Builder ofBoard(Board $board)
 * @method static Builder last()
 * @method static Builder first()
 */
#[Fillable(['board_id', 'name', 'order'])]
class BoardColumn extends Model
{
    /** @use HasFactory<BoardColumnFactory> */
    use HasFactory;

    use HasUuids;
    use SoftDeletes;

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(BoardItem::class)->orderBy('position');
    }

    #[Scope]
    protected function ofBoard(Board $board): Builder
    {
        return $this->where('board_id', $board->id);
    }

    #[Scope]
    protected function last(Builder $query): Builder
    {
        return $query->orderBy('order', 'desc')->limit(1);
    }

    #[Scope]
    protected function first(Builder $query): Builder
    {
        return $query->orderBy('order', 'asc')->limit(1);
    }

    public function getNextOrder(): ?int
    {
        $nextOrder = $this->order + 1;

        if (BoardColumn::ofBoard($this->board)->where('order', $nextOrder)->exists()) {
            return $nextOrder;
        }

        return null;
    }

    public function getPreviousOrder(): ?int
    {
        $previousOrder = $this->order - 1;

        if (BoardColumn::ofBoard($this->board)->where('order', $previousOrder)->exists()) {
            return $previousOrder;
        }

        return null;
    }
}
