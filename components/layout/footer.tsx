
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import { Briefcase, Facebook, Instagram, Linkedin, Twitter, Info, Users, ShieldCheck, MessageSquareText, HelpCircle, HeartHandshake, Gavel, GitBranch, Rss, FileText, Handshake } from '@/lib/icons';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 print-hide">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10 md:py-8">
          
          {/* Column 1: Logo and Copyright */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <SiteLogo className="mb-3" />
            <p className="text-sm leading-loose text-muted-foreground">
              © {new Date().getFullYear()} MindNavigator. Alle rechten voorbehouden.
            </p>
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
               <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                Blog
              </Link>
               <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                Contact
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
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Algemene Voorwaarden
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Privacybeleid
                </Link>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Cookiebeleid
                </Link>
                <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Disclaimer
                </Link>
                 <Link href="/methodologie/adaptieve-quiz" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Quiz Methodologie
                </Link>
                <Link href="/methodologie/ai-validatie" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  AI Validatie
                </Link>
                <Link href="/feedback" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  Feedback (Alpha)
                </Link>
                 <Link href="/invest" className="text-sm text-accent hover:text-accent/80 hover:underline font-semibold">
                  Investment Proposal (Temp)
                </Link>
            </nav>
          </div>

          {/* Column 4: Join Us */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h4 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
              <Handshake className="h-5 w-5 text-primary" /> Doe Mee
            </h4>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="h-5 w-5 text-foreground/80" />
                  <h5 className="text-sm font-semibold text-foreground">Word Tutor</h5>
                </div>
                <p className="text-xs text-muted-foreground max-w-xs mb-1">
                  Help met huiswerk en studievaardigheden.
                </p>
                <Button variant="link" asChild className="px-0 text-sm text-primary hover:text-primary/80 h-auto py-0">
                    <Link href="/word-tutor">Info & Aanmelden</Link>
                </Button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <HeartHandshake className="h-5 w-5 text-foreground/80" />
                  <h5 className="text-sm font-semibold text-foreground">Word Coach</h5>
                </div>
                <p className="text-xs text-muted-foreground max-w-xs mb-1">
                  Begeleid jongeren als psycholoog/orthopedagoog.
                </p>
                <Button variant="link" asChild className="px-0 text-sm text-primary hover:text-primary/80 h-auto py-0">
                    <Link href="/word-coach">Info & Aanmelden</Link>
                </Button>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="h-5 w-5 text-foreground/80" />
                  <h5 className="text-sm font-semibold text-foreground">Vacatures</h5>
                </div>
                <p className="text-xs text-muted-foreground max-w-xs mb-1">
                  Kom ons team versterken en maak een verschil.
                </p>
                <Button variant="link" asChild className="px-0 text-sm text-primary hover:text-primary/80 h-auto py-0">
                    <Link href="/vacatures">Bekijk onze vacatures</Link>
                </Button>
              </div>
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
