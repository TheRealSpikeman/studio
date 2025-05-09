// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ClipboardList, BarChart3, MessageSquare, User, Settings, LogOut, Users } from 'lucide-react'; // Added Users

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: LayoutDashboard },
  { href: '/quizzes', label: 'Quizzen', icon: ClipboardList },
  { href: '/dashboard/results', label: 'Resultaten', icon: BarChart3 },
  { href: '/dashboard/coaching', label: 'Coaching', icon: MessageSquare },
  { href: '/dashboard/profile', label: 'Profiel', icon: User },
  // TODO: Conditionally show admin items based on user role
  { href: '/dashboard/admin/user-management', label: 'Gebruikersbeheer', icon: Users, adminOnly: true },
];


export function DashboardSidebar() {
  const pathname = usePathname();
  // In a real app, userRole would come from an auth context
  const userRole: 'admin' | 'user' = 'admin'; // Placeholder for admin role check

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-screen w-64 flex-col border-r bg-card shadow-lg">
      <div className="flex h-16 items-center border-b px-6">
        <SiteLogo />
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start gap-2 p-4 text-sm font-medium">
          {navItems.map((item) => {
            if (item.adminOnly && userRole !== 'admin') {
              return null;
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                  pathname === item.href && 'bg-primary/10 text-primary font-semibold'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        {/* TODO: User profile / logout */}
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
          <LogOut className="h-5 w-5" />
          Uitloggen
        </Button>
      </div>
    </aside>
  );
}

