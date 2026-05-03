<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class BoardItemAttachment
 *
 * @property string $id
 * @property string $board_item_id
 * @property string $uploaded_by
 * @property string $name
 * @property string $path
 * @property string $mime_type
 * @property int $size
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property BoardItem $item
 * @property User $uploader
 *
 * @method BelongsTo<BoardItem> item()
 * @method BelongsTo<User> uploader()
 */
#[Fillable(['board_item_id', 'uploaded_by', 'name', 'path', 'mime_type', 'size'])]
class BoardItemAttachment extends Model
{
    use HasUuids;
    use SoftDeletes;

    public function item(): BelongsTo
    {
        return $this->belongsTo(BoardItem::class, 'board_item_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
