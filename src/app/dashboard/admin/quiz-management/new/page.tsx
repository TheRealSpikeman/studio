// src/app/dashboard/admin/quiz-management/new/page.tsx
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Bot, Edit, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewQuizOptionsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Nieuwe Quiz Aanmaken</h1>
         <Button variant="outline" asChild>
          <Link href="/dashboard/admin/quiz-management">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Overzicht
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <Link href="/dashboard/admin/quiz-management/new/manual" className="block">
            <Card className="hover:shadow-lg hover:border-primary transition-all duration-200 flex flex-col h-full">
            <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Edit className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Handmatig Samenstellen</CardTitle>
                </div>
                <CardDescription className="text-base">
                Stel zelf een quiz samen met volledige controle over elke vraag, weging en configuratie.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Volledige controle over vragen en antwoorden.</li>
                <li>Stel subtest-triggers en drempelwaardes in.</li>
                <li>Perfect voor specifieke, gedetailleerde assessments.</li>
                </ul>
            </CardContent>
            <div className="p-6 pt-0 mt-4">
                <Button className="w-full">
                    Start Handmatige Quiz <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
            </Card>
        </Link>

        <Link href="/dashboard/admin/quiz-management/generate" className="block">
            <Card className="hover:shadow-lg hover:border-primary transition-all duration-200 flex flex-col h-full">
            <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Bot className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Genereren met AI</CardTitle>
                </div>
                <CardDescription className="text-base">
                Laat onze AI snel een conceptquiz voor je genereren op basis van jouw specificaties.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Snel een concept opzetten voor een nieuw onderwerp.</li>
                <li>Bespaar tijd bij het bedenken van vragen.</li>
                <li>Na generatie kun je de quiz altijd handmatig aanpassen.</li>
                </ul>
            </CardContent>
            <div className="p-6 pt-0 mt-4">
                <Button className="w-full">
                    Genereer met AI <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
            </Card>
        </Link>
      </div>
    </div>
  );
}
