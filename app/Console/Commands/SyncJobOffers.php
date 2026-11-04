<?php

namespace App\Console\Commands;

use App\Models\JobSource;
use App\Services\JobSources\JobSourceManager;
use Illuminate\Console\Command;
use Throwable;

class SyncJobOffers extends Command
{
    protected $signature = 'job-offers:sync {source=lba}';

    protected $description = 'Synchronise les offres d’alternance depuis une source configurée.';

    public function handle(JobSourceManager $sources): int
    {
        $slug = (string) $this->argument('source');
        $sources->ensureSources();
        $source = JobSource::query()->where('slug', $slug)->first();

        if (! $source) {
            $this->error("Source inconnue : {$slug}.");

            return self::FAILURE;
        }

        if (! $source->enabled || ! $source->available) {
            $this->info("Synchronisation ignorée : {$source->status_note}");

            return self::SUCCESS;
        }

        try {
            $result = $sources->sync($slug);
        } catch (Throwable $error) {
            $this->error($error->getMessage());

            return self::FAILURE;
        }

        $this->info(sprintf(
            '%d offre(s) importée(s) ; %d offre(s) expirée(s).',
            $result['fetched_count'],
            $result['expired_count'],
        ));

        return self::SUCCESS;
    }
}
