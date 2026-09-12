<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $todayOrders = Order::whereDate('created_at', $today);

        $totalRevenue = (clone $todayOrders)
            ->where('status', 'completed')
            ->sum('total');

        $totalOrders = (clone $todayOrders)->count();

        $pendingCount = (clone $todayOrders)->where('status', 'pending')->count();
        $processingCount = (clone $todayOrders)->where('status', 'processing')->count();
        $completedCount = (clone $todayOrders)->where('status', 'completed')->count();

        $bestSellers = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->whereDate('orders.created_at', $today)
            ->select('products.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => [
                'total_revenue_today' => (float) $totalRevenue,
                'total_orders_today' => $totalOrders,
                'pending_orders' => $pendingCount,
                'processing_orders' => $processingCount,
                'completed_orders' => $completedCount,
                'best_sellers' => $bestSellers,
            ],
        ]);
    }
}