import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    GraduationCap,
    MapPin,
    Search,
    Sparkles,
    Users,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import { LanguageSwitcher, useLocale } from '@/i18n/locale';

type FeaturedOffer = {
    id: number;
    title: string;
    company: string | null;
    city: string | null;
    contract_types: string[];
    published_at: string | null;
    application_url: string | null;
    source: string;
};

function Brand() {
    const { t } = useLocale();

    return (
        <a href="#accueil" className="flex items-center gap-2.5" aria-label={t('home.brand.alt')}>
            <span className="grid size-10 place-items-center rounded-[14px] bg-gradient-to-br from-[#6941C6] to-[#3563EB] text-sm font-extrabold tracking-tight text-white shadow-md shadow-violet-200">
                AC
            </span>
            <span className="hidden text-[16px] font-extrabold tracking-[-0.04em] text-[#1E293B] min-[420px]:block">
                alternance<span className="text-[#6941C6]">connect</span>
            </span>
        </a>
    );
}

export default function Welcome({ featuredOffers, lastSyncedAt }: { featuredOffers: FeaturedOffer[]; lastSyncedAt: string | null }) {
    const { auth } = usePage().props;
    const { language, t } = useLocale();

    return (
        <>
            <Head title={t('home.title')} />
            <div id="accueil" className="min-h-screen bg-[#F7F8FE] text-[#1E293B]">
                <header className="sticky top-0 z-30 border-b border-[#E9EAF2] bg-white/95 backdrop-blur">
                    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
                        <Brand />
                        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex" aria-label="Navigation principale">
                            <a className="transition hover:text-[#6941C6]" href="/offres">{t('home.nav.offers')}</a>
                            <a className="transition hover:text-[#6941C6]" href="#comment-ca-marche">{t('home.nav.how')}</a>
                            <a className="transition hover:text-[#6941C6]" href="#partenaires">{t('home.nav.partners')}</a>
                        </nav>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <LanguageSwitcher className="px-2 sm:px-3" />
                            {auth.user ? (
                                <Link href={dashboard()} className="inline-flex items-center gap-2 rounded-xl bg-[#6941C6] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-[#5933B2]">
                                    {t('home.nav.space')} <ArrowUpRight size={16} />
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()} className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:inline-flex">{t('home.nav.login')}</Link>
                                    <Link href={register()} className="inline-flex items-center gap-2 rounded-xl bg-[#6941C6] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-[#5933B2]">
                                        {t('home.nav.register')} <ArrowUpRight size={16} />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    <section className="relative isolate overflow-hidden">
                        <div className="pointer-events-none absolute -right-40 -top-36 -z-10 size-[520px] rounded-full bg-violet-200/45 blur-3xl" />
                        <div className="pointer-events-none absolute -left-36 top-72 -z-10 size-[380px] rounded-full bg-blue-100/70 blur-3xl" />
                        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[1.04fr_.96fr] lg:gap-8 lg:pb-24 lg:pt-24">
                            <div className="max-w-2xl">
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#6941C6] shadow-sm">
                                    <Sparkles size={15} /> {t('home.hero.badge')}
                                </div>
                                <h1 className="max-w-[680px] text-[clamp(2.7rem,5.4vw,4.7rem)] font-black leading-[1.04] tracking-[-0.065em] text-[#172033]">
                                    {t('home.hero.titleStart')} <span className="bg-gradient-to-r from-[#6941C6] to-[#3563EB] bg-clip-text text-transparent">{t('home.hero.titleEnd')}</span>
                                </h1>
                                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                                    {t('home.hero.description')}
                                </p>

                                <form action="/offres" method="get" className="mt-9 rounded-[22px] border border-slate-200/80 bg-white p-2 shadow-[0_20px_55px_-30px_rgba(50,46,100,.35)] sm:flex sm:items-center">
                                    <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 sm:py-2">
                                        <Search className="shrink-0 text-[#6941C6]" size={20} />
                                        <span className="sr-only">{t('home.search.job')}</span>
                                        <input name="q" placeholder={t('home.search.job')} className="w-full border-0 bg-transparent p-0 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0" />
                                    </label>
                                    <div className="mx-3 hidden h-9 border-l border-slate-200 sm:block" />
                                    <label className="flex min-w-0 flex-1 items-center gap-3 border-t border-slate-100 px-3 py-3 sm:border-0 sm:py-2">
                                        <MapPin className="shrink-0 text-[#6941C6]" size={19} />
                                        <span className="sr-only">{t('home.search.city')}</span>
                                        <input name="city" placeholder={t('home.search.city')} className="w-full border-0 bg-transparent p-0 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0" />
                                    </label>
                                    <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-[15px] bg-[#6941C6] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#5933B2] sm:mt-0 sm:w-auto">
                                        {t('home.search.button')} <ArrowRight size={17} />
                                    </button>
                                </form>
                                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                                    <span className="font-bold text-slate-600">{t('home.popular')}</span>
                                    {['home.tag.marketing', 'home.tag.it', 'home.tag.hr'].map((tagKey) => (
                                        <a key={tagKey} href={`/offres?q=${encodeURIComponent(t(tagKey))}`} className="rounded-full bg-white px-3 py-1.5 transition hover:text-[#6941C6]">{t(tagKey)}</a>
                                    ))}
                                </div>
                            </div>

                            <div className="relative mx-auto w-full max-w-[530px] lg:ml-auto">
                                <div className="absolute -left-3 top-16 size-20 rounded-[26px] bg-gradient-to-br from-[#8B5CF6] to-[#3563EB] opacity-90 shadow-xl shadow-violet-200 sm:-left-8" />
                                <div className="absolute -right-3 bottom-12 size-16 rounded-full border-[10px] border-[#DBEAFE] sm:-right-6" />
                                <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#ece8ff] via-[#f5f2ff] to-[#dfe9ff] p-5 shadow-[0_35px_80px_-45px_rgba(58,51,136,.45)] sm:p-7">
                                    <div className="absolute -right-16 -top-20 size-72 rounded-full border border-white/70" />
                                    <div className="absolute -right-8 -top-12 size-56 rounded-full border border-white/70" />
                                    <div className="relative flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6941C6]">{t('home.preview.kicker')}</p>
                                            <p className="mt-1 text-sm font-extrabold text-[#1E293B]">{t('home.preview.title')}</p>
                                        </div>
                                        <span className="grid size-10 place-items-center rounded-2xl bg-white text-[#6941C6] shadow-sm"><Sparkles size={19} /></span>
                                    </div>
                                    <div className="relative mt-7 rounded-[26px] bg-white p-5 shadow-[0_18px_50px_-32px_rgba(32,25,79,.45)] sm:p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="grid size-14 shrink-0 place-items-center rounded-[18px] bg-gradient-to-br from-[#6941C6] to-[#3563EB] text-lg font-black text-white">AC</div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-400">{t('home.preview.card')}</p>
                                                <p className="mt-1 text-lg font-extrabold tracking-tight text-[#1E293B]">{t('home.preview.future')}</p>
                                            </div>
                                        </div>
                                        <div className="my-5 h-px bg-slate-100" />
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            {[
                                                { icon: Users, label: t('home.preview.talents') },
                                                { icon: Building2, label: t('home.preview.companies') },
                                                { icon: GraduationCap, label: t('home.preview.training') },
                                            ].map(({ icon: Icon, label }) => (
                                                <div key={label} className="rounded-2xl bg-[#F7F8FE] px-2 py-3">
                                                    <Icon className="mx-auto text-[#6941C6]" size={20} />
                                                    <p className="mt-2 text-[11px] font-bold text-slate-600">{label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative mt-4 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/65 px-4 py-3 backdrop-blur">
                                        <span className="grid size-9 place-items-center rounded-xl bg-blue-100 text-blue-700"><GraduationCap size={19} /></span>
                                        <p className="text-xs font-semibold leading-5 text-slate-600">{t('home.preview.caption')}</p>
                                        <ArrowUpRight className="ml-auto shrink-0 text-[#6941C6]" size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="comment-ca-marche" className="border-y border-slate-100 bg-white">
                        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-9 sm:grid-cols-3 sm:px-8 lg:py-11">
                            {[
                                { icon: GraduationCap, number: '1', title: t('home.step1.title'), text: t('home.step1.description'), kicker: t('home.step1.kicker') },
                                { icon: BriefcaseBusiness, number: '2', title: t('home.step2.title'), text: t('home.step2.description'), kicker: t('home.step2.kicker') },
                                { icon: Bookmark, number: '3', title: t('home.step3.title'), text: t('home.step3.description'), kicker: t('home.step3.kicker') },
                            ].map(({ icon: Icon, number, title, text, kicker }) => (
                                <article key={number} className="flex gap-4">
                                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F0ECFF] text-[#6941C6]"><Icon size={22} /></span>
                                    <div>
                                        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8B5CF6]">{kicker}</p>
                                        <h2 className="mt-1 font-extrabold text-[#1E293B]">{title}</h2>
                                        <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500">{text}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section id="offres" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                            <div>
                                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#6941C6]">{t('home.offers.kicker')}</p>
                                <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-[#1E293B] sm:text-4xl">{t('home.offers.title')}</h2>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{t('home.offers.description')}</p>
                            </div>
                            <Link href="/offres" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#6941C6] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#5933B2]">{t('home.offers.all')} <ArrowRight size={16} /></Link>
                        </div>

                        {lastSyncedAt && <p className="mt-5 text-xs text-slate-500">{t('offers.lastSynced')}: {new Date(lastSyncedAt).toLocaleString(language)}</p>}

                        {featuredOffers.length > 0 ? (
                            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {featuredOffers.map((offer) => (
                                    <article key={offer.id} className="group rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_-30px_rgba(30,41,59,.4)] transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_22px_45px_-32px_rgba(105,65,198,.45)] sm:p-6">
                                        <p className="text-xs font-semibold text-slate-500">{offer.company || t('offers.companyUnknown')}</p>
                                        <h3 className="mt-2 min-h-14 text-lg font-extrabold leading-6 tracking-tight text-[#1E293B]">{offer.title}</h3>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {offer.city && <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"><MapPin size={13} />{offer.city}</span>}
                                            {offer.contract_types.map((contract) => <span key={contract} className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">{contract}</span>)}
                                        </div>
                                        <p className="mt-4 text-xs text-slate-400">{offer.source}</p>
                                        {offer.application_url && <a href={offer.application_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#6941C6] transition group-hover:gap-3">{t('offers.apply')} <ArrowUpRight size={16} /></a>}
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-5 rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                                <Search className="mx-auto text-slate-300" size={30} />
                                <p className="mt-3 font-extrabold text-slate-700">{t('offers.empty.title')}</p>
                                <p className="mt-1 text-sm text-slate-500">{t('offers.empty.description')}</p>
                            </div>
                        )}
                    </section>

                    <section id="partenaires" className="px-5 pb-16 sm:px-8 sm:pb-20">
                        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
                            <article className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6941C6] to-[#4F46C8] p-7 text-white sm:p-10">
                                <div className="absolute -right-12 -top-20 size-64 rounded-full border border-white/15" />
                                <div className="relative max-w-lg">
                                    <Building2 size={26} className="text-violet-200" />
                                    <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-200">{t('home.recruiter.kicker')}</p>
                                    <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{t('home.recruiter.title')}</h2>
                                    <p className="mt-3 text-sm leading-6 text-violet-100">{t('home.recruiter.description')}</p>
                                    <Link href={auth.user ? dashboard() : register()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#6941C6] transition hover:bg-violet-50">{t(auth.user ? 'home.partners.space' : 'home.recruiter.button')} <ArrowRight size={16} /></Link>
                                </div>
                            </article>
                            <article className="rounded-[28px] border border-slate-200 bg-white p-7 sm:p-10">
                                <GraduationCap size={26} className="text-[#3563EB]" />
                                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#3563EB]">{t('home.training.kicker')}</p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1E293B] sm:text-3xl">{t('home.training.title')}</h2>
                                <p className="mt-3 text-sm leading-6 text-slate-500">{t('home.training.description')}</p>
                                <Link href={auth.user ? dashboard() : register()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#EEF2FF] px-4 py-3 text-sm font-extrabold text-[#3563EB] transition hover:bg-blue-100">{t(auth.user ? 'home.partners.space' : 'home.training.button')} <ArrowRight size={16} /></Link>
                            </article>
                        </div>
                    </section>

                    <section className="px-5 pb-16 sm:px-8 sm:pb-20">
                        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[30px] bg-[#172033] px-7 py-9 text-white sm:flex-row sm:items-center sm:px-10 sm:py-11">
                            <div className="max-w-2xl">
                                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-300">{t('home.footer.kicker')}</p>
                                <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{t('home.footer.title')}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-300">{t('home.footer.description')}</p>
                            </div>
                            <Link href={auth.user ? dashboard() : register()} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-[#6941C6] transition hover:bg-violet-50">{t(auth.user ? 'home.footer.space' : 'home.footer.create')} <ArrowRight size={17} /></Link>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <Brand />
                        <p>© {new Date().getFullYear()} Alternance Connect · {t('home.footer.kicker')}.</p>
                        <Link href={auth.user ? dashboard() : login()} className="font-bold text-[#6941C6] hover:underline">{t(auth.user ? 'home.footer.spaceLink' : 'home.footer.login')}</Link>
                    </div>
                </footer>
            </div>
        </>
    );
}
