<?php

namespace Database\Factories;

use App\Enums\UsageType;
use App\Models\Project;
use App\Models\ProjectUsage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectUsage>
 */
class ProjectUsageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'type' => fake()->randomElement(UsageType::cases()),
            'amount' => fake()->numberBetween(1, 10_000),
            'description' => null,
        ];
    }
}
