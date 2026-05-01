<?php

namespace App\Actions\Attachment;

use App\Models\Attachment;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UploadAttachmentAction
{
    /** @var string[] */
    private const ALLOWED_MIMES = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'text/plain', 'text/csv',
        'application/zip',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    private const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB per file

    public function handle(Project $project, User $uploader, Model $attachable, UploadedFile $file, string $disk = 'spaces'): Attachment
    {
        $mimeType = $file->getMimeType() ?? '';

        if (! in_array($mimeType, self::ALLOWED_MIMES, true)) {
            throw ValidationException::withMessages(['file' => 'File type not allowed.']);
        }

        $sizeBytes = $file->getSize();

        if ($sizeBytes > self::MAX_FILE_BYTES) {
            throw ValidationException::withMessages(['file' => 'File exceeds the 50 MB limit.']);
        }

        $usedBytes = $project->usedStorageBytes();
        $quotaBytes = $project->storageQuotaBytes();

        if ($usedBytes + $sizeBytes > $quotaBytes) {
            throw ValidationException::withMessages(['file' => 'Storage quota exceeded.']);
        }

        return DB::transaction(function () use ($project, $uploader, $attachable, $file, $disk, $mimeType, $sizeBytes): Attachment {
            $path = $file->store("attachments/{$project->id}", $disk);
            $url = Storage::disk($disk)->url($path);

            return $attachable->attachments()->create([
                'project_id' => $project->id,
                'uploaded_by' => $uploader->id,
                'filename' => $file->getClientOriginalName(),
                'url' => $url,
                'disk' => $disk,
                'mime_type' => $mimeType,
                'size_bytes' => $sizeBytes,
            ]);
        });
    }
}
