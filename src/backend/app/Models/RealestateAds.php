<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RealestateAds extends Model
{
    protected $table = 'realestate_ads';
    
    protected $fillabe = [
        'ads_id',
        'realestate-type',
        'detailed-address',
        'realestate-size',
        'bedroom-num',
        'bathroom-num ', 
        'floor-num ',
        'building-status ',
        'cladding-condition ',
        'negotiable-check',
        'video-url',

    ];

    public function advertisement()
    {

        return $this->belongsTo(Advertisement::class, 'ads_id');
    }

        public function ImageForRealestate()
    {

        return $this->hasMany(RealestateImage::class, 'realestate_ad_id');
    }
}
