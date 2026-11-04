import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';
import { useLocale } from '@/i18n/locale';

type Offer = {
    id: number;
    title: string;
    company: string | null;
    city: string | null;
    country_code: string | null;
};

export default function CreateApplication({
    offer,
    alreadyApplied,
}: {
    offer: Offer;
    alreadyApplied: boolean;
}) {
    const { t } = useLocale();

    return (
        <>
            <Head title={t('applications.apply.title')} />
            <div className="mx-auto w-full max-w-3xl space-y-5 p-4 sm:p-6 lg:p-8">
                <Link
                    href="/offres"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#6941C6] hover:underline"
                >
                    <ArrowLeft size={16} />
                    {t('nav.offers')}
                </Link>
                <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <p className="text-xs font-extrabold tracking-[0.15em] text-[#6941C6] uppercase">
                        {offer.company || 'Alternance Connect'}
                    </p>
                    <h1 className="mt-2 text-2xl font-black text-slate-900">
                        {offer.title}
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        {[offer.city, offer.country_code]
                            .filter(Boolean)
                            .join(' · ')}
                    </p>
                    <h2 className="mt-7 text-lg font-extrabold text-slate-900">
                        {t('applications.apply.title')}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {t('applications.apply.description')}
                    </p>
                    {alreadyApplied ? (
                        <p
                            role="status"
                            className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-900"
                        >
                            {t('applications.applied')}{' '}
                            <Link
                                className="underline"
                                href="/mes-candidatures"
                            >
                                {t('nav.applications')}
                            </Link>
                        </p>
                    ) : (
                        <form
                            action={`/offres/${offer.id}/postuler`}
                            method="post"
                            className="mt-5 space-y-4"
                        >
                            <label className="block space-y-1.5 text-sm font-semibold text-slate-700">
                                {t('applications.apply.letter')}
                                <textarea
                                    name="cover_letter"
                                    required
                                    minLength={20}
                                    maxLength={5000}
                                    rows={9}
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>
                            <label className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                                <input
                                    type="checkbox"
                                    name="privacy_notice_accepted"
                                    value="1"
                                    required
                                    className="mt-1 rounded border-slate-300"
                                />
                                {t('applications.privacy')}
                            </label>
                            <button className="inline-flex items-center gap-2 rounded-xl bg-[#6941C6] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#5933B2]">
                                <Send size={16} />
                                {t('applications.apply.submit')}
                            </button>
                        </form>
                    )}
                </section>
            </div>
        </>
    );
}
