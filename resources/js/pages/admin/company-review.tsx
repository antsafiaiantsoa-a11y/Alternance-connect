import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Building2, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from '@/i18n/locale';

type Company = {
    id: number;
    name: string;
    registration_number: string;
    country_code: string;
    city: string;
    website: string | null;
    contact_email: string;
    verification_status: string;
    owner_name: string;
    owner_email: string;
    created_at: string | null;
};
type Offer = {
    id: number;
    title: string;
    company: string | null;
    company_verified: boolean;
    city: string | null;
    country_code: string | null;
    description: string | null;
    contract_types: string[];
    created_at: string | null;
};

export default function CompanyReview({
    companies,
    offers,
}: {
    companies: Company[];
    offers: Offer[];
}) {
    const { t } = useLocale();
    const [companyNotes, setCompanyNotes] = useState<Record<number, string>>(
        {},
    );
    const [offerNotes, setOfferNotes] = useState<Record<number, string>>({});
    const { flash } = usePage<{
        flash: { status?: string | null; error?: string | null };
    }>().props;

    function decideCompany(
        company: Company,
        verificationStatus: 'verified' | 'rejected',
    ) {
        router.patch(
            `/admin/entreprises/${company.id}/verification`,
            {
                verification_status: verificationStatus,
                verification_note: companyNotes[company.id] || '',
            },
            { preserveScroll: true },
        );
    }

    function decideOffer(
        offer: Offer,
        moderationStatus: 'approved' | 'rejected',
    ) {
        router.patch(
            `/admin/entreprises/offres/${offer.id}`,
            {
                moderation_status: moderationStatus,
                moderation_note: offerNotes[offer.id] || '',
            },
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title={t('admin.companyReview.title')} />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
                <header>
                    <Link
                        href="/admin/offres"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#6941C6] hover:underline"
                    >
                        <ArrowLeft size={16} />
                        {t('nav.admin_sources')}
                    </Link>
                    <div className="mt-4 flex items-start gap-3">
                        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-[#6941C6]">
                            <ClipboardCheck size={22} />
                        </span>
                        <div>
                            <p className="text-xs font-extrabold tracking-[0.15em] text-[#6941C6] uppercase">
                                Alternance Connect
                            </p>
                            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                                {t('admin.companyReview.title')}
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                                {t('admin.companyReview.description')}
                            </p>
                        </div>
                    </div>
                </header>
                {flash.status && (
                    <p
                        role="status"
                        className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"
                    >
                        {flash.status}
                    </p>
                )}
                {flash.error && (
                    <p
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
                    >
                        {flash.error}
                    </p>
                )}

                <section className="space-y-4">
                    <h2 className="text-xl font-extrabold text-slate-900">
                        {t('admin.companyReview.companies')}
                    </h2>
                    {companies.length ? (
                        companies.map((company) => (
                            <article
                                key={company.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-600">
                                        <Building2 size={18} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-extrabold text-slate-900">
                                            {company.name}{' '}
                                            <span className="text-xs font-semibold text-slate-500">
                                                · {company.verification_status}
                                            </span>
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {company.registration_number} ·{' '}
                                            {company.country_code} ·{' '}
                                            {company.city}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {company.owner_name} ·{' '}
                                            <a
                                                href={`mailto:${company.owner_email}`}
                                                className="text-[#6941C6] underline"
                                            >
                                                {company.owner_email}
                                            </a>{' '}
                                            · {t('company.field.email')}:{' '}
                                            {company.contact_email}
                                        </p>
                                        {company.website && (
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-1 inline-block text-sm text-[#6941C6] underline"
                                            >
                                                {company.website}
                                            </a>
                                        )}
                                        {company.verification_status !==
                                            'verified' && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        decideCompany(
                                                            company,
                                                            'verified',
                                                        )
                                                    }
                                                    className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white"
                                                >
                                                    {t(
                                                        'admin.companyReview.verify',
                                                    )}
                                                </button>
                                                <input
                                                    value={
                                                        companyNotes[
                                                            company.id
                                                        ] || ''
                                                    }
                                                    onChange={(event) =>
                                                        setCompanyNotes({
                                                            ...companyNotes,
                                                            [company.id]:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                    placeholder={t(
                                                        'admin.companyReview.reason',
                                                    )}
                                                    className="min-w-56 flex-1 rounded-lg border-slate-200 text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    disabled={
                                                        !companyNotes[
                                                            company.id
                                                        ]?.trim()
                                                    }
                                                    onClick={() =>
                                                        decideCompany(
                                                            company,
                                                            'rejected',
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-extrabold text-red-800 disabled:opacity-40"
                                                >
                                                    {t(
                                                        'admin.companyReview.reject',
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                            {t('admin.companyReview.emptyCompanies')}
                        </p>
                    )}
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-extrabold text-slate-900">
                        {t('admin.companyReview.offers')}
                    </h2>
                    {offers.length ? (
                        offers.map((offer) => (
                            <article
                                key={offer.id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-extrabold text-slate-900">
                                            {offer.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {offer.company} · {offer.city} ·{' '}
                                            {offer.country_code}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold ${offer.company_verified ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}
                                    >
                                        {offer.company_verified
                                            ? t('company.status.verified')
                                            : t(
                                                  'admin.companyReview.companyNeeded',
                                              )}
                                    </span>
                                </div>
                                {offer.description && (
                                    <p className="mt-3 text-sm leading-6 whitespace-pre-line text-slate-600">
                                        {offer.description}
                                    </p>
                                )}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        disabled={!offer.company_verified}
                                        onClick={() =>
                                            decideOffer(offer, 'approved')
                                        }
                                        className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white disabled:opacity-40"
                                    >
                                        {t('admin.companyReview.approveOffer')}
                                    </button>
                                    <input
                                        value={offerNotes[offer.id] || ''}
                                        onChange={(event) =>
                                            setOfferNotes({
                                                ...offerNotes,
                                                [offer.id]: event.target.value,
                                            })
                                        }
                                        placeholder={t(
                                            'admin.companyReview.reason',
                                        )}
                                        className="min-w-56 flex-1 rounded-lg border-slate-200 text-sm"
                                    />
                                    <button
                                        type="button"
                                        disabled={!offerNotes[offer.id]?.trim()}
                                        onClick={() =>
                                            decideOffer(offer, 'rejected')
                                        }
                                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-extrabold text-red-800 disabled:opacity-40"
                                    >
                                        {t('admin.companyReview.rejectOffer')}
                                    </button>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                            {t('admin.companyReview.emptyOffers')}
                        </p>
                    )}
                </section>
            </div>
        </>
    );
}
