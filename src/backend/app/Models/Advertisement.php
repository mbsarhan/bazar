<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    protected $table = 'advertisements';

    protected $fillable = [
        'owner_id',
        'title',
        'price',
        'description',
        'transaction_type',
        'ad_status', // <-- ADD THIS LINE
        'governorate',
        'geo_location',
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
    public function carDetails()
    {

        return $this->hasOne(CarAds::class, 'ads_id');

    }

    public function realEstateDetails()
    {

        return $this->hasOne(RealestateAds::class, 'ads_id');

    }
    /**
     * Get the pending update for this advertisement, if one exists.
     */
    public function pendingUpdate()
    {
        return $this->hasOne(PendingAdvertisement::class);
    }


    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

public function favoredByUsers()
{
    return $this->belongsToMany(
        User::class,
        'favorites',
        'advertisement_id',
        'user_id'
    )->withTimestamps();
}
}
