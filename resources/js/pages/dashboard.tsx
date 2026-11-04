import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { ArrowRight, BriefcaseBusiness, CircleUserRound, Compass, Sparkles } from 'lucide-react';
import { dashboard } from '@/routes';
import { useLocale } from '@/i18n/locale';

export default function Dashboard() {
    const { auth } = usePage().props;
    const { t } = useLocale();
    const firstName = auth.user.name.trim().split(/\s+/)[0] || auth.user.name;

    setLayoutProps({
        breadcrumbs: [{ title: t('dashboard.title'), href: dashboard() }],
    });

    return (
        <>
            <Head title={t('dashboard.title')} />
            <div className="flex flex-1 flex-col gap-7 p-4 sm:p-6 lg:p-8">
                <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6941C6] to-[#3563EB] p-7 text-white shadow-lg shadow-violet-200/60 sm:p-9">
                    <div className="absolute -right-20 -top-28 size-80 rounded-full border border-white/15" />
                    <div className="absolute -right-8 -top-16 size-56 rounded-full border border-white/15" />
                    <div className="relative max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white/90">
                            <Sparkles size={14} /> {t('dashboard.title')}
                        </span>
                        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                            {t('dashboard.greeting', { name: firstName })}
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
                            {t('dashboard.intro')}
                        </p>
                        <a href="/offres" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#6941C6] transition hover:bg-violet-50">
                            {t('dashboard.browse')} <ArrowRight size={17} />
                        </a>
                    </div>
                </section>

                <section>
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#6941C6]">{t('dashboard.start.kicker')}</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{t('dashboard.start.title')}</h2>
                    </div>
                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                        <Link href="/settings/profile" className="group rounded-[22px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/70 sm:p-6">
                            <span className="grid size-12 place-items-center rounded-2xl bg-violet-50 text-[#6941C6]"><CircleUserRound size={23} /></span>
                            <h3 className="mt-4 text-lg font-extrabold text-slate-900">{t('dashboard.profile.title')}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500">{t('dashboard.profile.description')}</p>
                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#6941C6] group-hover:gap-3">{t('dashboard.profile.button')} <ArrowRight size={16} /></span>
                        </Link>
                        <a href="/offres" className="group rounded-[22px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/70 sm:p-6">
                            <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-[#3563EB]"><Compass size={23} /></span>
                            <h3 className="mt-4 text-lg font-extrabold text-slate-900">{t('dashboard.explore.title')}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500">{t('dashboard.explore.description')}</p>
                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#3563EB] group-hover:gap-3">{t('dashboard.explore.button')} <ArrowRight size={16} /></span>
                        </a>
                    </div>
                </section>

                <section className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-sm leading-6 text-blue-900">
                    <BriefcaseBusiness className="mt-0.5 shrink-0 text-blue-700" size={18} />
                    <p>{t('dashboard.notice')}</p>
                </section>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Mon espace',
            href: dashboard(),
        },
    ],
};
