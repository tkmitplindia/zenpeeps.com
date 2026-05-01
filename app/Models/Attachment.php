<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Carbon\Carbon;
use Database\Factories\AttachmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A file uploaded and attached to a polymorphic model (task, page, message, meeting).
 *
 * @property string $id
 * @property string $attachable_type
 * @property string $attachable_id
 * @property string $project_id
 * @property string $uploaded_by
 * @property string $filename
 * @property string $url
 * @property string $disk
 * @property string $mime_type
 * @property int $size_bytes
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Model $attachable
 * @property-read Project $project
 * @property-read User $uploader
 */
#[Fillable([
    'attachable_type',
    'attachable_id',
    'project_id',
    'uploaded_by',
    'filename',
    'url',
    'disk',
    'mime_type',
    'size_bytes',
])]
class Attachment extends Model
{
    /** @use HasFactory<AttachmentFactory> */
    use HasFactory;

    use HasUuid;
    use SoftDeletes;

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
