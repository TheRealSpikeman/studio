// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ClipboardList, BarChart3, MessageSquare, User, Settings, Users as UsersIconLucide, Menu, BookOpenCheck, Users2, Lightbulb, Briefcase, GraduationCap, Euro, FileBarChart, ListChecks, FilePlus, BarChartHorizontal, FileText, FileEdit, MessagesSquare as MessagesSquareIcon, Shuffle, Clock, Contact, CalendarPlus, CalendarSearch, CalendarClock, HelpCircle, CreditCard, TrendingUp, Link2, UserCheck } from 'lucide-react'; 
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect, Fragment } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useDashboardRole, type UserRoleType } from '@/contexts/DashboardRoleContext'; 

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  tutorOnly?: boolean;
  leerlingOnly?: boolean;
  ouderOnly?: boolean;
  sectionTitle?: string;
  isSubItem?: boolean;
  parent?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  // Leerling Items
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, leerlingOnly: true },
  { href: '/quizzes', label: 'Quizzen', icon: ClipboardList, leerlingOnly: true },
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
    icon: BookOpenCheck,
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
  { href: '/dashboard/ouder', label: 'Ouder Dashboard', icon: LayoutDashboard, ouderOnly: true, sectionTitle: "Ouder Portaal" },
  { href: '/dashboard/ouder/kinderen', label: 'Mijn Kinderen', icon: Contact, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  {
    href: '/dashboard/ouder/kinderen', 
    label: 'Voortgang Kinderen',
    icon: TrendingUp,
    ouderOnly: true,
    isSubItem: false,
    parent: '/dashboard/ouder'
  },
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
  { href: '/dashboard/ouder/tutor-koppelen', label: 'Tutor Zoeken', icon: Link2, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { href: '/dashboard/ouder/gekoppelde-tutors', label: 'Gekoppelde Tutors', icon: UserCheck, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { href: '/dashboard/ouder/abonnementen', label: 'Abonnementen', icon: Euro, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { href: '/dashboard/ouder/facturatie', label: 'Facturatie', icon: CreditCard, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { href: '/dashboard/ouder/berichten', label: 'Berichten', icon: MessagesSquareIcon, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },
  { href: '/dashboard/ouder/faq', label: 'FAQ Ouders', icon: HelpCircle, ouderOnly: true, isSubItem: false, parent: '/dashboard/ouder' },


  // Tutor specific section
  { href: '/dashboard/tutor', label: 'Tutor Dashboard', icon: LayoutDashboard, tutorOnly: true, sectionTitle: "Tutor Portaal" },
  { href: '/dashboard/tutor/availability', label: 'Mijn Beschikbaarheid', icon: Clock, tutorOnly: true, isSubItem: false, parent: '/dashboard/tutor' },
  { href: '/dashboard/tutor/lessons', label: 'Alle Lessen (Tutor)', icon: BookOpenCheck, tutorOnly: true, isSubItem: false, parent: '/dashboard/tutor' },
  { href: '/dashboard/tutor/students', label: 'Mijn Leerlingen', icon: UsersIconLucide, tutorOnly: true, isSubItem: false, parent: '/dashboard/tutor' },


  // Admin specific section
  { href: '/dashboard/admin', label: 'Admin Dashboard', icon: LayoutDashboard, adminOnly: true, sectionTitle: "Admin Dashboard" },
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
  
  { href: '/dashboard/profile', label: 'Profiel', icon: User }, // Common for all roles
];

function SidebarNavigationContent() {
  const pathname = usePathname();
  const { currentDashboardRole, setCurrentDashboardRole } = useDashboardRole(); 
  let currentSectionTitleDisplayed: string | null = null;
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true); 
  const [hasBillingAction, setHasBillingAction] = useState(true); 

  return (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <SiteLogo />
      </div>
      <div className="p-4 border-b">
        <Label htmlFor="role-switcher" className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
          <Shuffle className="h-3 w-3"/>
          Testrol Wisselaar
        </Label>
        <Select value={currentDashboardRole} onValueChange={(value: UserRoleType) => setCurrentDashboardRole(value)}>
          <SelectTrigger id="role-switcher" className="h-9">
            <SelectValue placeholder="Selecteer een rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leerling">Leerling</SelectItem>
            <SelectItem value="ouder">Ouder</SelectItem>
            <SelectItem value="tutor">Tutor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
         <p className="text-xs text-muted-foreground mt-1">
          Sidebar past zich aan de gekozen rol aan.
        </p>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start gap-1 p-4 text-sm font-medium">
          {navItems.map((item, index) => {
            let showItem = false;
            if (currentDashboardRole === 'admin') {
              showItem = !item.tutorOnly && !item.leerlingOnly && !item.ouderOnly;
            } else if (currentDashboardRole === 'tutor') {
              showItem = (!!item.tutorOnly || item.href === '/dashboard/profile') && !item.adminOnly && !item.leerlingOnly && !item.ouderOnly;
            } else if (currentDashboardRole === 'leerling') {
              showItem = (!!item.leerlingOnly || item.href === '/dashboard/profile') && !item.adminOnly && !item.tutorOnly && !item.ouderOnly;
            } else if (currentDashboardRole === 'ouder') {
              showItem = (!!item.ouderOnly || item.href === '/dashboard/profile') && !item.adminOnly && !item.tutorOnly && !item.leerlingOnly;
            }

            if (!showItem) return null;
            
            let renderSectionHeader = false;
            if (item.sectionTitle) { 
                if (item.sectionTitle !== currentSectionTitleDisplayed) { 
                    if (currentDashboardRole === 'admin' && item.sectionTitle === "Admin Dashboard") {
                        renderSectionHeader = true;
                    } else if (currentDashboardRole === 'tutor' && item.sectionTitle === "Tutor Portaal") {
                        renderSectionHeader = true; 
                    } else if (currentDashboardRole === 'ouder' && item.sectionTitle === "Ouder Portaal") {
                        renderSectionHeader = true;
                    } else if (currentDashboardRole === 'leerling') {
                         if (item.sectionTitle !== "Admin Dashboard" && item.sectionTitle !== "Tutor Portaal" && item.sectionTitle !== "Ouder Portaal") {
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
                if (currentDashboardRole === 'admin') return !child.tutorOnly && !child.leerlingOnly && !child.ouderOnly;
                if (currentDashboardRole === 'tutor') return (!!child.tutorOnly || child.href === '/dashboard/profile') && !child.adminOnly && !child.leerlingOnly && !child.ouderOnly;
                if (currentDashboardRole === 'leerling') return (!!child.leerlingOnly || child.href === '/dashboard/profile') && !child.adminOnly && !child.tutorOnly && !child.ouderOnly;
                if (currentDashboardRole === 'ouder') return (!!child.ouderOnly || child.href === '/dashboard/profile') && !child.adminOnly && !child.tutorOnly && !child.leerlingOnly;
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
            if (item.label === "Voortgang Kinderen" && pathname.startsWith("/dashboard/ouder/kinderen/") && pathname !== "/dashboard/ouder/kinderen") {
              isParentHighlighted = true;
            }


            return (
              <Fragment key={`${item.href}-${index}`}>
                {renderSectionHeader && item.sectionTitle && (
                    <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider mt-3">
                        {item.sectionTitle}
                    </div>
                )}
                <Link
                    href={item.href}
                    className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                    isParentHighlighted && !item.isSubItem && 'bg-primary/10 text-primary font-semibold'
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {item.href === '/dashboard/ouder/berichten' && currentDashboardRole === 'ouder' && hasUnreadMessages && (
                        <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" title="Nieuwe berichten">
                            <span className="sr-only">Nieuwe berichten</span>
                        </span>
                    )}
                    {item.href === '/dashboard/ouder/facturatie' && currentDashboardRole === 'ouder' && hasBillingAction && (
                        <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-destructive animate-pulse" title="Facturatie actie vereist">
                            <span className="sr-only">Facturatie actie vereist</span>
                        </span>
                    )}
                </Link>

                {isParentExpanded && item.children && visibleChildren.map((child, childIndex) => {
                  const isChildActive = pathname === child.href || (child.href !== '/' && child.href !== item.href && pathname.startsWith(child.href) && child.href !== '/dashboard/ouder/lessen/overzicht');
                  const isExactLessenOverzichtActive = child.href === '/dashboard/ouder/lessen/overzicht' && pathname === '/dashboard/ouder/lessen/overzicht';

                  return (
                    <Link
                      key={`${child.href}-${childIndex}`}
                      href={child.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                        (isChildActive || isExactLessenOverzichtActive) && 'bg-primary/10 text-primary font-semibold',
                        child.isSubItem && 'ml-4 text-sm py-2' 
                      )}
                    >
                      <child.icon className="h-5 w-5" />
                      {child.label}
                    </Link>
                  );
                })}
              </Fragment>
            );
          })}
        </nav>
      </ScrollArea>
    </>
  );
}

export function DashboardSidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pathname = usePathname();
  useEffect(() => {
    if (isMobile) {
      setIsSheetOpen(false);
    }
  }, [pathname, isMobile]);


  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-64 bg-card">
          <SidebarNavigationContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col border-r bg-card shadow-lg md:flex">
      <SidebarNavigationContent />
    </aside>
  );
}
