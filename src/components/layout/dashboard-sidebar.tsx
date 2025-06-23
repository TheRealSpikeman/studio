
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useDashboardRole, type UserRoleType } from '@/contexts/DashboardRoleContext'; 
import { useState, useEffect, Fragment, useMemo } from 'react';
import { 
  LayoutDashboard, ClipboardList, BarChart3, MessageSquare, User, Settings, 
  Users as UsersIconLucide, BookOpenCheck, Briefcase, 
  Euro, FileBarChart, ListChecks, FilePlus, BarChartHorizontal, 
  FileText, FileEdit, MessagesSquare as MessagesSquareIcon, Shuffle, Clock, 
  HelpCircle, CreditCard, TrendingUp,
  Link2, UserCheck, ShieldCheck as ShieldCheckIcon, Package, HeartHandshake, PlayCircle, MessageCircleQuestion, BookHeart, BookUser, GitBranch, Bot, Zap, Wrench, CalendarPlus, CalendarClock, CalendarDays, GraduationCap
} from 'lucide-react'; 

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

export function SidebarNavContent() {
  const pathname = usePathname();
  const { currentDashboardRole, setCurrentDashboardRole } = useDashboardRole();
  const [isOuderOnboardingPending, setIsOuderOnboardingPending] = useState(true);
  const [isLeerlingOnboardingPending, setIsLeerlingOnboardingPending] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOuderOnboardingPending(!(localStorage.getItem(ONBOARDING_KEY_OUDER) === 'true'));
      setIsLeerlingOnboardingPending(!(localStorage.getItem(ONBOARDING_KEY_LEERLING) === 'true'));
    }
  }, []);

  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => {
      const roleFlags = {
        admin: !!item.adminOnly,
        tutor: !!item.tutorOnly,
        coach: !!item.coachOnly,
        leerling: !!item.leerlingOnly,
        ouder: !!item.ouderOnly,
      };
      const hasNoSpecificRole = Object.values(roleFlags).every(v => !v);
      const isForCurrentRole = hasNoSpecificRole || roleFlags[currentDashboardRole];

      if (!isForCurrentRole) return false;

      if (currentDashboardRole === 'ouder') {
        if (item.isOuderOnboardingLink !== isOuderOnboardingPending) return false;
        if (!item.isOuderOnboardingLink && isOuderOnboardingPending) return false;
      }
      if (currentDashboardRole === 'leerling') {
        if (item.href === '/dashboard/leerling/welcome' && !isLeerlingOnboardingPending) return false;
        if (!['/dashboard/leerling/welcome', '/dashboard/profile'].includes(item.href) && isLeerlingOnboardingPending) return false;
      }
      return true;
    });
  }, [currentDashboardRole, isOuderOnboardingPending, isLeerlingOnboardingPending]);

  const defaultOpenAccordionItems = useMemo(() => {
    const activeParent = filteredNavItems.find(item =>
      item.children?.some(child => pathname.startsWith(child.href))
    );
    return activeParent ? [activeParent.href] : [];
  }, [pathname, filteredNavItems]);

  let currentSectionTitleDisplayed: string | null = null;

  return (
    <>
      <div className="p-4 border-b">
        <SiteLogo />
        <div className="mt-4 space-y-1">
          <Label htmlFor="role-switcher" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Shuffle className="h-3 w-3" />
            Testrol Wisselaar
          </Label>
          <Select value={currentDashboardRole} onValueChange={(value: UserRoleType) => setCurrentDashboardRole(value)}>
            <SelectTrigger id="role-switcher" aria-label="Selecteer een rol">
              <SelectValue placeholder="Selecteer een rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leerling">Leerling</SelectItem>
              <SelectItem value="ouder">Ouder</SelectItem>
              <SelectItem value="tutor">Tutor</SelectItem>
              <SelectItem value="coach">Coach</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          <Accordion type="multiple" defaultValue={defaultOpenAccordionItems} className="w-full">
            {filteredNavItems.map((item) => {
              let renderSectionHeader = false;
              if (item.sectionTitle && item.sectionTitle !== currentSectionTitleDisplayed) {
                renderSectionHeader = true;
                currentSectionTitleDisplayed = item.sectionTitle;
              }

              const isDirectlyActive = !item.children && pathname === item.href;
              const isParentOfActivePage = item.children?.some(child => pathname.startsWith(child.href));

              return (
                <Fragment key={item.href}>
                  {renderSectionHeader && (
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-2 pt-4 pb-1">
                      {item.sectionTitle}
                    </h4>
                  )}

                  {item.children && item.children.length > 0 ? (
                    <AccordionItem value={item.href} className="border-none">
                      <AccordionTrigger className={cn("rounded-md hover:bg-muted hover:no-underline p-2", isParentOfActivePage && "bg-muted text-primary")}>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-6 pt-1 pb-0">
                        <div className="flex flex-col space-y-1 border-l border-muted-foreground/20 ml-1">
                          {item.children.map(child => (
                            <Button key={child.href} asChild variant="ghost" size="sm" className={cn("justify-start ml-2", pathname.startsWith(child.href) && "bg-accent text-accent-foreground")}>
                              <Link href={child.href}>
                                <child.icon className="mr-2 h-4 w-4" />
                                {child.label}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <Button asChild variant={isDirectlyActive ? "secondary" : "ghost"} className="w-full justify-start">
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  )}
                </Fragment>
              );
            })}
          </Accordion>
        </nav>
      </ScrollArea>
    </>
  );
}

export function DashboardSidebar() {
  return (
    <div className="hidden md:flex h-screen w-72 flex-col fixed inset-y-0 z-40 border-r bg-card">
      <SidebarNavContent />
    </div>
  );
}
