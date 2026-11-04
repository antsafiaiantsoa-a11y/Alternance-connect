<?php

namespace App\Services\JobSources;

use RuntimeException;

class FranceTravailService
{
    public function isAvailable(): bool
    {
        // France Travail has withdrawn this API from its public developer portal.
        // Do not send direct requests until the access agreement and endpoint are restored.
        return false;
    }

    public function publishedOffers(): never
    {
        throw new RuntimeException('L’API Offres France Travail n’est actuellement plus exposée. Demandez un accès via francetravail.io avant d’activer cette source.');
    }
}
