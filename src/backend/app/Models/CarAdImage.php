<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarAdImage extends Model
{
    protected $table = 'car_ad_images';
    protected $fillable = [

        'car_ad_id',
        'image_url',
    ];

    public function CarAd()
    {

        return $this->belongsTo(CarAds::class, 'car_ad_id');
    }

}
