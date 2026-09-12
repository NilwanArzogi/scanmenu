<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'order_number' => $this->order_number,
            'table_number' => $this->table->table_number,
            'customer_name' => $this->customer_name,
            'note' => $this->note,
            'subtotal' => (float) $this->subtotal,
            'total' => (float) $this->total,
            'status' => $this->status,
            'items' => $this->items->map(function ($item) {
                return [
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'price_at_order' => (float) $item->price_at_order,
                    'line_total' => (float) $item->price_at_order * $item->quantity,
                    'note' => $item->note,
                ];
            }),
            'created_at' => $this->created_at,
        ];
    }
}