<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class BoardItemComment
 *
 * @property string $id
 * @property string $board_item_id
 * @property string $user_id
 * @property string $body
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property BoardItem $item
 * @property User $author
 *
 * @method BelongsTo<BoardItem> item()
 * @method BelongsTo<User> author()
 */
#[Fillable(['board_item_id', 'user_id', 'body'])]
class BoardItemComment extends Model
{
    use HasUuids;
    use SoftDeletes;

    public function item(): BelongsTo
    {
        return $this->belongsTo(BoardItem::class, 'board_item_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
