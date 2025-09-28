<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RealestateImage extends Model
{
    protected $table = 'realestate_images';

    protected $fillable = [

        'realestate_ad_id',
        'image_url',

    ];

    protected function HasRealestate(){
        
        return $this->belongsTo(RealestateAds::class, 'realestate_ad_id');
    }
}
