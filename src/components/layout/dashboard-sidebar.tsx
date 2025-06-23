
// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, ClipboardList, BarChart3, MessageSquare, User, Settings, 
  Users as UsersIconLucide, BookOpenCheck, Briefcase, 
  Euro, FileBarChart, ListChecks, FilePlus, BarChartHorizontal, 
  FileText, FileEdit, MessagesSquare as MessagesSquareIcon, Shuffle, Clock, 
  HelpCircle, CreditCard, TrendingUp,
  Link2, UserCheck, ShieldCheck as ShieldCheckIcon, Package, HeartHandshake, PlayCircle, MessageCircleQuestion, BookHeart, BookUser, GitBranch, Bot, Zap, ChevronRight, Wrench, Contact, CalendarDays, CalendarPlus, CalendarClock, GraduationCap
} from 'lucide-react'; 
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useState, useEffect, Fragment, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useDashboardRole, type UserRoleType } from '@/contexts/DashboardRoleContext'; 
import { Skeleton } from "@/components/ui/skeleton";

const ONBOARDING_KEY_OUDER = 'onboardingCompleted_ouder_v1';
const ONBOARDING_KEY_LEERLING = 'onboardingCompleted_leerling_v1';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  tutorOnly?: boolean;
  coachOnly?: boolean; 
  leerlingOnly?: boolean;
  ouderOnly?: boolean;
  sectionTitle?: string;
  children?: NavItem[];
  parent?: string; // Used to identify parent for active state
  isOuderOnboardingLink?: boolean; 
}

