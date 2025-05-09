// src/app/dashboard/homework-assistance/[subjectId]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import { TipItem } from '@/components/homework-assistance/TipItem';
import { ToolPlaceholderCard } from '@/components/homework-assistance/ToolPlaceholderCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Youtube, BookOpenCheck, Timer, Brain, Layers3, FileQuestion } from 'lucide-react';
import Link from 'next/link';

// Dummy data - in a real app, this would come from a CMS or database
const subjectDetails: Record<string, { name: string; icon: React.ElementType }> = {
  nederlands: { name: 'Nederlands', icon: FileText },
  wiskunde: { name: 'Wiskunde', icon: FileText }, // Replace with Calculator if available or an SVG
  engels: { name: 'Engels', icon: FileText }, // Replace with Languages if available or an SVG
  geschiedenis: { name: 'Geschiedenis', icon: FileText }, // Replace with History if available or an SVG
  biologie: { name: 'Biologie', icon: FileText }, // Replace with FlaskConical if available or an SVG
  aardrijkskunde: { name: 'Aardrijkskunde', icon: FileText }, // Replace with Globe if available or an SVG
};

const subjectTips: Record<string, Array<{ title: string; description: string; type: 'article' | 'video' }>> = {
  nederlands: [
    { title: 'Effectief samenvatten', description: 'Leer de kern uit een tekst te halen en hoofd- van bijzaken te onderscheiden.', type: 'article' },
    { title: 'Werkwoordspelling uitgelegd', description: 'Een duidelijke video over de d/t/dt regels en sterke/zwakke werkwoorden.', type: 'video' },
    { title: 'Argumentatiestructuren herkennen', description: 'Verbeter je tekstbegrip door argumenten te analyseren.', type: 'article' },
  ],
  wiskunde: [
    { title: 'Stappenplan voor vergelijkingen oplossen', description: 'Een systematische aanpak voor algebraïsche problemen.', type: 'article' },
    { title: 'De stelling van Pythagoras (video)', description: 'Visuele uitleg en voorbeelden van de beroemde stelling.', type: 'video' },
  ],
  engels: [
    { title: 'Veelgemaakte grammaticafouten', description: 'Tips om je Engelse grammatica te perfectioneren.', type: 'article'},
    { title: 'Engelse uitspraak oefenen (video)', description: 'Oefen met native speakers voor een betere uitspraak.', type: 'video'}
  ]
  // Add more tips for other subjects
};

const subjectExercises: Record<string, Array<{ title: string; description: string; type: 'pdf' | 'interactive' }>> = {
  nederlands: [
    { title: 'Oefenexamen Tekstbegrip', description: 'Test je vaardigheden met een volledig oefenexamen.', type: 'pdf' },
    { title: 'Interactieve Grammatica Quiz', description: 'Oefen direct online met diverse grammaticaonderdelen.', type: 'interactive' },
  ],
  wiskunde: [
    { title: 'Oefenopgaven Algebra', description: 'Een set opgaven om je algebra vaardigheden te testen.', type: 'pdf'},
  ]
  // Add more exercises
};

const subjectTools = [
    { id: 'pomodoro', name: 'Pomodoro Timer', icon: Timer, description: 'Werk gefocust in blokken.' },
    { id: 'mindmap', name: 'Mindmap Maker', icon: Brain , description: 'Visualiseer en structureer je gedachten.' },
    { id: 'flashcards', name: 'Flashcard Generator', icon: Layers3, description: 'Maak digitale flashcards om te leren.' },
];


export default function SubjectDetailPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  const subjectInfo = subjectDetails[subjectId] || { name: 'Onbekend Vak', icon: FileQuestion };
  const tips = subjectTips[subjectId] || [];
  const exercises = subjectExercises[subjectId] || [];
  const SubjectIcon = subjectInfo.icon;

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/dashboard/homework-assistance">
          <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar vakkenoverzicht
        </Link>
      </Button>

      <section className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <SubjectIcon className="h-7 w-7" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-foreground">{subjectInfo.name}</h1>
            <p className="text-muted-foreground">Hulpbronnen en tools voor {subjectInfo.name.toLowerCase()}.</p>
        </div>
      </section>

      <Tabs defaultValue="tips" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tips">Tips & Trucs</TabsTrigger>
          <TabsTrigger value="exercises">Oefeningen</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="tips">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Slimme Tips & Uitlegvideo's</CardTitle>
              <CardDescription>Bekijk artikelen en video's om {subjectInfo.name.toLowerCase()} beter te begrijpen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tips.length > 0 ? (
                tips.map((tip, index) => (
                  <TipItem key={index} title={tip.title} description={tip.description} type={tip.type} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nog geen tips beschikbaar voor {subjectInfo.name.toLowerCase()}. Kom snel terug!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Oefenmateriaal</CardTitle>
              <CardDescription>Test je kennis met oefenopgaven en interactieve quizzes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {exercises.length > 0 ? (
                exercises.map((ex, index) => (
                  <Card key={index} className="p-4 bg-muted/50">
                    <h3 className="font-semibold mb-1">{ex.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{ex.description}</p>
                    {ex.type === 'pdf' ? (
                        <Button variant="outline" size="sm" disabled>Download PDF (voorbeeld)</Button>
                    ) : (
                        <Button size="sm" disabled>Start Interactieve Quiz (binnenkort)</Button>
                    )}
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nog geen oefeningen beschikbaar voor {subjectInfo.name.toLowerCase()}.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Handige Tools</CardTitle>
              <CardDescription>Gebruik deze tools om je leerproces te ondersteunen.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectTools.map((tool) => (
                    <ToolPlaceholderCard key={tool.id} toolName={tool.name} description={tool.description} icon={<tool.icon className="h-7 w-7 text-primary" />} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
