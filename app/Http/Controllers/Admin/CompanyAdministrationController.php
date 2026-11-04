<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\JobOffer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CompanyAdministrationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/company-review', [
            'companies' => Company::query()
                ->with('owner:id,name,email')
                ->orderByRaw("CASE WHEN verification_status = 'pending' THEN 0 ELSE 1 END")
                ->latest()
                ->get()
                ->map(fn (Company $company): array => [
                    'id' => $company->id,
                    'name' => $company->name,
                    'registration_number' => $company->registration_number,
                    'country_code' => $company->country_code,
                    'city' => $company->city,
                    'website' => $company->website,
                    'contact_email' => $company->contact_email,
                    'verification_status' => $company->verification_status,
                    'owner_name' => $company->owner->name,
                    'owner_email' => $company->owner->email,
                    'created_at' => $company->created_at?->toIso8601String(),
                ])->all(),
            'offers' => JobOffer::query()
                ->where('source_provider', 'company')
                ->where('moderation_status', 'pending')
                ->with('company:id,name,verification_status')
                ->latest()
                ->get()
                ->map(fn (JobOffer $offer): array => [
                    'id' => $offer->id,
                    'title' => $offer->title,
                    'company' => $offer->company?->name,
                    'company_verified' => $offer->company?->verification_status === 'verified',
                    'city' => $offer->city,
                    'country_code' => $offer->country_code,
                    'description' => $offer->description,
                    'contract_types' => $offer->contract_types ?? [],
                    'created_at' => $offer->created_at?->toIso8601String(),
                ])->all(),
        ]);
    }

    public function verifyCompany(Request $request, Company $company): RedirectResponse
    {
        $data = $request->validate([
            'verification_status' => ['required', Rule::in(['verified', 'rejected'])],
            'verification_note' => ['required_if:verification_status,rejected', 'nullable', 'string', 'max:1000'],
        ]);

        $company->update([
            'verification_status' => $data['verification_status'],
            'verification_note' => $data['verification_note'] ?? null,
            'verified_at' => $data['verification_status'] === 'verified' ? now() : null,
        ]);

        if ($data['verification_status'] === 'rejected') {
            $company->offers()->where('availability_status', 'active')->update([
                'availability_status' => 'unavailable',
            ]);
        }

        return back()->with('status', 'La vérification de l’entreprise a été mise à jour.');
    }

    public function moderateOffer(Request $request, JobOffer $offer): RedirectResponse
    {
        abort_unless($offer->source_provider === 'company', 404);
        $data = $request->validate([
            'moderation_status' => ['required', Rule::in(['approved', 'rejected'])],
            'moderation_note' => ['required_if:moderation_status,rejected', 'nullable', 'string', 'max:1000'],
        ]);

        if ($data['moderation_status'] === 'approved' && $offer->company?->verification_status !== 'verified') {
            return back()->with('error', 'Vérifie d’abord l’entreprise avant d’approuver ses offres.');
        }

        $offer->update([
            'moderation_status' => $data['moderation_status'],
            'moderation_note' => $data['moderation_note'] ?? null,
            'published_at' => $data['moderation_status'] === 'approved' ? now() : null,
            'availability_status' => $data['moderation_status'] === 'approved' ? 'active' : $offer->availability_status,
        ]);

        return back()->with('status', 'La décision de modération a été enregistrée.');
    }
}
