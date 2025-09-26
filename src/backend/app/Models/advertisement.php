<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    protected $fillable = [
        'owner_id',
        'price',
        'description',
        'transaction_type',
        'governorate',
        'city',
        'views_count',
        'currency_type',
    ];

    /**
     * Get the user that owns the advertisement.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
