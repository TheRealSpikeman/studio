
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck } from 'lucide-react';
import Link from 'next/link';
import { SiteLogo } from '@/components/common/site-logo';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


function VerifyEmailContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const isNewRegistration = searchParams.get("newRegistration") === "true";

  const planNames: { [key: string]: string } = {
    coaching_tools_monthly: "Coaching & Tools - Maandelijks",
    coaching_tools_yearly: "Coaching & Tools - Jaarlijks",
    family_guide_monthly: "Gezins Gids - Maandelijks",
    family_guide_yearly: "Gezins Gids - Jaarlijks",
    // Legacy plan IDs for backward compatibility if needed, or remove if old links are not a concern
    monthly: "Coaching Maandelijks",
    annual: "Coaching Jaarlijks",
  };

  let descriptionText = "We hebben een verificatielink naar uw e-mailadres gestuurd. Klik op de link in de e-mail om uw account te activeren.";
  if (isNewRegistration) {
    descriptionText += " Na verificatie kunt u inloggen op uw ouder-dashboard om uw gezinsprofiel in te stellen en kinderen toe te voegen.";
    if (planParam) {
        const planName = planNames[planParam] || "Geselecteerd Plan";
      descriptionText += ` Vervolgens kunt u het "${planName}" abonnement voor uw gezin activeren.`;
    }
  }


  const handleResendEmail = () => {
    console.log("Resend verification email logic here.");
    toast({
      title: "Verificatie-e-mail opnieuw verzonden",
      description: "Een nieuwe verificatielink is naar uw e-mailadres gestuurd. Controleer uw inbox (en spamfolder).",
      variant: "default",
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Controleer uw inbox</CardTitle>
          <CardDescription>
            {descriptionText}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Geen e-mail ontvangen? Controleer uw spamfolder of vraag hieronder een nieuwe verificatie-e-mail aan.
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Pagina laden...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

