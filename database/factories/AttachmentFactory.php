<?php

namespace Database\Factories;

use App\Models\Attachment;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attachment>
 */
class AttachmentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'uploaded_by' => User::factory(),
            'filename' => fake()->word().'.'.fake()->fileExtension(),
            'url' => fake()->url(),
            'disk' => 'local',
            'mime_type' => fake()->mimeType(),
            'size_bytes' => fake()->numberBetween(1024, 10 * 1024 * 1024),
        ];
    }
}
