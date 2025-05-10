import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:flex-row md:py-6">
        <div className="text-center md:text-left">
          <p className="text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} MindNavigator. Alle rechten voorbehouden.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
           <div className="mb-2 md:mb-0">
            <h4 className="text-sm font-semibold text-foreground">Word Tutor bij MindNavigator</h4>
            <p className="text-xs text-muted-foreground">Help tieners 12–18 jaar met hun huiswerk, bepaal je eigen tarief en uren.</p>
            <Button variant="link" asChild className="px-0 text-xs text-primary hover:text-primary/80 h-auto py-0 mt-1">
                <Link href="/word-tutor">Meer informatie & Aanmelden</Link>
            </Button>
          </div>
          <nav className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacybeleid
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
              Cookiebeleid
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Algemene Voorwaarden
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
