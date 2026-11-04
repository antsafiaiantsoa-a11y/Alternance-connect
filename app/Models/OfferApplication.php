<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfferApplication extends Model
{
    protected $table = 'job_offer_applications';

    protected $fillable = [
        'job_offer_id',
        'applicant_id',
        'cover_letter',
        'status',
        'status_updated_at',
        'privacy_notice_accepted_at',
    ];

    protected function casts(): array
    {
        return [
            'status_updated_at' => 'datetime',
            'privacy_notice_accepted_at' => 'datetime',
        ];
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(JobOffer::class, 'job_offer_id');
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }
}
