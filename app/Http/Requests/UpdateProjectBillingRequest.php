<?php

namespace App\Http\Requests;

use App\Enums\Plan;
use App\Models\Project;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateProjectBillingRequest extends FormRequest
{
    public function authorize(): bool
    {
        $project = $this->route('project');

        return $project instanceof Project
            && ($this->user()?->can('update', $project) ?? false);
    }

    /**
     * @return array<string, array<int, ValidationRule|string|Enum>>
     */
    public function rules(): array
    {
        return [
            'plan' => ['required', new Enum(Plan::class)],
        ];
    }
}
