import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Globe2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from '@/i18n/locale';

type Country = {
    code: string;
    name_fr: string;
    name_en: string;
    name_de: string;
    eu_member: boolean;
    enabled_for_search: boolean;
    offers_count: number;
    coverage_status: 'configured' | 'needs_setup' | 'no_source';
};

export default function CountriesPage({ countries }: { countries: Country[] }) {
    const { language, t } = useLocale();
    const [busyCode, setBusyCode] = useState<string | null>(null);
    const { flash } = usePage<{ flash: { status?: string | null } }>().props;
    const localizedName = (country: Country) =>
        country[`name_${language}` as 'name_fr' | 'name_en' | 'name_de'];

    function toggle(country: Country) {
        setBusyCode(country.code);
        router.patch(
            `/admin/offres/pays/${country.code}`,
            { enabled_for_search: !country.enabled_for_search },
            {
                preserveScroll: true,
                onFinish: () => setBusyCode(null),
            },
        );
    }

    return (
        <>
            <Head title={t('admin.countries.title')} />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
                <header>
                    <Link
                        href="/admin/offres"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#6941C6] hover:underline"
                    >
                        <ArrowLeft size={16} />
                        {t('admin.countries.back')}
                    </Link>
                    <div className="mt-4 flex items-start gap-3">
                        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-[#6941C6]">
                            <Globe2 size={22} />
                        </span>
                        <div>
                            <p className="text-xs font-extrabold tracking-[0.15em] text-[#6941C6] uppercase">
                                Alternance Connect
                            </p>
                            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                                {t('admin.countries.title')}
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                                {t('admin.countries.description')}
                            </p>
                        </div>
                    </div>
                </header>

                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                    <strong>{t('admin.countries.noticeTitle')}</strong>{' '}
                    {t('admin.countries.notice')}
                </section>

                {flash.status && (
                    <p
                        role="status"
                        className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"
                    >
                        {flash.status}
                    </p>
                )}

                <section
                    aria-label={t('admin.countries.title')}
                    className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {countries.map((country) => (
                        <article
                            key={country.code}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-600">
                                        <MapPin size={17} />
                                    </span>
                                    <div>
                                        <h2 className="font-extrabold text-slate-900">
                                            {localizedName(country)}
                                        </h2>
                                        <p className="mt-0.5 text-xs font-semibold text-slate-500">
                                            {country.code}
                                            {country.eu_member
                                                ? ` · ${t('admin.countries.eu')}`
                                                : ''}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${country.coverage_status === 'configured' ? 'bg-emerald-50 text-emerald-800' : country.coverage_status === 'needs_setup' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-600'}`}
                                >
                                    {t(
                                        `admin.countries.coverage.${country.coverage_status}`,
                                    )}
                                </span>
                            </div>
                            <p className="mt-3 text-xs text-slate-500">
                                {t('admin.countries.offers', {
                                    count: country.offers_count,
                                })}
                            </p>
                            <button
                                type="button"
                                disabled={busyCode === country.code}
                                onClick={() => toggle(country)}
                                aria-pressed={country.enabled_for_search}
                                className={`mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-extrabold disabled:opacity-50 ${country.enabled_for_search ? 'border border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-[#6941C6] text-white hover:bg-[#5933B2]'}`}
                            >
                                {country.enabled_for_search
                                    ? t('admin.countries.disable')
                                    : t('admin.countries.enable')}
                            </button>
                        </article>
                    ))}
                </section>
            </div>
        </>
    );
}
