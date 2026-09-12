<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\Admin\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('table', 'items.product');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $orders = $query->orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => OrderResource::collection($orders),
        ]);
    }

    public function show(Order $order)
    {
        $order->load('table', 'items.product');

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => new OrderResource($order),
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order)
    {
        $order->update(['status' => $request->validated('status')]);
        $order->load('table', 'items.product');

        return response()->json([
            'success' => true,
            'message' => 'Status pesanan berhasil diperbarui.',
            'data' => new OrderResource($order),
        ]);
    }
}