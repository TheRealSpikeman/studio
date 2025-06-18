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
  useSidebar
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, ClipboardList, BarChart3, MessageSquare, User, Settings, 
  Users as UsersIconLucide, Menu, BookOpenCheck, Users2, Lightbulb, Briefcase, 
  GraduationCap, Euro, FileBarChart, ListChecks, FilePlus, BarChartHorizontal, 
  FileText, FileEdit, MessagesSquare as MessagesSquareIcon, Shuffle, Clock, 
  Contact, CalendarPlus, CalendarSearch, CalendarClock, HelpCircle, CreditCard, 
  TrendingUp, Link2, UserCheck, ChevronsRightLeft, ShieldCheck as ShieldCheckIcon, Package, HeartHandshake, PlayCircle
} from 'lucide-react'; 
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useState, useEffect, Fragment } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useDashboardRole, type UserRoleType } from '@/contexts/DashboardRoleContext'; 

const ONBOARDING_KEY_OUDER = 'onboardingCompleted_ouder_v1'; // Key for localStorage

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
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, leerlingOnly: true },
  { href: '/dashboard/leerling/quizzes', label: 'Zelfreflectie Tools', icon: ClipboardList, leerlingOnly: true },
  { href: '/dashboard/results', label: 'Resultaten', icon: BarChart3, leerlingOnly: true },
  {
    href: '/dashboard/coaching',
    label: 'Coaching',
    icon: MessageSquare,
    leerlingOnly: true,
    children: [
      { href: '/dashboard/coaching/settings', label: 'Instellingen Coaching', icon: Settings, isSubItem: true, parent: '/dashboard/coaching', leerlingOnly: true },
    ]
  },
  {
    href: '/dashboard/leerling/lessons', 
    label: 'Mijn Lessen',
    icon: BookOpenCheck, 
    leerlingOnly: true,
  },
  {
    href: '/dashboard/homework-assistance',
    label: 'Huiswerkbegeleiding',
    icon: GraduationCap, 
    leerlingOnly: true,
    children: [
      {
        href: '/dashboard/homework-assistance', 
        label: 'Online Tips & Tools',
        icon: Lightbulb,
        isSubItem: true,
        parent: '/dashboard/homework-assistance',
        leerlingOnly: true,
      },
      {
        href: '/dashboard/homework-assistance/tutors',
        label: '1-op-1 Begeleiding',
        icon: Users2,
        isSubItem: true,
        parent: '/dashboard/homework-assistance',
        leerlingOnly: true,
      },
    ]
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

  // Admin specific section
  { href: '/dashboard/admin', label: 'Admin Dashboard', icon: LayoutDashboard, adminOnly: true, sectionTitle: "ADMIN DASHBOARD" },
  { href: '/dashboard/admin/user-management', label: 'Gebruikersbeheer', icon: UsersIconLucide, adminOnly: true },
  { href: '/dashboard/admin/student-management', label: 'Leerlingenbeheer', icon: GraduationCap, adminOnly: true },
  { href: '/dashboard/admin/tutor-management', label: 'Tutorbeheer', icon: Briefcase, adminOnly: true },
  {
    href: '/dashboard/admin/quiz-management',
    label: 'Quizzen Beheer',
    icon: ListChecks,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/quiz-management', label: 'Alle Quizzen', icon: ListChecks, isSubItem: true, parent: '/dashboard/admin/quiz-management' },
      { href: '/dashboard/admin/quiz-management/new', label: 'Nieuwe Quiz', icon: FilePlus, isSubItem: true, parent: '/dashboard/admin/quiz-management' },
      { href: '/dashboard/admin/quiz-management/reports', label: 'Rapportages', icon: BarChartHorizontal, isSubItem: true, parent: '/dashboard/admin/quiz-management' },
    ]
  },
  { href: '/dashboard/admin/subscription-management', label: 'Abonnementenbeheer', icon: CreditCard, adminOnly: true },
  { href: '/dashboard/admin/feature-management', label: 'Feature Beheer', icon: Package, adminOnly: true }, 
  {
    href: '/dashboard/admin/content-management',
    label: 'Content Management',
    icon: FileEdit,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/content-management', label: 'Pagina Overzicht', icon: FileText, isSubItem: true, parent: '/dashboard/admin/content-management' },
      { href: '/dashboard/admin/content-management/new', label: 'Nieuwe Pagina', icon: FilePlus, isSubItem: true, parent: '/dashboard/admin/content-management' },
    ]
  },
  { href: '/dashboard/admin/finance', label: 'Financiën', icon: Euro, adminOnly: true },
  { href: '/dashboard/admin/reporting', label: 'Platform Rapportages', icon: FileBarChart, adminOnly: true },
  { href: '/dashboard/admin/settings', label: 'Admin Instellingen', icon: Settings, adminOnly: true },
  
  { href: '/dashboard/profile', label: 'Profiel', icon: User }, 
];

