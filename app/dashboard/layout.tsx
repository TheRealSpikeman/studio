
// src/app/dashboard/layout.tsx
"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, PanelLeft } from '@/lib/icons';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SidebarNavContent } from '@/components/layout/dashboard-sidebar';

function DashboardLayoutUI({ children }: { children: ReactNode }) {
  const { user, isLoading, isLoggingOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // This effect handles redirection for unauthenticated users.
  useEffect(() => {
    if (!isLoading && !user && pathname !== '/dashboard/results') {
      router.replace('/login');
    }
  }, [user, isLoading, router, pathname]);

  // While checking auth state or logging out, show a loader.
  if (isLoading || isLoggingOut) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">{isLoggingOut ? 'Uitloggen...' : 'Authenticatie controleren...'}</p>
      </div>
    );
  }

  // If the user is authenticated, render the full dashboard layout.
  if (user) {
    return (
      <div className="min-h-screen bg-muted/30">
        <DashboardSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        <main className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:pl-20" : "md:pl-72"
        )}>
          <DashboardHeader>
              <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <PanelLeft className="h-5 w-5" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col w-72 p-0">
                        <SheetHeader className="sr-only">
                          <SheetTitle>Navigatie Menu</SheetTitle>
                        </SheetHeader>
                        <SidebarNavContent isCollapsed={false} setIsCollapsed={() => {}} />
                    </SheetContent>
                </Sheet>
            </div>
          </DashboardHeader>
          <div className="p-4 sm:p-6 lg:p-8">
              {children}
          </div>
        </main>
      </div>
    );
  }
  
  // If not authenticated and on the results page, render page without dashboard shell.
  // This allows anonymous users to see their results.
  if (pathname === '/dashboard/results') {
    return <>{children}</>;
  }

  // If not authenticated and on any other dashboard page, they are being redirected.
  // Show a loader in the meantime.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Authenticatie controleren...</p>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutUI>{children}</DashboardLayoutUI>;
}
