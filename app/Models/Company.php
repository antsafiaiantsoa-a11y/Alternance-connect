<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'owner_id',
        'name',
        'registration_number',
        'country_code',
        'city',
        'website',
        'contact_email',
        'verification_status',
        'verification_note',
        'verified_at',
        'privacy_notice_accepted_at',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
            'privacy_notice_accepted_at' => 'datetime',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function offers(): HasMany
    {
        return $this->hasMany(JobOffer::class);
    }
}
