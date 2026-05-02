<?php

namespace Database\Factories;

use App\Models\Board;
use App\Models\BoardColumn;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BoardColumn>
 */
class BoardColumnFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $board = Board::factory()->create();

        return [
            'name' => $this->faker->word,
            'order' => $board->columns()->count() + 1,
            'board_id' => $board->id,
        ];
    }
}
