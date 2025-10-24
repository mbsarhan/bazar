<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PendingAdvertisement extends Model
{
    use HasFactory;


    protected $table = 'pending_advertisements'; // <-- UPDATE THIS LINE

    // Use a guarded property to allow all other fields to be mass-assignable
    protected $guarded = ['id'];

    protected $casts = [
        'pending_media' => 'array', // Automatically cast the JSON to an array
    ];

    /**
     * Get the original advertisement that this update belongs to.
     */
    public function advertisement()
    {
        return $this->belongsTo(Advertisement::class);
    }
}