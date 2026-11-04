<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use App\Models\JobSource;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(): Response
    {
        $featuredOffers = JobOffer::query()
            ->available()
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(fn (JobOffer $offer): array => [
                'id' => $offer->id,
                'title' => $offer->title,
                'company' => $offer->company_name,
                'city' => $offer->city,
                'contract_types' => $offer->contract_types ?? [],
                'published_at' => $offer->published_at?->toIso8601String(),
                'application_url' => $offer->application_url,
                'source' => $offer->source_provider === 'company'
                    ? 'Entreprise via Alternance Connect'
                    : $this->sourceDisplayName($offer->source_label),
            ])
            ->all();

        return Inertia::render('welcome', [
            'featuredOffers' => $featuredOffers,
            'lastSyncedAt' => JobSource::query()->where('slug', 'lba')->value('last_synced_at'),
        ]);
    }

    private function sourceDisplayName(string $sourceLabel): string
    {
        $normalized = strtolower($sourceLabel);

        if ($normalized === 'offres_emploi_lba') {
            return 'La Bonne Alternance';
        }

        if (str_contains($normalized, 'france travail')) {
            return 'France Travail · via La Bonne Alternance';
        }

        return 'Offre partenaire · via La Bonne Alternance';
    }
}
