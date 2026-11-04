<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\JobOffer;
use App\Models\JobSource;
use App\Services\JobSources\JobSourceManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CountriesController extends Controller
{
    public function index(JobSourceManager $sources): Response
    {
        $sources->ensureSources();
        $lbaAvailable = JobSource::query()->where('slug', 'lba')->value('available') ?? false;
        $offerCounts = JobOffer::query()
            ->selectRaw('country_code, count(*) as offers_count')
            ->whereNotNull('country_code')
            ->groupBy('country_code')
            ->pluck('offers_count', 'country_code');

        return Inertia::render('admin/countries', [
            'countries' => Country::query()->orderBy('name_fr')->get()->map(fn (Country $country): array => [
                'code' => $country->code,
                'name_fr' => $country->name_fr,
                'name_en' => $country->name_en,
                'name_de' => $country->name_de,
                'eu_member' => $country->eu_member,
                'enabled_for_search' => $country->enabled_for_search,
                'offers_count' => (int) ($offerCounts[$country->code] ?? 0),
                'coverage_status' => $country->code === 'FR'
                    ? ($lbaAvailable ? 'configured' : 'needs_setup')
                    : 'no_source',
            ])->all(),
        ]);
    }

    public function toggle(Request $request, Country $country): RedirectResponse
    {
        $data = $request->validate([
            'enabled_for_search' => ['required', 'boolean'],
        ]);

        $country->update(['enabled_for_search' => (bool) $data['enabled_for_search']]);

        return back()->with('status', 'La disponibilité du pays dans les filtres a été mise à jour.');
    }
}
