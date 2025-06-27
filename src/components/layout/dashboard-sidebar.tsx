// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState, useEffect, Fragment, useMemo } from 'react';
import {
  LayoutDashboard, 
  ClipboardList, 
  MessageSquare, 
  User, 
  Settings, 
  Users as UsersIcon,
  BookOpen as BookOpenCheck,
  Briefcase, 
  Euro, 
  ListChecks, 
  FilePlus, 
  FileEdit, 
  Clock, 
  HelpCircle, 
  CreditCard, 
  ArrowUp as TrendingUp,
  Link as Link2,
  User as UserCheck,
  Shield as ShieldCheck,
  Package, 
  Handshake as HeartHandshake,
  PlayCircle, 
  MessageCircle as MessageCircleQuestion,
  BookOpen as BookUser,
  GitBranch, 
  Bot, 
  Wrench, 
  CalendarPlus, 
  Calendar as CalendarDays,
  BookHeart,
  GraduationCap,
  BarChart as BarChartHorizontal,
  BarChart as FileBarChart,
  PanelLeft,
  PanelRight,
  BrainCircuit,
  Rocket,
  ScrollText,
} from '@/lib/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

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
  parent?: string;
  isOuderOnboardingLink?: boolean;
  isNew?: boolean;
}

const navItems: NavItem[] = [
  // Leerling Items
  { href: '/dashboard/leerling/welcome', label: 'Welkom!', icon: PlayCircle, leerlingOnly: true, sectionTitle: "Leerling Portaal" },
  {
    href: '#dashboard-parent',
    label: 'Dashboard',
    icon: LayoutDashboard,
    leerlingOnly: true,
    children: [
      { href: '/dashboard/leerling', label: 'Overzicht', icon: LayoutDashboard, parent: '#dashboard-parent' },
      { href: '/dashboard/coaching', label: 'Dagelijkse Coaching', icon: MessageSquare, parent: '#dashboard-parent' },
      { href: '/dashboard/tools', label: 'Aanbevolen Tools', icon: Wrench, parent: '#dashboard-parent' },
      { href: '/dashboard/coaching/settings', label: 'Instellingen', icon: Settings, parent: '#dashboard-parent' },
    ]
  },
  { href: '/dashboard/leerling/quizzes', label: 'Zelfreflectie Tools', icon: ClipboardList, leerlingOnly: true },
  { href: '/dashboard/results', label: 'Mijn Resultaten', icon: FileBarChart, leerlingOnly: true },
  { href: '/dashboard/leerling/lessons', label: 'Mijn Lessen', icon: BookOpenCheck, leerlingOnly: true },
  { href: '/dashboard/community', label: 'Community Forum', icon: MessageSquare, leerlingOnly: true },
  
  // Ouder Items
  { href: '/dashboard/ouder/welcome', label: 'Start Ouder Onboarding', icon: PlayCircle, ouderOnly: true, isOuderOnboardingLink: true, sectionTitle: "OUDER PORTAAL" }, 
  { href: '/dashboard/ouder', label: 'Ouder Dashboard', icon: LayoutDashboard, ouderOnly: true, sectionTitle: "OUDER PORTAAL" },
  { href: '/dashboard/ouder/kinderen', label: 'Mijn Kinderen', icon: UsersIcon, ouderOnly: true },
  { 
    href: '#ouder-lessen-parent', 
    label: 'Lessen Kinderen', 
    icon: BookOpenCheck, 
    ouderOnly: true, 
    children: [
        { href: '/dashboard/ouder/lessen/plannen', label: 'Les Plannen', icon: CalendarPlus, parent: '#ouder-lessen-parent' },
        { href: '/dashboard/ouder/lessen/aankomend', label: 'Aankomende Lessen', icon: CalendarDays, parent: '#ouder-lessen-parent' },
        { href: '/dashboard/ouder/lessen/overzicht', label: 'Lessen Overzicht', icon: CalendarDays, parent: '#ouder-lessen-parent' },
    ]
  },
  { href: '/dashboard/ouder/zoek-professional', label: 'Zoek Begeleiding', icon: Link2, ouderOnly: true },
  { href: '/dashboard/ouder/gekoppelde-professionals', label: 'Mijn Begeleiders', icon: UserCheck, ouderOnly: true },
  { href: '/dashboard/ouder/abonnementen', label: 'Abonnementen', icon: Euro, ouderOnly: true },
  { href: '/dashboard/ouder/facturatie', label: 'Facturatie', icon: CreditCard, ouderOnly: true },
  { href: '/dashboard/ouder/berichten', label: 'Berichten', icon: MessageSquare, ouderOnly: true },
  { href: '/dashboard/ouder/privacy-instellingen', label: 'Privacy & Delen', icon: ShieldCheck, ouderOnly: true },
  { href: '/dashboard/ouder/faq', label: 'FAQ Ouders', icon: HelpCircle, ouderOnly: true },

  // Tutor specific section
  { href: '/dashboard/tutor', label: 'Tutor Dashboard', icon: LayoutDashboard, tutorOnly: true, sectionTitle: "TUTOR PORTAAL" },
  { href: '/dashboard/tutor/availability', label: 'Mijn Beschikbaarheid', icon: Clock, tutorOnly: true },
  { href: '/dashboard/tutor/lessons', label: 'Alle Lessen (Tutor)', icon: BookOpenCheck, tutorOnly: true },
  { href: '/dashboard/tutor/students', label: 'Mijn Leerlingen', icon: UsersIcon, tutorOnly: true },

  // Coach specific section
  { href: '/dashboard/coach', label: 'Coach Dashboard', icon: LayoutDashboard, coachOnly: true, sectionTitle: "COACH PORTAAL" },
  { href: '/dashboard/coach/availability', label: 'Mijn Beschikbaarheid (Coach)', icon: Clock, coachOnly: true },
  { href: '/dashboard/coach/lessons', label: 'Mijn Sessies', icon: BookOpenCheck, coachOnly: true },
  { href: '/dashboard/coach/students', label: 'Mijn Cliënten', icon: HeartHandshake, coachOnly: true },
  { href: '/dashboard/coach/tools', label: 'Coach Tools', icon: Wrench, coachOnly: true },

  // Admin specific section
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true, sectionTitle: "ADMIN DASHBOARD" },
  {
    href: '#user-management-parent',
    label: 'Gebruikersbeheer',
    icon: UsersIcon,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/user-management', label: 'Alle Gebruikers', icon: UsersIcon, parent: '#user-management-parent' },
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
      { href: '/dashboard/admin/quiz-management', label: 'Alle Quizzen', icon: ListChecks, parent: '#quiz-management-parent' },
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
      { href: '/dashboard/admin/tool-management', label: 'Toolbeheer', icon: Wrench, parent: '#platform-parent' },
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
      { href: '/dashboard/admin/documentation/data-flow', label: 'Data & Inzichten Flow', icon: BrainCircuit, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/customer-journey', label: 'Customer Journey', icon: UsersIcon, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/ai-persona', label: 'AI Persona', icon: Bot, parent: '#documentation-parent' },
      { href: '/dashboard/admin/tool-recommendation-logic', label: 'Tool Aanbeveling Logica', icon: GitBranch, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/roadmap', label: 'Roadmap', icon: Rocket, parent: '#documentation-parent', isNew: true },
      { href: '/dashboard/admin/documentation/changelog', label: 'Changelog', icon: ScrollText, parent: '#documentation-parent' },
    ]
  },
  
  { href: '/dashboard/profile', label: 'Profiel', icon: User }, 
];

