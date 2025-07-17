"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import { LogOut, Menu } from '@/lib/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';


export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { href: "/pricing", label: "Prijzen" },
    { href: "/blog", label: "Blog" },
    { href: "/neurodiversiteit", label: "Neurodiversiteit" },
    { href: "/for-parents", label: "Voor ouders" },
    { href: "/about", label: "Over ons" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <SiteLogo />
          {/* TEMPORARY ROLE DISPLAY FOR TESTING */}
          <Badge variant="outline" className="border-red-500 text-red-500 text-[10px] px-1.5 py-0.5 hidden sm:inline-flex">
            Rol: {user ? user.role : 'Anoniem'}
          </Badge>
          {/* END TEMPORARY DISPLAY */}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button variant="ghost" asChild key={link.href}><Link href={link.href}>{link.label}</Link></Button>
          ))}
          {isAuthenticated ? (
            <>
              <Button variant="link" asChild><Link href="/dashboard">Mijn Dashboard</Link></Button>
              <Button onClick={logout} variant="outline"><LogOut className="mr-2 h-4 w-4"/> Uitloggen</Button>
            </>
          ) : (
            <>
              <Button variant="link" asChild><Link href="/login">Inloggen</Link></Button>
              <Button asChild><Link href="/signup">Aanmelden</Link></Button>
            </>
          )}
        </nav>
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><Menu className="h-6 w-6" /><span className="sr-only">Open menu</span></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild><Link href={link.href}>{link.label}</Link></DropdownMenuItem>
              ))}
               {isAuthenticated ? (
                <>
                  <DropdownMenuItem asChild><Link href="/dashboard">Mijn Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem onSelect={logout} className="text-destructive">Uitloggen</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild><Link href="/login">Inloggen</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/signup" className="font-semibold text-primary">Aanmelden</Link></DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
