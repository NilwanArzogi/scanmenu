<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Table;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            $number = str_pad($i, 2, '0', STR_PAD_LEFT);

            Table::create([
                'table_number' => $number,
                'table_code' => 'tbl-' . $number . '-' . Str::random(6),
                'status' => 'active',
            ]);
        }
    }
}
