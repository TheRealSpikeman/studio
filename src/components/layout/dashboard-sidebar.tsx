// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, ClipboardList, BarChart3, MessageSquare, User, Settings, 
  Users as UsersIconLucide, Menu, BookOpenCheck, Users2, Lightbulb, Briefcase, 
  GraduationCap, Euro, FileBarChart, ListChecks, FilePlus, BarChartHorizontal, 
  FileText, FileEdit, MessagesSquare as MessagesSquareIcon, Shuffle, Clock, 
  Contact, CalendarPlus, CalendarSearch, CalendarClock, HelpCircle, CreditCard, 
  TrendingUp, Link2, UserCheck, ChevronsRightLeft, ShieldCheck as ShieldCheckIcon, Package, HeartHandshake, PlayCircle, MessageCircleQuestion, BookHeart, BookUser, GitBranch, Bot, Zap, ChevronRight, Wrench
} from 'lucide-react'; 
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useState, useEffect, Fragment } from 'react';
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
  isSubItem?: boolean;
  parent?: string;
  children?: NavItem[];
  isOuderOnboardingLink?: boolean; 
}

const navItems: NavItem[] = [
  // Leerling Items
  { href: '/dashboard/leerling/welcome', label: 'Welkom!', icon: PlayCircle, leerlingOnly: true, sectionTitle: "Leerling Portaal" },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, leerlingOnly: true, sectionTitle: "Leerling Portaal" },
  { href: '/dashboard/leerling/quizzes', label: 'Zelfreflectie Tools', icon: ClipboardList, leerlingOnly: true },
  { href: '/dashboard/results', label: 'Mijn Resultaten', icon: BarChart3, leerlingOnly: true },
  {
    href: '/dashboard/coaching',
    label: 'Coaching & Tools',
    icon: Zap,
    leerlingOnly: true,
    children: [
      { href: '/dashboard/coaching', label: 'Dagelijkse Coaching', icon: MessageSquare, isSubItem: true, parent: '/dashboard/coaching' },
      { href: '/dashboard/tools', label: 'Alle Tools', icon: Wrench, isSubItem: true, parent: '/dashboard/coaching' },
      { href: '/dashboard/coaching/settings', label: 'Instellingen', icon: Settings, isSubItem: true, parent: '/dashboard/coaching' },
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
  { href: '/dashboard/ouder/kinderen', label: 'Mijn Kinderen', icon: Contact, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { 
    href: '/dashboard/ouder/lessen/overzicht', 
    label: 'Lessen Kinderen', 
    icon: BookOpenCheck, 
    ouderOnly: true, 
    isSubItem: false, 
    parent: '/dashboard/ouder',
    children: [
        { href: '/dashboard/ouder/lessen/plannen', label: 'Les Plannen', icon: CalendarPlus, isSubItem: true, parent: '/dashboard/ouder/lessen/overzicht', ouderOnly: true },
        { href: '/dashboard/ouder/lessen/aankomend', label: 'Aankomende Lessen', icon: CalendarClock, isSubItem: true, parent: '/dashboard/ouder/lessen/overzicht', ouderOnly: true },
        { href: '/dashboard/ouder/lessen/overzicht', label: 'Lessen Overzicht', icon: CalendarSearch, isSubItem: true, parent: '/dashboard/ouder/lessen/overzicht', ouderOnly: true },
    ]
  },
  { href: '/dashboard/ouder/zoek-professional', label: 'Zoek Begeleiding', icon: Link2, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { href: '/dashboard/ouder/gekoppelde-professionals', label: 'Mijn Begeleiders', icon: UserCheck, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { href: '/dashboard/ouder/abonnementen', label: 'Abonnementen', icon: Euro, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { href: '/dashboard/ouder/facturatie', label: 'Facturatie', icon: CreditCard, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { href: '/dashboard/ouder/berichten', label: 'Berichten', icon: MessagesSquareIcon, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { href: '/dashboard/ouder/privacy-instellingen', label: 'Privacy & Delen', icon: ShieldCheckIcon, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { href: '/dashboard/ouder/faq', label: 'FAQ Ouders', icon: HelpCircle, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },

  // Tutor specific section
  { href: '/dashboard/tutor', label: 'Tutor Dashboard', icon: LayoutDashboard, tutorOnly: true, sectionTitle: "TUTOR PORTAAL" },
  { href: '/dashboard/tutor/availability', label: 'Mijn Beschikbaarheid', icon: Clock, tutorOnly: true, isSubItem: false, parent: '/dashboard/tutor' },
  { href: '/dashboard/tutor/lessons', label: 'Alle Lessen (Tutor)', icon: BookOpenCheck, tutorOnly: true, isSubItem: false, parent: '/dashboard/tutor' },
  { href: '/dashboard/tutor/students', label: 'Mijn Leerlingen', icon: UsersIconLucide, tutorOnly: true, isSubItem: false, parent: '/dashboard/tutor' },

  // Coach specific section
  { href: '/dashboard/coach', label: 'Coach Dashboard', icon: LayoutDashboard, coachOnly: true, sectionTitle: "COACH PORTAAL" },
  { href: '/dashboard/coach/availability', label: 'Mijn Beschikbaarheid (Coach)', icon: Clock, coachOnly: true, isSubItem: false, parent: '/dashboard/coach' },
  { href: '/dashboard/coach/lessons', label: 'Mijn Sessies', icon: BookOpenCheck, coachOnly: true, isSubItem: false, parent: '/dashboard/coach' },
  { href: '/dashboard/coach/students', label: 'Mijn Cliënten', icon: HeartHandshake, coachOnly: true, isSubItem: false, parent: '/dashboard/coach' },

  // Admin specific section - NEW STRUCTURE
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true, sectionTitle: "ADMIN DASHBOARD" },
  {
    href: '#user-management-parent',
    label: 'Gebruikersbeheer',
    icon: UsersIconLucide,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/user-management', label: 'Alle Gebruikers', icon: UsersIconLucide, isSubItem: true, parent: '#user-management-parent', adminOnly: true },
      { href: '/dashboard/admin/student-management', label: 'Leerlingen', icon: GraduationCap, isSubItem: true, parent: '#user-management-parent', adminOnly: true },
      { href: '/dashboard/admin/tutor-management', label: 'Tutoren', icon: Briefcase, isSubItem: true, parent: '#user-management-parent', adminOnly: true },
    ]
  },
  {
    href: '#quiz-management-parent',
    label: 'Quizbeheer',
    icon: ListChecks,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/quiz-management', label: 'Alle Quizzes', icon: ListChecks, isSubItem: true, parent: '#quiz-management-parent' },
      { href: '/dashboard/admin/quiz-management/create', label: 'Nieuwe Quiz', icon: FilePlus, isSubItem: true, parent: '#quiz-management-parent' },
      { href: '/dashboard/admin/quiz-management/reports', label: 'Rapportages', icon: BarChartHorizontal, isSubItem: true, parent: '#quiz-management-parent' },
    ]
  },
  {
    href: '#insights-parent', // Non-clickable parent
    label: 'Inzichten',
    icon: TrendingUp,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/reporting', label: 'Platform Rapportages', icon: FileBarChart, isSubItem: true, parent: '#insights-parent' },
      { href: '/dashboard/admin/feedback-overview', label: 'Feedback Overzicht', icon: MessageCircleQuestion, isSubItem: true, parent: '#insights-parent' },
    ]
  },
  {
    href: '#finance-parent', // Non-clickable parent
    label: 'Financieel Beheer',
    icon: Euro,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/subscription-management', label: 'Abonnementen', icon: CreditCard, isSubItem: true, parent: '#finance-parent' },
      { href: '/dashboard/admin/finance', label: 'Betalingen', icon: Euro, isSubItem: true, parent: '#finance-parent' },
    ]
  },
  {
    href: '#platform-parent', // Non-clickable parent
    label: 'Platformbeheer',
    icon: Settings,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/feature-management', label: 'Functionaliteiten', icon: Package, isSubItem: true, parent: '#platform-parent' },
      { href: '/dashboard/admin/tool-recommendation-logic', label: 'Tool Aanbevelingen', icon: GitBranch, isSubItem: true, parent: '#platform-parent' },
      { href: '/dashboard/admin/content-management', label: 'Content', icon: FileEdit, isSubItem: true, parent: '#platform-parent' },
      { href: '/dashboard/admin/settings', label: 'Instellingen', icon: Settings, isSubItem: true, parent: '#platform-parent' },
    ]
  },
  {
    href: '#documentation-parent',
    label: 'Documentatie',
    icon: BookHeart,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/documentation', label: 'Overzicht', icon: BookHeart, isSubItem: true, parent: '#documentation-parent', adminOnly: true },
      { href: '/dashboard/admin/documentation/platform-guide', label: 'Platform Handleiding', icon: BookUser, isSubItem: true, parent: '#documentation-parent', adminOnly: true },
      { href: '/dashboard/admin/documentation/data-flow', label: 'Data & Inzichten Flow', icon: GitBranch, isSubItem: true, parent: '#documentation-parent', adminOnly: true },
      { href: '/dashboard/admin/documentation/customer-journey', label: 'Customer Journey', icon: UsersIconLucide, isSubItem: true, parent: '#documentation-parent', adminOnly: true },
      { href: '/dashboard/admin/documentation/ai-persona', label: 'AI Persona', icon: Bot, isSubItem: true, parent: '#documentation-parent', adminOnly: true },
    ]
  },
  
  { href: '/dashboard/profile', label: 'Profiel', icon: User }, 
];

function SidebarNavigationContent() {
  const pathname = usePathname();
  const { currentDashboardRole, setCurrentDashboardRole } = useDashboardRole(); 
  const { state: sidebarState } = useSidebar();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  
  let currentSectionTitleDisplayed: string | null = null;
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true); 
  const [hasBillingAction, setHasBillingAction] = useState(true); 
  const [showCommunityNavItemForLeerling, setShowCommunityNavItemForLeerling] = useState(true);
  const [isOuderOnboardingPending, setIsOuderOnboardingPending] = useState(true); 
  const [isLeerlingOnboardingPending, setIsLeerlingOnboardingPending] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setIsOuderOnboardingPending(!(localStorage.getItem(ONBOARDING_KEY_OUDER) === 'true'));
        setIsLeerlingOnboardingPending(!(localStorage.getItem(ONBOARDING_KEY_LEERLING) === 'true'));

        if (currentDashboardRole === 'leerling') {
            const communityAccessAllowed = JSON.parse(localStorage.getItem(`privacySettings_child1_allowCommunityAccess`) ?? 'true');
            setShowCommunityNavItemForLeerling(communityAccessAllowed);
        } else {
            setShowCommunityNavItemForLeerling(true);
        }
    }
  }, [currentDashboardRole]);

  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.children) {
        const isParentOfActivePage = item.children.some(child => pathname.startsWith(child.href) && child.href !== item.href && item.href.startsWith('#'));
        if (isParentOfActivePage) {
          initialOpenState[item.href] = true;
        }
      }
    });
    setOpenSubMenus(initialOpenState);
  }, [pathname]);

  const toggleSubMenu = (href: string) => {
    setOpenSubMenus(prev => ({ ...prev, [href]: !prev[href] }));
  };


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
        <SidebarMenu>
          {navItems.map((item, index) => {
            
            const roleFlags = {
              admin: !!item.adminOnly,
              tutor: !!item.tutorOnly,
              coach: !!item.coachOnly,
              leerling: !!item.leerlingOnly,
              ouder: !!item.ouderOnly,
            };

            const isForCurrentRole = (role: UserRoleType) => {
                const hasNoSpecificRole = !roleFlags.admin && !roleFlags.tutor && !roleFlags.coach && !roleFlags.leerling && !roleFlags.ouder;
                return hasNoSpecificRole || roleFlags[role];
            };

            if (!isForCurrentRole(currentDashboardRole)) {
                return null;
            }

            // Handle special visibility cases
            if (currentDashboardRole === 'ouder' && item.isOuderOnboardingLink !== isOuderOnboardingPending) return null;
            if (currentDashboardRole === 'ouder' && !item.isOuderOnboardingLink && isOuderOnboardingPending) return null;
            if (currentDashboardRole === 'leerling' && item.href === '/dashboard/leerling/welcome' && !isLeerlingOnboardingPending) return null;
            if (currentDashboardRole === 'leerling' && item.href !== '/dashboard/leerling/welcome' && item.href !== '/dashboard/profile' && isLeerlingOnboardingPending) return null;
            if (currentDashboardRole === 'leerling' && item.href === '/dashboard/community' && !showCommunityNavItemForLeerling) return null;
            
            let renderSectionHeader = false;
            if (item.sectionTitle && item.sectionTitle !== currentSectionTitleDisplayed) { 
                renderSectionHeader = true;
                currentSectionTitleDisplayed = item.sectionTitle;
            }
            
            const visibleChildren = item.children?.filter(child => isForCurrentRole(currentDashboardRole)) || [];
            const isParentOfActivePage = visibleChildren.some(child => pathname.startsWith(child.href) && child.href !== item.href && item.href.startsWith('#'));
            const isDirectlyActive = !item.children && pathname === item.href;
            const isOpen = openSubMenus[item.href] === true;

            return (
              <Fragment key={`${item.href}-${index}`}>
                {renderSectionHeader && (
                    <SidebarGroup className="pt-3 pb-1 group-data-[collapsible=icon]:hidden">
                        <SidebarGroupLabel>{item.sectionTitle}</SidebarGroupLabel>
                    </SidebarGroup>
                )}

                {item.children && visibleChildren.length > 0 ? (
                  <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => toggleSubMenu(item.href)}
                        data-state={isOpen ? "open" : "closed"}
                        isActive={isParentOfActivePage} 
                        tooltip={item.label}
                      >
                        <item.icon />
                        <span className="group-data-[collapsible=icon]:hidden flex-grow">
                          {item.label}
                        </span>
                        <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
                            isOpen && "rotate-90"
                        )} />
                      </SidebarMenuButton>
                      <SidebarMenuSub data-state={isOpen ? "open" : "closed"}>
                          {visibleChildren.map((child, childIndex) => (
                              <SidebarMenuSubItem key={`${child.href}-${childIndex}`}>
                                <SidebarMenuSubButton 
                                  asChild 
                                  isActive={pathname === child.href}
                                >
                                  <Link href={child.href}>
                                    <child.icon />
                                    {child.label}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                   </SidebarMenuItem>
                ) : (
                  // Render regular item
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isDirectlyActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span className="group-data-[collapsible=icon]:hidden flex-grow">
                          {item.label}
                        </span>
                         {item.href === '/dashboard/ouder/facturatie' && currentDashboardRole === 'ouder' && hasBillingAction && (
                          <span title="Facturatie actie vereist" className="ml-auto mr-1 inline-block h-2 w-2 rounded-full bg-primary min-w-0 group-data-[collapsible=icon]:hidden" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                    {item.href === '/dashboard/ouder/berichten' && currentDashboardRole === 'ouder' && hasUnreadMessages && (
                      <SidebarMenuBadge title="Nieuwe berichten" />
                    )}
                  </SidebarMenuItem>
                )}
              </Fragment>
            );
          })}
        </SidebarMenu>
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
  const { isMobile, setOpenMobile } = useSidebar();
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
      <Sidebar side="left" collapsible="offcanvas">
        <SidebarNavigationContent />
      </Sidebar>
    );
  }

  return (
    <Sidebar side="left" collapsible="icon" className="bg-card border-r shadow-lg">
      <SidebarNavigationContent />
    </Sidebar>
  );
}
