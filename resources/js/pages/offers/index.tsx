import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, BriefcaseBusiness, MapPin, Search } from 'lucide-react';
import { useLocale } from '@/i18n/locale';

type Offer = {
    id: number;
    title: string;
    company: string | null;
    description: string | null;
    contract_types: string[];
    city: string | null;
    country_code: string | null;
    sector: string | null;
    training_name: string | null;
    salary_min: number | string | null;
    salary_max: number | string | null;
    currency: string | null;
    duration_months: number | null;
    required_languages: string[];
    postal_code: string | null;
    region: string | null;
    rome_codes: string[];
    education_level: string | null;
    salary: string | null;
    published_at: string | null;
    starts_at: string | null;
    expires_at: string | null;
    original_url: string | null;
    application_url: string | null;
    source_provider: string;
    source: string;
    source_label: string;
    source_provider: string;
    remote_mode: string | null;
};

type PageLink = { url: string | null; label: string; active: boolean };
type PaginatedOffers = {
    data: Offer[];
    links: PageLink[];
    total: number;
    current_page: number;
    last_page: number;
};
type SourceOption = { value: string; label: string };
type CountryOption = {
    code: string;
    name_fr: string;
    name_en: string;
    name_de: string;
};

type Props = {
    offers: PaginatedOffers;
    hasImportedOffers: boolean;
    filters: Record<string, string>;
    sourceOptions: SourceOption[];
    countries: CountryOption[];
    lastSyncedAt: string | null;
};

