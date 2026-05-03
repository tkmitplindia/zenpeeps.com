<?php

namespace App\Http\Requests;

use App\Models\Board;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReorderBoardColumnsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $board = $this->route('board');

        return $board instanceof Board && request()->user()->can('update', $board);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Board $board */
        $board = $this->route('board');

        return [
            'columns' => ['required', 'array', 'min:1'],
            'columns.*' => [
                'required',
                'string',
                Rule::exists('board_columns', 'id')->where('board_id', $board->id),
            ],
        ];
    }
}
