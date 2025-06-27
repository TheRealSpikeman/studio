
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from 'lucide-react';

export function Header() {
  const navLinks = [
    { href: "/pricing", label: "Prijzen" },
    { href: "/neurodiversiteit", label: "Neurodiversiteit" },
    { href: "/for-parents", label: "Voor ouders" },
    { href: "/about", label: "Over ons" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print-hide">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <SiteLogo />
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button variant="ghost" asChild key={link.href}><Link href={link.href}>{link.label}</Link></Button>
          ))}
          <Button variant="link" asChild><Link href="/login">Inloggen</Link></Button>
          <Button asChild><Link href="/signup">Aanmelden</Link></Button>
        </nav>
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><Menu className="h-6 w-6" /><span className="sr-only">Open menu</span></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild><Link href={link.href}>{link.label}</Link></DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild><Link href="/login">Inloggen</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/signup" className="font-semibold text-primary">Aanmelden</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
