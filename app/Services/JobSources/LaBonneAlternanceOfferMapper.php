<?php

namespace App\Services\JobSources;

use Carbon\CarbonImmutable;
use Throwable;

class LaBonneAlternanceOfferMapper
{
    /** @return array<string, mixed>|null */
    public function map(array $job, CarbonImmutable $syncedAt): ?array
    {
        $identifier = is_array($job['identifier'] ?? null) ? $job['identifier'] : [];
        $partnerLabel = trim((string) ($identifier['partner_label'] ?? ''));
        $externalId = trim((string) ($identifier['partner_job_id'] ?? ''));
        $offer = is_array($job['offer'] ?? null) ? $job['offer'] : [];

        // Recruiter suggestions are not job advertisements and must never be displayed as one.
        if ($partnerLabel === ''
            || in_array(strtolower($partnerLabel), ['recruteurs_lba', 'recruiters_lba'], true)
            || $externalId === ''
            || trim((string) ($offer['title'] ?? '')) === '') {
            return null;
        }

        $workplace = is_array($job['workplace'] ?? null) ? $job['workplace'] : [];
        $location = is_array($job['location'] ?? null) ? $job['location'] : [];
        $address = is_array($location['address'] ?? null) ? $location['address'] : [];
        $contract = is_array($job['contract'] ?? null) ? $job['contract'] : [];
        $publication = is_array($job['publication'] ?? null) ? $job['publication'] : [];
        $apply = is_array($job['apply'] ?? null) ? $job['apply'] : [];

        $expiresAt = $this->dateValue($publication['expiration'] ?? null);
        $offerStatus = strtolower((string) ($offer['status'] ?? 'active'));
        $availability = match (true) {
            in_array($offerStatus, ['cancelled', 'filled'], true) => 'unavailable',
            $expiresAt !== null && $expiresAt->isBefore(today()) => 'expired',
            default => 'active',
        };

        $contractTypes = $contract['type'] ?? [];
        if (is_string($contractTypes)) {
            $contractTypes = [$contractTypes];
        }
        if (! is_array($contractTypes)) {
            $contractTypes = [];
        }

        $romeCodes = $offer['rome_codes'] ?? [];
        if (! is_array($romeCodes)) {
            $romeCodes = [];
        }

        $skills = [
            'required' => is_array($offer['desired_skills'] ?? null) ? $offer['desired_skills'] : [],
            'to_be_acquired' => is_array($offer['to_be_acquired_skills'] ?? null) ? $offer['to_be_acquired_skills'] : [],
        ];

        return [
            'source_provider' => 'lba',
            'source_label' => $partnerLabel,
            'source_offer_id' => $externalId,
            'source_partner_id' => $this->nullableString($identifier['partner_id'] ?? null),
            'company_name' => $this->firstString([
                $workplace['name'] ?? null,
                $workplace['brand'] ?? null,
                $workplace['legal_name'] ?? null,
            ]),
            'title' => trim((string) $offer['title']),
            'description' => $this->nullableString($offer['description'] ?? null),
            'contract_types' => json_encode(array_values(array_filter(array_map(
                static fn ($value): ?string => is_string($value) && trim($value) !== '' ? trim($value) : null,
                $contractTypes,
            ))), JSON_THROW_ON_ERROR),
            'city' => $this->firstString([
                $address['city'] ?? null,
                $address['city_name'] ?? null,
                $address['commune'] ?? null,
                $location['city'] ?? null,
            ]),
            'country_code' => 'FR',
            'postal_code' => $this->firstString([
                $address['postal_code'] ?? null,
                $address['postcode'] ?? null,
                $address['zip'] ?? null,
                $location['postal_code'] ?? null,
            ]),
            'region' => $this->firstString([
                $address['region'] ?? null,
                $address['region_name'] ?? null,
                $location['region'] ?? null,
            ]),
            'rome_codes' => json_encode(array_values($romeCodes), JSON_THROW_ON_ERROR),
            'skills' => json_encode($skills, JSON_THROW_ON_ERROR),
            'education_level' => $this->displayValue($offer['target_diploma'] ?? null),
            'salary' => $this->nullableString($offer['salary'] ?? null),
            'published_at' => $this->dateValue($publication['creation'] ?? null)?->toDateTimeString(),
            'starts_at' => $this->dateValue($contract['start'] ?? null)?->toDateString(),
            'expires_at' => $expiresAt?->toDateString(),
            // LBA documents apply.url as the source-provided destination for applying.
            'original_url' => $this->safeUrl($job['original_url'] ?? $offer['original_url'] ?? null),
            'application_url' => $this->safeUrl($apply['url'] ?? null),
            'remote_mode' => $this->nullableString($contract['remote'] ?? null),
            'availability_status' => $availability,
            'last_synced_at' => $syncedAt->toDateTimeString(),
            'created_at' => $syncedAt->toDateTimeString(),
            'updated_at' => $syncedAt->toDateTimeString(),
        ];
    }

    private function firstString(array $values): ?string
    {
        foreach ($values as $value) {
            $string = $this->nullableString($value);
            if ($string !== null) {
                return $string;
            }
        }

        return null;
    }

    private function nullableString(mixed $value): ?string
    {
        return is_string($value) && trim($value) !== '' ? trim($value) : null;
    }

    private function safeUrl(mixed $value): ?string
    {
        if (! is_string($value) || filter_var($value, FILTER_VALIDATE_URL) === false) {
            return null;
        }

        return in_array(strtolower((string) parse_url($value, PHP_URL_SCHEME)), ['https', 'http'], true)
            ? $value
            : null;
    }

    private function displayValue(mixed $value): ?string
    {
        if (is_string($value)) {
            return $this->nullableString($value);
        }

        if (! is_array($value)) {
            return null;
        }

        foreach (['label', 'name', 'title', 'level', 'european'] as $key) {
            if (is_string($value[$key] ?? null) && trim($value[$key]) !== '') {
                return trim($value[$key]);
            }
        }

        return null;
    }

    private function dateValue(mixed $value): ?CarbonImmutable
    {
        if (! is_string($value) || trim($value) === '') {
            return null;
        }

        try {
            return CarbonImmutable::parse($value);
        } catch (Throwable) {
            return null;
        }
    }
}
