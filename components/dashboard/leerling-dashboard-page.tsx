// src/components/dashboard/leerling-dashboard-page.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare, TrendingUp, ClipboardList, FileBarChart, BookOpenCheck, Wrench } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const ONBOARDING_KEY_LEERLING = 'onboardingCompleted_leerling_v1';

// This is now a default export for easier dynamic import.
export default function LeerlingDashboardPageComponent() {
    const router = useRouter();

    // This effect handles the redirection logic if the user hasn't completed onboarding.
    useEffect(() => {
        const onboardingCompleted = localStorage.getItem(ONBOARDING_KEY_LEERLING);
        if (!onboardingCompleted) {
            router.replace('/dashboard/leerling/welcome');
        }
    }, [router]);
    
    const currentUserData = { 
      name: "Alex", 
      ageGroup: '15-18' as '12-14' | '15-18' | 'adult'
    };

    const latestCoachingTip = {
      title: "Tip van de dag: Structuur en Routine",
      message: "Een voorspelbare dagstructuur kan helpen om overprikkeling te verminderen en focus te verbeteren. Probeer vandaag één vast rustmoment in te plannen.",
    };

    interface DashboardActionItem {
      id: string;
      title: string;
      description: string;
      icon: React.ElementType;
      link: string;
      buttonText: string;
      buttonVariant: "default" | "outline";
      colorClass?: string;
    }

    const leerlingDashboardItems: DashboardActionItem[] = [
      {
        id: 'quizzes',
        title: 'Ontdek Jezelf',
        description: 'Start een nieuwe quiz, ga verder waar je gebleven was, of bekijk alle beschikbare quizzen.',
        icon: ClipboardList,
        link: currentUserData.ageGroup === 'adult' ? '/dashboard/leerling/quizzes' : `/dashboard/leerling/quizzes?ageGroup=${currentUserData.ageGroup}`,
        buttonText: 'Naar Mijn Quizzen',
        buttonVariant: 'default', // Primary button
        colorClass: 'bg-orange-50 border-orange-200 hover:shadow-orange-100',
      },
      {
        id: 'coaching',
        title: 'Jouw Dagelijkse Groei',
        description: 'Ontvang persoonlijke tips, reflecteer in je dagboek en volg je voortgang in de coaching hub.',
        icon: MessageSquare,
        link: '/dashboard/coaching',
        buttonText: 'Naar Mijn Coaching',
        buttonVariant: 'outline', // Secondary button
        colorClass: 'bg-teal-50 border-teal-200 hover:shadow-teal-100',
      },
      {
        id: 'results',
        title: 'Jouw Inzichten',
        description: 'Bekijk je voltooide quizrapporten, ontdek je profiel en download je resultaten.',
        icon: FileBarChart,
        link: '/dashboard/results',
        buttonText: 'Bekijk Mijn Resultaten',
        buttonVariant: 'outline', // Secondary button
        colorClass: 'bg-purple-50 border-purple-200 hover:shadow-purple-100',
      },
      {
        id: 'tools',
        title: 'Jouw Aanbevolen Tools',
        description: 'Ontdek planners, timers en andere handige tools die passen bij jouw profiel en je helpen met focus en organisatie.',
        icon: Wrench,
        link: '/dashboard/tools',
        buttonText: 'Bekijk aanbevolen Tools',
        buttonVariant: 'outline',
        colorClass: 'bg-blue-50 border-blue-200 hover:shadow-blue-100',
      }
    ];
    
    return (
        <div className="space-y-8">
          <section>
            <h1 className="text-3xl font-bold text-foreground">
              Welkom terug, <span className="text-primary">{currentUserData.name}</span>!
            </h1>
            <p className="text-lg text-muted-foreground">Klaar om meer over jezelf te ontdekken en te groeien?</p>
          </section>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leerlingDashboardItems.map((item) => (
                <Card 
                    key={item.id} 
                    className={cn(
                        "group flex flex-col shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-in-out h-full min-h-72",
                        item.colorClass || "bg-card"
                    )}
                >
                  <CardHeader className="items-center text-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 mb-5">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold leading-tight">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-center flex-grow">
                    <p className="text-base font-normal leading-relaxed">{item.description}</p>
                  </CardContent>
                  <CardFooter className="pt-6 mt-auto">
                    <Button 
                      asChild 
                      variant={item.buttonVariant} 
                      className="w-full h-12 py-3 px-6 rounded-lg font-semibold"
                    >
                      <Link href={item.link}>{item.buttonText}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <Card className="shadow-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-primary">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    {latestCoachingTip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{latestCoachingTip.message}</p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2 mt-auto">
                    <Button asChild className="flex-1 h-12 py-3 px-6 rounded-lg font-semibold" variant="default">
                        <Link href="/dashboard/coaching">Naar Coaching Hub</Link>
                    </Button>
                    <Button variant="outline" className="flex-1 h-12 py-3 px-6 rounded-lg font-semibold">
                        Markeer als gelezen
                    </Button>
                </CardFooter>
              </Card>
            </section>
            
            <section>
                <Card className="shadow-lg h-full flex flex-col">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl text-accent">
                            <TrendingUp className="h-6 w-6 text-accent"/>
                            Mijn Voortgang
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="flex-grow">
                        <p className="text-muted-foreground text-sm">
                            Je hebt recent de "Sociale Angst & Vriendschap" quiz voltooid. Goed bezig!
                        </p>
                         <p className="text-muted-foreground text-sm mt-2">
                            Volgende stap: verdiep je in de coaching tips over communicatiestijlen.
                        </p>
                     </CardContent>
                     <CardFooter className="mt-auto">
                        <Button variant="outline" asChild className="w-full h-12 py-3 px-6 rounded-lg font-semibold">
                            <Link href="/dashboard/results">Bekijk alle resultaten</Link>
                        </Button>
                     </CardFooter>
                </Card>
            </section>
          </div>
        </div>
      );
}
