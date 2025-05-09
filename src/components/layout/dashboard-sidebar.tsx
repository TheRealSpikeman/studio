// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button'; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ClipboardList, BarChart3, MessageSquare, User, Settings, Users, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; 
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: LayoutDashboard },
  { href: '/quizzes', label: 'Quizzen', icon: ClipboardList },
  { href: '/dashboard/results', label: 'Resultaten', icon: BarChart3 },
  { href: '/dashboard/coaching', label: 'Coaching', icon: MessageSquare },
  { href: '/dashboard/coaching/settings', label: 'Coaching Instellingen', icon: Settings },
  { href: '/dashboard/profile', label: 'Profiel', icon: User },
  // TODO: Conditionally show admin items based on user role
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
        <nav className="grid items-start gap-2 p-4 text-sm font-medium">
          {navItems.map((item) => {
            if (item.adminOnly && userRole !== 'admin') {
              return null;
            }
            // Check for active parent for sub-items
            const isActive = pathname === item.href || (item.href === '/dashboard/coaching' && pathname.startsWith('/dashboard/coaching/settings'));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                  isActive && 'bg-primary/10 text-primary font-semibold'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </>
  );
}

export function DashboardSidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Control Sheet visibility

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sheet on navigation for mobile
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
