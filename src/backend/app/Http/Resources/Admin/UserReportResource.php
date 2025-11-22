<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserReportResource extends JsonResource
{
    /**
     * A map of reason keys to human-readable labels.
     *
     * @var array
     */
    private $reasonLabels = [
        'spam' => 'محتوى غير مرغوب فيه أو إعلانات متكررة',
        'fraud' => 'احتيال أو نصب',
        'fake' => 'حساب مزيف أو معلومات كاذبة',
        'harassment' => 'مضايقة أو تحرش',
        'inappropriate' => 'محتوى غير لائق',
        'other' => 'أخرى',
    ];

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // $this refers to the UserReport model instance
        return [
            'id' => $this->id,
            'type' => 'user', // We only have user reports for now
            
            // Reported User Info (from the loaded relationship)
            'reportedUserId' => $this->reported->id,
            'reportedUserName' => "{$this->reported->fname} {$this->reported->lname}",

            // Reporter Info (from the loaded relationship)
            'reporterUserId' => $this->reporter->id,
            'reporterUserName' => "{$this->reporter->fname} {$this->reporter->lname}",
            
            // Report Details
            'reason' => $this->reason,
            'reasonLabel' => $this->reasonLabels[$this->reason] ?? 'غير محدد',
            'description' => $this->description,
            'status' => $this->status,
            'createdAt' => $this->created_at->toIso8601String(),
            
            // Review Details (these will be null if not yet reviewed)
            'reviewedAt' => $this->reviewed_at?->toIso8601String(),
            'reviewNote' => $this->review_note,
        ];
    }
}