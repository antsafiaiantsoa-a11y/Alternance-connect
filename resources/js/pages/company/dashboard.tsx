import { Head, router, usePage } from '@inertiajs/react';
import { Building2, BriefcaseBusiness } from 'lucide-react';
import { useLocale } from '@/i18n/locale';

type Country = {
    code: string;
    name_fr: string;
    name_en: string;
    name_de: string;
};
type Company = {
    id: number;
    name: string;
    registration_number: string;
    country_code: string;
    city: string;
    website: string | null;
    contact_email: string;
    verification_status: 'pending' | 'verified' | 'rejected';
    verification_note: string | null;
};
type Offer = {
    id: number;
    title: string;
    country_code: string | null;
    city: string | null;
    availability_status: string;
    moderation_status: string;
    applications_count: number;
    published_at: string | null;
};
type Application = {
    id: number;
    offer_title: string;
    applicant_name: string;
    applicant_email: string;
    cover_letter: string;
    status: string;
    created_at: string | null;
};

export default function CompanyDashboard({
    company,
    countries,
    offers,
    applications,
}: {
    company: Company | null;
    countries: Country[];
    offers: Offer[];
    applications: Application[];
}) {
    const { language, t } = useLocale();
    const { flash, errors } = usePage<{
        flash: { status?: string | null; error?: string | null };
        errors: Record<string, string>;
    }>().props;
    const countryName = (country: Country) =>
        country[`name_${language}` as 'name_fr' | 'name_en' | 'name_de'];

    return (
        <>
            <Head title={t('company.title')} />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
                <header className="flex items-start gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-[#6941C6]">
                        <Building2 size={22} />
                    </span>
                    <div>
                        <p className="text-xs font-extrabold tracking-[0.15em] text-[#6941C6] uppercase">
                            Alternance Connect
                        </p>
                        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                            {t('company.title')}
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                            {t('company.description')}
                        </p>
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
                {Object.keys(errors).length > 0 && (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        <p className="font-extrabold">{t('common.formErrors')}</p>
                        <ul className="mt-2 list-inside list-disc">{Object.values(errors).map((error) => <li key={error}>{error}</li>)}</ul>
                    </div>
                )}

                {!company || company.verification_status === 'rejected' ? (
                    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        {company?.verification_note && (
                            <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                                {t('company.status.note', { note: company.verification_note })}
                            </p>
                        )}
                        <h2 className="text-xl font-extrabold text-slate-900">
                            {t('company.profile.title')}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t('company.profile.description')}
                        </p>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                router.post('/entreprise', new FormData(event.currentTarget), { preserveScroll: true });
                            }}
                            className="mt-5 grid gap-4 sm:grid-cols-2"
                        >
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('company.field.name')}
                                <input
                                    name="name"
                                    required
                                    maxLength={160}
                                    defaultValue={company?.name ?? ''}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('company.field.registration')}
                                <input
                                    name="registration_number"
                                    required
                                    maxLength={120}
                                    defaultValue={company?.registration_number ?? ''}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('company.field.country')}
                                <select
                                    name="country_code"
                                    required
                                    defaultValue={company?.country_code ?? ''}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                >
                                    <option value="" />
                                    {countries.map((country) => (
                                        <option
                                            key={country.code}
                                            value={country.code}
                                        >
                                            {countryName(country)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('company.field.city')}
                                <input
                                    name="city"
                                    required
                                    maxLength={120}
                                    defaultValue={company?.city ?? ''}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('company.field.website')}
                                <input
                                    type="url"
                                    name="website"
                                    defaultValue={company?.website ?? ''}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('company.field.email')}
                                <input
                                    type="email"
                                    name="contact_email"
                                    required
                                    maxLength={255}
                                    defaultValue={company?.contact_email ?? ''}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="flex items-start gap-2 text-xs leading-5 text-slate-600 sm:col-span-2">
                                <input
                                    type="checkbox"
                                    name="privacy_notice_accepted"
                                    value="1"
                                    required
                                    className="mt-1 rounded border-slate-300"
                                />
                                {t('company.privacy')}
                            </label>
                            <div className="sm:col-span-2">
                                <button className="rounded-xl bg-[#6941C6] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#5933B2]">
                                    {t('company.profile.submit')}
                                </button>
                            </div>
                        </form>
                    </section>
                ) : (
                    <>
                        <section
                            className={`rounded-2xl border p-5 ${company.verification_status === 'verified' ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : company.verification_status === 'rejected' ? 'border-red-200 bg-red-50 text-red-950' : 'border-amber-200 bg-amber-50 text-amber-950'}`}
                        >
                            <h2 className="font-extrabold">
                                {company.name} ·{' '}
                                {t(
                                    `company.status.${company.verification_status}`,
                                )}
                            </h2>
                            <p className="mt-2 text-sm leading-6">
                                {t(
                                    company.verification_status === 'verified'
                                        ? 'company.notice.verified'
                                        : 'company.notice.pending',
                                )}
                            </p>
                            {company.verification_note && (
                                <p className="mt-2 text-sm font-semibold">
                                    {t('company.status.note', {
                                        note: company.verification_note,
                                    })}
                                </p>
                            )}
                        </section>

                        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
                                <BriefcaseBusiness size={20} />
                                {t('company.offers.title')}
                            </h2>
                            {company.verification_status === 'verified' && (
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        router.post('/entreprise/offres', new FormData(event.currentTarget), { preserveScroll: true });
                                    }}
                                    className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2 sm:p-5"
                                >
                                    <h3 className="font-extrabold text-slate-900 sm:col-span-2">
                                        {t('company.offer.form')}
                                    </h3>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('company.offer.title')}
                                        <input
                                            name="title"
                                            required
                                            maxLength={180}
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('company.offer.sector')}
                                        <input
                                            name="sector"
                                            required
                                            maxLength={120}
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('company.field.country')}
                                        <select
                                            name="country_code"
                                            required
                                            defaultValue={company.country_code}
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        >
                                            {countries.map((country) => (
                                                <option
                                                    key={country.code}
                                                    value={country.code}
                                                >
                                                    {countryName(country)}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('company.field.city')}
                                        <input
                                            name="city"
                                            required
                                            maxLength={120}
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('offers.region')}
                                        <input
                                            name="region"
                                            maxLength={120}
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('offers.education')}
                                        <input
                                            name="education_level"
                                            maxLength={120}
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('company.offer.training')}
                                        <input
                                            name="training_name"
                                            maxLength={180}
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('company.offer.contract')}
                                        <select
                                            name="contract_type"
                                            required
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        >
                                            <option value="apprenticeship">
                                                {t(
                                                    'company.offer.contract.apprenticeship',
                                                )}
                                            </option>
                                            <option value="professionalization">
                                                {t(
                                                    'company.offer.contract.professionalization',
                                                )}
                                            </option>
                                            <option value="dual_training">
                                                {t(
                                                    'company.offer.contract.dual',
                                                )}
                                            </option>
                                        </select>
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('company.offer.salaryMin')}
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            name="salary_min"
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('company.offer.salaryMax')}
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            name="salary_max"
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('company.offer.currency')}
                                        <input
                                            name="currency"
                                            maxLength={3}
                                            placeholder="EUR"
                                            className="w-full rounded-xl border-slate-200 text-sm uppercase"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                        {t('company.offer.duration')}
                                        <input
                                            type="number"
                                            min="1"
                                            max="60"
                                            name="duration_months"
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700 sm:col-span-2">
                                        {t('company.offer.languages')}
                                        <input
                                            name="languages"
                                            maxLength={500}
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-sm font-semibold text-slate-700 sm:col-span-2">
                                        {t('company.offer.description')}
                                        <textarea
                                            name="description"
                                            required
                                            minLength={40}
                                            maxLength={20000}
                                            rows={5}
                                            className="w-full rounded-xl border-slate-200 text-sm"
                                        />
                                    </label>
                                    <div className="sm:col-span-2">
                                        <button className="rounded-xl bg-[#6941C6] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#5933B2]">
                                            {t('company.offer.submit')}
                                        </button>
                                    </div>
                                </form>
                            )}
                            <div className="mt-5 space-y-3">
                                {offers.length ? (
                                    offers.map((offer) => (
                                        <article
                                            key={offer.id}
                                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
                                        >
                                            <div>
                                                <h3 className="font-extrabold text-slate-900">
                                                    {offer.title}
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {offer.city}
                                                    {offer.country_code
                                                        ? ` · ${offer.country_code}`
                                                        : ''}{' '}
                                                    ·{' '}
                                                    {t(
                                                        `company.offer.state.${offer.moderation_status === 'approved' ? (offer.availability_status === 'unavailable' ? 'unavailable' : 'approved') : offer.moderation_status}`,
                                                    )}{' '}
                                                    · {offer.applications_count}
                                                </p>
                                            </div>
                                            {offer.availability_status ===
                                                'active' && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.delete(
                                                            `/entreprise/offres/${offer.id}`,
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
                                                >
                                                    {t('company.offer.disable')}
                                                </button>
                                            )}
                                        </article>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">—</p>
                                )}
                            </div>
                        </section>

                        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="text-xl font-extrabold text-slate-900">
                                {t('company.applications.title')}
                            </h2>
                            <p className="mt-2 text-xs text-slate-500">
                                {t('company.application.privacy')}
                            </p>
                            <div className="mt-4 space-y-4">
                                {applications.length ? (
                                    applications.map((application) => (
                                        <article
                                            key={application.id}
                                            className="rounded-xl border border-slate-200 p-4"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-extrabold text-slate-900">
                                                        {
                                                            application.applicant_name
                                                        }{' '}
                                                        ·{' '}
                                                        {
                                                            application.offer_title
                                                        }
                                                    </h3>
                                                    <a
                                                        className="mt-1 block text-sm text-[#6941C6] underline"
                                                        href={`mailto:${application.applicant_email}`}
                                                    >
                                                        {
                                                            application.applicant_email
                                                        }
                                                    </a>
                                                </div>
                                                <select
                                                    aria-label={t(
                                                        'company.application.update',
                                                    )}
                                                    value={application.status}
                                                    onChange={(event) =>
                                                        router.patch(
                                                            `/entreprise/candidatures/${application.id}`,
                                                            {
                                                                status: event
                                                                    .target
                                                                    .value,
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                    className="rounded-lg border-slate-200 text-sm"
                                                >
                                                    <option value="received">
                                                        {t(
                                                            'company.application.status.received',
                                                        )}
                                                    </option>
                                                    <option value="reviewing">
                                                        {t(
                                                            'company.application.status.reviewing',
                                                        )}
                                                    </option>
                                                    <option value="interview">
                                                        {t(
                                                            'company.application.status.interview',
                                                        )}
                                                    </option>
                                                    <option value="accepted">
                                                        {t(
                                                            'company.application.status.accepted',
                                                        )}
                                                    </option>
                                                    <option value="rejected">
                                                        {t(
                                                            'company.application.status.rejected',
                                                        )}
                                                    </option>
                                                </select>
                                            </div>
                                            <p className="mt-3 text-sm leading-6 whitespace-pre-line text-slate-700">
                                                {application.cover_letter}
                                            </p>
                                        </article>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">—</p>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </>
    );
}
