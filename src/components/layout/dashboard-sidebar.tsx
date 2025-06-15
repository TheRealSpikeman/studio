
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

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  tutorOnly?: boolean;
  sectionTitle?: string;
  isSubItem?: boolean;
  parent?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
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
  // Tutor specific - Tutor Dashboard now before Profile
  { href: '/dashboard/tutor', label: 'Tutor Dashboard', icon: Briefcase, tutorOnly: true, sectionTitle: "Tutor Portaal" },
  // Profile link moved after Tutor Dashboard for general order. It will still be filtered by role logic.
  { href: '/dashboard/profile', label: 'Profiel', icon: User },
];


function SidebarNavigationContent() {
  const pathname = usePathname();
  // In a real app, userRole would come from an authentication context/hook.
  const [userRole, setUserRole] = useState<UserRoleType>('admin'); // Default to admin for initial load
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
            let showItem = false;
            if (userRole === 'admin') {
              showItem = !item.tutorOnly; 
            } else if (userRole === 'tutor') {
              // Tutor only sees their specific items and profile
              showItem = (!!item.tutorOnly || item.href === '/dashboard/profile') && !item.adminOnly;
            } else if (userRole === 'user') {
              showItem = !item.adminOnly && !item.tutorOnly;
            }

            if (!showItem) return null;
            
            let renderSectionHeader = false;
            if (item.sectionTitle) { 
                if (item.sectionTitle !== currentSectionTitleDisplayed) { 
                    if (userRole === 'admin' && item.sectionTitle === "Admin Dashboard") {
                        renderSectionHeader = true;
                    } else if (userRole === 'user') {
                        // Users don't see "Admin Dashboard" or "Tutor Portaal" titles
                        if (item.sectionTitle !== "Admin Dashboard" && item.sectionTitle !== "Tutor Portaal") {
                            renderSectionHeader = true; // For potential future user-specific section titles
                        }
                    }
                    // For 'tutor' role, "Tutor Portaal" title is explicitly NOT rendered here.
                    currentSectionTitleDisplayed = item.sectionTitle;
                }
            } else {
                // If an item does not have a sectionTitle, we consider the "section" to have ended for title display purposes.
                // This helps if general items follow a titled section.
                // currentSectionTitleDisplayed = null; // Reset if no title on current item
            }

            const isItemDirectlyActive = pathname === item.href;
            
            const visibleChildren = item.children?.filter(child => {
                if (userRole === 'admin') return !child.tutorOnly;
                if (userRole === 'tutor') return (!!child.tutorOnly || child.href === '/dashboard/profile') && !child.adminOnly ;
                if (userRole === 'user') return !child.adminOnly && !child.tutorOnly;
                return false;
            }) || [];

            let isParentExpanded = isItemDirectlyActive;
            if(item.children && visibleChildren.length > 0){ // Check visibleChildren
                 isParentExpanded = visibleChildren.some(child => // Check against visibleChildren
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
                </Link>
                {isParentExpanded && item.children && visibleChildren.map((child, childIndex) => {
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
