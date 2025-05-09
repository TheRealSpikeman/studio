// src/app/dashboard/homework-assistance/page.tsx
"use client";

import { SubjectCard } from '@/components/homework-assistance/SubjectCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlannerSection } from '@/components/homework-assistance/PlannerSection';
import { TodoSection } from '@/components/homework-assistance/TodoSection';
import { PomodoroSection } from '@/components/homework-assistance/PomodoroSection';
import { TemplatesSection } from '@/components/homework-assistance/TemplatesSection';
import { BookOpenCheck, Languages, Calculator, Globe, FlaskConical, History, Users2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const subjects = [
  { id: 'nederlands', name: 'Nederlands', icon: Languages, description: 'Hulp bij taal, lezen en schrijven.' },
  { id: 'wiskunde', name: 'Wiskunde', icon: Calculator, description: 'Uitleg over algebra, meetkunde en meer.' },
  { id: 'engels', name: 'Engels', icon: Languages, description: 'Verbeter je Engelse taalvaardigheden.' },
  { id: 'geschiedenis', name: 'Geschiedenis', icon: History, description: 'Ontdek het verleden en begrijp het heden.' },
  { id: 'biologie', name: 'Biologie', icon: FlaskConical, description: 'Leer over levende organismen en ecosystemen.' },
  { id: 'aardrijkskunde', name: 'Aardrijkskunde', icon: Globe, description: 'Verken de wereld en haar bewoners.' },
];

export default function HomeworkAssistancePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BookOpenCheck className="h-8 w-8 text-primary" />
          Huiswerkbegeleiding & Tools
        </h1>
        <p className="text-muted-foreground">
          Vind hier online tips, tools, planninghulpmiddelen en de mogelijkheid om 1-op-1 begeleiding te boeken.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content column (Subject cards, Tutor booking) */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Online Tips & Tools per Vak</CardTitle>
              <CardDescription>Kies een vak om tips, oefeningen en handige tools te bekijken. Voeg direct taken toe aan je To-Do lijst voor dat vak.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subjectId={subject.id}
                    subjectName={subject.name}
                    icon={<subject.icon className="h-8 w-8 text-primary" />}
                    description={subject.description}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users2 className="h-6 w-6 text-primary" />
                1-op-1 Begeleiding
              </CardTitle>
              <CardDescription>
                Persoonlijke hulp nodig? Boek een sessie met een van onze gecertificeerde tutors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Krijg persoonlijke aandacht en uitleg op maat van een ervaren docent. Filter op vak, bekijk profielen en plan direct een sessie in.
              </p>
              <Button asChild disabled>
                <Link href="/dashboard/homework-assistance/tutors">
                  Bekijk Tutors (binnenkort beschikbaar)
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar column (Planner, To-Do, Pomodoro, Templates) */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-20 self-start max-h-[calc(100vh-5rem)] overflow-y-auto pr-2">
          <PlannerSection />
          <TodoSection />
          <PomodoroSection />
          <TemplatesSection />
          
          <Card className="shadow-md bg-blue-50 border-blue-200">
            <CardHeader>
                <CardTitle className="text-blue-700 text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5"/>Herinneringen & Notificaties</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-blue-600">
                    Binnenkort: Ontvang in-app, e-mail en push-notificaties voor je taken en deadlines!
                </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
