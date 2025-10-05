<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    protected $table = 'advertisements';

    protected $fillable = [
        'owner_id',
        'price',
        'description',
        'transaction_type',
        'ad_status', // <-- ADD THIS LINE
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
    public function carDetails(){

        return $this->hasOne(CarAds::class,'ads_id');

    }

       public function realEstateDetails(){

        return $this->hasOne(RealestateAds::class,'ads_id');

    }
}
