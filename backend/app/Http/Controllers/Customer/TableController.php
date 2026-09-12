<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\TableResource;
use App\Models\Table;

class TableController extends Controller
{
    public function show(string $code)
    {
        $table = Table::where('table_code', $code)->first();

        if (! $table) {
            return response()->json([
                'success' => false,
                'message' => 'Meja tidak ditemukan.',
                'errors' => [],
            ], 404);
        }

        if ($table->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Meja ini sedang tidak aktif.',
                'errors' => [],
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => new TableResource($table),
        ]);
    }
}