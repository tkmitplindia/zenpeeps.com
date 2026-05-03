<?php

namespace Database\Factories;

use App\Enums\BoardItemPriority;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\BoardItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BoardItem>
 */
class BoardItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $board = Board::factory()->create();
        $column = BoardColumn::factory()->create(['board_id' => $board->id]);

        return [
            'board_id' => $board->id,
            'board_column_id' => $column->id,
            'created_by' => UserFactory::new(),
            'number' => $board->items()->count() + 1,
            'position' => $column->items()->count() + 1,
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'priority' => $this->faker->randomElement(BoardItemPriority::cases())->value,
            'estimated_minutes' => $this->faker->numberBetween(30, 480),
            'tracked_seconds' => 0,
            'time_tracker_started_at' => null,
            'due_date' => $this->faker->optional()->dateTimeBetween('now', '+1 month'),
            'started_at' => null,
            'completed_at' => null,
        ];
    }

    public function forBoard(Board $board): static
    {
        return $this->state(function () use ($board) {
            $column = $board->columns()->first() ?? BoardColumn::factory()->create(['board_id' => $board->id]);

            return [
                'board_id' => $board->id,
                'board_column_id' => $column->id,
                'number' => $board->items()->count() + 1,
                'position' => $column->items()->count() + 1,
            ];
        });
    }

    public function inColumn(BoardColumn $column): static
    {
        return $this->state(fn () => [
            'board_id' => $column->board_id,
            'board_column_id' => $column->id,
            'number' => $column->board->items()->count() + 1,
            'position' => $column->items()->count() + 1,
        ]);
    }

    public function priority(BoardItemPriority $priority): static
    {
        return $this->state(['priority' => $priority->value]);
    }

    public function assignedTo(User|array $users): static
    {
        $users = is_array($users) ? $users : [$users];

        return $this->afterCreating(function (BoardItem $item) use ($users) {
            $item->assignees()->attach(collect($users)->pluck('id')->all());
        });
    }
}
