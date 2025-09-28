<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarAds extends Model
{

    protected $table = 'car_ads';
    protected $fillabe = [
        
        'ads_id',
        'manufacturer',
        'model',
        'model_year',
        'status',
        'gear',
        'fule_type',
        'distance_traveled',

    ];
        // Define columns that should be treated as Carbon instances (dates)
    protected function casts(){
        return [
            
            'model_year' => 'datetime',
        ];

    }
    

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
