// src/app/dashboard/admin/settings/personas/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, PlusCircle, Edit, Trash2, Linkedin, ExternalLink } from '@/lib/icons';
import { aiPersonas, type AiPersona } from '@/ai/personas';

export default function AiPersonasPage() {
  const [personas, setPersonas] = useState<AiPersona[]>(aiPersonas);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary" />
            AI Persona Beheer
          </h1>
          <p className="text-muted-foreground">
            Beheer hier de verschillende AI-persoonlijkheden die op het platform worden gebruikt.
          </p>
        </div>
        <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Persona (binnenkort)
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {personas.map((persona) => (
          <Card key={persona.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:w-1/3 flex-shrink-0 relative">
                <div className="aspect-square w-full md:w-full h-auto md:h-full">
                  <Image
                    src={persona.imageUrl}
                    alt={`Foto van ${persona.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={persona.imageHint}
                  />
                </div>
              </div>
              <div className="md:w-2/3 flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{persona.name}</CardTitle>
                  <CardDescription className="font-medium">{persona.title}</CardDescription>
                   {persona.linkedinUrl && (
                      <Link href={persona.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors w-fit">
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn Profiel</span>
                      </Link>
                   )}
                </CardHeader>
                <CardContent className="space-y-4 text-sm flex-grow">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Bio</h4>
                    <p className="text-muted-foreground leading-relaxed">{persona.bio}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Bijdrage aan MindNavigator</h4>
                    <p className="text-muted-foreground leading-relaxed">{persona.contribution}</p>
                  </div>
                   <div>
                    <h4 className="font-semibold text-foreground mb-1">AI Prompt Instructie</h4>
                    <p className="text-muted-foreground leading-relaxed italic text-xs">"{persona.description}"</p>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto border-t pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <Edit className="mr-2 h-4 w-4" /> Bewerken
                    </Button>
                    <Button variant="destructive" size="sm" disabled>
                      <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                    </Button>
                  </div>
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
