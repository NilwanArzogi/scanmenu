<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tableId = $this->route('table')->id;

        return [
            'table_number' => ['required', 'string', 'max:50', Rule::unique('tables', 'table_number')->ignore($tableId)],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }
}