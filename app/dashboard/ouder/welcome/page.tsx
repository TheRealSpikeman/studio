// src/app/dashboard/ouder/welcome/page.tsx
"use client";

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OnboardingSteps } from '@/components/ouder/welcome/OnboardingSteps';
import { useRouter, useSearchParams } from 'next/navigation';

const ONBOARDING_KEY_OUDER = 'onboardingCompleted_ouder_v1';

function OuderWelcomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const planParam = searchParams.get('plan');
  const hasChosenPlan = !!planParam;

  const handleCompleteOnboarding = () => {
    if (!hasChosenPlan) {
      toast({
        title: "Kies eerst een plan",
        description: "Selecteer een abonnement voordat u verder gaat naar het dashboard.",
        variant: "destructive"
      });
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY_OUDER, 'true');
    }
    router.push('/dashboard/ouder');
  };

  const handlePlanSelect = (planId: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('plan', planId);
    window.history.pushState({ path: newUrl.href }, '', newUrl.href);
    router.replace(newUrl.href, { scroll: false });
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center bg-background py-10 px-4">
      <div className="w-full max-w-4xl text-center">
        
        <div className="mb-8 p-6 bg-primary/10 border border-primary/20 rounded-lg text-primary text-left shadow-sm">
          <h1 className="text-2xl font-semibold mb-3 flex items-center gap-2"><Compass className="h-7 w-7"/>Stel uw Ouder Dashboard in (~5 min)</h1>
          <p className="text-sm text-foreground/90 mb-4">Doorloop de onderstaande actiepunten om MindNavigator optimaal voor uw gezin in te richten:</p>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-foreground/80">
            <li><strong>Kies een Abonnement:</strong> Selecteer een plan. Dit activeert de overige instellingen.</li>
            <li><strong>Lees & Accepteer Voorwaarden:</strong> Essentieel voor een veilig en transparant gebruik.</li>
            <li><strong>Kind(eren) Toevoegen:</strong> Maak profielen aan voor uw kinderen. Zij ontvangen een e-mail om hun account te activeren.</li>
            <li><strong>Privacy & Delen Instellen:</strong> Bepaal per kind wat er gedeeld mag worden.</li>
            <li><strong>'Ken je Kind' Test (Optioneel):</strong> Krijg eerste inzichten die helpen bij het instellen en gesprekken.</li>
          </ol>
        </div>

        <OnboardingSteps
            planParam={planParam}
            onPlanSelect={handlePlanSelect}
        />

        <div className="flex flex-col items-center gap-3 mt-10">
           <Button
            onClick={handleCompleteOnboarding}
            className="w-full max-w-xs"
            size="lg"
            disabled={!hasChosenPlan}
          >
            Doorgaan naar mijn Ouder Dashboard
          </Button>
          <Link href="/for-parents" className="text-xs text-primary hover:underline">
            Meer informatie voor ouders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OuderWelcomePage() {
  return (
    <Suspense fallback={<div>Pagina laden...</div>}>
      <OuderWelcomePageContent />
    </Suspense>
  );
}
