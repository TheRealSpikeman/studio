// src/app/dashboard/layout.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelLeft } from '@/components/icons';
import { SidebarNavContent } from '@/components/layout/dashboard-sidebar'; // Import the content part

function DashboardLayoutUI({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated, after loading state is resolved
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Authenticatie controleren...</p>
      </div>
    );
  }

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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutUI>{children}</DashboardLayoutUI>;
}
