// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ClipboardList, BarChart3, MessageSquare, User, Settings, Users as UsersIconLucide, Menu, BookOpenCheck, Users2, Lightbulb, Briefcase, GraduationCap, DollarSign, FileBarChart, ListChecks, FilePlus, BarChartHorizontal, FileText, FileEdit, MessagesSquare, Shuffle, Clock } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect, Fragment } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useDashboardRole, type UserRoleType } from '@/contexts/DashboardRoleContext'; // Importeer de hook en type

// NavItem interface blijft hetzelfde
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  tutorOnly?: boolean;
  userOnly?: boolean;
  sectionTitle?: string;
  isSubItem?: boolean;
  parent?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  // General User Items
  { href: '/dashboard', label: 'Overzicht', icon: LayoutDashboard, userOnly: true },
  { href: '/quizzes', label: 'Quizzen', icon: ClipboardList, userOnly: true },
  { href: '/dashboard/results', label: 'Resultaten', icon: BarChart3, userOnly: true },
  {
    href: '/dashboard/coaching',
    label: 'Coaching',
    icon: MessageSquare,
    userOnly: true,
    children: [
      { href: '/dashboard/coaching/settings', label: 'Instellingen Coaching', icon: Settings, isSubItem: true, parent: '/dashboard/coaching', userOnly: true },
    ]
  },
  {
    href: '/dashboard/homework-assistance',
    label: 'Huiswerkbegeleiding',
    icon: BookOpenCheck,
    userOnly: true,
    children: [
      {
        href: '/dashboard/homework-assistance', 
        label: 'Online Tips & Tools',
        icon: Lightbulb,
        isSubItem: true,
        parent: '/dashboard/homework-assistance',
        userOnly: true,
      },
      {
        href: '/dashboard/homework-assistance/tutors',
        label: '1-op-1 Begeleiding',
        icon: Users2,
        isSubItem: true,
        parent: '/dashboard/homework-assistance',
        userOnly: true,
      },
    ]
  },
  { href: '/dashboard/community', label: 'Community Forum', icon: MessagesSquare, userOnly: true },
  
  // Tutor specific section
  { href: '/dashboard/tutor', label: 'Tutor Dashboard', icon: LayoutDashboard, tutorOnly: true, sectionTitle: "Tutor Portaal" },
  { href: '/dashboard/tutor/availability', label: 'Mijn Beschikbaarheid', icon: Clock, tutorOnly: true, isSubItem: false, parent: '/dashboard/tutor' },
  { href: '/dashboard/tutor/lessons', label: 'Mijn Lessen', icon: BookOpenCheck, tutorOnly: true, isSubItem: false, parent: '/dashboard/tutor' },
  { href: '/dashboard/tutor/students', label: 'Mijn Leerlingen', icon: UsersIconLucide, tutorOnly: true, isSubItem: false, parent: '/dashboard/tutor' },


  // Admin specific section
  { href: '/dashboard/admin', label: 'Admin Overzicht', icon: LayoutDashboard, adminOnly: true, sectionTitle: "Admin Dashboard" },
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
  { href: '/dashboard/admin/finance', label: 'Financiën', icon: DollarSign, adminOnly: true },
  { href: '/dashboard/admin/reporting', label: 'Platform Rapportages', icon: FileBarChart, adminOnly: true },
  { href: '/dashboard/admin/settings', label: 'Admin Instellingen', icon: Settings, adminOnly: true },
  
  { href: '/dashboard/profile', label: 'Profiel', icon: User },
];

function SidebarNavigationContent() {
  const pathname = usePathname();
  const { currentDashboardRole, setCurrentDashboardRole } = useDashboardRole(); // Gebruik de context
  let currentSectionTitleDisplayed: string | null = null;

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
            <SelectItem value="user">Deelnemer (User)</SelectItem>
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
              showItem = !item.tutorOnly && !item.userOnly;
            } else if (currentDashboardRole === 'tutor') {
              showItem = (!!item.tutorOnly || item.href === '/dashboard/profile') && !item.adminOnly && !item.userOnly;
            } else if (currentDashboardRole === 'user') {
              showItem = (!!item.userOnly || item.href === '/dashboard/profile') && !item.adminOnly && !item.tutorOnly;
            }

            if (!showItem) return null;
            
            let renderSectionHeader = false;
            if (item.sectionTitle) { 
                if (item.sectionTitle !== currentSectionTitleDisplayed) { 
                    if (currentDashboardRole === 'admin' && item.sectionTitle === "Admin Dashboard") {
                        renderSectionHeader = true;
                    } else if (currentDashboardRole === 'tutor' && item.sectionTitle === "Tutor Portaal") {
                        renderSectionHeader = true; // Always render for Tutor Portaal title
                    } else if (currentDashboardRole === 'user') {
                         if (item.sectionTitle !== "Admin Dashboard" && item.sectionTitle !== "Tutor Portaal") {
                            renderSectionHeader = true; 
                        }
                    }
                    currentSectionTitleDisplayed = item.sectionTitle;
                }
            }

            const isItemDirectlyActive = pathname === item.href;
            
            const visibleChildren = item.children?.filter(child => {
                if (currentDashboardRole === 'admin') return !child.tutorOnly && !child.userOnly;
                if (currentDashboardRole === 'tutor') return (!!child.tutorOnly || child.href === '/dashboard/profile') && !child.adminOnly && !child.userOnly;
                if (currentDashboardRole === 'user') return (!!child.userOnly || child.href === '/dashboard/profile') && !child.adminOnly && !child.tutorOnly;
                return false;
            }) || [];

            let isParentExpanded = isItemDirectlyActive;
            if(item.children && visibleChildren.length > 0){ 
                 isParentExpanded = visibleChildren.some(child => 
                    pathname === child.href || (child.href !== '/' && child.href !== item.href && pathname.startsWith(child.href))
                ) || isItemDirectlyActive;
            }

            let isParentHighlighted = isItemDirectlyActive;
            if(isParentExpanded && item.children && visibleChildren.length > 0){
                 const activeChildIsNotParentDefault = visibleChildren.some(child => pathname.startsWith(child.href) && child.href !== item.href);
                 if (activeChildIsNotParentDefault) {
                    isParentHighlighted = false;
                 } else if(isItemDirectlyActive) {
                    isParentHighlighted = true;
                 } else {
                    isParentHighlighted = false; 
                 }
            }
            
            // Special handling for Tutor Portaal: don't render the main link if it's the section title itself
            const skipRenderingMainLink = currentDashboardRole === 'tutor' && item.sectionTitle === "Tutor Portaal" && item.href === '/dashboard/tutor';

            return (
              <Fragment key={`${item.href}-${index}`}>
                {renderSectionHeader && item.sectionTitle && (
                    <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider mt-3">
                        {item.sectionTitle}
                    </div>
                )}
                {!skipRenderingMainLink && (
                    <Link
                        href={item.href}
                        className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                        isParentHighlighted && !item.isSubItem && 'bg-primary/10 text-primary font-semibold'
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                )}


                {isParentExpanded && item.children && visibleChildren.map((child, childIndex) => {
                  if (currentDashboardRole === 'tutor' && (child.href === '/dashboard/tutor' || child.href === '/dashboard/profile')) return null;
                  
                  const isChildActive = pathname === child.href || (child.href !== '/' && child.href !== item.href && pathname.startsWith(child.href));
                  return (
                    <Link
                      key={`${child.href}-${childIndex}`}
                      href={child.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                        isChildActive && 'bg-primary/10 text-primary font-semibold',
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
