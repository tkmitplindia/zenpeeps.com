<?php

use App\Actions\Attachment\DeleteAttachmentAction;
use App\Actions\Attachment\UploadAttachmentAction;
use App\Actions\Project\StoreProjectAction;
use App\Models\Attachment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('spaces');
});

test('deletes the attachment row and removes the file from disk', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    $project->load('limits');

    $file = UploadedFile::fake()->create('photo.jpg', 50, 'image/jpeg');
    $attachment = (new UploadAttachmentAction)->handle($project, $owner, $project, $file, 'spaces');

    $path = parse_url($attachment->url, PHP_URL_PATH);

    (new DeleteAttachmentAction)->handle($attachment);

    expect(Attachment::withTrashed()->find($attachment->id))->not->toBeNull(); // soft deleted
    expect(Attachment::find($attachment->id))->toBeNull();

    Storage::disk('spaces')->assertMissing(ltrim($path, '/'));
});
