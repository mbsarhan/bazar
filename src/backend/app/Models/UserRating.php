<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRating extends Model
{
    protected $table = 'user_ratings';
    protected $fillable = [
        'rater_id',
        'rating_id',
        'rating', 
    ];

    public function rater()
    {
        return $this->belongsTo(User::class, 'rater_id');
    }

      public function rated()
    {
        return $this->belongsTo(User::class, 'rated_id');
    }

}
