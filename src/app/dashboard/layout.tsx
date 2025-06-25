// src/app/dashboard/layout.tsx
"use client";

import { DashboardSidebar, SidebarNavContent } from '@/components/layout/dashboard-sidebar';
import type { ReactNode } from 'react'; 
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, UserCircle, Menu, Loader2 } from 'lucide-react'; 
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation'; 
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false); // Close sidebar on navigation change
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-card flex flex-col">
        <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
        <SidebarNavContent isCollapsed={false} setIsCollapsed={() => {}} />
      </SheetContent>
    </Sheet>
  )
}

function DashboardHeader() {
  const { user, logout, isLoading } = useAuth(); 

  if (isLoading) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </header>
    );
  }

  const userName = user?.name || 'Gast';
  const userEmail = user?.email || '';
  const userAvatarUrl = user?.avatarUrl;
  const userInitials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <MobileSidebar />
      <div className="flex-1">
        {/* Potential place for breadcrumbs or page title if needed */}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
            <p className="text-sm font-medium">Welkom, {userName}!</p>
            <p className="text-xs text-muted-foreground">Actieve rol: {user?.role}</p>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                    <AvatarImage src={userAvatarUrl || undefined} alt={userName || "User Avatar"} data-ai-hint="person avatar" />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                    </p>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profiel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Uitloggen
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function InnerLayout({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
          <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div className={cn(
            "flex flex-1 flex-col transition-all duration-300 ease-in-out",
            isCollapsed ? "md:ml-20" : "md:ml-72"
          )}>
            <DashboardHeader />
            <main className="flex-1 p-6 md:p-8 lg:p-10">
              {children}
            </main>
          </div>
        </div>
    )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
        <InnerLayout>{children}</InnerLayout>
    </AuthProvider>
  );
}
