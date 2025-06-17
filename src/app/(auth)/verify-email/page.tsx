
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Hourglass, CheckCircle2 } from 'lucide-react'; // Added Hourglass, CheckCircle2
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
  const flow = searchParams.get("flow"); // e.g., 'parent_approval_pending'
  const userType = searchParams.get("userType"); // 'teen' or 'parent'
  const parentApproved = searchParams.get("parentApproved") === "true";
  const teenEmailForParentContext = searchParams.get("teenEmail");


  const planNames: { [key: string]: string } = {
    coaching_tools_monthly: "Coaching & Tools - Maandelijks",
    coaching_tools_yearly: "Coaching & Tools - Jaarlijks",
    family_guide_monthly: "Gezins Gids - Maandelijks",
    family_guide_yearly: "Gezins Gids - Jaarlijks",
    // Legacy plan IDs for backward compatibility if needed, or remove if old links are not a concern
    monthly: "Coaching Maandelijks",
    annual: "Coaching Jaarlijks",
  };

  let titleText = "Controleer uw inbox";
  let descriptionText = "We hebben een verificatielink naar uw e-mailadres gestuurd. Klik op de link in de e-mail om uw account te activeren.";
  let IconComponent = MailCheck;

  if (userType === 'teen' && flow === 'parent_approval_pending') {
    titleText = "Wacht op goedkeuring ouder";
    descriptionText = `Je account is aangemaakt! We hebben een e-mail gestuurd naar je ouder/verzorger voor goedkeuring. Zodra zij toestemming geven, ontvang je bericht en kun je starten met MindNavigator.`;
    IconComponent = Hourglass;
  } else if (userType === 'parent' && parentApproved && teenEmailForParentContext) {
     titleText = "Bedankt voor uw goedkeuring!";
     descriptionText = `U heeft succesvol toestemming gegeven voor ${teenEmailForParentContext}. Verifieer nu uw eigen e-mailadres om uw ouderaccount te activeren. Hierna kunt u het abonnement voor uw gezin beheren en de voortgang van uw kinderen volgen.`;
     IconComponent = CheckCircle2;
  } else if (userType === 'parent' && isNewRegistration) {
    titleText = "Ouderaccount bijna klaar!";
    descriptionText = "We hebben een verificatielink naar uw e-mailadres gestuurd. Klik op de link om uw ouderaccount te activeren.";
    if (planParam) {
        const planName = planNames[planParam] || "Geselecteerd Plan";
        descriptionText += ` Hierna kunt u het "${planName}" abonnement voor uw gezin configureren en kinderen toevoegen.`;
    } else {
        descriptionText += ` Hierna kunt u kinderen toevoegen en een passend abonnement kiezen.`;
    }
    IconComponent = MailCheck;
  } else if (isNewRegistration) { // General new registration, potentially teen >= 16 or adult
    // Description might vary if it's a teen >= 16 vs adult. For now, generic.
    descriptionText = "We hebben een verificatielink naar uw e-mailadres gestuurd. Klik op de link in de e-mail om uw account te activeren en toegang te krijgen tot MindNavigator.";
    if (planParam) {
        const planName = planNames[planParam] || "Geselecteerd Plan";
      descriptionText += ` Vervolgens kunt u het "${planName}" abonnement activeren.`;
    }
    IconComponent = MailCheck;
  }


  const handleResendEmail = () => {
    // TODO: Implement actual resend email logic based on context (teen, parent, etc.)
    console.log("Resend verification email logic here for context:", { flow, userType, parentApproved });
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
            <IconComponent className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">{titleText}</CardTitle>
          <CardDescription>
            {descriptionText}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(flow !== 'parent_approval_pending') && ( // Hide resend for teens waiting on parents
            <>
              <p className="text-sm text-muted-foreground">
                Geen e-mail ontvangen? Controleer uw spamfolder of vraag hieronder een nieuwe verificatie-e-mail aan.
              </p>
              <Button onClick={handleResendEmail} className="w-full">
                Verificatie-e-mail opnieuw verzenden
              </Button>
            </>
          )}
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
