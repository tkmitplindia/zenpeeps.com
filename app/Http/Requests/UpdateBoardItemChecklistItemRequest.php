<?php

namespace App\Http\Requests;

use App\Models\BoardItemChecklistItem;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBoardItemChecklistItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        $checklistItem = $this->route('checklistItem');

        return $checklistItem instanceof BoardItemChecklistItem
            && request()->user()->can('update', $checklistItem->item);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'completed' => ['sometimes', 'boolean'],
        ];
    }
}
