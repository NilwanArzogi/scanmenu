<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTableRequest;
use App\Http\Requests\Admin\UpdateTableRequest;
use App\Http\Resources\TableResource;
use App\Models\Table;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TableController extends Controller
{
    public function index()
    {
        $tables = Table::orderBy('table_number')->get();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => TableResource::collection($tables),
        ]);
    }

    public function store(StoreTableRequest $request)
    {
        $validated = $request->validated();

        $table = Table::create([
            'table_number' => $validated['table_number'],
            'table_code' => $this->generateUniqueCode($validated['table_number']),
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Meja berhasil dibuat.',
            'data' => new TableResource($table),
        ], 201);
    }

    public function update(UpdateTableRequest $request, Table $table)
    {
        $table->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Meja berhasil diperbarui.',
            'data' => new TableResource($table),
        ]);
    }

    public function destroy(Table $table)
    {
        if ($table->orders()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Meja tidak bisa dihapus karena masih memiliki riwayat order.',
                'errors' => [],
            ], 422);
        }

        $table->delete();

        return response()->json([
            'success' => true,
            'message' => 'Meja berhasil dihapus.',
            'data' => [],
        ]);
    }

    public function qrCode(Table $table)
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
        $menuUrl = $frontendUrl . '/menu/' . $table->table_code;

        $svg = QrCode::format('svg')->size(300)->generate($menuUrl);

        return response($svg)->header('Content-Type', 'image/svg+xml');
    }

    private function generateUniqueCode(string $tableNumber): string
    {
        do {
            $code = 'tbl-' . Str::slug($tableNumber) . '-' . Str::random(6);
        } while (Table::where('table_code', $code)->exists());

        return $code;
    }
}