<?php

namespace App\Http\Requests;

use App\Enums\BoardStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBoardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('board'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('boards', 'name')->ignore($this->route('board'))],
            'description' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::enum(BoardStatus::class)],
            'members' => ['nullable', 'array'],
            'members.*' => ['required', 'exists:users,id'],
        ];
    }
}
