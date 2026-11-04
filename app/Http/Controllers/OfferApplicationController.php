<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use App\Models\OfferApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferApplicationController extends Controller
{
    public function create(JobOffer $offer, Request $request): Response
    {
        $offer = JobOffer::query()->available()->whereKey($offer->id)->where('source_provider', 'company')->firstOrFail();
        abort_if($offer->created_by === $request->user()->id, 403);

        return Inertia::render('applications/create', [
            'offer' => [
                'id' => $offer->id,
                'title' => $offer->title,
                'company' => $offer->company_name,
                'city' => $offer->city,
                'country_code' => $offer->country_code,
            ],
            'alreadyApplied' => OfferApplication::query()
                ->where('job_offer_id', $offer->id)
                ->where('applicant_id', $request->user()->id)
                ->exists(),
        ]);
    }

    public function store(JobOffer $offer, Request $request): RedirectResponse
    {
        $offer = JobOffer::query()->available()->whereKey($offer->id)->where('source_provider', 'company')->firstOrFail();
        abort_if($offer->created_by === $request->user()->id, 403);

        $data = $request->validate([
            'cover_letter' => ['required', 'string', 'min:20', 'max:5000'],
            'privacy_notice_accepted' => ['accepted'],
        ]);
        unset($data['privacy_notice_accepted']);

        OfferApplication::query()->firstOrCreate(
            ['job_offer_id' => $offer->id, 'applicant_id' => $request->user()->id],
            [
                'cover_letter' => $data['cover_letter'],
                'status' => 'received',
                'privacy_notice_accepted_at' => now(),
            ],
        );

        return to_route('applications.index')->with('status', 'Ta candidature a été envoyée à l’entreprise.');
    }

    public function index(Request $request): Response
    {
        return Inertia::render('applications/index', [
            'applications' => $request->user()->applications()
                ->with('offer:id,title,company_name,city,country_code')
                ->latest()
                ->get()
                ->map(fn (OfferApplication $application): array => [
                    'id' => $application->id,
                    'offer_id' => $application->job_offer_id,
                    'title' => $application->offer->title,
                    'company' => $application->offer->company_name,
                    'city' => $application->offer->city,
                    'country_code' => $application->offer->country_code,
                    'status' => $application->status,
                    'created_at' => $application->created_at?->toIso8601String(),
                ])->all(),
        ]);
    }

    public function withdraw(Request $request, OfferApplication $application): RedirectResponse
    {
        abort_unless($application->applicant_id === $request->user()->id, 403);
        $application->delete();

        return back()->with('status', 'La candidature a été supprimée de ton espace.');
    }
}
