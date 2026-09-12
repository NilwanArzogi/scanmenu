<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Product;
use App\Models\Table;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $table1 = Table::where('table_number', '01')->first();
        $table2 = Table::where('table_number', '02')->first();

        $this->createOrder($table1, 'SM-000001', 'pending', [
            ['name' => 'Kopi Susu', 'qty' => 2],
            ['name' => 'Nasi Goreng', 'qty' => 1],
        ]);

        $this->createOrder($table2, 'SM-000002', 'completed', [
            ['name' => 'Es Teh Manis', 'qty' => 3],
            ['name' => 'Ayam Geprek', 'qty' => 2],
        ]);

        $this->createOrder($table1, 'SM-000003', 'processing', [
            ['name' => 'Kentang Goreng', 'qty' => 1],
        ]);
    }

    private function createOrder(Table $table, string $orderNumber, string $status, array $items): void
    {
        $subtotal = 0;
        $itemsData = [];

        foreach ($items as $item) {
            $product = Product::where('name', $item['name'])->first();
            $lineTotal = $product->price * $item['qty'];
            $subtotal += $lineTotal;

            $itemsData[] = [
                'product_id' => $product->id,
                'quantity' => $item['qty'],
                'price_at_order' => $product->price,
            ];
        }

        $order = Order::create([
            'table_id' => $table->id,
            'order_number' => $orderNumber,
            'subtotal' => $subtotal,
            'total' => $subtotal,
            'status' => $status,
        ]);

        foreach ($itemsData as $data) {
            $order->items()->create($data);
        }
    }
}