function SidebarNavigationContent() {
  const pathname = usePathname();
  const { currentDashboardRole, setCurrentDashboardRole } = useDashboardRole(); 
  const { state: sidebarState } = useSidebar();
  let currentSectionTitleDisplayed: string | null = null;
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true); 
  const [hasBillingAction, setHasBillingAction] = useState(true); 
  const [showCommunityNavItemForLeerling, setShowCommunityNavItemForLeerling] = useState(true);
  const [isOuderOnboardingPending, setIsOuderOnboardingPending] = useState(true); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const onboardingCompleted = localStorage.getItem(ONBOARDING_KEY_OUDER) === 'true';
        setIsOuderOnboardingPending(!onboardingCompleted);

        if (currentDashboardRole === 'leerling') {
            // Replace with actual logic if community access is controlled by settings
            const communityAccessAllowed = JSON.parse(localStorage.getItem(`privacySettings_child1_allowCommunityAccess`) ?? 'true');
            setShowCommunityNavItemForLeerling(communityAccessAllowed);
        } else {
            setShowCommunityNavItemForLeerling(true);
        }
    }
  }, [currentDashboardRole]);


  return (
    <>
      <SidebarHeader className="border-b">
        <div className="flex h-16 items-center justify-between px-4 group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-1">
          <SiteLogo 
            textClassName="group-data-[collapsible=icon]:hidden" 
            iconClassName="group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8" 
          />
        </div>
        <div className={cn(
            "p-4 border-b", 
            "group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:border-b-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
        )}>
          <Label htmlFor="role-switcher" className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1 group-data-[collapsible=icon]:hidden">
            <Shuffle className="h-3 w-3"/>
            Testrol Wisselaar
          </Label>
          <Select value={currentDashboardRole} onValueChange={(value: UserRoleType) => setCurrentDashboardRole(value)}>
            <SelectTrigger 
              id="role-switcher" 
              className="h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
              aria-label="Selecteer een rol"
            >
               <span className="group-data-[collapsible=icon]:hidden"><SelectValue placeholder="Selecteer een rol" /></span>
               <Shuffle className="h-5 w-5 group-data-[collapsible=icon]:block hidden" />
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
      
      <SidebarContent className="group-data-[state=collapsed]:group-data-[collapsible=icon]:pt-1">
        <SidebarMenu>
          {navItems.map((item, index) => {
            let showItem = false;
            if (currentDashboardRole === 'admin') {
              showItem = !item.tutorOnly && !item.leerlingOnly && !item.ouderOnly && !item.coachOnly && !item.isOuderOnboardingLink;
            } else if (currentDashboardRole === 'tutor') {
              showItem = (!!item.tutorOnly || item.href === '/dashboard/profile') && !item.adminOnly && !item.leerlingOnly && !item.ouderOnly && !item.coachOnly && !item.isOuderOnboardingLink;
            } else if (currentDashboardRole === 'coach') {
              showItem = (!!item.coachOnly || item.href === '/dashboard/profile') && !item.adminOnly && !item.leerlingOnly && !item.ouderOnly && !item.tutorOnly && !item.isOuderOnboardingLink;
            } else if (currentDashboardRole === 'leerling') {
              if (item.href === '/dashboard/community') {
                showItem = !!item.leerlingOnly && showCommunityNavItemForLeerling && !item.adminOnly && !item.tutorOnly && !item.ouderOnly && !item.coachOnly && !item.isOuderOnboardingLink;
              } else {
                showItem = (!!item.leerlingOnly || item.href === '/dashboard/profile') && !item.adminOnly && !item.tutorOnly && !item.ouderOnly && !item.coachOnly && !item.isOuderOnboardingLink;
              }
            } else if (currentDashboardRole === 'ouder') {
              if (item.isOuderOnboardingLink) {
                showItem = isOuderOnboardingPending; 
              } else {
                showItem = (!!item.ouderOnly || item.href === '/dashboard/profile') && !item.adminOnly && !item.tutorOnly && !item.leerlingOnly && !item.coachOnly;
              }
            }


            if (!showItem) return null;
            
            let renderSectionHeader = false;
            if (item.sectionTitle) { 
                if (item.sectionTitle !== currentSectionTitleDisplayed) { 
                    if (currentDashboardRole === 'admin' && item.sectionTitle === "ADMIN DASHBOARD") {
                        renderSectionHeader = true;
                    } else if (currentDashboardRole === 'tutor' && item.sectionTitle === "TUTOR PORTAAL") {
                        renderSectionHeader = true; 
                    } else if (currentDashboardRole === 'coach' && item.sectionTitle === "COACH PORTAAL") {
                        renderSectionHeader = true; 
                    } else if (currentDashboardRole === 'ouder' && item.sectionTitle === "OUDER PORTAAL") {
                        renderSectionHeader = true;
                    } else if (currentDashboardRole === 'leerling') {
                         if (item.sectionTitle !== "ADMIN DASHBOARD" && item.sectionTitle !== "TUTOR PORTAAL" && item.sectionTitle !== "OUDER PORTAAL" && item.sectionTitle !== "COACH PORTAAL") {
                            renderSectionHeader = true; 
                        }
                    }
                    if(renderSectionHeader) {
                      currentSectionTitleDisplayed = item.sectionTitle;
                    }
                }
            }

            const isItemDirectlyActive = pathname === item.href;
            
            const visibleChildren = item.children?.filter(child => {
                if (currentDashboardRole === 'admin') return !child.tutorOnly && !child.leerlingOnly && !child.ouderOnly && !child.coachOnly;
                if (currentDashboardRole === 'tutor') return (!!child.tutorOnly || child.href === '/dashboard/profile') && !child.adminOnly && !child.leerlingOnly && !child.ouderOnly && !child.coachOnly;
                if (currentDashboardRole === 'coach') return (!!child.coachOnly || child.href === '/dashboard/profile') && !child.adminOnly && !child.leerlingOnly && !child.ouderOnly && !child.tutorOnly;
                if (currentDashboardRole === 'leerling') return (!!child.leerlingOnly || child.href === '/dashboard/profile') && !child.adminOnly && !child.tutorOnly && !child.ouderOnly && !child.coachOnly;
                if (currentDashboardRole === 'ouder') return (!!child.ouderOnly || child.href === '/dashboard/profile') && !child.adminOnly && !child.tutorOnly && !child.leerlingOnly && !child.coachOnly;
                return false;
            }) || [];

            let isParentExpanded = isItemDirectlyActive;
             if(item.children && visibleChildren.length > 0){ 
                 isParentExpanded = visibleChildren.some(child => 
                    pathname === child.href || (child.parent && pathname.startsWith(child.parent))
                ) || isItemDirectlyActive;
            }

            let isParentHighlighted = false;
            if (isItemDirectlyActive) {
                 const childWithIdenticalHrefIsActive = visibleChildren.some(child => child.href === item.href && child.href === pathname);
                 if (!childWithIdenticalHrefIsActive) {
                     isParentHighlighted = true;
                 }
            } else if (item.children && visibleChildren.length > 0 && isParentExpanded) {
                const noChildIsMoreSpecificOrExactMatch = !visibleChildren.some(child =>
                    child.href === pathname || 
                    (child.href !== item.href && pathname.startsWith(child.href)) 
                );
                if (pathname.startsWith(item.href) && item.href !== '/' && noChildIsMoreSpecificOrExactMatch && item.href !== '/dashboard/ouder/lessen/overzicht') {
                    isParentHighlighted = true;
                }
            }
            if (item.href === '/dashboard/ouder/lessen/overzicht' && pathname === '/dashboard/ouder/lessen/overzicht' && !item.isSubItem) {
               isParentHighlighted = true;
            }
             if (item.label === "Mijn Kinderen" && pathname.startsWith("/dashboard/ouder/kinderen/") && pathname !== "/dashboard/ouder/kinderen") {
              isParentHighlighted = true;
            }

            const itemIsDisabled = currentDashboardRole === 'ouder' && 
                                   isOuderOnboardingPending && 
                                   !item.isOuderOnboardingLink &&
                                   item.href !== '/dashboard/profile';

            return (
              <Fragment key={`${item.href}-${index}`}>
                {renderSectionHeader && item.sectionTitle && (
                    <SidebarGroup className="pt-3 pb-1 group-data-[collapsible=icon]:hidden">
                        <SidebarGroupLabel>{item.sectionTitle}</SidebarGroupLabel>
                    </SidebarGroup>
                )}
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={(isParentHighlighted || (item.isOuderOnboardingLink && isOuderOnboardingPending)) && !item.isSubItem} 
                    tooltip={item.label}
                    disabled={itemIsDisabled}
                    className={cn(
                        item.isOuderOnboardingLink && isOuderOnboardingPending && "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 font-semibold animate-pulse"
                    )}
                  >
                    <Link href={itemIsDisabled ? '#' : item.href} aria-disabled={itemIsDisabled} className={itemIsDisabled ? 'pointer-events-none opacity-50' : ''}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden flex-grow">
                        {item.label}
                      </span>
                       {item.href === '/dashboard/ouder/facturatie' && currentDashboardRole === 'ouder' && hasBillingAction && !itemIsDisabled && (
                        <span
                          title="Facturatie actie vereist"
                          className="ml-auto mr-1 inline-block h-2 w-2 rounded-full bg-primary min-w-0 group-data-[collapsible=icon]:hidden"
                        />
                      )}
                    </Link>
                  </SidebarMenuButton>
                  {(item.href === '/dashboard/ouder/berichten' && currentDashboardRole === 'ouder' && hasUnreadMessages && !itemIsDisabled) && (
                    <SidebarMenuBadge title="Nieuwe berichten"></SidebarMenuBadge>
                  )}
                </SidebarMenuItem>

                {isParentExpanded && item.children && visibleChildren.length > 0 && !itemIsDisabled && (
                  <SidebarMenuSub>
                    {visibleChildren.map((child, childIndex) => {
                      const isChildActive = pathname === child.href || (child.href !== '/' && child.href !== item.href && pathname.startsWith(child.href) && child.href !== '/dashboard/ouder/lessen/overzicht');
                       const isExactLessenOverzichtActive = child.href === '/dashboard/ouder/lessen/overzicht' && pathname === '/dashboard/ouder/lessen/overzicht';
                       const childIsDisabled = currentDashboardRole === 'ouder' && isOuderOnboardingPending && child.href !== '/dashboard/profile';
                      return (
                        <SidebarMenuSubItem key={`${child.href}-${childIndex}`}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={isChildActive || isExactLessenOverzichtActive}
                            disabled={childIsDisabled}
                           >
                            <Link href={childIsDisabled ? '#' : child.href} aria-disabled={childIsDisabled} className={childIsDisabled ? 'pointer-events-none opacity-50' : ''}>
                              <child.icon />
                              {child.label}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}

export function DashboardSidebar() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  const pathname = usePathname();
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

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
