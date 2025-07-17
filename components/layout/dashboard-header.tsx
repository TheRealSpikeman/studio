
// src/components/layout/dashboard-header.tsx
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from '@/lib/icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { NotificationBell } from '@/components/common/NotificationBell';
import { Badge } from '@/components/ui/badge';

export function DashboardHeader({ children }: { children?: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 print-hide">
      {children}
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        
        {/* TEMPORARY ROLE DISPLAY FOR TESTING */}
        <Badge variant="outline" className="border-red-500 text-red-500 text-[10px] px-1.5 py-0.5">
          Rol: {user ? user.role : 'Anoniem'}
        </Badge>
        {/* END TEMPORARY DISPLAY */}

        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name} data-ai-hint="user avatar" />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
             <DropdownMenuItem onSelect={() => router.push('/dashboard/profile')}>
                <UserIcon className="mr-2 h-4 w-4" /> Profiel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Uitloggen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
