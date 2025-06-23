// src/app/dashboard/layout.tsx
"use client";

import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import React, { ReactNode, useEffect, useState } from 'react'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, UserCircle } from 'lucide-react'; 
import Link from 'next/link';
import { DashboardRoleProvider, useDashboardRole, UserRoleType } from '@/contexts/DashboardRoleContext'; 
import { usePathname, useRouter } from 'next/navigation'; 
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const roleSpecificUserData: Record<UserRoleType, { name: string; email: string; avatarSeed: string }> = {
  leerling: { name: "Alex Leerling", email: "alex.leerling@example.com", avatarSeed: "alex-leerling" },
  ouder: { name: "Olivia Ouder", email: "olivia.ouder@example.com", avatarSeed: "olivia-ouder" },
  tutor: { name: "Thomas Tutor", email: "thomas.tutor@example.com", avatarSeed: "thomas-tutor" },
  coach: { name: "Carla Coach", email: "carla.coach@example.com", avatarSeed: "carla-coach" },
  admin: { name: "Adam Admin", email: "adam.admin@example.com", avatarSeed: "adam-admin" },
};


function DashboardHeader() {
  const { currentDashboardRole } = useDashboardRole(); 
  const currentUser = roleSpecificUserData[currentDashboardRole] || roleSpecificUserData.leerling; 

  const userName = currentUser.name;
  const userEmail = currentUser.email;
  const userAvatarUrl = `https://picsum.photos/seed/${currentUser.avatarSeed}/40/40`;

  const userInitials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="mr-2 md:hidden" /> 
      <Button variant="ghost" size="icon" className="hidden md:flex h-9 w-9" asChild>
        <SidebarTrigger />
      </Button>
      
      <div className="flex-1">
        {/* Potentiële plek voor broodkruimels of paginatitel als nodig */}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
            <p className="text-sm font-medium">Welkom, {userName}!</p>
            <p className="text-xs text-muted-foreground">{userEmail} (Actieve rol: {currentDashboardRole})</p>
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
                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Uitloggen
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function DashboardContentWrapper({ children }: { children: ReactNode }) {
  const { currentDashboardRole } = useDashboardRole();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const roleBasePaths: Record<UserRoleType, string> = {
      admin: '/dashboard/admin',
      leerling: '/dashboard',
      tutor: '/dashboard/tutor',
      ouder: '/dashboard/ouder',
      coach: '/dashboard/coach', 
    };

    let shouldRedirect = false;
    let targetPath = '';

    if (pathname === '/dashboard/profile') {
      return;
    }

    switch (currentDashboardRole) {
      case 'admin':
        if (!pathname.startsWith('/dashboard/admin')) {
          shouldRedirect = true;
          targetPath = roleBasePaths.admin;
        }
        break;
      case 'tutor':
        if (!pathname.startsWith('/dashboard/tutor')) {
          shouldRedirect = true;
          targetPath = roleBasePaths.tutor;
        }
        break;
      case 'coach': 
        if (!pathname.startsWith('/dashboard/coach')) {
          shouldRedirect = true;
          targetPath = roleBasePaths.coach;
        }
        break;
      case 'ouder':
        if (!pathname.startsWith('/dashboard/ouder')) {
          shouldRedirect = true;
          targetPath = roleBasePaths.ouder;
        }
        break;
      case 'leerling':
        const allowedLeerlingPathPrefixes = [
          '/dashboard/coaching', 
          '/dashboard/results', 
          '/dashboard/homework-assistance', 
          '/dashboard/community',
          '/dashboard/leerling/lessons',
          '/dashboard/leerling/quizzes',
          '/dashboard/leerling/welcome'
        ];
        const isPathAllowedForLeerling = 
          pathname === '/dashboard' || 
          allowedLeerlingPathPrefixes.some(p => pathname.startsWith(p));

        if (!isPathAllowedForLeerling) {
          if (pathname.startsWith('/dashboard/admin') || 
              pathname.startsWith('/dashboard/tutor') || 
              pathname.startsWith('/dashboard/coach') || 
              pathname.startsWith('/dashboard/ouder')) {
            shouldRedirect = true;
            targetPath = roleBasePaths.leerling;
          }
        }
        break;
    }
    
    if (shouldRedirect && targetPath && pathname !== targetPath) {
       router.replace(targetPath);
    }

  }, [currentDashboardRole, pathname, router]);

  return <>{children}</>;
}


function DashboardMainContainer({ children }: { children: React.ReactNode }) {
    // This component is now simplified. The layout is handled by flexbox
    // and the placeholder div from the sidebar component itself.
    return (
        <div className="flex flex-1 flex-col">
            <DashboardHeader /> 
            <main className="flex-1 p-6 md:p-8 lg:p-10 bg-secondary/30">
                {children}
            </main>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  // Server-side rendering skeleton to prevent hydration errors.
  // This matches the initial state of the client before useEffect runs.
  if (!isClient) {
    return (
      <div className="flex min-h-screen w-full">
        {/* Renders a static skeleton of the collapsed sidebar */}
        <div className="hidden md:block w-[3.5rem] border-r bg-card shadow-lg" />
        <div className="flex flex-1 flex-col">
           <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
             <Skeleton className="h-9 w-9" />
             <div className="flex-1" />
             <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40 mt-1" />
                </div>
                <Skeleton className="h-9 w-9 rounded-full" />
             </div>
           </header>
           <main className="flex-1 p-6 md:p-8 lg:p-10 bg-secondary/30">
             {children}
           </main>
        </div>
      </div>
    );
  }

  // Client-side render with full context and dynamic classes
  return (
    <SidebarProvider>
      <DashboardRoleProvider>
          <div className="flex min-h-screen w-full">
            <DashboardSidebar />
            <DashboardMainContainer>
              <DashboardContentWrapper>{children}</DashboardContentWrapper>
            </DashboardMainContainer>
          </div>
      </DashboardRoleProvider>
    </SidebarProvider>
  );
}
