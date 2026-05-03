<?php

namespace App\Http\Requests;

use App\Models\Board;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReorderBoardItemsRequest extends FormRequest
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

        $columnExists = Rule::exists('board_columns', 'id')->where('board_id', $board->id);
        $itemExists = Rule::exists('board_items', 'id')->where('board_id', $board->id);

        return [
            'columns' => ['required', 'array', 'min:1'],
            'columns.*.id' => ['required', 'string', $columnExists],
            'columns.*.items' => ['present', 'array'],
            'columns.*.items.*' => ['required', 'string', $itemExists],
        ];
    }
}
