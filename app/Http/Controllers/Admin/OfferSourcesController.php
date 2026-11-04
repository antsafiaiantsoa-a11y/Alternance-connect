<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobSyncRun;
use App\Services\JobSources\JobSourceManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class OfferSourcesController extends Controller
{
    public function index(JobSourceManager $sources): Response
    {
        $sources->ensureSources();

        return Inertia::render('admin/offer-sources', [
            'sources' => $sources->sourceStatus(),
            'runs' => JobSyncRun::query()
                ->orderByDesc('started_at')
                ->limit(20)
                ->get([
                    'id',
                    'source_slug',
                    'started_at',
                    'finished_at',
                    'status',
                    'fetched_count',
                    'expired_count',
                    'error_message',
                ]),
        ]);
    }

    public function toggle(Request $request, string $slug, JobSourceManager $sources): RedirectResponse
    {
        $data = $request->validate(['enabled' => ['required', 'boolean']]);

        try {
            $sources->setEnabled($slug, (bool) $data['enabled']);
        } catch (Throwable $error) {
            return back()->with('error', $error->getMessage());
        }

        return back()->with('status', 'Le statut de la source a été mis à jour.');
    }

    public function sync(string $slug, JobSourceManager $sources): RedirectResponse
    {
        try {
            $result = $sources->sync($slug);
        } catch (Throwable $error) {
            return back()->with('error', $error->getMessage());
        }

        return back()->with('status', sprintf(
            '%d offre(s) synchronisée(s) ; %d offre(s) expirée(s).',
            $result['fetched_count'],
            $result['expired_count'],
        ));
    }
}
