<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RealestateAds extends Model
{
    protected $table = 'realestate_ads';
    
    protected $fillable = [
        'ads_id',
        'realestate_type',
        'detailed_address',
        'area',
        'bedroom_num',
        'bathroom_num ', 
        'floor_num ',
        'building_status ',
        'cladding_condition ',
        'negotiable_check',
        'video_url',
        'hls_url',

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
