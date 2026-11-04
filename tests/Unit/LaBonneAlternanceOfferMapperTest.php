<?php

namespace Tests\Unit;

use App\Services\JobSources\LaBonneAlternanceOfferMapper;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\TestCase;

class LaBonneAlternanceOfferMapperTest extends TestCase
{
    public function test_it_maps_a_real_partner_offer_and_keeps_its_application_link(): void
    {
        $mapper = new LaBonneAlternanceOfferMapper;
        $mapped = $mapper->map($this->offer(), CarbonImmutable::parse('2026-11-04 10:00:00'));

        $this->assertNotNull($mapped);
        $this->assertSame('Développeur web', $mapped['title']);
        $this->assertSame('Acme', $mapped['company_name']);
        $this->assertSame('Lyon', $mapped['city']);
        $this->assertSame('https://example.fr/postuler', $mapped['application_url']);
        $this->assertSame('offres_emploi_lba', $mapped['source_label']);
        $this->assertSame('["Apprentissage"]', $mapped['contract_types']);
    }

    public function test_it_rejects_recruiter_suggestions_and_rows_without_a_job_title(): void
    {
        $mapper = new LaBonneAlternanceOfferMapper;
        $recruiter = $this->offer();
        $recruiter['identifier']['partner_label'] = 'recruteurs_lba';
        $untitled = $this->offer();
        $untitled['offer']['title'] = '';

        $this->assertNull($mapper->map($recruiter, CarbonImmutable::now()));
        $this->assertNull($mapper->map($untitled, CarbonImmutable::now()));
    }

    /** @return array<string, mixed> */
    private function offer(): array
    {
        return [
            'identifier' => ['partner_label' => 'offres_emploi_lba', 'partner_job_id' => 'job-123'],
            'offer' => [
                'title' => 'Développeur web',
                'description' => 'Contrat en alternance.',
                'target_diploma' => 'Bac +3',
                'rome_codes' => ['M1805'],
                'desired_skills' => ['PHP'],
            ],
            'workplace' => ['name' => 'Acme'],
            'location' => ['address' => ['city' => 'Lyon', 'postal_code' => '69000']],
            'contract' => ['type' => ['Apprentissage'], 'start' => '2027-01-01'],
            'publication' => ['creation' => '2026-10-01', 'expiration' => '2027-01-31'],
            'apply' => ['url' => 'https://example.fr/postuler'],
        ];
    }
}
