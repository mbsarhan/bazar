<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Notifications\VerifyEmailWithOtp;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements MustVerifyEmail 
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'fname',
        'lname',
        'name_last_updated_at', // <-- 1. ADD TO FILLABLE
        'email',
        'phone',
        'password',
        'admin',
        'review',
        'total_view',
        'verification_code',         
        'verification_code_expires_at',
        'pending_email', 
        'pending_email_verification_code', 
        'pending_email_expires_at', 
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'verification_code_expires_at' => 'datetime',
            'pending_email_expires_at' => 'datetime',
            'password' => 'hashed',
            'name_last_updated_at' => 'datetime', // <-- 2. ADD TO CASTS
        ];
    }

     public function sendEmailVerificationNotification()
    {
        $code = random_int(100000, 999999);
        $expiresAt = now()->addMinutes(10); 

        $this->forceFill([
            'verification_code' => $code,
            'verification_code_expires_at' => $expiresAt,
        ])->save();

        $this->notify(new VerifyEmailWithOtp($code));
    }


       public function advertisements()
    {
        
        return $this->hasMany(Advertisement::class, 'owner_id');
    }
        public function ratingsGiven() 
    {
        return $this->hasMany(UserRating::class, 'rater_id');
    }

      public function ratingsReceived()
    {
        return $this->hasMany(UserRating::class, 'rated_id');
    }

  
}
