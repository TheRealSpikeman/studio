// src/app/features/coaching-en-tools/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Brain, Zap, Sparkles, Compass, Lightbulb, ArrowLeft } from 'lucide-react';
import type { ElementType } from 'react';

interface ThinkingStyle {
  icon: ElementType;
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  colorClass: string;
}

const thinkingStyles: ThinkingStyle[] = [
  {
    icon: Zap,
    title: "De Supersnelle Sprinter",
    description: "Jouw brein is als een snelle raceauto: vol energie en je kunt supersnel van gedachten wisselen. Perfect voor creatieve ideeën en als er snel iets moet gebeuren!",
    strengths: ["Creatief", "Energiek", "Spontaan", "Goed in noodgevallen"],
    challenges: ["Soms moeilijk om stil te zitten", "Kan snel afgeleid zijn"],
    colorClass: "bg-orange-50 border-orange-200"
  },
  {
    icon: Sparkles,
    title: "De Gevoelige Antenne",
    description: "Jij hebt supergevoelige antennes! Je merkt kleine details en gevoelens van anderen op die de meesten missen. Dit maakt je heel zorgzaam en empathisch.",
    strengths: ["Empathisch", "Opmerkzaam", "Creatief", "Zorgzaam"],
    challenges: ["Soms snel moe door te veel prikkels", "Kan dingen persoonlijk aantrekken"],
    colorClass: "bg-purple-50 border-purple-200"
  },
  {
    icon: Compass,
    title: "De Puzzel Master",
    description: "Jouw brein houdt van orde, logica en duidelijke patronen. Je bent fantastisch in het analyseren van hoe dingen werken en het onthouden van feiten.",
    strengths: ["Analytisch", "Eerlijk en direct", "Gedetailleerd", "Expert in je interesses"],
    challenges: ["Onverwachte veranderingen kunnen lastig zijn", "Grapjes soms te letterlijk nemen"],
    colorClass: "bg-teal-50 border-teal-200"
  },
  {
    icon: Lightbulb,
    title: "De Dromerige Ontdekker",
    description: "Jouw hoofd zit vol fantastische ideeën en creatieve werelden. Je kunt makkelijk nieuwe verbanden leggen die anderen niet zien en komt met originele oplossingen.",
    strengths: ["Fantasierijk", "Probleemoplossend", "Originele ideeën", "Out-of-the-box denken"],
    challenges: ["Soms moeite om te starten met een taak", "Kan makkelijk afdwalen met gedachten"],
    colorClass: "bg-blue-50 border-blue-200"
  }
];

export default function CoachingEnToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl">
          
          <div className="text-center mb-12 md:mb-16">
            <Brain className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Jouw Unieke Brein: Wat zijn Denkstijlen?</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Ieders brein werkt een beetje anders. Dat is geen 'goed' of 'fout', het is juist een superkracht! Ontdek hier een paar 'denkstijlen' en kijk of je er een herkent.
            </p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section>
              <p className="text-center text-lg">
                Zie de verschillende denkstijlen als een team van superhelden. Elk heeft zijn eigen unieke krachten en een paar dingen waar ze wat hulp bij kunnen gebruiken (hun 'kryptonite'). Misschien herken je jezelf wel in een of meerdere van deze helden!
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {thinkingStyles.map((style, index) => (
                <Card key={index} className={`shadow-lg hover:shadow-xl transition-shadow ${style.colorClass} border-2`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-primary">
                      <style.icon className="h-8 w-8" />
                      {style.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{style.description}</p>
                    <div>
                      <h4 className="font-semibold text-foreground">Jouw Superkrachten:</h4>
                      <p className="text-sm text-muted-foreground">{style.strengths.join(', ')}.</p>
                    </div>
                     <div>
                      <h4 className="font-semibold text-foreground">Jouw 'Kryptonite':</h4>
                      <p className="text-sm text-muted-foreground">{style.challenges.join(', ')}.</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-primary/10 border-primary/30">
                <CardHeader>
                    <CardTitle className="text-primary text-xl">Belangrijk om te onthouden</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-foreground/80">
                    <p>✓ Je bent waarschijnlijk een mix van verschillende stijlen.</p>
                    <p>✓ Het gaat er niet om een label op jezelf te plakken, maar om te begrijpen wat voor jou werkt.</p>
                    <p>✓ Iedereen is uniek. Deze quiz helpt je om jouw unieke combinatie van krachten en uitdagingen te ontdekken.</p>
                </CardContent>
            </Card>

            <section className="text-center mt-16 pt-10 border-t">
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl mb-4">
                Klaar om jouw unieke denkstijl te ontdekken?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                De Zelfreflectie Tool is de perfecte volgende stap.
              </p>
              <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/quizzes">
                  <ArrowLeft className="mr-2 h-5 w-5"/> Terug naar de Quizzen
                </Link>
              </Button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
