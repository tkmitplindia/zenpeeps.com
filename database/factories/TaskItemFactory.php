<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\TaskItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TaskItem>
 */
class TaskItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'task_id' => Task::factory(),
            'text' => fake()->sentence(4),
            'done' => false,
            'position' => fake()->numberBetween(0, 10),
        ];
    }

    public function done(): static
    {
        return $this->state(['done' => true]);
    }
}
