// src/app/dashboard/leerling/welcome/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Sparkles, CheckSquare, BookOpen, ArrowRight, UserCircle } from 'lucide-react';

// Dummy user data - in a real app, this would come from context/auth
const currentUser = {
  name: "Alex", 
  ageGroup: "15-18" as "12-14" | "15-18" | "adult", 
};

const ONBOARDING_KEY_LEERLING = 'onboardingCompleted_leerling_v1';

export default function LeerlingWelcomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCompleteOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY_LEERLING, 'true');
    }
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-2xl text-center">
        <Sparkles className="mx-auto h-14 w-14 text-primary mb-4" />
        <h1 className="text-3xl font-bold text-foreground">
          Welkom bij MindNavigator, {currentUser.name}!
        </h1>
        <p className="text-lg text-muted-foreground mt-2 mb-8">
          Klaar om jezelf beter te leren kennen en je sterke punten te ontdekken?
        </p>
        
        <p className="text-base text-foreground/90 leading-relaxed mb-6">
          MindNavigator is jouw persoonlijke gids. We beginnen met een korte zelfreflectie tool die speciaal voor jouw leeftijdscategorie ({currentUser.ageGroup} jaar) is ontworpen. Dit helpt je:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
          <div className="flex items-start space-x-3 p-4 bg-card rounded-lg border shadow-sm">
            <UserCircle className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Jouw Unieke Profiel</h4>
              <p className="text-sm text-muted-foreground">Ontdek je denkstijl, hoe je informatie verwerkt en wat jou energie geeft.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-card rounded-lg border shadow-sm">
            <CheckSquare className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Sterke Punten & Uitdagingen</h4>
              <p className="text-sm text-muted-foreground">Leer waar je goed in bent en waar je misschien wat extra ondersteuning kunt gebruiken.</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-primary/10 rounded-lg border border-primary/30 text-left mb-10 shadow-md">
          <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Jouw Eerste Stap: De Zelfreflectie Tool
          </h3>
          <p className="text-foreground/80 mb-4 text-base">
            Deze set vragen (ongeveer 10-15 minuten) helpt ons je een eerste, persoonlijk overzicht te geven. Er zijn geen foute antwoorden!
          </p>
          <Button size="lg" className="w-full" asChild>
            <Link href={`/dashboard/leerling/quizzes?ageGroup=${currentUser.ageGroup}`}>
              Start de Zelfreflectie Tool Nu <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-8">
          Na de zelfreflectie tool ontgrendel je meer inzichten, dagelijkse coaching en handige tools in je dashboard.
        </p>
        
        <div className="flex flex-col items-center gap-3">
          <Button onClick={handleCompleteOnboarding} variant="outline" className="w-full max-w-xs">
            Ik begrijp het, ga verder naar mijn dashboard
          </Button>
          <Link href="/neurodiversiteit" className="text-xs text-primary hover:underline">
            Wat is neurodiversiteit eigenlijk?
          </Link>
        </div>

      </div>
    </div>
  );
}
