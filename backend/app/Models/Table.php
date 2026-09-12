<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Table extends Model
{
    public $timestamps = false;

    protected $table = 'tables';

    protected $fillable = [
        'table_number',
        'table_code',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($table) {
            $table->created_at = $table->created_at ?? now();
        });
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}