const navItems: NavItem[] = [
  // Leerling Items
  { href: '/dashboard/leerling/welcome', label: 'Welkom!', icon: PlayCircle, leerlingOnly: true, sectionTitle: "Leerling Portaal" },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, leerlingOnly: true, sectionTitle: "Leerling Portaal" },
  { href: '/dashboard/leerling/quizzes', label: 'Zelfreflectie Tools', icon: ClipboardList, leerlingOnly: true },
  { href: '/dashboard/results', label: 'Mijn Resultaten', icon: BarChart3, leerlingOnly: true },
  {
    href: '#coaching-tools-parent',
    label: 'Coaching & Tools',
    icon: Zap,
    leerlingOnly: true,
    children: [
      { href: '/dashboard/coaching', label: 'Dagelijkse Coaching', icon: MessageSquare, parent: '#coaching-tools-parent' },
      { href: '/dashboard/tools', label: 'Alle Tools', icon: Wrench, parent: '#coaching-tools-parent' },
      { href: '/dashboard/coaching/settings', label: 'Instellingen', icon: Settings, parent: '#coaching-tools-parent' },
    ]
  },
  {
    href: '/dashboard/leerling/lessons', 
    label: 'Mijn Lessen',
    icon: BookOpenCheck, 
    leerlingOnly: true,
  },
  { href: '/dashboard/community', label: 'Community Forum', icon: MessagesSquareIcon, leerlingOnly: true },
  
  // Ouder Items
  { href: '/dashboard/ouder/welcome', label: 'Start Ouder Onboarding', icon: PlayCircle, ouderOnly: true, isOuderOnboardingLink: true, sectionTitle: "OUDER PORTAAL" }, 
  { href: '/dashboard/ouder', label: 'Ouder Dashboard', icon: LayoutDashboard, ouderOnly: true, sectionTitle: "OUDER PORTAAL" },
  { href: '/dashboard/ouder/kinderen', label: 'Mijn Kinderen', icon: UsersIconLucide, ouderOnly: true },
  { 
    href: '#ouder-lessen-parent', 
    label: 'Lessen Kinderen', 
    icon: BookOpenCheck, 
    ouderOnly: true, 
    children: [
        { href: '/dashboard/ouder/lessen/plannen', label: 'Les Plannen', icon: CalendarPlus, parent: '#ouder-lessen-parent' },
        { href: '/dashboard/ouder/lessen/aankomend', label: 'Aankomende Lessen', icon: CalendarClock, parent: '#ouder-lessen-parent' },
        { href: '/dashboard/ouder/lessen/overzicht', label: 'Lessen Overzicht', icon: CalendarDays, parent: '#ouder-lessen-parent' },
    ]
  },
  { href: '/dashboard/ouder/zoek-professional', label: 'Zoek Begeleiding', icon: Link2, ouderOnly: true },
  { href: '/dashboard/ouder/gekoppelde-professionals', label: 'Mijn Begeleiders', icon: UserCheck, ouderOnly: true },
  { href: '/dashboard/ouder/abonnementen', label: 'Abonnementen', icon: Euro, ouderOnly: true },
  { href: '/dashboard/ouder/facturatie', label: 'Facturatie', icon: CreditCard, ouderOnly: true },
  { href: '/dashboard/ouder/berichten', label: 'Berichten', icon: MessagesSquareIcon, ouderOnly: true },
  { href: '/dashboard/ouder/privacy-instellingen', label: 'Privacy & Delen', icon: ShieldCheckIcon, ouderOnly: true },
  { href: '/dashboard/ouder/faq', label: 'FAQ Ouders', icon: HelpCircle, ouderOnly: true },

  // Tutor specific section
  { href: '/dashboard/tutor', label: 'Tutor Dashboard', icon: LayoutDashboard, tutorOnly: true, sectionTitle: "TUTOR PORTAAL" },
  { href: '/dashboard/tutor/availability', label: 'Mijn Beschikbaarheid', icon: Clock, tutorOnly: true },
  { href: '/dashboard/tutor/lessons', label: 'Alle Lessen (Tutor)', icon: BookOpenCheck, tutorOnly: true },
  { href: '/dashboard/tutor/students', label: 'Mijn Leerlingen', icon: UsersIconLucide, tutorOnly: true },

  // Coach specific section
  { href: '/dashboard/coach', label: 'Coach Dashboard', icon: LayoutDashboard, coachOnly: true, sectionTitle: "COACH PORTAAL" },
  { href: '/dashboard/coach/availability', label: 'Mijn Beschikbaarheid (Coach)', icon: Clock, coachOnly: true },
  { href: '/dashboard/coach/lessons', label: 'Mijn Sessies', icon: BookOpenCheck, coachOnly: true },
  { href: '/dashboard/coach/students', label: 'Mijn Cliënten', icon: HeartHandshake, coachOnly: true },

  // Admin specific section
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true, sectionTitle: "ADMIN DASHBOARD" },
  {
    href: '#user-management-parent',
    label: 'Gebruikersbeheer',
    icon: UsersIconLucide,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/user-management', label: 'Alle Gebruikers', icon: UsersIconLucide, parent: '#user-management-parent' },
      { href: '/dashboard/admin/student-management', label: 'Leerlingen', icon: GraduationCap, parent: '#user-management-parent' },
      { href: '/dashboard/admin/tutor-management', label: 'Tutoren', icon: Briefcase, parent: '#user-management-parent' },
    ]
  },
  {
    href: '#quiz-management-parent',
    label: 'Quizbeheer',
    icon: ListChecks,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/quiz-management', label: 'Alle Quizzes', icon: ListChecks, parent: '#quiz-management-parent' },
      { href: '/dashboard/admin/quiz-management/create', label: 'Nieuwe Quiz', icon: FilePlus, parent: '#quiz-management-parent' },
      { href: '/dashboard/admin/quiz-management/reports', label: 'Rapportages', icon: BarChartHorizontal, parent: '#quiz-management-parent' },
    ]
  },
  {
    href: '#insights-parent',
    label: 'Inzichten',
    icon: TrendingUp,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/reporting', label: 'Platform Rapportages', icon: FileBarChart, parent: '#insights-parent' },
      { href: '/dashboard/admin/feedback-overview', label: 'Feedback Overzicht', icon: MessageCircleQuestion, parent: '#insights-parent' },
    ]
  },
  {
    href: '#finance-parent',
    label: 'Financieel Beheer',
    icon: Euro,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/subscription-management', label: 'Abonnementen', icon: CreditCard, parent: '#finance-parent' },
      { href: '/dashboard/admin/finance', label: 'Betalingen', icon: Euro, parent: '#finance-parent' },
    ]
  },
  {
    href: '#platform-parent',
    label: 'Platformbeheer',
    icon: Settings,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/feature-management', label: 'Functionaliteiten', icon: Package, parent: '#platform-parent' },
      { href: '/dashboard/admin/tool-recommendation-logic', label: 'Tool Aanbevelingen', icon: GitBranch, parent: '#platform-parent' },
      { href: '/dashboard/admin/content-management', label: 'Content', icon: FileEdit, parent: '#platform-parent' },
      { href: '/dashboard/admin/settings', label: 'Instellingen', icon: Settings, parent: '#platform-parent' },
    ]
  },
  {
    href: '#documentation-parent',
    label: 'Documentatie',
    icon: BookHeart,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/documentation', label: 'Overzicht', icon: BookHeart, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/platform-guide', label: 'Platform Handleiding', icon: BookUser, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/data-flow', label: 'Data & Inzichten Flow', icon: GitBranch, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/customer-journey', label: 'Customer Journey', icon: UsersIconLucide, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/ai-persona', label: 'AI Persona', icon: Bot, parent: '#documentation-parent' },
    ]
  },
  
  { href: '/dashboard/profile', label: 'Profiel', icon: User }, 
];

