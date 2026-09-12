<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\Table;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();

        $table = Table::where('table_code', $validated['table_code'])->first();

        if ($table->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Meja ini sedang tidak aktif.',
                'errors' => [],
            ], 403);
        }

        $productIds = collect($validated['items'])->pluck('product_id');
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        foreach ($validated['items'] as $item) {
            $product = $products->get($item['product_id']);

            if (! $product || ! $product->is_available) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produk "' . ($product->name ?? 'tidak dikenal') . '" sedang tidak tersedia.',
                    'errors' => [],
                ], 422);
            }
        }

        $order = DB::transaction(function () use ($validated, $table, $products) {
            $subtotal = 0;

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);
                $subtotal += $product->price * $item['quantity'];
            }

            $order = Order::create([
                'table_id' => $table->id,
                'order_number' => 'TEMP', 
                'customer_name' => $validated['customer_name'] ?? null,
                'note' => $validated['note'] ?? null,
                'subtotal' => $subtotal,
                'total' => $subtotal, 
                'status' => 'pending',
            ]);

            $order->order_number = 'SM-' . str_pad($order->id, 6, '0', STR_PAD_LEFT);
            $order->save();

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price_at_order' => $product->price,
                    'note' => $item['note'] ?? null,
                ]);
            }

            return $order;
        });

        $order->load('table', 'items.product');

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat.',
            'data' => new OrderResource($order),
        ], 201);
    }

    public function show(string $orderNumber)
    {
        $order = Order::with('table', 'items.product')
            ->where('order_number', $orderNumber)
            ->first();

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan.',
                'errors' => [],
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => new OrderResource($order),
        ]);
    }
}