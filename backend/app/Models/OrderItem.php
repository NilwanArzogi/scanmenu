<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price_at_order',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'price_at_order' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}