import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck } from 'lucide-react';
import Link from 'next/link';
import { SiteLogo } from '@/components/common/site-logo';

export default function VerifyEmailPage() {
  // TODO: Add action to resend email
  const handleResendEmail = () => {
    console.log("Resend verification email logic here.");
    // Add toast notification or similar feedback
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <MailCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Controleer je inbox</CardTitle>
          <CardDescription>
            We hebben een verificatielink naar je e-mailadres gestuurd. Klik op de link om je account te activeren.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Geen e-mail ontvangen? Controleer je spamfolder of probeer het opnieuw.
          </p>
          <Button onClick={handleResendEmail} className="w-full">
            Verificatie-e-mail opnieuw verzenden
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Terug naar Inloggen</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
