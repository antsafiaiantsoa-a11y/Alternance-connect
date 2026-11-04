<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobOffer extends Model
{
    protected $fillable = [
        'source_provider',
        'source_label',
        'source_offer_id',
        'source_partner_id',
        'company_name',
        'title',
        'description',
        'contract_types',
        'city',
        'country_code',
        'address_line',
        'postal_code',
        'region',
        'sector',
        'training_name',
        'rome_codes',
        'skills',
        'education_level',
        'salary',
        'salary_min',
        'salary_max',
        'currency',
        'duration_months',
        'required_languages',
        'attribution_text',
        'reuse_license',
        'dedupe_hash',
        'company_id',
        'created_by',
        'moderation_status',
        'moderation_note',
        'published_at',
        'starts_at',
        'expires_at',
        'original_url',
        'application_url',
        'remote_mode',
        'availability_status',
        'last_synced_at',
    ];

    protected function casts(): array
    {
        return [
            'contract_types' => 'array',
            'rome_codes' => 'array',
            'skills' => 'array',
            'required_languages' => 'array',
            'published_at' => 'datetime',
            'starts_at' => 'date',
            'expires_at' => 'date',
            'last_synced_at' => 'datetime',
        ];
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query
            ->where('moderation_status', 'approved')
            ->where('availability_status', 'active')
            ->where(function (Builder $query): void {
                $query->whereNull('expires_at')
                    ->orWhereDate('expires_at', '>=', today());
            });
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(OfferApplication::class, 'job_offer_id');
    }
}
