<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Import for type hinting

class UserReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'reporter_id',
        'reported_id',
        'reason',
        'description',
        // --- ADD THESE NEW FILLABLE FIELDS ---
        'status',
        'review_note',
        'reviewed_by',
        'reviewed_at',
    ];

    // --- ADD THIS CAST FOR DATES ---
    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    /**
     * Get the user who submitted the report.
     */
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /**
     * Get the user who was reported.
     */
    public function reported()
    {
        return $this->belongsTo(User::class, 'reported_id');
    }


    // --- ADD THIS NEW RELATIONSHIP ---
    /**
     * Get the admin who reviewed the report.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}