function SidebarNavigationContent() {
  const pathname = usePathname();
  const { currentDashboardRole, setCurrentDashboardRole } = useDashboardRole(); 
  const { state: sidebarState } = useSidebar();
  
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true); 
  const [hasBillingAction, setHasBillingAction] = useState(true); 
  const [showCommunityNavItemForLeerling, setShowCommunityNavItemForLeerling] = useState(true);
  const [isOuderOnboardingPending, setIsOuderOnboardingPending] = useState(true); 
  const [isLeerlingOnboardingPending, setIsLeerlingOnboardingPending] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setIsOuderOnboardingPending(!(localStorage.getItem(ONBOARDING_KEY_OUDER) === 'true'));
        setIsLeerlingOnboardingPending(!(localStorage.getItem(ONBOARDING_KEY_LEERLING) === 'true'));
    }
  }, []);
  
  const defaultOpenAccordionItems = useMemo(() => {
    const activeParent = navItems.find(item =>
        item.children?.some(child => pathname.startsWith(child.href))
    );
    return activeParent ? [activeParent.href] : [];
  }, [pathname]);
  
  let currentSectionTitleDisplayed: string | null = null;

  return (
    <>
      <SidebarHeader>
        <div className="flex h-16 items-center justify-between px-4 group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-1">
          <SiteLogo 
            textClassName="group-data-[collapsible=icon]:hidden" 
            iconClassName="group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8" 
          />
        </div>
        <div className={cn(
            "p-4",
            "group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:border-b-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
        )}>
          <Label htmlFor="role-switcher" className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1 group-data-[collapsible=icon]:hidden">
            <Shuffle className="h-3 w-3"/>
            Testrol Wisselaar
          </Label>
          <Select value={currentDashboardRole} onValueChange={(value: UserRoleType) => setCurrentDashboardRole(value)}>
            <SelectTrigger 
              id="role-switcher" 
              className={cn(
                "h-9", 
                "group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
              )}
              aria-label="Selecteer een rol"
            >
               <span className="group-data-[collapsible=icon]:hidden"><SelectValue placeholder="Selecteer een rol" /></span>
               <Shuffle className={cn("h-5 w-5", sidebarState === 'expanded' ? 'group-data-[collapsible=icon]:hidden' : 'group-data-[collapsible=icon]:block')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leerling">Leerling</SelectItem>
              <SelectItem value="ouder">Ouder</SelectItem>
              <SelectItem value="tutor">Tutor</SelectItem>
              <SelectItem value="coach">Coach</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1 group-data-[collapsible=icon]:hidden">
            Sidebar past zich aan de gekozen rol aan.
          </p>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator />

      <SidebarContent className="group-data-[state=collapsed]:group-data-[collapsible=icon]:pt-1">
        <Accordion type="multiple" defaultValue={defaultOpenAccordionItems} className="w-full">
        <SidebarMenu>
          {navItems.map((item, index) => {
            const roleFlags = {
              admin: !!item.adminOnly, tutor: !!item.tutorOnly, coach: !!item.coachOnly,
              leerling: !!item.leerlingOnly, ouder: !!item.ouderOnly,
            };
            const isForCurrentRole = (role: UserRoleType) => {
              const hasNoSpecificRole = Object.values(roleFlags).every(v => !v);
              return hasNoSpecificRole || roleFlags[role];
            };

            if (!isForCurrentRole(currentDashboardRole)) return null;

            if (currentDashboardRole === 'ouder' && item.isOuderOnboardingLink !== isOuderOnboardingPending) return null;
            if (currentDashboardRole === 'ouder' && !item.isOuderOnboardingLink && isOuderOnboardingPending) return null;
            if (currentDashboardRole === 'leerling' && item.href === '/dashboard/leerling/welcome' && !isLeerlingOnboardingPending) return null;
            if (currentDashboardRole === 'leerling' && !['/dashboard/leerling/welcome', '/dashboard/profile'].includes(item.href) && isLeerlingOnboardingPending) return null;
            if (currentDashboardRole === 'leerling' && item.href === '/dashboard/community' && !showCommunityNavItemForLeerling) return null;

            let renderSectionHeader = false;
            if (item.sectionTitle && item.sectionTitle !== currentSectionTitleDisplayed) { 
                renderSectionHeader = true;
                currentSectionTitleDisplayed = item.sectionTitle;
            }
            
            const visibleChildren = item.children?.filter(child => isForCurrentRole(currentDashboardRole)) || [];
            const isParentOfActivePage = visibleChildren.some(child => pathname.startsWith(child.href));
            const isDirectlyActive = !item.children && pathname === item.href;
            
            return (
              <Fragment key={`${item.href}-${index}`}>
                {renderSectionHeader && (
                    <SidebarGroup className="pt-3 pb-1 group-data-[collapsible=icon]:hidden">
                        <SidebarGroupLabel>{item.sectionTitle}</SidebarGroupLabel>
                    </SidebarGroup>
                )}

                {item.children && visibleChildren.length > 0 ? (
                  <AccordionItem value={item.href} className="border-none">
                    <AccordionTrigger asChild>
                      <SidebarMenuItem className="p-0">
                          <SidebarMenuButton 
                            className="w-full justify-between"
                            isActive={isParentOfActivePage} 
                            tooltip={item.label}
                          >
                            <span className="flex items-center gap-2">
                              <item.icon />
                              <span className="group-data-[collapsible=icon]:hidden flex-grow">
                                {item.label}
                              </span>
                            </span>
                             <ChevronRight className={cn( "h-4 w-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden AccordionChevron" )} />
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 pl-7 pr-2 group-data-[collapsible=icon]:hidden">
                      <SidebarMenu>
                        {visibleChildren.map((child, childIndex) => (
                           <SidebarMenuItem key={`${child.href}-${childIndex}`}>
                             <SidebarMenuButton asChild isActive={pathname === child.href || pathname.startsWith(`${child.href}/`)} size="sm">
                                <Link href={child.href}>
                                  {child.icon && <child.icon />}
                                  {child.label}
                                </Link>
                             </SidebarMenuButton>
                           </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isDirectlyActive || pathname.startsWith(`${item.href}/`)} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span className="group-data-[collapsible=icon]:hidden flex-grow">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </Fragment>
            );
          })}
        </SidebarMenu>
        </Accordion>
      </SidebarContent>
    </>
  );
}

const SidebarSkeleton = () => (
    <div className="hidden md:flex flex-col h-full w-[3.5rem] bg-card border-r p-2 gap-4">
        <div className="flex items-center justify-center h-16">
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex items-center justify-center">
            <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <div className="flex-grow space-y-2 pt-4">
            <Skeleton className="h-8 w-8 rounded-md mx-auto" />
            <Skeleton className="h-8 w-8 rounded-md mx-auto" />
            <Skeleton className="h-8 w-8 rounded-md mx-auto" />
            <Skeleton className="h-8 w-8 rounded-md mx-auto" />
        </div>
    </div>
);

export function DashboardSidebar() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const pathname = usePathname();
  
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  if (!isClient) {
    return <SidebarSkeleton />;
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[300px] p-0 bg-card">
          <SheetTitle className="sr-only">Hoofdnavigatie</SheetTitle>
          <Sidebar side="left" collapsible="offcanvas" className="h-full w-full">
            <SidebarNavigationContent />
          </Sidebar>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar side="left" collapsible="icon" className="bg-card border-r shadow-lg">
      <SidebarNavigationContent />
    </Sidebar>
  );
}
