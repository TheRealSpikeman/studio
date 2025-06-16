
// src/components/layout/dashboard-layout.tsx
"use client";

import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, UserCircle } from 'lucide-react'; // Removed ImageUp
import Link from 'next/link';
import { DashboardRoleProvider, useDashboardRole, UserRoleType } from '@/contexts/DashboardRoleContext'; 
import { usePathname, useRouter } from 'next/navigation'; 

// Removed Dialog, Image related imports as they are no longer used here for avatar editing.
// Removed predefinedAvatars, and avatar editing state/functions from header.

function DashboardHeader() {
  const { currentDashboardRole } = useDashboardRole(); 
  const userName = "Alex"; // Placeholder
  const userEmail = "alex.tester@example.com"; // Placeholder
  const userAvatarUrl = "https://picsum.photos/seed/alex-avatar/40/40"; // Placeholder - simple direct URL

  const userInitials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="ml-auto flex items-center gap-4">
        <div className="flex flex-col items-end">
            <p className="text-sm font-medium">Welkom, {userName}!</p>
            <p className="text-xs text-muted-foreground">{userEmail} (Rol: {currentDashboardRole})</p>
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                  {/* AvatarImage now uses a simple, direct URL. Logic for changing it is moved to profile page. */}
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
                {/* Removed "Profielfoto wijzigen" DropdownMenuItem */}
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
          '/dashboard/leerling/lessons'
        ];
        const isPathAllowedForLeerling = 
          pathname === '/dashboard' || 
          allowedLeerlingPathPrefixes.some(p => pathname.startsWith(p));

        if (!isPathAllowedForLeerling) {
          if (pathname.startsWith('/dashboard/admin') || 
              pathname.startsWith('/dashboard/tutor') || 
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


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardRoleProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col md:pl-64">
          <DashboardHeader /> 
          <main className="flex-1 p-6 md:p-8 lg:p-10 bg-secondary/30">
            <DashboardContentWrapper>{children}</DashboardContentWrapper>
          </main>
        </div>
      </div>
    </DashboardRoleProvider>
  );
}
