// src/app/dashboard/leerling/welcome/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, BookOpen, ArrowRight, UserCircle, Sparkles, Check, Info, Lightbulb, Compass, Rocket, Timer, BarChart, Waves } from 'lucide-react';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";

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
      <div className="w-full max-w-3xl text-center">
        <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Welkom bij MindNavigator, {currentUser.name}!
        </h1>
        <p className="text-lg text-muted-foreground mt-2 mb-8 max-w-2xl mx-auto">
          Klaar om jezelf beter te leren kennen? In ongeveer 10 minuten ontdek je jouw unieke denkstijl. Je kunt de test altijd pauzeren en later verdergaan.
        </p>
        
        <Alert variant="default" className="mb-8 bg-blue-50 border-blue-200 text-blue-700 text-left shadow-sm">
          <Info className="h-5 w-5 !text-blue-600" />
          <AlertTitleUi className="text-blue-700 font-semibold">Jouw reis begint hier!</AlertTitleUi>
          <AlertDescUi className="text-blue-600">
            De meeste functies in je dashboard, zoals de Coaching Hub en je persoonlijke resultaten, worden ontgrendeld zodra je de eerste Zelfreflectie Tool hebt voltooid. Dit is jouw startpunt.
          </AlertDescUi>
        </Alert>
        
        <div className="text-left mb-10">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-6">Wat ga je ontdekken?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="bg-card border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                  <Compass className="h-6 w-6"/> Jouw Denkstijl
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Verken hoe jij informatie verwerkt en de wereld ziet.</p>
                <p className="text-xs italic mt-2">Voorbeeldvragen: "Krijg je energie van drukte of juist van rust? Ben je een snelle beslisser of denk je liever lang na?"</p>
              </CardContent>
            </Card>

            <Card className="bg-card border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                  <Lightbulb className="h-6 w-6"/> Sterktes & Uitdagingen
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Leer waar je van nature goed in bent en waar je misschien wat extra ondersteuning kunt gebruiken.</p>
                <p className="text-xs italic mt-2">Voorbeeld: Ontdek of je een 'creatieve dromer' bent die soms moeite heeft met plannen.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border shadow-sm">
              <CardHeader className="pb-3">
                 <CardTitle className="flex items-center gap-2 text-lg text-primary">
                  <Rocket className="h-6 w-6"/> Jouw Persoonlijke Toolkit
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Na de quiz krijg je toegang tot tools die bij jou passen.</p>
                <p className="text-xs italic mt-2">Denk aan: een <strong className="text-foreground">Focus Timer</strong>, een <strong className="text-foreground">Mood Tracker</strong> of <strong className="text-foreground">Relaxatie Oefeningen</strong>.</p>
              </CardContent>
            </Card>
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
              Deze set vragen is speciaal voor jouw leeftijdscategorie ({currentUser.ageGroup} jaar). Er zijn geen goede of foute antwoorden!
            </p>
            <Button size="lg" className="w-full" asChild>
              <Link href={`/dashboard/leerling/quizzes?ageGroup=${currentUser.ageGroup}`}>
                Start de Zelfreflectie Tool Nu <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex flex-col items-center gap-3">
          <Button onClick={handleCompleteOnboarding} variant="outline" className="w-full max-w-md">
            Ik sla dit over en ga naar mijn (beperkte) dashboard
          </Button>
          <Link href={neurodiversityLink} className="text-xs text-primary hover:underline">
            Wat is neurodiversiteit eigenlijk?
          </Link>
        </div>

      </div>
    </div>
  );
}
