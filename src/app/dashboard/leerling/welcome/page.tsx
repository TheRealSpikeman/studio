// src/app/dashboard/leerling/welcome/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, BookOpen, ArrowRight, UserCircle, Sparkles, Check } from 'lucide-react';

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

  const neurodiversityLink = currentUser.ageGroup === '12-14' 
    ? "/features/coaching-en-tools" 
    : "/neurodiversiteit";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Welkom bij MindNavigator, {currentUser.name}!
        </h1>
        <p className="text-lg text-muted-foreground mt-2 mb-8">
          Klaar om jezelf beter te leren kennen en je sterke punten te ontdekken?
        </p>
        
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20 mb-10 text-left shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary text-xl">
              <Sparkles className="h-6 w-6" />
              Wat kun je verwachten?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-foreground/80">Persoonlijke inzichten over jouw unieke denkstijl en talenten.</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-foreground/80">Dagelijkse coaching content, speciaal afgestemd op jouw resultaten en behoeften.</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-foreground/80">Praktische tips, tools en oefeningen die écht bij jou passen en je verder helpen.</span>
              </div>
                 <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-foreground/80">Een veilige plek voor zelfontdekking en persoonlijke groei.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-base text-foreground/90 leading-relaxed mb-6 text-left">
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
        
        <Card className="p-6 bg-primary/10 rounded-lg border border-primary/30 text-left mb-10 shadow-md">
          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Jouw Eerste Stap: De Zelfreflectie Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-foreground/80 mb-4 text-base">
              Deze set vragen (ongeveer 10-15 minuten) helpt ons je een eerste, persoonlijk overzicht te geven. Er zijn geen foute antwoorden!
            </p>
            <Button size="lg" className="w-full" asChild>
              <Link href={`/dashboard/leerling/quizzes?ageGroup=${currentUser.ageGroup}`}>
                Start de Zelfreflectie Tool Nu <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <p className="text-sm text-muted-foreground mb-8">
          Na de zelfreflectie tool ontgrendel je meer inzichten, dagelijkse coaching en handige tools in je dashboard.
        </p>
        
        <div className="flex flex-col items-center gap-3">
          <Button onClick={handleCompleteOnboarding} variant="outline" className="w-full max-w-xs">
            Ik begrijp het, ga verder naar mijn dashboard
          </Button>
          <Link href={neurodiversityLink} className="text-xs text-primary hover:underline">
            Wat is neurodiversiteit eigenlijk?
          </Link>
        </div>

      </div>
    </div>
  );
}
