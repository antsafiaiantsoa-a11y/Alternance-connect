import { Head, Link, router, usePage } from '@inertiajs/react';
import { BriefcaseBusiness } from 'lucide-react';
import { useLocale } from '@/i18n/locale';

type Application = {
    id: number;
    offer_id: number;
    title: string;
    company: string | null;
    city: string | null;
    country_code: string | null;
    status: string;
    created_at: string | null;
};

export default function ApplicationsIndex({
    applications,
}: {
    applications: Application[];
}) {
    const { language, t } = useLocale();
    const { flash } = usePage<{ flash: { status?: string | null } }>().props;
    const locale =
        language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'en-GB';

    return (
        <>
            <Head title={t('applications.title')} />
            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
                <header>
                    <p className="text-xs font-extrabold tracking-[0.15em] text-[#6941C6] uppercase">
                        Alternance Connect
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                        {t('applications.title')}
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {t('applications.description')}
                    </p>
                </header>
                {flash.status && (
                    <p
                        role="status"
                        className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"
                    >
                        {flash.status}
                    </p>
                )}
                {applications.length ? (
                    applications.map((application) => (
                        <article
                            key={application.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-[#6941C6]">
                                        <BriefcaseBusiness size={18} />
                                    </span>
                                    <div>
                                        <h2 className="font-extrabold text-slate-900">
                                            {application.title}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {application.company}
                                            {application.city
                                                ? ` · ${application.city}`
                                                : ''}
                                            {application.country_code
                                                ? ` · ${application.country_code}`
                                                : ''}
                                        </p>
                                        <p className="mt-2 text-xs font-bold text-[#6941C6]">
                                            {t(
                                                `company.application.status.${application.status}`,
                                            )}
                                        </p>
                                        {application.created_at && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                {new Date(
                                                    application.created_at,
                                                ).toLocaleDateString(locale)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.delete(
                                            `/mes-candidatures/${application.id}`,
                                            { preserveScroll: true },
                                        )
                                    }
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
                                >
                                    {t('applications.withdraw')}
                                </button>
                            </div>
                            <Link
                                href={`/offres?country=${application.country_code || ''}`}
                                className="mt-4 inline-block text-sm font-bold text-[#6941C6] underline"
                            >
                                {t('nav.offers')}
                            </Link>
                        </article>
                    ))
                ) : (
                    <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
                        {t('applications.empty')}
                    </p>
                )}
            </div>
        </>
    );
}
