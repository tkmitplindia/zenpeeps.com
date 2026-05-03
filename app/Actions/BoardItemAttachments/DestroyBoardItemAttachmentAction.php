<?php

namespace App\Actions\BoardItemAttachments;

use App\Models\BoardItemAttachment;
use Illuminate\Support\Facades\Storage;

final class DestroyBoardItemAttachmentAction
{
    public function execute(BoardItemAttachment $attachment): void
    {
        Storage::disk('public')->delete($attachment->path);

        $attachment->delete();
    }
}
