// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button'; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ClipboardList, BarChart3, MessageSquare, User, Settings, Users, Menu, BookOpenCheck, Users2, Lightbulb } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; 
import { useState, useEffect, Fragment } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: LayoutDashboard },
  { href: '/quizzes', label: 'Quizzen', icon: ClipboardList },
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
    href: '/dashboard/homework-assistance', // Parent links to "Online Tips & Tools"
    label: 'Huiswerkbegeleiding', 
    icon: BookOpenCheck,
    children: [
      { 
        href: '/dashboard/homework-assistance', 
        label: 'Online Tips & Tools', 
        icon: Lightbulb, // Icon for Online Tips & Tools
        isSubItem: true, 
        parent: '/dashboard/homework-assistance' 
      },
      { 
        href: '/dashboard/homework-assistance/tutors', // Placeholder link for 1-on-1
        label: '1-op-1 Begeleiding', 
        icon: Users2, // Icon for 1-on-1 Begeleiding
        isSubItem: true, 
        parent: '/dashboard/homework-assistance' 
      },
    ]
  },
  { href: '/dashboard/profile', label: 'Profiel', icon: User },
  { href: '/dashboard/admin/user-management', label: 'Gebruikersbeheer', icon: Users, adminOnly: true },
];


function SidebarNavigationContent() {
  const pathname = usePathname();
  // In a real app, userRole would come from an auth context
  const userRole: 'admin' | 'user' = 'admin'; // Placeholder for admin role check

  return (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <SiteLogo />
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start gap-1 p-4 text-sm font-medium">
          {navItems.map((item) => {
            if (item.adminOnly && userRole !== 'admin') {
              return null;
            }
            
            let isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/' && pathname.startsWith(item.href));
            
            // If it's a parent item, it's active if its own href matches or if any child is active
            // Exception: if a child has the exact same href as the parent, parent active state is based on that child.
            if (item.children) {
              const isAnyChildActive = item.children.some(child => pathname === child.href || (child.href !== '/' && pathname.startsWith(child.href)));
              if (isAnyChildActive) {
                // If parent's own link is NOT the one active, but a DIFFERENT child is, parent is active.
                // If parent's own link IS active (because a child shares it, or it's the direct target), isActive is already true.
                isActive = true;
              }
            }
            
            return (
              <Fragment key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                    isActive && !item.isSubItem && 'bg-primary/10 text-primary font-semibold' 
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
                {isActive && item.children && item.children.map(child => { // Render children only if parent is active
                   if (child.adminOnly && userRole !== 'admin') {
                    return null;
                  }
                  const isChildActive = pathname === child.href || (child.href !== '/' && pathname.startsWith(child.href));
                  return (
                    <Link
                      key={child.href} 
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

