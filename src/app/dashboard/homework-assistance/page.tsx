// src/app/dashboard/homework-assistance/page.tsx
"use client";

import { SubjectCard } from '@/components/homework-assistance/SubjectCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck, Languages, Calculator, Globe, FlaskConical, History, Users2 } from 'lucide-react';
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
          Huiswerkbegeleiding
        </h1>
        <p className="text-muted-foreground">
          Vind hier online tips, tools en de mogelijkheid om 1-op-1 begeleiding te boeken.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Online Tips & Tools</CardTitle>
          <CardDescription>Kies een vak om tips, oefeningen en handige tools te bekijken.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
