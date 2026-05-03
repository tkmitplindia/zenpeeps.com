<?php

namespace App\Actions\BoardItemAttachments;

use App\Models\BoardItem;
use App\Models\BoardItemAttachment;
use App\Models\User;
use Illuminate\Http\UploadedFile;

final class StoreBoardItemAttachmentAction
{
    public function execute(BoardItem $item, User $uploader, UploadedFile $file): BoardItemAttachment
    {
        $path = $file->store("board-items/{$item->id}/attachments", 'public');

        return $item->attachments()->create([
            'uploaded_by' => $uploader->id,
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);
    }
}
