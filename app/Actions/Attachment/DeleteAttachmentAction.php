<?php

namespace App\Actions\Attachment;

use App\Models\Attachment;
use Illuminate\Support\Facades\Storage;

class DeleteAttachmentAction
{
    public function handle(Attachment $attachment): void
    {
        Storage::disk($attachment->disk)->delete(
            parse_url($attachment->url, PHP_URL_PATH) ?? $attachment->url
        );

        $attachment->delete();
    }
}
