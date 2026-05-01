<?php

namespace App\Actions\Board;

use App\Models\Board;
use Illuminate\Support\Facades\DB;

class UpdateBoardAction
{
    /**
     * @param  array{name?: string, description?: ?string, columns?: string[]}  $data
     */
    public function handle(Board $board, array $data): Board
    {
        return DB::transaction(function () use ($board, $data): Board {
            $board->update([
                'name' => $data['name'] ?? $board->name,
                'description' => array_key_exists('description', $data) ? $data['description'] : $board->description,
            ]);

            if (isset($data['columns'])) {
                $board->columns()->delete();

                foreach ($data['columns'] as $index => $columnName) {
                    $board->columns()->create([
                        'name' => $columnName,
                        'position' => $index,
                    ]);
                }
            }

            return $board->load('columns');
        });
    }
}
