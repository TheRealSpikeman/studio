// src/components/layout/dashboard-layout.tsx
"use client";

import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import React, { ReactNode, useEffect, useState, useRef } from 'react'; // Added useState, useRef
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, UserCircle, ImageUp } from 'lucide-react'; // Added ImageUp
import Link from 'next/link';
import { DashboardRoleProvider, useDashboardRole, UserRoleType } from '@/contexts/DashboardRoleContext'; 
import { usePathname, useRouter } from 'next/navigation'; 
import Image from 'next/image'; // Added Image
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'; // Added Dialog components
import { Input } from '@/components/ui/input'; // Added Input

const predefinedAvatars = [
  { id: 'avatar1', src: 'https://placehold.co/200x200.png?text=A1', alt: 'Abstract geometrisch patroon', hint: 'abstract geometric' },
  { id: 'avatar2', src: 'https://placehold.co/200x200.png?text=A2', alt: 'Natuur landschap', hint: 'nature landscape' },
  { id: 'avatar3', src: 'https://placehold.co/200x200.png?text=A3', alt: 'Dieren portret', hint: 'animal portrait' },
  { id: 'avatar4', src: 'https://placehold.co/200x200.png?text=A4', alt: 'Ruimte en sterrenstelsels', hint: 'space galaxy' },
  { id: 'avatar5', src: 'https://placehold.co/200x200.png?text=A5', alt: 'Stadsgezicht skyline', hint: 'city skyline' },
  { id: 'avatar6', src: 'https://placehold.co/200x200.png?text=A6', alt: 'Lekker eten', hint: 'food delicious' },
];


function DashboardHeader() {
  const { currentDashboardRole } = useDashboardRole(); 
  const userName = "Alex"; // Placeholder
  const userEmail = "alex.tester@example.com"; // Placeholder
  const initialUserAvatarUrl = "https://picsum.photos/seed/alex-avatar/40/40"; // Placeholder

  const [currentHeaderAvatarUrl, setCurrentHeaderAvatarUrl] = useState<string | null>(initialUserAvatarUrl);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const userInitials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  const handleHeaderAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentHeaderAvatarUrl(reader.result as string);
        setIsAvatarModalOpen(false); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderSelectAvatar = (avatarSrc: string) => {
    setCurrentHeaderAvatarUrl(avatarSrc);
    setIsAvatarModalOpen(false);
  };
  
  const handleRemoveAvatar = () => {
    setCurrentHeaderAvatarUrl(null);
    // Optionally close modal or keep it open for other selections
    // setIsAvatarModalOpen(false); // Optional: close modal after removal
  };


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="ml-auto flex items-center gap-4">
        <div className="flex flex-col items-end">
            <p className="text-sm font-medium">Welkom, {userName}!</p>
            <p className="text-xs text-muted-foreground">{userEmail} (Rol: {currentDashboardRole})</p>
        </div>
        
        <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {/* Wrap the DialogTrigger around the Button that contains the Avatar */}
                    <DialogTrigger asChild> 
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-9 w-9">
                            <AvatarImage src={currentHeaderAvatarUrl || undefined} alt={userName || "User Avatar"} data-ai-hint="person avatar" />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DialogTrigger>
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
                    {/* Avatar change is now triggered by clicking the Avatar itself via DialogTrigger */}
                    <DropdownMenuItem onSelect={() => setIsAvatarModalOpen(true)}>
                        <ImageUp className="mr-2 h-4 w-4" />
                        Profielfoto wijzigen
                    </DropdownMenuItem>
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

            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Profielfoto Wijzigen</DialogTitle>
                <DialogDescription>
                  Upload een nieuwe foto of kies een van onze avatars. Deze wijziging is direct zichtbaar in de header.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Upload een foto</h4>
                  <Button onClick={() => avatarFileInputRef.current?.click()} variant="outline" className="w-full">
                    <ImageUp className="mr-2 h-4 w-4" /> Blader door bestanden
                  </Button>
                  <Input
                    type="file"
                    accept="image/*"
                    ref={avatarFileInputRef}
                    onChange={handleHeaderAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Of</span>
                  </div>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold">Kies een avatar</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {predefinedAvatars.map(avatar => (
                        <button
                          key={avatar.id}
                          onClick={() => handleHeaderSelectAvatar(avatar.src)}
                          className={`rounded-full overflow-hidden border-2 transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary
                            ${currentHeaderAvatarUrl === avatar.src ? 'border-primary ring-2 ring-primary scale-105' : 'border-transparent'}`}
                          title={avatar.alt}
                        >
                          <Image
                            src={avatar.src}
                            alt={avatar.alt}
                            width={80}
                            height={80}
                            className="aspect-square object-cover"
                            data-ai-hint={avatar.hint}
                          />
                        </button>
                      ))}
                    </div>
                </div>
                 {currentHeaderAvatarUrl && (
                    <Button variant="link" className="text-destructive p-0 h-auto justify-start" onClick={handleRemoveAvatar}>
                        Verwijder huidige foto/avatar
                    </Button>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Annuleren</Button>
                </DialogClose>
                {/* De save knop is niet per se nodig hier, de selectie is direct */}
              </DialogFooter>
            </DialogContent>
        </Dialog>

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
