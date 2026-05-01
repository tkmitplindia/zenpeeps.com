<?php

namespace Database\Factories;

use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $board = Board::factory()->create();
        $column = BoardColumn::factory()->create(['board_id' => $board->id]);
        $user = User::factory()->create();

        return [
            'board_id' => $board->id,
            'board_column_id' => $column->id,
            'project_id' => $board->project_id,
            'created_by' => $user->id,
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'position' => fake()->numberBetween(0, 100),
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'urgent']),
            'due_date' => fake()->optional()->dateTimeBetween('now', '+3 months'),
            'estimate_minutes' => fake()->optional()->numberBetween(30, 480),
            'elapsed_seconds' => 0,
        ];
    }
}
