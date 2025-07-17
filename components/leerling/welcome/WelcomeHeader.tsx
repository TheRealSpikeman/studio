// src/components/leerling/welcome/WelcomeHeader.tsx
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Sparkles } from '@/lib/icons';

interface WelcomeHeaderProps {
  name: string;
}

export function WelcomeHeader({ name }: WelcomeHeaderProps) {
  return (
    <>
      <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Welkom bij MindNavigator, {name}!
      </h1>
      <p className="text-lg text-muted-foreground mt-2 mb-8 max-w-2xl mx-auto">
        Klaar om jezelf beter te leren kennen? In ongeveer 10 minuten ontdek je jouw unieke denkstijl. Je kunt de test altijd pauzeren en later verdergaan.
      </p>
      
      <Alert variant="default" className="mb-8 bg-blue-50 border-blue-200 text-blue-700 text-left shadow-sm">
        <Info className="h-5 w-5 !text-blue-600" />
        <AlertTitle className="text-blue-700 font-semibold">Jouw reis begint hier!</AlertTitle>
        <AlertDescription className="text-blue-600">
          De meeste functies in je dashboard, zoals de Coaching Hub en je persoonlijke resultaten, worden ontgrendeld zodra je de eerste Zelfreflectie Tool hebt voltooid. Dit is jouw startpunt.
        </AlertDescription>
      </Alert>
    </>
  );
}
