import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { useLocale } from '@/i18n/locale';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useLocale();
    setLayoutProps({
        title: t('auth.verify.pageTitle'),
        description: t('auth.verify.layoutDescription'),
    });

    return (
        <>
            <Head title={t('auth.verify.pageTitle')} />

            <div className="mx-auto w-full max-w-lg rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-violet-50 text-[#6941C6]">
                    <MailCheck size={26} />
                </div>
                <h1 className="mt-5 text-center text-2xl font-black tracking-tight text-slate-900">
                    {t('auth.verify.title')}
                </h1>
                <p className="mt-3 text-center text-sm leading-6 text-slate-600">
                    {t('auth.verify.description')}
                </p>

                {status === 'verification-link-sent' && (
                    <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800">
                        {t('auth.verify.sent')}
                    </div>
                )}

                <Link href="/" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6941C6] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#5933B2]">
                    <ArrowLeft size={17} /> {t('auth.verify.continue')}
                </Link>

                <div className="mt-5 flex flex-col items-center gap-3 text-sm">
                    <Form {...send.form()}>
                        {({ processing }) => (
                            <Button type="submit" variant="ghost" disabled={processing} className="text-[#6941C6]">
                                {processing && <Spinner />}
                                {t('auth.verify.resend')}
                            </Button>
                        )}
                    </Form>
                    <Link href={logout()} className="font-semibold text-slate-500 hover:text-slate-800">
                        {t('auth.verify.logout')}
                    </Link>
                </div>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Confirmation e-mail',
    description: 'Quelques détails sur la confirmation de ton compte.',
};
