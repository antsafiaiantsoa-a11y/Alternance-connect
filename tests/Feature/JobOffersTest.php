<?php

namespace Tests\Feature;

use App\Models\JobOffer;
use App\Models\JobSource;
use App\Models\User;
use App\Services\JobSources\JobSourceManager;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class JobOffersTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_and_search_page_only_render_saved_offers(): void
    {
        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('featuredOffers', [])
        );

        $this->get('/offres')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('offers/index')
            ->where('offers.total', 0)
        );

        $this->makeOffer('Assistant comptable', 'Paris');
        $this->makeOffer('Développeur web', 'Lyon');

        $this->get('/offres?city=Lyon')->assertInertia(fn (Assert $page) => $page
            ->component('offers/index')
            ->where('offers.total', 1)
            ->where('offers.data.0.title', 'Développeur web')
        );
    }

    public function test_sync_imports_only_real_job_rows_and_updates_existing_offers(): void
    {
        config([
            'job_sources.lba.api_key' => 'test-key',
            'job_sources.lba.non_profit_use_confirmed' => true,
            'job_sources.lba.enabled' => true,
        ]);
        $responseSequence = Http::sequence()
            ->push(['jobs' => [$this->apiOffer('Titre initial'), $this->recruiterSuggestion()]], 200)
            ->push(['jobs' => [$this->apiOffer('Titre actualisé')]], 200);
        Http::fake(['*' => $responseSequence]);

        $manager = app(JobSourceManager::class);
        $first = $manager->sync('lba');
        $second = $manager->sync('lba');

        $this->assertSame(1, $first['fetched_count']);
        $this->assertSame(1, $second['fetched_count']);
        $this->assertDatabaseCount('job_offers', 1);
        $this->assertDatabaseHas('job_offers', [
            'source_offer_id' => 'partner-1',
            'title' => 'Titre actualisé',
            'application_url' => 'https://example.fr/apply',
        ]);
        $this->assertDatabaseHas('job_sync_runs', ['status' => 'succeeded', 'fetched_count' => 1]);
        Http::assertSent(fn (Request $request): bool => $request->hasHeader('Authorization', 'Bearer test-key'));
    }

    public function test_sync_downloads_the_official_export_using_its_temporary_url(): void
    {
        config([
            'job_sources.lba.api_key' => 'test-key',
            'job_sources.lba.non_profit_use_confirmed' => true,
            'job_sources.lba.enabled' => true,
        ]);
        Http::fake([
            'https://api.apprentissage.beta.gouv.fr/api/job/v1/export' => Http::response([
                'url' => 'https://exports.example.test/daily.json',
                'lastUpdate' => '2026-11-04T03:00:00+01:00',
            ], 200),
            'https://exports.example.test/daily.json' => Http::response([
                'jobs' => [$this->apiOffer('Offre depuis l’export officiel')],
            ], 200),
        ]);

        $result = app(JobSourceManager::class)->sync('lba');

        $this->assertSame(1, $result['fetched_count']);
        $this->assertDatabaseHas('job_offers', ['title' => 'Offre depuis l’export officiel']);
        Http::assertSentCount(2);
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/job/v1/export')
            && $request->hasHeader('Authorization', 'Bearer test-key'));
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/daily.json')
            && ! $request->hasHeader('Authorization'));
    }

    public function test_failed_api_access_is_recorded_and_not_reported_as_a_successful_sync(): void
    {
        config([
            'job_sources.lba.api_key' => 'invalid-key',
            'job_sources.lba.non_profit_use_confirmed' => true,
            'job_sources.lba.enabled' => true,
        ]);
        Http::fake(['*' => Http::response([], 401)]);

        try {
            app(JobSourceManager::class)->sync('lba');
            $this->fail('Expected an invalid API key to fail the synchronization.');
        } catch (\RuntimeException $error) {
            $this->assertStringContainsString('HTTP 401', $error->getMessage());
        }

        $this->assertDatabaseHas('job_sync_runs', ['status' => 'failed']);
        $this->assertDatabaseHas('job_sources', ['slug' => 'lba']);
        $this->assertNotNull(JobSource::query()->where('slug', 'lba')->value('last_error'));
    }

    public function test_offer_management_is_only_available_to_allowlisted_administrators(): void
    {
        config(['job_sources.admins' => ['offers-admin@example.test']]);

        $this->actingAs(User::factory()->create(['email' => 'candidate@example.test']))
            ->get('/admin/offres')
            ->assertForbidden();

        $this->actingAs(User::factory()->create(['email' => 'offers-admin@example.test']))
            ->get('/admin/offres')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('admin/offer-sources')->has('sources', 2));
    }

    public function test_local_setup_allows_a_signed_in_user_to_open_source_management_when_no_admin_is_configured(): void
    {
        config(['app.env' => 'local', 'job_sources.admins' => []]);

        $this->actingAs(User::factory()->create())
            ->get('/admin/offres')
            ->assertOk();
    }

    public function test_country_filter_returns_only_offers_for_the_selected_country(): void
    {
        $this->makeOffer('Offre française', 'Paris')->update(['country_code' => 'FR']);
        $this->makeOffer('Offre allemande', 'Berlin')->update(['country_code' => 'DE']);

        $this->get('/offres?country=DE')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('offers.total', 1)
                ->where('offers.data.0.title', 'Offre allemande')
                ->where('offers.data.0.country_code', 'DE')
                ->where('filters.country', 'DE')
            );
    }

    public function test_admin_can_toggle_country_visibility_without_marking_a_source_as_connected(): void
    {
        config(['app.env' => 'local', 'job_sources.admins' => []]);
        $admin = User::factory()->create();

        $this->actingAs($admin)->get('/admin/offres/pays')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/countries')
                ->where('countries.0.coverage_status', 'no_source')
            );

        $this->actingAs($admin)->patch('/admin/offres/pays/DE', ['enabled_for_search' => true])
            ->assertRedirect();

        $this->assertDatabaseHas('countries', ['code' => 'DE', 'enabled_for_search' => true]);
        $this->assertDatabaseMissing('job_sources', ['slug' => 'germany']);
    }

    public function test_company_offer_is_verified_moderated_and_receives_private_applications(): void
    {
        config(['app.env' => 'local', 'job_sources.admins' => []]);
        $companyOwner = User::factory()->create();
        $admin = User::factory()->create();
        $candidate = User::factory()->create();

        $this->actingAs($companyOwner)->post('/entreprise', [
            'name' => 'Atelier Lyon',
            'registration_number' => 'FR-123456',
            'country_code' => 'FR',
            'city' => 'Lyon',
            'contact_email' => 'recrutement@atelier.example',
            'privacy_notice_accepted' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('companies', [
            'name' => 'Atelier Lyon',
            'verification_status' => 'pending',
        ]);

        $this->actingAs($admin)->patch('/admin/entreprises/1/verification', [
            'verification_status' => 'verified',
        ])->assertRedirect();

        $this->actingAs($companyOwner)->post('/entreprise/offres', [
            'title' => 'Technicienne de maintenance',
            'description' => 'Rejoins notre équipe pour préparer un diplôme en maintenance industrielle en alternance.',
            'country_code' => 'FR',
            'city' => 'Lyon',
            'sector' => 'Industrie',
            'contract_type' => 'apprenticeship',
            'privacy_notice_accepted' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('job_offers', [
            'title' => 'Technicienne de maintenance',
            'moderation_status' => 'pending',
            'source_provider' => 'company',
        ]);
        $this->get('/offres')->assertInertia(fn (Assert $page) => $page->where('offers.total', 0));

        $offerId = JobOffer::query()->where('source_provider', 'company')->value('id');
        $this->actingAs($admin)->patch("/admin/entreprises/offres/{$offerId}", [
            'moderation_status' => 'approved',
        ])->assertRedirect();
        $this->get('/offres?contract=apprenticeship&sector=Indus')
            ->assertInertia(fn (Assert $page) => $page->where('offers.total', 1));

        $this->actingAs($candidate)->get("/offres/{$offerId}/postuler")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('applications/create')
                ->where('alreadyApplied', false)
            );

        $this->actingAs($candidate)->post("/offres/{$offerId}/postuler", [
            'cover_letter' => 'Je souhaite rejoindre votre entreprise pour cette alternance.',
            'privacy_notice_accepted' => true,
        ])->assertRedirect('/mes-candidatures');

        $this->assertDatabaseHas('job_offer_applications', [
            'job_offer_id' => $offerId,
            'applicant_id' => $candidate->id,
            'status' => 'received',
        ]);

        $this->actingAs($companyOwner)->get('/entreprise')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('company/dashboard')
                ->has('applications', 1)
                ->where('applications.0.applicant_email', $candidate->email)
            );

        $applicationId = DB::table('job_offer_applications')->value('id');
        $this->actingAs($companyOwner)->patch("/entreprise/candidatures/{$applicationId}", [
            'status' => 'interview',
        ])->assertRedirect();
        $this->assertDatabaseHas('job_offer_applications', ['id' => $applicationId, 'status' => 'interview']);

        $this->actingAs($candidate)->delete("/mes-candidatures/{$applicationId}")->assertRedirect();
        $this->assertDatabaseMissing('job_offer_applications', ['id' => $applicationId]);
    }

    private function makeOffer(string $title, string $city): JobOffer
    {
        return JobOffer::query()->create([
            'source_provider' => 'lba',
            'source_label' => 'offres_emploi_lba',
            'source_offer_id' => fake()->unique()->bothify('offer-####'),
            'title' => $title,
            'city' => $city,
            'country_code' => 'FR',
            'contract_types' => ['Apprentissage'],
            'rome_codes' => ['M1805'],
            'availability_status' => 'active',
        ]);
    }

    /** @return array<string, mixed> */
    private function apiOffer(string $title): array
    {
        return [
            'identifier' => ['partner_label' => 'offres_emploi_lba', 'partner_job_id' => 'partner-1'],
            'offer' => ['title' => $title, 'description' => 'Offre réelle test.', 'rome_codes' => ['M1805']],
            'workplace' => ['name' => 'Entreprise réelle'],
            'location' => ['address' => ['city' => 'Lyon']],
            'contract' => ['type' => ['Apprentissage']],
            'publication' => ['creation' => '2026-10-01', 'expiration' => '2027-02-01'],
            'apply' => ['url' => 'https://example.fr/apply'],
        ];
    }

    /** @return array<string, mixed> */
    private function recruiterSuggestion(): array
    {
        return [
            'identifier' => ['partner_label' => 'recruteurs_lba', 'partner_job_id' => 'recruiter-1'],
            'offer' => ['title' => 'Entreprise qui recrute'],
        ];
    }
}
