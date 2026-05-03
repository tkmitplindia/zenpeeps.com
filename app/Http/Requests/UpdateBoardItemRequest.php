<?php

namespace App\Http\Requests;

use App\Enums\BoardItemPriority;
use App\Models\BoardItem;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBoardItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        $item = $this->route('item');

        return $item instanceof BoardItem && request()->user()->can('update', $item);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var BoardItem $item */
        $item = $this->route('item');

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'board_column_id' => [
                'sometimes',
                'required',
                'string',
                Rule::exists('board_columns', 'id')->where('board_id', $item->board_id),
            ],
            'position' => ['sometimes', 'integer', 'min:1'],
            'priority' => ['sometimes', 'required', 'string', Rule::enum(BoardItemPriority::class)],
            'estimated_minutes' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'assignees' => ['sometimes', 'array'],
            'assignees.*' => ['required', 'exists:users,id'],
            'tags' => ['sometimes', 'array'],
            'tags.*' => ['required', 'string', 'max:64'],
        ];
    }
}
