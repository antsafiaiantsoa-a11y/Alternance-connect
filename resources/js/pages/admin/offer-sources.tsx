import { Head, router, usePage } from '@inertiajs/react';
import { RefreshCw, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from '@/i18n/locale';

type Source = {
    slug: string;
    label: string;
    enabled: boolean;
    available: boolean;
    status_note: string | null;
    last_synced_at: string | null;
    last_error: string | null;
    offers_count: number;
};

type SyncRun = {
    id: number;
    source_slug: string;
    started_at: string;
    finished_at: string | null;
    status: string;
    fetched_count: number;
    expired_count: number;
    error_message: string | null;
};

type Props = {
    sources: Source[];
    runs: SyncRun[];
};

export default function OfferSources({ sources, runs }: Props) {
    const { language, t } = useLocale();
    const [busySlug, setBusySlug] = useState<string | null>(null);
    const { flash } = usePage<{ flash: { status?: string | null; error?: string | null } }>().props;
    const locale = language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'en-GB';

    function toggle(source: Source) {
        setBusySlug(source.slug);
        router.patch(`/admin/offres/${source.slug}`, { enabled: !source.enabled }, {
            preserveScroll: true,
            onFinish: () => setBusySlug(null),
        });
    }

    function synchronize(source: Source) {
        setBusySlug(source.slug);
        router.post(`/admin/offres/${source.slug}/synchroniser`, {}, {
            preserveScroll: true,
            onFinish: () => setBusySlug(null),
        });
    }

    return (
        <>
            <Head title={t('admin.sources.title')} />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
                <header className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#6941C6]">Alternance Connect</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{t('admin.sources.title')}</h1>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t('admin.sources.description')}</p>
                    </div>
                </header>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
                    <strong>{t('admin.sources.noticeTitle')}</strong> {t('admin.sources.notice')}
                </div>

                {sources.some((source) => source.slug === 'lba' && !source.available) && (
                    <section role="status" className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-amber-950 sm:p-6">
                        <h2 className="text-lg font-extrabold">{t('admin.sources.lbaSetupTitle')}</h2>
                        <p className="mt-2 text-sm leading-6">{t('admin.sources.lbaSetupIntro')}</p>
                        <ol className="mt-4 list-inside list-decimal space-y-2 text-sm leading-6">
                            <li><a href="https://api.apprentissage.beta.gouv.fr/fr" target="_blank" rel="noreferrer" className="font-extrabold underline">{t('admin.sources.lbaSetupCreateKey')}</a></li>
                            <li>
                                {t('admin.sources.lbaSetupAddKey')}
                                <code className="mt-2 block whitespace-pre-line rounded-lg bg-white p-3 font-mono text-xs">
                                    {'LBA_API_KEY=votre_cle\nLBA_NON_PROFIT_USE=true'}
                                </code>
                            </li>
                            <li>{t('admin.sources.lbaSetupConfirmUse')}</li>
                        </ol>
                        <p className="mt-4 text-sm font-semibold">{t('admin.sources.lbaSetupFinish')}</p>
                    </section>
                )}

                {flash.status && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{flash.status}</p>}
                {flash.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{flash.error}</p>}

                <section className="grid gap-4 lg:grid-cols-2">
                    {sources.map((source) => (
                        <article key={source.slug} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-violet-50 text-[#6941C6]"><Settings2 size={20} /></span>
                                    <div>
                                        <h2 className="font-extrabold text-slate-900">{source.label}</h2>
                                        <p className={`mt-1 text-xs font-bold ${source.available ? 'text-emerald-700' : 'text-amber-700'}`}>{source.available ? t('admin.sources.available') : t('admin.sources.unavailable')}</p>
                                    </div>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${source.enabled ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{source.enabled ? t('admin.sources.enabled') : t('admin.sources.disabled')}</span>
                            </div>
                            {source.status_note && <p className="mt-4 text-sm leading-6 text-slate-600">{source.status_note}</p>}
                            {source.last_error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{source.last_error}</p>}
                            <dl className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                                <div><dt className="text-slate-500">{t('admin.sources.offers')}</dt><dd className="mt-1 font-extrabold text-slate-900">{source.offers_count}</dd></div>
                                <div><dt className="text-slate-500">{t('admin.sources.lastSync')}</dt><dd className="mt-1 font-semibold text-slate-800">{source.last_synced_at ? new Date(source.last_synced_at).toLocaleString(locale) : t('admin.sources.never')}</dd></div>
                            </dl>
                            <div className="mt-5 flex flex-wrap gap-2">
                                <button type="button" disabled={!source.available || busySlug === source.slug} onClick={() => toggle(source)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">{source.enabled ? t('admin.sources.disable') : t('admin.sources.enable')}</button>
                                <button type="button" disabled={!source.available || !source.enabled || busySlug === source.slug} onClick={() => synchronize(source)} className="inline-flex items-center gap-2 rounded-xl bg-[#6941C6] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#5933B2] disabled:cursor-not-allowed disabled:opacity-40"><RefreshCw size={15} className={busySlug === source.slug ? 'animate-spin' : ''} />{t('admin.sources.syncNow')}</button>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
                    <h2 className="text-lg font-extrabold text-slate-900">{t('admin.sources.history')}</h2>
                    {runs.length ? <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm">
                        <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr><th className="py-3 pr-4">{t('admin.sources.date')}</th><th className="py-3 pr-4">{t('admin.sources.source')}</th><th className="py-3 pr-4">{t('admin.sources.runStatus')}</th><th className="py-3 pr-4">{t('admin.sources.imported')}</th><th className="py-3">{t('admin.sources.expired')}</th></tr></thead>
                        <tbody>{runs.map((run) => <tr key={run.id} className="border-b border-slate-100 align-top"><td className="py-3 pr-4">{new Date(run.started_at).toLocaleString(locale)}</td><td className="py-3 pr-4">{run.source_slug}</td><td className="py-3 pr-4"><span className={run.status === 'succeeded' ? 'font-bold text-emerald-700' : run.status === 'failed' ? 'font-bold text-red-700' : 'font-bold text-slate-600'}>{t(`admin.sources.status.${run.status}`)}</span>{run.error_message && <p className="mt-1 max-w-sm text-xs text-red-700">{run.error_message}</p>}</td><td className="py-3 pr-4">{run.fetched_count}</td><td className="py-3">{run.expired_count}</td></tr>)}</tbody>
                    </table></div> : <p className="mt-3 text-sm text-slate-500">{t('admin.sources.noRuns')}</p>}
                </section>
            </div>
        </>
    );
}