export default function OffersIndex({
    offers,
    hasImportedOffers,
    filters,
    sourceOptions,
    countries,
    lastSyncedAt,
}: Props) {
    const { language, t } = useLocale();
    const locale =
        language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'en-GB';
    const hasActiveFilters = Object.values(filters).some(Boolean);
    const countryName = (code: string) => {
        const country = countries.find((option) => option.code === code);
        return country
            ? country[`name_${language}` as 'name_fr' | 'name_en' | 'name_de']
            : code;
    };
    const formatSalary = (offer: Offer) => {
        if (offer.salary) return offer.salary;
        if (
            !offer.currency ||
            (offer.salary_min == null && offer.salary_max == null)
        )
            return null;
        try {
            const formatter = new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: offer.currency,
                maximumFractionDigits: 0,
            });
            if (offer.salary_min != null && offer.salary_max != null) {
                return `${formatter.format(Number(offer.salary_min))} – ${formatter.format(Number(offer.salary_max))}`;
            }
            return offer.salary_min != null
                ? `${formatter.format(Number(offer.salary_min))}+`
                : `≤ ${formatter.format(Number(offer.salary_max))}`;
        } catch {
            return null;
        }
    };

    return (
        <>
            <Head title={t('offers.title')} />
            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
                <header className="flex flex-wrap items-start justify-between gap-4 rounded-[26px] bg-gradient-to-br from-[#6941C6] to-[#3563EB] p-6 text-white sm:p-8">
                    <div>
                        <p className="text-xs font-extrabold tracking-[0.15em] text-violet-200 uppercase">
                            {t('offers.kicker')}
                        </p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                            {t('offers.title')}
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
                            {t('offers.description')}
                        </p>
                    </div>
                    {hasImportedOffers && hasActiveFilters && (
                        <Link
                            href="/offres"
                            className="rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#5933B2] shadow-sm hover:bg-violet-50"
                        >
                            {t('offers.showAll')}
                        </Link>
                    )}
                </header>

                {hasImportedOffers ? (
                    <>
                        <form
                            action="/offres"
                            method="get"
                            className="grid gap-4 rounded-[24px] border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.search')}
                                <input
                                    name="q"
                                    defaultValue={filters.q}
                                    placeholder={t('offers.searchPlaceholder')}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.country')}
                                <select
                                    name="country"
                                    defaultValue={filters.country}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                >
                                    <option value="">{t('offers.all')}</option>
                                    {countries.map((country) => (
                                        <option
                                            key={country.code}
                                            value={country.code}
                                        >
                                            {
                                                country[
                                                    `name_${language}` as
                                                        | 'name_fr'
                                                        | 'name_en'
                                                        | 'name_de'
                                                ]
                                            }
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.city')}
                                <input
                                    name="city"
                                    defaultValue={filters.city}
                                    placeholder={t('home.search.city')}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.region')}
                                <input
                                    name="region"
                                    defaultValue={filters.region}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.sector')}
                                <input
                                    name="sector"
                                    defaultValue={filters.sector}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.language')}
                                <input
                                    name="language"
                                    defaultValue={filters.language}
                                    placeholder="Deutsch"
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.salaryFrom')}
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="salary_from"
                                    defaultValue={filters.salary_from}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.salaryTo')}
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="salary_to"
                                    defaultValue={filters.salary_to}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.currency')}
                                <input
                                    name="currency"
                                    maxLength={3}
                                    defaultValue={filters.currency}
                                    placeholder="EUR"
                                    className="w-full rounded-xl border-slate-200 text-sm uppercase"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.contract')}
                                <select
                                    name="contract"
                                    defaultValue={filters.contract}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                >
                                    <option value="">{t('offers.all')}</option>
                                    <option value="apprenticeship">
                                        {t('offers.apprenticeship')}
                                    </option>
                                    <option value="professionalization">
                                        {t('offers.professionalization')}
                                    </option>
                                    <option value="dual_training">
                                        {t('offers.dualTraining')}
                                    </option>
                                </select>
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.education')}
                                <input
                                    name="education"
                                    defaultValue={filters.education}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.source')}
                                <select
                                    name="source"
                                    defaultValue={filters.source}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                >
                                    <option value="">{t('offers.all')}</option>
                                    {sourceOptions.map((source) => (
                                        <option
                                            key={source.value}
                                            value={source.value}
                                        >
                                            {source.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.rome')}
                                <input
                                    name="rome"
                                    defaultValue={filters.rome}
                                    placeholder="M1805"
                                    pattern="[A-Za-z][0-9]{4}"
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('offers.publishedAfter')}
                                <input
                                    type="date"
                                    name="published_after"
                                    defaultValue={filters.published_after}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
                                <button className="inline-flex items-center gap-2 rounded-xl bg-[#6941C6] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#5933B2]">
                                    <Search size={16} />
                                    {t('offers.filter')}
                                </button>
                                <Link
                                    href="/offres"
                                    className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100"
                                >
                                    {t('offers.reset')}
                                </Link>
                            </div>
                        </form>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
                            <p>
                                {t('offers.resultCount', {
                                    count: offers.total,
                                })}
                            </p>
                            <p>
                                {lastSyncedAt
                                    ? `${t('offers.lastSynced')}: ${new Date(lastSyncedAt).toLocaleString(locale)}`
                                    : t('offers.notSynced')}
                            </p>
                        </div>

                        {offers.data.length ? (
                            <div className="grid gap-4 lg:grid-cols-2">
                                {offers.data.map((offer) => (
                                    <article
                                        key={offer.id}
                                        className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-violet-50 text-[#6941C6]">
                                                <BriefcaseBusiness size={20} />
                                            </span>
                                            <div className="min-w-0">
                                                <h2 className="text-lg leading-6 font-extrabold text-slate-900">
                                                    {offer.title}
                                                </h2>
                                                <p className="mt-1 text-sm font-semibold text-slate-600">
                                                    {offer.company ||
                                                        t(
                                                            'offers.companyUnknown',
                                                        )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                                            {offer.city && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1.5">
                                                    <MapPin size={13} />
                                                    {offer.city}
                                                    {offer.postal_code
                                                        ? ` (${offer.postal_code})`
                                                        : ''}
                                                </span>
                                            )}
                                            {offer.country_code && (
                                                <span className="rounded-full bg-slate-50 px-3 py-1.5">
                                                    {countryName(
                                                        offer.country_code,
                                                    )}
                                                </span>
                                            )}
                                            {offer.region && (
                                                <span className="rounded-full bg-slate-50 px-3 py-1.5">
                                                    {offer.region}
                                                </span>
                                            )}
                                            {offer.contract_types.map(
                                                (contract) => (
                                                    <span
                                                        key={contract}
                                                        className="rounded-full bg-violet-50 px-3 py-1.5 text-violet-800"
                                                    >
                                                        {contract ===
                                                            'apprenticeship' ||
                                                        contract ===
                                                            'Apprentissage'
                                                            ? t(
                                                                  'offers.apprenticeship',
                                                              )
                                                            : contract ===
                                                                    'professionalization' ||
                                                                contract ===
                                                                    'Professionnalisation'
                                                              ? t(
                                                                    'offers.professionalization',
                                                                )
                                                              : contract ===
                                                                  'dual_training'
                                                                ? t(
                                                                      'offers.dualTraining',
                                                                  )
                                                                : contract}
                                                    </span>
                                                ),
                                            )}
                                            {offer.sector && (
                                                <span className="rounded-full bg-slate-50 px-3 py-1.5">
                                                    {offer.sector}
                                                </span>
                                            )}
                                            {offer.training_name && (
                                                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-800">
                                                    {offer.training_name}
                                                </span>
                                            )}
                                            {offer.duration_months && (
                                                <span className="rounded-full bg-slate-50 px-3 py-1.5">
                                                    {t(
                                                        'company.offer.duration',
                                                    )}
                                                    : {offer.duration_months}
                                                </span>
                                            )}
                                            {offer.required_languages.map(
                                                (requiredLanguage) => (
                                                    <span
                                                        key={requiredLanguage}
                                                        className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-900"
                                                    >
                                                        {requiredLanguage}
                                                    </span>
                                                ),
                                            )}
                                            {offer.education_level && (
                                                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-800">
                                                    {offer.education_level}
                                                </span>
                                            )}
                                            {formatSalary(offer) && (
                                                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800">
                                                    {formatSalary(offer)}
                                                </span>
                                            )}
                                        </div>
                                        {offer.description && (
                                            <p className="mt-4 line-clamp-4 text-sm leading-6 whitespace-pre-line text-slate-600">
                                                {offer.description}
                                            </p>
                                        )}
                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                            <div className="text-xs leading-5 text-slate-500">
                                                <p>
                                                    {t('offers.source')}:{' '}
                                                    <span className="font-bold">
                                                        {offer.source}
                                                    </span>
                                                </p>
                                                {offer.published_at && (
                                                    <p>
                                                        {t('offers.published')}:{' '}
                                                        {new Date(
                                                            offer.published_at,
                                                        ).toLocaleDateString(
                                                            locale,
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                            {offer.source_provider ===
                                            'company' ? (
                                                <Link
                                                    href={`/offres/${offer.id}/postuler`}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-[#6941C6] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#5933B2]"
                                                >
                                                    {t(
                                                        'offers.applyOnPlatform',
                                                    )}
                                                    <ArrowUpRight size={15} />
                                                </Link>
                                            ) : offer.application_url ||
                                              offer.original_url ? (
                                                <a
                                                    href={
                                                        offer.application_url ||
                                                        offer.original_url ||
                                                        undefined
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-xl bg-[#6941C6] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#5933B2]"
                                                >
                                                    {offer.application_url
                                                        ? t('offers.apply')
                                                        : t(
                                                              'offers.viewAndApply',
                                                          )}{' '}
                                                    <ArrowUpRight size={15} />
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400">
                                                    {t(
                                                        'offers.applicationMissing',
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                                <Search
                                    className="mx-auto text-slate-300"
                                    size={30}
                                />
                                <h2 className="mt-3 font-extrabold text-slate-800">
                                    {t('offers.empty.title')}
                                </h2>
                                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                                    {t('offers.empty.description')}
                                </p>
                                {hasActiveFilters && (
                                    <Link
                                        href="/offres"
                                        className="mt-5 inline-flex rounded-xl bg-[#6941C6] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#5933B2]"
                                    >
                                        {t('offers.showAll')}
                                    </Link>
                                )}
                            </div>
                        )}

                        {offers.last_page > 1 && (
                            <nav
                                aria-label={t('offers.pagination')}
                                className="flex flex-wrap justify-center gap-2"
                            >
                                {offers.links.map((link, index) => {
                                    const label =
                                        index === 0
                                            ? t('offers.previous')
                                            : index === offers.links.length - 1
                                              ? t('offers.next')
                                              : link.label;
                                    return link.url ? (
                                        <Link
                                            key={`${link.label}-${index}`}
                                            href={link.url}
                                            preserveScroll
                                            className={`rounded-lg px-3 py-2 text-sm font-bold ${link.active ? 'bg-[#6941C6] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                                        >
                                            {label}
                                        </Link>
                                    ) : (
                                        <span
                                            key={`${link.label}-${index}`}
                                            className="rounded-lg px-3 py-2 text-sm text-slate-300"
                                        >
                                            {label}
                                        </span>
                                    );
                                })}
                            </nav>
                        )}
                    </>
                ) : (
                    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900">
                                    {t('offers.officialWidgetTitle')}
                                </h2>
                                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                                    {t('offers.officialWidgetDescription')}
                                </p>
                            </div>
                            <a
                                href="https://labonnealternance.apprentissage.beta.gouv.fr/"
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 text-sm font-bold text-[#6941C6] underline"
                            >
                                {t('offers.officialSite')}
                            </a>
                        </div>
                        <iframe
                            title={t('offers.officialWidgetTitle')}
                            src="https://labonnealternance.apprentissage.beta.gouv.fr/recherche-emploi?scope=all&caller=Alternance%20Connect"
                            loading="eager"
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="block h-[1050px] w-full border-0 bg-white"
                        />
                    </section>
                )}
            </div>
        </>
    );
}
