<?php

namespace App\Http\Requests;

use App\Enums\BoardStatus;
use App\Models\Board;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBoardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = request()->user();

        return $user->can('create', Board::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:boards,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::enum(BoardStatus::class)],
        ];
    }
}
