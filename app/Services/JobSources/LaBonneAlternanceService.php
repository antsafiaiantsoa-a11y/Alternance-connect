<?php

namespace App\Services\JobSources;

use Generator;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class LaBonneAlternanceService
{
    /** @return Generator<int, array<string, mixed>> */
    public function publishedOffers(): Generator
    {
        $apiKey = trim((string) config('job_sources.lba.api_key'));

        if ($apiKey === '') {
            throw new RuntimeException('La clé API La Bonne Alternance n’est pas configurée.');
        }

        if (! config('job_sources.lba.non_profit_use_confirmed')) {
            throw new RuntimeException('Confirmez dans .env que l’usage de La Bonne Alternance est non lucratif avant toute synchronisation.');
        }

        $baseUrl = rtrim((string) config('job_sources.lba.base_url'), '/');
        $manifest = Http::withToken($apiKey)
            ->acceptJson()
            ->timeout(30)
            ->get($baseUrl.'/job/v1/export');

        if ($manifest->failed()) {
            throw new RuntimeException($this->apiError('export', $manifest->status()));
        }

        $payload = $manifest->json();

        // A direct jobs payload is also accepted for test fixtures and future API versions.
        if (is_array($payload) && is_array($payload['jobs'] ?? null)) {
            yield from $this->jobRows($payload['jobs']);

            return;
        }

        $downloadUrl = is_array($payload) ? ($payload['url'] ?? null) : null;

        if (! is_string($downloadUrl) || ! $this->isHttpUrl($downloadUrl)) {
            throw new RuntimeException('La réponse d’export de La Bonne Alternance ne contient pas de lien de téléchargement valide.');
        }

        $export = Http::acceptJson()->timeout(120)->get($downloadUrl);

        if ($export->failed()) {
            throw new RuntimeException($this->apiError('téléchargement de l’export', $export->status()));
        }

        $exportPayload = $export->json();

        if (! is_array($exportPayload) || ! is_array($exportPayload['jobs'] ?? null)) {
            throw new RuntimeException('Le fichier d’export de La Bonne Alternance ne contient pas de liste d’offres exploitable.');
        }

        yield from $this->jobRows($exportPayload['jobs']);
    }

    /** @return Generator<int, array<string, mixed>> */
    private function jobRows(array $jobs): Generator
    {
        foreach ($jobs as $job) {
            if (is_array($job)) {
                yield $job;
            }
        }
    }

    private function isHttpUrl(string $url): bool
    {
        return filter_var($url, FILTER_VALIDATE_URL) !== false
            && in_array(strtolower((string) parse_url($url, PHP_URL_SCHEME)), ['https', 'http'], true);
    }

    private function apiError(string $operation, int $status): string
    {
        if ($status === 401) {
            return 'La clé API La Bonne Alternance est absente, invalide ou expirée (HTTP 401).';
        }

        if ($status === 403) {
            return 'La Bonne Alternance a refusé l’accès à cette ressource (HTTP 403).';
        }

        if ($status === 429 || $status === 419) {
            return 'La limite de requêtes de La Bonne Alternance est atteinte. Réessayez après le délai indiqué par l’API.';
        }

        return "Échec de l’opération {$operation} auprès de La Bonne Alternance (HTTP {$status}).";
    }
}
