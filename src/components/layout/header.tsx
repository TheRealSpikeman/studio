import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <SiteLogo />
        <nav className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" asChild>
            <Link href="/quizzes">Quizzen</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/coaching">Coaching</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/#pricing">Prijzen</Link>
          </Button>
          <Button variant="link" asChild className="hidden sm:inline-flex">
            <Link href="/login">Inloggen</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Aanmelden</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
