// src/app/parental-approval/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteLogo } from "@/components/common/site-logo";
import Link from "next/link";
import { ShieldAlert, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ApprovalContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");

  const planNames: { [key: string]: string } = {
    coaching_tools_monthly: "Coaching & Tools - Maandelijks",
    coaching_tools_yearly: "Coaching & Tools - Jaarlijks",
    family_guide_monthly: "Gezins Gids - Maandelijks",
    family_guide_yearly: "Gezins Gids - Jaarlijks",
  };
  const planName = planId ? (planNames[planId] || "Geselecteerd Plan") : null;

  return (
    <Card className="w-full max-w-lg shadow-xl text-center">
      <CardHeader>
        <ShieldAlert className="mx-auto h-12 w-12 text-primary mb-3" />
        <CardTitle className="text-2xl font-bold">Belangrijke Informatie</CardTitle>
        <CardDescription>
          Bedankt voor uw interesse in MindNavigator. De manier waarop ouders een account aanmaken en abonnementen kiezen is bijgewerkt.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Om een account aan te maken en {planName ? `het "${planName}" abonnement te starten` : "een abonnement te kiezen"}, dient u zich eerst als ouder te registreren via onze hoofdsite.
          Na registratie en verificatie van uw e-mailadres, kunt u in uw ouder-dashboard kinderen toevoegen en een passend abonnement selecteren.
        </p>
        <p className="text-sm text-muted-foreground">
          Als u hier bent gekomen via een oudere link, excuses voor het ongemak.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href={planId ? `/signup?plan=${planId}` : "/signup"}>
              Ga naar Ouder Registratie
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/#pricing">
              Bekijk Abonnementen
            </Link>
          </Button>
        </div>
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md text-left text-sm">
          <Info className="inline-block h-5 w-5 mr-2 text-blue-600" />
          <strong className="text-blue-700">Hoe werkt het nu?</strong>
          <ol className="list-decimal list-inside ml-4 mt-1 space-y-1 text-muted-foreground">
            <li>U maakt als ouder een account aan via de registratiepagina.</li>
            <li>U verifieert uw e-mailadres.</li>
            <li>U logt in op uw nieuwe ouder-dashboard.</li>
            <li>Vanuit het dashboard voegt u uw kind(eren) toe.</li>
            <li>U kiest en activeert het gewenste abonnement voor uw kind(eren).</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ParentalApprovalPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Suspense fallback={<div>Pagina laden...</div>}>
        <ApprovalContent />
      </Suspense>
    </div>
  );
}
