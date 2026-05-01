<?php

use App\Actions\Attachment\UploadAttachmentAction;
use App\Actions\Project\StoreProjectAction;
use App\Models\Attachment;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('spaces');
});

test('uploads a file and persists an attachment row', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    $project->load('limits');

    $file = UploadedFile::fake()->create('report.pdf', 100, 'application/pdf');

    $attachment = (new UploadAttachmentAction)->handle($project, $owner, $project, $file, 'spaces');

    expect($attachment)->toBeInstanceOf(Attachment::class)
        ->and($attachment->filename)->toBe('report.pdf')
        ->and($attachment->mime_type)->toBe('application/pdf')
        ->and($attachment->project_id)->toBe($project->id)
        ->and($attachment->uploaded_by)->toBe($owner->id)
        ->and($attachment->disk)->toBe('spaces');
});

test('rejects disallowed mime types', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    $project->load('limits');

    $file = UploadedFile::fake()->create('script.exe', 100, 'application/x-msdownload');

    expect(fn () => (new UploadAttachmentAction)->handle($project, $owner, $project, $file, 'spaces'))
        ->toThrow(ValidationException::class);
});

test('rejects files exceeding 50 MB', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    $project->load('limits');

    $file = UploadedFile::fake()->create('big.pdf', 51 * 1024, 'application/pdf');

    expect(fn () => (new UploadAttachmentAction)->handle($project, $owner, $project, $file, 'spaces'))
        ->toThrow(ValidationException::class);
});

test('rejects upload when storage quota would be exceeded', function () {
    $owner = User::factory()->create();
    $project = (new StoreProjectAction)->handle($owner, ['name' => 'Acme']);
    $project->load('limits');

    Attachment::factory()->create([
        'project_id' => $project->id,
        'uploaded_by' => $owner->id,
        'attachable_type' => Project::class,
        'attachable_id' => $project->id,
        'size_bytes' => $project->storageQuotaBytes(),
        'disk' => 'spaces',
    ]);

    $file = UploadedFile::fake()->create('extra.pdf', 1, 'application/pdf');

    expect(fn () => (new UploadAttachmentAction)->handle($project, $owner, $project, $file, 'spaces'))
        ->toThrow(ValidationException::class);
});
