<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\JobOffer;
use App\Models\OfferApplication;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CompanyPortalController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->company;
        $offers = $company?->offers()->latest()->limit(100)->get()
            ->map(fn (JobOffer $offer): array => [
                'id' => $offer->id,
                'title' => $offer->title,
                'country_code' => $offer->country_code,
                'city' => $offer->city,
                'availability_status' => $offer->availability_status,
                'moderation_status' => $offer->moderation_status,
                'applications_count' => $offer->applications()->count(),
                'published_at' => $offer->published_at?->toIso8601String(),
            ])->all() ?? [];

        $applications = $company
            ? OfferApplication::query()
                ->whereHas('offer', fn (Builder $query) => $query->where('company_id', $company->id))
                ->with(['offer:id,title', 'applicant:id,name,email'])
                ->latest()
                ->limit(100)
                ->get()
                ->map(fn (OfferApplication $application): array => [
                    'id' => $application->id,
                    'offer_title' => $application->offer->title,
                    'applicant_name' => $application->applicant->name,
                    'applicant_email' => $application->applicant->email,
                    'cover_letter' => $application->cover_letter,
                    'status' => $application->status,
                    'created_at' => $application->created_at?->toIso8601String(),
                ])->all()
            : [];

        return Inertia::render('company/dashboard', [
            'company' => $company ? [
                'id' => $company->id,
                'name' => $company->name,
                'registration_number' => $company->registration_number,
                'country_code' => $company->country_code,
                'city' => $company->city,
                'website' => $company->website,
                'contact_email' => $company->contact_email,
                'verification_status' => $company->verification_status,
                'verification_note' => $company->verification_note,
            ] : null,
            'countries' => Country::query()->orderBy('name_fr')->get(['code', 'name_fr', 'name_en', 'name_de']),
            'offers' => $offers,
            'applications' => $applications,
        ]);
    }

    public function storeProfile(Request $request): RedirectResponse
    {
        if ($request->user()->company()->exists()) {
            return back()->with('error', 'Une fiche entreprise existe déjà pour ce compte. Contacte l’équipe si tu dois corriger ses informations légales.');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'registration_number' => [
                'required',
                'string',
                'max:120',
                Rule::unique('companies', 'registration_number')->where('country_code', strtoupper((string) $request->input('country_code'))),
            ],
            'country_code' => ['required', 'string', 'size:2', 'exists:countries,code'],
            'city' => ['required', 'string', 'max:120'],
            'website' => ['nullable', 'url:http,https', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'privacy_notice_accepted' => ['accepted'],
        ]);
        unset($data['privacy_notice_accepted']);

        $request->user()->company()->create([
            ...$data,
            'verification_status' => 'pending',
            'privacy_notice_accepted_at' => now(),
        ]);

        return back()->with('status', 'La demande de vérification de l’entreprise a été envoyée.');
    }

    public function storeOffer(Request $request): RedirectResponse
    {
        $company = $request->user()->company;
        if (! $company || $company->verification_status !== 'verified') {
            return back()->with('error', 'Le profil entreprise doit être vérifié avant de publier une offre.');
        }

        $data = $this->validatedOffer($request);
        $languages = $this->languages($data['languages'] ?? '');
        $contractType = $data['contract_type'];
        $currency = filled($data['salary_min'] ?? null) || filled($data['salary_max'] ?? null)
            ? strtoupper((string) $data['currency'])
            : null;
        unset($data['languages']);
        unset($data['contract_type']);

        $company->offers()->create([
            ...$data,
            'source_provider' => 'company',
            'source_label' => 'company_direct',
            'source_offer_id' => (string) Str::uuid(),
            'source_partner_id' => (string) $company->id,
            'created_by' => $request->user()->id,
            'company_name' => $company->name,
            'contract_types' => [$contractType],
            'required_languages' => $languages,
            'currency' => $currency,
            'availability_status' => 'active',
            'moderation_status' => 'pending',
            'attribution_text' => 'Offre publiée directement par '.$company->name,
            'reuse_license' => 'Publication directe par l’entreprise propriétaire du compte.',
            'expires_at' => now()->addDays(60)->toDateString(),
        ]);

        return back()->with('status', 'L’offre est envoyée à la modération avant sa mise en ligne.');
    }

    public function updateOffer(Request $request, JobOffer $offer): RedirectResponse
    {
        $company = $request->user()->company;
        abort_unless($company && $offer->company_id === $company->id, 403);
        abort_unless($company->verification_status === 'verified', 403);

        $data = $this->validatedOffer($request);
        $data['contract_types'] = [$data['contract_type']];
        $data['required_languages'] = $this->languages($data['languages'] ?? '');
        $data['currency'] = filled($data['salary_min'] ?? null) || filled($data['salary_max'] ?? null)
            ? strtoupper((string) $data['currency'])
            : null;
        unset($data['contract_type'], $data['languages']);

        $offer->update([
            ...$data,
            'moderation_status' => 'pending',
            'moderation_note' => null,
            'published_at' => null,
        ]);

        return back()->with('status', 'Les modifications sont renvoyées à la modération.');
    }

    public function deactivateOffer(Request $request, JobOffer $offer): RedirectResponse
    {
        $company = $request->user()->company;
        abort_unless($company && $offer->company_id === $company->id, 403);

        $offer->update(['availability_status' => 'unavailable']);

        return back()->with('status', 'L’offre a été désactivée.');
    }

    public function updateApplicationStatus(Request $request, OfferApplication $application): RedirectResponse
    {
        $company = $request->user()->company;
        abort_unless($company && $application->offer->company_id === $company->id, 403);

        $data = $request->validate([
            'status' => ['required', Rule::in(['reviewing', 'interview', 'accepted', 'rejected'])],
        ]);
        $application->update([
            ...$data,
            'status_updated_at' => now(),
        ]);

        return back()->with('status', 'Le statut de la candidature a été mis à jour.');
    }

    /** @return array<string, mixed> */
    private function validatedOffer(Request $request): array
    {
        $request->merge(['currency' => mb_strtoupper(trim((string) $request->input('currency')))]);

        return $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'description' => ['required', 'string', 'min:40', 'max:20000'],
            'country_code' => ['required', 'string', 'size:2', 'exists:countries,code'],
            'city' => ['required', 'string', 'max:120'],
            'region' => ['nullable', 'string', 'max:120'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'sector' => ['required', 'string', 'max:120'],
            'training_name' => ['nullable', 'string', 'max:180'],
            'contract_type' => ['required', Rule::in(['apprenticeship', 'professionalization', 'dual_training'])],
            'education_level' => ['nullable', 'string', 'max:120'],
            'salary_min' => ['nullable', 'numeric', 'min:0', 'max:10000000'],
            'salary_max' => ['nullable', 'numeric', 'min:0', 'max:10000000', 'gte:salary_min'],
            'currency' => ['required_with:salary_min,salary_max', 'nullable', Rule::in(['EUR', 'CHF', 'GBP', 'NOK', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'ISK', 'ALL', 'BAM', 'MKD', 'RSD', 'MDL', 'UAH', 'BYN', 'RUB', 'TRY', 'GEL', 'AMD', 'AZN'])],
            'duration_months' => ['nullable', 'integer', 'min:1', 'max:60'],
            'languages' => ['nullable', 'string', 'max:500'],
        ]);
    }

    /** @return array<int, string> */
    private function languages(string $value): array
    {
        return array_values(array_unique(array_filter(array_map(
            static fn (string $language): string => trim($language),
            preg_split('/[,;\n]+/', $value) ?: [],
        ))));
    }
}
