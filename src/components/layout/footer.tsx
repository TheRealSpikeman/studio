import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import { Briefcase, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto flex flex-col items-center gap-8 py-10 md:flex-row md:justify-between md:gap-6 md:py-8">
        
        {/* Column 1: Logo and Copyright */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <SiteLogo className="mb-3" />
          <p className="text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} MindNavigator. Alle rechten voorbehouden.
          </p>
          {/* Placeholder for social media icons */}
          <div className="mt-4 flex gap-3">
            <Link href="#" aria-label="MindNavigator on Facebook" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="MindNavigator on Instagram" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="MindNavigator on Twitter" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
             <Link href="#" aria-label="MindNavigator on LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Column 2: Become Tutor CTA */}
        <div className="flex flex-col items-center text-center md:items-center">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="h-5 w-5 text-primary" />
            <h4 className="text-md font-semibold text-foreground">Word Tutor bij MindNavigator</h4>
          </div>
          <p className="text-xs text-muted-foreground max-w-xs">
            Help tieners 12–18 jaar met hun huiswerk, bepaal je eigen tarief en uren.
          </p>
          <Button variant="link" asChild className="px-0 text-sm text-primary hover:text-primary/80 h-auto py-0 mt-2">
            <Link href="/word-tutor">Meer informatie & Aanmelden</Link>
          </Button>
        </div>

        {/* Column 3: Policy Links */}
        <div className="flex flex-col items-center text-center md:items-end md:text-right">
          <nav className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center md:justify-end md:gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Privacybeleid
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Cookiebeleid
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Algemene Voorwaarden
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Contact
            </Link>
          </nav>
           {/* Placeholder for trust badges - example */}
           <div className="mt-4">
             <p className="text-xs text-muted-foreground">★ 4.8 – 1200+ jongeren gingen je voor</p>
           </div>
        </div>

      </div>
    </footer>
  );
}
