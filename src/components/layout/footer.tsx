
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import { Briefcase, Facebook, Instagram, Linkedin, Twitter, Info, Users, ShieldCheck, MessageSquareText, HelpCircle, HeartHandshake, Gavel } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10 md:py-8">
          
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

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h4 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> Informatie
            </h4>
            <nav className="flex flex-col gap-1.5">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                Over Ons
              </Link>
              <Link href="/for-parents" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                Voor Ouders
              </Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                Prijzen
              </Link>
               <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                Contact
              </Link>
              <Link href="/neurodiversiteit" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                Neurodiversiteit
              </Link>
              <Link href="/samenwerkingen" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                Partners & Deskundigheid
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                Veelgestelde Vragen
              </Link>
            </nav>
          </div>

          {/* Column 3: Legal Links */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h4 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" /> Belangrijk
            </h4>
            <nav className="flex flex-col gap-1.5">
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Privacybeleid
                </Link>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Cookiebeleid
                </Link>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Algemene Voorwaarden
                </Link>
                <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Disclaimer
                </Link>
                <Link href="/feedback" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Feedback (Alpha)
                </Link>
            </nav>
          </div>

          {/* Column 4: Join Us */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Title "Doe Mee" and its icon are removed */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="h-5 w-5 text-primary" />
                <h5 className="text-sm font-semibold text-foreground">Word Tutor</h5>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs mb-1">
                Bied 1-op-1 huiswerkbegeleiding, help met studievaardigheden en specifieke vakken.
              </p>
              <Button variant="link" asChild className="px-0 text-sm text-primary hover:text-primary/80 h-auto py-0">
                  <Link href="/word-tutor">Meer informatie & Aanmelden (Tutor)</Link>
              </Button>
            </div>

            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <HeartHandshake className="h-5 w-5 text-primary" />
                <h5 className="text-sm font-semibold text-foreground">Word Coach</h5>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs mb-1">
                Als psycholoog/orthopedagoog: bied 1-op-1 begeleiding voor persoonlijke ontwikkeling en welzijn.
              </p>
              <Button variant="link" asChild className="px-0 text-sm text-primary hover:text-primary/80 h-auto py-0">
                  <Link href="/word-coach">Meer informatie & Aanmelden (Coach)</Link>
              </Button>
            </div>
          </div>

        </div>
         <div className="text-center py-4 border-t">
            <p className="text-xs text-muted-foreground">★ 4.8 – 1200+ jongeren gingen je voor</p>
        </div>
      </div>
    </footer>
  );
}
