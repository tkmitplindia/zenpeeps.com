<?php

namespace App\Http\Requests;

use App\Enums\BoardItemPriority;
use App\Models\Board;
use App\Models\BoardItem;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBoardItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        $board = $this->route('board');

        return $board instanceof Board && request()->user()->can('create', [BoardItem::class, $board]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Board $board */
        $board = $this->route('board');

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'board_column_id' => ['required', 'string', Rule::exists('board_columns', 'id')->where('board_id', $board->id)],
            'priority' => ['nullable', 'string', Rule::enum(BoardItemPriority::class)],
            'estimated_minutes' => ['nullable', 'integer', 'min:0'],
            'due_date' => ['nullable', 'date'],
            'assignees' => ['nullable', 'array'],
            'assignees.*' => ['required', 'exists:users,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['required', 'string', 'max:64'],
        ];
    }
}
