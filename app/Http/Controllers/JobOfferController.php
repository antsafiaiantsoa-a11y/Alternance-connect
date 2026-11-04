<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\JobOffer;
use App\Models\JobSource;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class JobOfferController extends Controller
{
    public function index(Request $request): Response
    {
        $request->merge(['currency' => mb_strtoupper(trim((string) $request->input('currency')))]);
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'city' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'size:2', 'exists:countries,code'],
            'region' => ['nullable', 'string', 'max:120'],
            'sector' => ['nullable', 'string', 'max:120'],
            'language' => ['nullable', 'string', 'max:50'],
            'contract' => ['nullable', Rule::in(['apprenticeship', 'professionalization', 'dual_training', 'Apprentissage', 'Professionnalisation'])],
            'salary_from' => ['nullable', 'numeric', 'min:0', 'max:10000000'],
            'salary_to' => ['nullable', 'numeric', 'min:0', 'max:10000000', 'gte:salary_from'],
            'currency' => ['required_with:salary_from,salary_to', 'nullable', Rule::in(['EUR', 'CHF', 'GBP', 'NOK', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'ISK', 'ALL', 'BAM', 'MKD', 'RSD', 'MDL', 'UAH', 'BYN', 'RUB', 'TRY', 'GEL', 'AMD', 'AZN'])],
            'education' => ['nullable', 'string', 'max:120'],
            'source' => ['nullable', 'string', 'max:120'],
            'rome' => ['nullable', 'regex:/^[A-Za-z]\d{4}$/'],
            'published_after' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $offers = JobOffer::query()->available();

        if (filled($filters['country'] ?? null)) {
            $offers->where('country_code', strtoupper($filters['country']));
        }

        if (filled($filters['q'] ?? null)) {
            $needle = '%'.trim($filters['q']).'%';
            $offers->where(function ($query) use ($needle): void {
                $query->where('title', 'like', $needle)
                    ->orWhere('company_name', 'like', $needle)
                    ->orWhere('description', 'like', $needle);
            });
        }

        foreach (['city', 'region'] as $field) {
            if (filled($filters[$field] ?? null)) {
                $offers->where($field, 'like', '%'.trim($filters[$field]).'%');
            }
        }

        if (filled($filters['contract'] ?? null)) {
            $aliases = match ($filters['contract']) {
                'apprenticeship' => ['apprenticeship', 'Apprentissage'],
                'professionalization' => ['professionalization', 'Professionnalisation'],
                'dual_training' => ['dual_training', 'Formation duale', 'Duale Ausbildung'],
                default => [$filters['contract']],
            };
            $offers->where(function ($query) use ($aliases): void {
                foreach ($aliases as $index => $alias) {
                    $method = $index === 0 ? 'whereJsonContains' : 'orWhereJsonContains';
                    $query->{$method}('contract_types', $alias);
                }
            });
        }

        if (filled($filters['sector'] ?? null)) {
            $offers->where('sector', 'like', '%'.trim($filters['sector']).'%');
        }

        if (filled($filters['language'] ?? null)) {
            $offers->whereJsonContains('required_languages', trim($filters['language']));
        }

        if (filled($filters['salary_from'] ?? null) || filled($filters['salary_to'] ?? null)) {
            $offers->where('currency', strtoupper($filters['currency']));
        }

        if (filled($filters['salary_from'] ?? null)) {
            $minimum = $filters['salary_from'];
            $offers->where(function ($query) use ($minimum): void {
                $query->where('salary_max', '>=', $minimum)
                    ->orWhere('salary_min', '>=', $minimum);
            });
        }

        if (filled($filters['salary_to'] ?? null)) {
            $maximum = $filters['salary_to'];
            $offers->where(function ($query) use ($maximum): void {
                $query->where('salary_min', '<=', $maximum)
                    ->orWhere('salary_max', '<=', $maximum);
            });
        }

        if (filled($filters['education'] ?? null)) {
            $offers->where('education_level', 'like', '%'.trim($filters['education']).'%');
        }

        if (filled($filters['source'] ?? null)) {
            $offers->where('source_label', $filters['source']);
        }

        if (filled($filters['rome'] ?? null)) {
            $offers->whereJsonContains('rome_codes', strtoupper($filters['rome']));
        }

        if (filled($filters['published_after'] ?? null)) {
            $offers->whereDate('published_at', '>=', $filters['published_after']);
        }

        $sourceOptions = JobOffer::query()
            ->available()
            ->whereNotNull('source_label')
            ->select('source_label')
            ->distinct()
            ->orderBy('source_label')
            ->pluck('source_label')
            ->map(fn (string $label): array => [
                'value' => $label,
                'label' => $this->sourceDisplayName($label),
            ])
            ->values();

        $offersPage = $offers
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (JobOffer $offer): array => [
                'id' => $offer->id,
                'title' => $offer->title,
                'company' => $offer->company_name,
                'description' => $offer->description,
                'contract_types' => $offer->contract_types ?? [],
                'city' => $offer->city,
                'country_code' => $offer->country_code,
                'sector' => $offer->sector,
                'training_name' => $offer->training_name,
                'salary_min' => $offer->salary_min,
                'salary_max' => $offer->salary_max,
                'currency' => $offer->currency,
                'duration_months' => $offer->duration_months,
                'required_languages' => $offer->required_languages ?? [],
                'postal_code' => $offer->postal_code,
                'region' => $offer->region,
                'rome_codes' => $offer->rome_codes ?? [],
                'education_level' => $offer->education_level,
                'salary' => $offer->salary,
                'published_at' => $offer->published_at?->toIso8601String(),
                'starts_at' => $offer->starts_at?->toDateString(),
                'expires_at' => $offer->expires_at?->toDateString(),
                'original_url' => $offer->original_url,
                'application_url' => $offer->application_url,
                'source' => $this->sourceDisplayName($offer->source_label, $offer->source_provider),
                'source_provider' => $offer->source_provider,
                'source_label' => $offer->source_label,
                'remote_mode' => $offer->remote_mode,
            ]);

        $lastSyncedAt = JobSource::query()
            ->where('slug', 'lba')
            ->value('last_synced_at');
        $hasImportedOffers = JobOffer::query()->available()->exists();
        $countries = Country::query()
            ->where('enabled_for_search', true)
            ->orderBy('name_fr')
            ->get(['code', 'name_fr', 'name_en', 'name_de']);

        return Inertia::render('offers/index', [
            'offers' => $offersPage,
            'hasImportedOffers' => $hasImportedOffers,
            'filters' => [
                'q' => $filters['q'] ?? '',
                'city' => $filters['city'] ?? '',
                'country' => strtoupper($filters['country'] ?? ''),
                'sector' => $filters['sector'] ?? '',
                'language' => $filters['language'] ?? '',
                'salary_from' => $filters['salary_from'] ?? '',
                'salary_to' => $filters['salary_to'] ?? '',
                'currency' => strtoupper($filters['currency'] ?? ''),
                'region' => $filters['region'] ?? '',
                'contract' => $filters['contract'] ?? '',
                'education' => $filters['education'] ?? '',
                'source' => $filters['source'] ?? '',
                'rome' => strtoupper($filters['rome'] ?? ''),
                'published_after' => $filters['published_after'] ?? '',
            ],
            'sourceOptions' => $sourceOptions,
            'countries' => $countries,
            'lastSyncedAt' => $lastSyncedAt ? (string) $lastSyncedAt : null,
        ]);
    }

    private function sourceDisplayName(string $sourceLabel, string $sourceProvider): string
    {
        if ($sourceProvider === 'company') {
            return 'Entreprise via Alternance Connect';
        }

        $normalized = strtolower($sourceLabel);

        if ($normalized === 'offres_emploi_lba') {
            return 'La Bonne Alternance';
        }

        if (str_contains($normalized, 'france travail')) {
            return 'France Travail · via La Bonne Alternance';
        }

        return 'La Bonne Alternance · '.$sourceLabel;
    }
}
