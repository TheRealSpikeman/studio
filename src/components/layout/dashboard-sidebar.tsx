
// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ClipboardList, BarChart3, MessageSquare, User, Settings, Users, Menu, BookOpenCheck, Users2, Lightbulb, Briefcase, GraduationCap, DollarSign, FileBarChart, ListChecks, FilePlus, BarChartHorizontal, FileText, FileEdit, MessagesSquare, Shuffle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect, Fragment } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type UserRoleType = 'admin' | 'user' | 'tutor';

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: LayoutDashboard },
  { href: '/quizzes', label: 'Quizzen (Deelnemer)', icon: ClipboardList },
  { href: '/dashboard/results', label: 'Resultaten', icon: BarChart3 },
  {
    href: '/dashboard/coaching',
    label: 'Coaching',
    icon: MessageSquare,
    children: [
      { href: '/dashboard/coaching/settings', label: 'Instellingen Coaching', icon: Settings, isSubItem: true, parent: '/dashboard/coaching' },
    ]
  },
  {
    href: '/dashboard/homework-assistance',
    label: 'Huiswerkbegeleiding',
    icon: BookOpenCheck,
    children: [
      {
        href: '/dashboard/homework-assistance',
        label: 'Online Tips & Tools',
        icon: Lightbulb,
        isSubItem: true,
        parent: '/dashboard/homework-assistance'
      },
      {
        href: '/dashboard/homework-assistance/tutors',
        label: '1-op-1 Begeleiding',
        icon: Users2,
        isSubItem: true,
        parent: '/dashboard/homework-assistance'
      },
    ]
  },
  { href: '/dashboard/community', label: 'Community Forum', icon: MessagesSquare },
  { href: '/dashboard/profile', label: 'Profiel', icon: User },
  // Admin specific section
  { href: '/dashboard/admin', label: 'Admin Overzicht', icon: LayoutDashboard, adminOnly: true, sectionTitle: "Admin Dashboard" },
  { href: '/dashboard/admin/user-management', label: 'Gebruikersbeheer', icon: Users, adminOnly: true },
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
  // Tutor specific
  { href: '/dashboard/tutor', label: 'Tutor Dashboard', icon: Briefcase, tutorOnly: true, sectionTitle: "Tutor Portaal" },
];


function SidebarNavigationContent() {
  const pathname = usePathname();
  // In a real app, userRole would come from an authentication context/hook.
  // For testing, we use a state variable.
  const [userRole, setUserRole] = useState<UserRoleType>('admin');
  let currentSectionTitle = "";

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
        <Select value={userRole} onValueChange={(value: UserRoleType) => setUserRole(value)}>
          <SelectTrigger id="role-switcher" className="h-9">
            <SelectValue placeholder="Selecteer een rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">Deelnemer (User)</SelectItem>
            <SelectItem value="tutor">Tutor</SelectItem>
          </SelectContent>
        </Select>
         <p className="text-xs text-muted-foreground mt-1">
          Sidebar past zich aan de gekozen rol aan.
        </p>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start gap-1 p-4 text-sm font-medium">
          {navItems.map((item, index) => {
            let showItem = true;
            if (item.adminOnly && userRole !== 'admin') {
              showItem = false;
            }
            // @ts-ignore
            if (item.tutorOnly && userRole !== 'tutor') {
              showItem = false;
            }
            // Non-admin and non-tutor roles should not see adminOnly or tutorOnly items
            if (userRole === 'user' && (item.adminOnly || item.tutorOnly)) {
                showItem = false;
            }


            if (!showItem) return null;

            const isItemDirectlyActive = pathname === item.href;
            let isParentHighlighted = isItemDirectlyActive;
            let isParentExpanded = isItemDirectlyActive;

            if (item.children) {
              const isAnyChildActive = item.children.some(child =>
                pathname === child.href || (child.href !== '/' && child.href !== item.href && pathname.startsWith(child.href))
              );

              if (isAnyChildActive) {
                isParentExpanded = true;
              }

              if (isItemDirectlyActive) {
                 const activeChildIsNotParentDefault = item.children.some(child => pathname.startsWith(child.href) && child.href !== item.href);
                 if (activeChildIsNotParentDefault) {
                    isParentHighlighted = false;
                 }
              } else if (isAnyChildActive) {
                isParentHighlighted = false;
              }

            }

            const sectionTitleChanged = item.sectionTitle && item.sectionTitle !== currentSectionTitle;
            if (sectionTitleChanged) {
                currentSectionTitle = item.sectionTitle!;
            }

            // Ensure regular users don't see section titles for admin/tutor sections if they don't have access to any items in them
            const sectionHasVisibleItems = item.sectionTitle ? navItems.some(navItem => 
                navItem.sectionTitle === item.sectionTitle &&
                !(navItem.adminOnly && userRole !== 'admin') &&
                // @ts-ignore
                !(navItem.tutorOnly && userRole !== 'tutor') &&
                !(userRole === 'user' && (navItem.adminOnly || navItem.tutorOnly))
            ) : true;


            return (
              <Fragment key={`${item.href}-${index}`}>
                {sectionTitleChanged && sectionHasVisibleItems && (
                    <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider mt-3">
                        {currentSectionTitle}
                    </div>
                )}
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                    // @ts-ignore
                    isParentHighlighted && !item.isSubItem && 'bg-primary/10 text-primary font-semibold'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
                {isParentExpanded && item.children && item.children.map((child, childIndex) => {
                   // @ts-ignore
                   if (child.adminOnly && userRole !== 'admin') {
                    return null;
                  }
                  // @ts-ignore
                  if (child.tutorOnly && userRole !== 'tutor') {
                    return null;
                  }
                  const isChildActive = pathname === child.href || (child.href !== '/' && child.href !== item.href && pathname.startsWith(child.href));

                  return (
                    <Link
                      key={`${child.href}-${childIndex}`}
                      href={child.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                        isChildActive && 'bg-primary/10 text-primary font-semibold',
                        // @ts-ignore
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