const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

export function SidebarNavContent({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (isCollapsed: boolean) => void; }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const currentDashboardRole = user?.role || 'leerling';
  const [isOuderOnboardingPending, setIsOuderOnboardingPending] = useState(true);
  const [isLeerlingOnboardingPending, setIsLeerlingOnboardingPending] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOuderOnboardingPending(!(localStorage.getItem(ONBOARDING_KEY_OUDER) === 'true'));
      setIsLeerlingOnboardingPending(!(localStorage.getItem(ONBOARDING_KEY_LEERLING) === 'true'));
    }
  }, [currentDashboardRole]);

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
        if (item.isOuderOnboardingLink) return isOuderOnboardingPending;
        if (!item.isOuderOnboardingLink && item.ouderOnly) return !isOuderOnboardingPending;
      }
      if (currentDashboardRole === 'leerling') {
        if (item.href === '/dashboard/leerling/welcome') return isLeerlingOnboardingPending;
        if (item.href !== '/dashboard/leerling/welcome' && item.leerlingOnly) return !isLeerlingOnboardingPending;
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
  
  const baseLinkClasses = "flex items-center gap-3 rounded-md w-full px-3 py-1.5 text-sm font-medium transition-colors";
  const hoverClasses = "hover:bg-[#f8f9fa] dark:hover:bg-muted";
  const activeLinkClasses = "bg-primary/10 text-primary font-semibold";
  const inactiveLinkClasses = "text-foreground";
  const sublinkInactiveClasses = "text-muted-foreground hover:text-primary";

  return (
    <TooltipProvider>
        <div className="flex h-full max-h-screen flex-col">
        <div className={cn("flex h-16 items-center border-b shrink-0", isCollapsed ? "justify-center px-2" : "px-4")}>
            <SiteLogo isCollapsed={isCollapsed} />
        </div>
        <div className={cn("p-4 border-b shrink-0", isCollapsed && "flex justify-center")}>
             <div className="space-y-1">
                {!isCollapsed && user ? (
                    <>
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
                    </>
                ) : user ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || undefined} alt={user.name} data-ai-hint="user avatar" />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                ) : null }
             </div>
        </div>
        <ScrollArea className="flex-1">
            <nav className="p-2 space-y-0.5">
            <Accordion type="multiple" defaultValue={defaultOpenAccordionItems} className="w-full space-y-0.5">
                {filteredNavItems.map((item) => {
                let renderSectionHeader = false;
                if (item.sectionTitle && item.sectionTitle !== currentSectionTitleDisplayed) {
                    renderSectionHeader = true;
                    currentSectionTitleDisplayed = item.sectionTitle;
                }

                const isDirectlyActive = !item.children && pathname === item.href;
                const isParentOfActivePage = item.children?.some(child => pathname.startsWith(child.href));

                const NavItemWrapper = ({ children }: { children: React.ReactNode }) =>
                    isCollapsed ? (
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>{children}</TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-4">
                        {item.label}
                        {item.isNew && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-300">Nieuw</Badge>}
                        </TooltipContent>
                    </Tooltip>
                    ) : (
                    <>{children}</>
                    );

                return (
                    <Fragment key={item.href}>
                    {renderSectionHeader && !isCollapsed && (
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground/70 tracking-wider px-3 pt-3 pb-1">
                        {item.sectionTitle}
                        </h4>
                    )}
                    {item.children && item.children.length > 0 ? (
                        <AccordionItem value={item.href} className="border-none">
                            <NavItemWrapper>
                                <AccordionTrigger className={cn(
                                    baseLinkClasses, "hover:no-underline",
                                    isCollapsed ? "justify-center" : "justify-between",
                                    isParentOfActivePage && !isCollapsed ? 'text-primary' : 'text-foreground hover:text-primary',
                                    hoverClasses
                                )}>
                                    <div className="flex items-center gap-3">
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                                    </div>
                                    {!isCollapsed && item.isNew && <Badge variant="secondary" className="ml-auto text-xs bg-green-100 text-green-700 border-green-300">Nieuw</Badge>}
                                </AccordionTrigger>
                            </NavItemWrapper>
                            <AccordionContent className="pt-1 pl-6 pb-1">
                                <div className={cn("flex flex-col space-y-0.5", !isCollapsed && "border-l-2 border-muted-foreground/30 ml-[9px] pl-4")}>
                                {item.children.map(child => {
                                    const isChildActive = pathname.startsWith(child.href);
                                    return (
                                    <Link key={child.href} href={child.href} className={cn(
                                        baseLinkClasses, 'py-1.5',
                                        isChildActive ? activeLinkClasses : cn(sublinkInactiveClasses, 'hover:bg-[#f8f9fa] dark:hover:bg-muted'),
                                        isCollapsed && "justify-center"
                                    )}>
                                        <child.icon className="h-4 w-4 shrink-0" />
                                        {!isCollapsed && <span className="truncate">{child.label}</span>}
                                        {!isCollapsed && child.isNew && <Badge variant="secondary" className="ml-auto text-xs bg-green-100 text-green-700 border-green-300">Nieuw</Badge>}
                                    </Link>
                                    );
                                })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ) : (
                        <NavItemWrapper>
                            <Link href={item.href} className={cn(
                                baseLinkClasses,
                                isDirectlyActive ? activeLinkClasses : cn(inactiveLinkClasses, hoverClasses),
                                isCollapsed && "justify-center"
                            )}>
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                            {!isCollapsed && item.isNew && <Badge variant="secondary" className="ml-auto text-xs bg-green-100 text-green-700 border-green-300">Nieuw</Badge>}
                            </Link>
                        </NavItemWrapper>
                    )}
                    </Fragment>
                );
                })}
            </Accordion>
            </nav>
        </ScrollArea>
        <div className={cn("mt-auto p-4 border-t shrink-0", isCollapsed && "flex justify-center")}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={cn("w-full justify-center", isCollapsed && "w-auto")} onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                        <span className="sr-only">{isCollapsed ? 'Menu uitklappen' : 'Menu inklappen'}</span>
                    </Button>
                </TooltipTrigger>
                {isCollapsed && (
                    <TooltipContent side="right">
                        <p>{isCollapsed ? 'Menu uitklappen' : 'Menu inklappen'}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </div>
        </div>
    </TooltipProvider>
  );
}

export function DashboardSidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (isCollapsed: boolean) => void; }) {
  return (
    <aside className={cn(
        "hidden md:flex h-screen flex-col fixed inset-y-0 z-40 border-r bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72"
    )}>
      <SidebarNavContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
    </aside>
  );
}
