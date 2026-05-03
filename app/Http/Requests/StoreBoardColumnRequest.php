<?php

namespace App\Http\Requests;

use App\Models\Board;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBoardColumnRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = request()->user();
        $board = $this->route('board');

        return $board instanceof Board && $user->can('update', $board);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Board $board */
        $board = $this->route('board');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('board_columns', 'name')->where('board_id', $board->id),
            ],
        ];
    }
}
