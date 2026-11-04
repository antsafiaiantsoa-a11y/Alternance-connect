import { Link, usePage } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    Building2,
    ClipboardCheck,
    ClipboardList,
    LayoutDashboard,
    Map,
    Settings2,
    UserRound,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { useLocale } from '@/i18n/locale';

export function AppSidebar() {
    const { t } = useLocale();
    const { canManageOfferSources } = usePage().props;
    const mainNavItems: NavItem[] = [
        { title: t('nav.dashboard'), href: dashboard(), icon: LayoutDashboard },
        { title: t('nav.offers'), href: '/offres', icon: BriefcaseBusiness },
        { title: t('nav.profile'), href: '/settings/profile', icon: UserRound },
        { title: t('nav.company'), href: '/entreprise', icon: Building2 },
        {
            title: t('nav.applications'),
            href: '/mes-candidatures',
            icon: ClipboardList,
        },
    ];

    if (canManageOfferSources) {
        mainNavItems.push({
            title: t('nav.admin_sources'),
            href: '/admin/offres',
            icon: Settings2,
        });
        mainNavItems.push({
            title: t('nav.admin_countries'),
            href: '/admin/offres/pays',
            icon: Map,
        });
        mainNavItems.push({
            title: t('nav.admin_companies'),
            href: '/admin/entreprises',
            icon: ClipboardCheck,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
