<?php

namespace Database\Factories;

use App\Enums\BoardTemplate;
use App\Models\Board;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Board>
 */
class BoardFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->optional()->sentence(),
            'template' => BoardTemplate::Custom,
            'position' => fake()->numberBetween(0, 100),
        ];
    }
}
