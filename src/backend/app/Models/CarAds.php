<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarAds extends Model
{

    protected $table = 'car_ads';
    protected $fillable = [
        
        'ads_id',
        'manufacturer',
        'model',
        'model_year',
        'status',
        'gear',
        'fule_type',
        'distance_traveled',

    ];
    
    /**
     * Get the parent Advertisement that owns this car-specific listing data.
     */
    public function BelongToAdvertisement()
    {

        return $this->belongsTo(Advertisement::class, 'ads_id');
    }

      public function ImagesForCar()
    {

        return $this->hasMany(CarAdImage::class, 'car_ad_id');
    }


}
