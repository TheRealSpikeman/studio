// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useDashboardRole, type UserRoleType } from '@/contexts/DashboardRoleContext'; 
import React, { useState, useEffect, Fragment, useMemo } from 'react';
import {
  LayoutDashboard, ClipboardList, MessageSquare, User, Settings, 
  Users as UsersIconLucide, BookOpenCheck, Briefcase, Euro, ListChecks, FilePlus, 
  FileEdit, MessagesSquare, Shuffle, Clock, 
  HelpCircle, CreditCard, TrendingUp, Link2, UserCheck, ShieldCheck, Package, 
  HeartHandshake, PlayCircle, MessageCircleQuestion, BookUser, GitBranch, Bot, Zap, Wrench, 
  CalendarPlus, CalendarDays, BookOpen, BarChartHorizontal
} from '@/lib/icons';

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
  { href: '/dashboard/community', label: 'Community Forum', icon: MessagesSquare, leerlingOnly: true },
  
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
        { href: '/dashboard/ouder/lessen/aankomend', label: 'Aankomende Lessen', icon: CalendarDays, parent: '#ouder-lessen-parent' },
        { href: '/dashboard/ouder/lessen/overzicht', label: 'Lessen Overzicht', icon: CalendarDays, parent: '#ouder-lessen-parent' },
    ]
  },
  { href: '/dashboard/ouder/zoek-professional', label: 'Zoek Begeleiding', icon: Link2, ouderOnly: true },
  { href: '/dashboard/ouder/gekoppelde-professionals', label: 'Mijn Begeleiders', icon: UserCheck, ouderOnly: true },
  { href: '/dashboard/ouder/abonnementen', label: 'Abonnementen', icon: Euro, ouderOnly: true },
  { href: '/dashboard/ouder/facturatie', label: 'Facturatie', icon: CreditCard, ouderOnly: true },
  { href: '/dashboard/ouder/berichten', label: 'Berichten', icon: MessagesSquare, ouderOnly: true },
  { href: '/dashboard/ouder/privacy-instellingen', label: 'Privacy &amp; Delen', icon: ShieldCheck, ouderOnly: true },
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
  { href: '/dashboard/coach/tools', label: 'Coach Tools', icon: Wrench, coachOnly: true },

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
      { href: '/dashboard/admin/content-management', label: 'Content', icon: FileEdit, parent: '#platform-parent' },
      { href: '/dashboard/admin/settings', label: 'Instellingen', icon: Settings, parent: '#platform-parent' },
    ]
  },
  {
    href: '#tools-parent',
    label: 'Tools',
    icon: Wrench,
    adminOnly: true,
    children: [
        { href: '/dashboard/admin/tool-recommendation-logic', label: 'Tool Aanbevelingen', icon: GitBranch, parent: '#tools-parent' },
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
      { href: '/dashboard/admin/documentation/data-flow', label: 'Data &amp; Inzichten Flow', icon: GitBranch, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/customer-journey', label: 'Customer Journey', icon: UsersIconLucide, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/ai-persona', label: 'AI Persona', icon: Bot, parent: '#documentation-parent' },
    ]
  },
  
  { href: '/dashboard/profile', label: 'Profiel', icon: User }, 
];

export function SidebarNavContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentDashboardRole, setCurrentDashboardRole } = useDashboardRole();
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
  
  const handleRoleChange = (role: UserRoleType) => {
    setCurrentDashboardRole(role);
    router.push(`/dashboard/${role}`);
  };

  const baseLinkClasses = "flex items-center gap-3 rounded-md w-full px-3 py-2 text-sm font-medium transition-colors";
  const hoverClasses = "hover:bg-[#f8f9fa] dark:hover:bg-muted";
  const activeLinkClasses = "bg-primary/10 text-primary font-semibold";
  const inactiveLinkClasses = "text-foreground";
  const sublinkInactiveClasses = "text-muted-foreground hover:text-primary";

  return (
    <>
      <div className="p-4 border-b">
        <SiteLogo />
        <div className="mt-4 space-y-1">
          <Label htmlFor="role-switcher" className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1">
            <Shuffle className="h-3.5 w-3.5" />
            Wissel Rol (Demo)
          </Label>
          <Select value={currentDashboardRole} onValueChange={handleRoleChange}>
            <SelectTrigger id="role-switcher" aria-label="Selecteer een rol" className="h-9">
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
        <nav className="p-2 space-y-1">
          <Accordion type="multiple" defaultValue={defaultOpenAccordionItems} className="w-full space-y-1">
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
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground/70 tracking-wider px-3 pt-3 pb-1">
                      {item.sectionTitle}
                    </h4>
                  )}

                  {item.children && item.children.length > 0 ? (
                    <AccordionItem value={item.href} className="border-none">
                      <AccordionTrigger className={cn(
                        baseLinkClasses,
                        "hover:no-underline justify-between",
                        isParentOfActivePage ? 'text-primary' : 'text-foreground hover:text-primary',
                        hoverClasses
                      )}>
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pl-6 pb-1">
                        <div className="flex flex-col space-y-1 border-l border-muted-foreground/30 ml-[9px] pl-4">
                          {item.children.map(child => {
                            const isChildActive = pathname.startsWith(child.href);
                            return (
                               <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                    baseLinkClasses,
                                    'py-1.5',
                                    isChildActive ? activeLinkClasses : cn(sublinkInactiveClasses, 'hover:bg-[#f8f9fa] dark:hover:bg-muted')
                                )}>
                                <child.icon className="h-4 w-4" />
                                <span>{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                          baseLinkClasses,
                          isDirectlyActive ? activeLinkClasses : cn(inactiveLinkClasses, hoverClasses)
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
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
