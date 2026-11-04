<?php

namespace App\Services\JobSources;

use App\Models\JobOffer;
use App\Models\JobSource;
use App\Models\JobSyncRun;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class JobSourceManager
{
    public function __construct(
        private readonly LaBonneAlternanceService $lba,
        private readonly LaBonneAlternanceOfferMapper $mapper,
        private readonly FranceTravailService $franceTravail,
    ) {}

    public function ensureSources(): void
    {
        $hasKey = trim((string) config('job_sources.lba.api_key')) !== '';
        $nonProfitConfirmed = (bool) config('job_sources.lba.non_profit_use_confirmed');
        $lbaAvailable = $hasKey && $nonProfitConfirmed;
        $lbaNote = match (true) {
            ! $hasKey => 'Ajoutez LBA_API_KEY dans .env pour connecter cette source.',
            ! $nonProfitConfirmed => 'La source exige un usage non lucratif. Confirmez LBA_NON_PROFIT_USE=true dans .env avant toute requête.',
            default => 'Les offres réelles sont synchronisées depuis l’export officiel La Bonne Alternance.',
        };

        $lbaSource = JobSource::firstOrCreate(
            ['slug' => 'lba'],
            [
                'label' => 'La Bonne Alternance',
                'enabled' => (bool) config('job_sources.lba.enabled'),
                'available' => $lbaAvailable,
                'status_note' => $lbaNote,
            ],
        );
        $lbaSource->forceFill([
            'available' => $lbaAvailable,
            'status_note' => $lbaNote,
        ])->saveQuietly();

        $franceTravailSource = JobSource::firstOrCreate(
            ['slug' => 'france-travail'],
            [
                'label' => 'France Travail (accès direct)',
                'enabled' => false,
                'available' => false,
                'status_note' => 'API Offres temporairement retirée du portail. Un accès écrit de France Travail est requis ; aucune requête directe n’est envoyée.',
            ],
        );
        $franceTravailSource->forceFill([
            'available' => $this->franceTravail->isAvailable(),
            'enabled' => $this->franceTravail->isAvailable() && $franceTravailSource->enabled,
            'status_note' => 'API Offres temporairement retirée du portail. Un accès écrit de France Travail est requis ; aucune requête directe n’est envoyée.',
        ])->saveQuietly();
    }

    /** @return array<int, array<string, mixed>> */
    public function sourceStatus(): array
    {
        $this->ensureSources();

        return JobSource::query()->orderBy('id')->get()->map(function (JobSource $source): array {
            $count = match ($source->slug) {
                'france-travail' => JobOffer::query()
                    ->where('source_provider', 'lba')
                    ->whereRaw('LOWER(source_label) LIKE ?', ['%france travail%'])
                    ->count(),
                default => JobOffer::query()->where('source_provider', $source->slug)->count(),
            };

            return [
                'slug' => $source->slug,
                'label' => $source->label,
                'enabled' => $source->enabled,
                'available' => $source->available,
                'status_note' => $source->status_note,
                'last_synced_at' => $source->last_synced_at?->toIso8601String(),
                'last_error' => $source->last_error,
                'offers_count' => $count,
            ];
        })->all();
    }

    public function setEnabled(string $slug, bool $enabled): JobSource
    {
        $this->ensureSources();
        $source = JobSource::query()->where('slug', $slug)->firstOrFail();

        if ($enabled && ! $source->available) {
            throw new RuntimeException($source->status_note ?? 'Cette source n’est pas disponible.');
        }

        $source->update(['enabled' => $enabled]);

        return $source->refresh();
    }

    /** @return array{fetched_count: int, expired_count: int} */
    public function sync(string $slug): array
    {
        $this->ensureSources();
        $source = JobSource::query()->where('slug', $slug)->firstOrFail();

        if (! $source->enabled) {
            throw new RuntimeException("La source {$source->label} est désactivée.");
        }

        if (! $source->available) {
            throw new RuntimeException($source->status_note ?? 'Cette source n’est pas disponible.');
        }

        $lock = Cache::lock("job-source-sync:{$slug}", 600);

        if (! $lock->get()) {
            throw new RuntimeException('Une synchronisation de cette source est déjà en cours.');
        }

        try {
            return $this->runSync($source);
        } finally {
            $lock->release();
        }
    }

    /** @return array{fetched_count: int, expired_count: int} */
    private function runSync(JobSource $source): array
    {
        $startedAt = CarbonImmutable::now()->startOfSecond();
        $run = JobSyncRun::query()->create([
            'source_slug' => $source->slug,
            'started_at' => $startedAt,
            'status' => 'running',
        ]);
        $fetched = 0;
        $batch = [];

        try {
            $rows = match ($source->slug) {
                'lba' => $this->lba->publishedOffers(),
                'france-travail' => $this->franceTravail->publishedOffers(),
                default => throw new RuntimeException('Source d’offres inconnue.'),
            };

            foreach ($rows as $row) {
                $mapped = $source->slug === 'lba'
                    ? $this->mapper->map($row, $startedAt)
                    : null;

                if ($mapped === null) {
                    continue;
                }

                $batch[] = $mapped;
                $fetched++;

                if (count($batch) >= 250) {
                    $this->upsert($batch);
                    $batch = [];
                }
            }

            if ($batch !== []) {
                $this->upsert($batch);
            }

            $expiredCount = JobOffer::query()
                ->where('source_provider', $source->slug)
                ->where('availability_status', 'active')
                ->whereDate('expires_at', '<', $startedAt->toDateString())
                ->update([
                    'availability_status' => 'expired',
                    'updated_at' => $startedAt,
                ]);

            JobOffer::query()
                ->where('source_provider', $source->slug)
                ->where('availability_status', 'active')
                ->where('last_synced_at', '<', $startedAt)
                ->where(function ($query) use ($startedAt): void {
                    $query->whereNull('expires_at')
                        ->orWhereDate('expires_at', '>=', $startedAt->toDateString());
                })
                ->update([
                    'availability_status' => 'unavailable',
                    'updated_at' => $startedAt,
                ]);

            $source->update([
                'last_synced_at' => $startedAt,
                'last_error' => null,
            ]);
            $run->update([
                'finished_at' => CarbonImmutable::now(),
                'status' => 'succeeded',
                'fetched_count' => $fetched,
                'expired_count' => $expiredCount,
            ]);

            return ['fetched_count' => $fetched, 'expired_count' => $expiredCount];
        } catch (Throwable $error) {
            $message = mb_substr($error->getMessage(), 0, 1000);
            $source->update(['last_error' => $message]);
            $run->update([
                'finished_at' => CarbonImmutable::now(),
                'status' => 'failed',
                'fetched_count' => $fetched,
                'error_message' => $message,
            ]);
            Log::warning('Job offer source synchronization failed.', [
                'source' => $source->slug,
                'error' => $message,
            ]);

            throw $error;
        }
    }

    /** @param array<int, array<string, mixed>> $batch */
    private function upsert(array $batch): void
    {
        $updateFields = array_values(array_diff(
            array_keys($batch[0]),
            ['source_provider', 'source_label', 'source_offer_id', 'created_at'],
        ));

        JobOffer::query()->upsert(
            $batch,
            ['source_provider', 'source_label', 'source_offer_id'],
            $updateFields,
        );
    }
}
