
// src/app/dashboard/admin/settings/personas/page.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Linkedin, ExternalLink, PlusCircle, Edit } from 'lucide-react';
import { aiPersonas, type AiPersona } from '@/ai/personas';

export default function AiPersonaManagementPage() {

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary" />
            AI Persona Beheer
          </h1>
          <p className="text-muted-foreground">
            Een overzicht van alle AI persona's die gebruikt worden voor content creatie en interactie.
          </p>
        </div>
        <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Persona (binnenkort)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiPersonas.map((persona: AiPersona) => (
            <Card key={persona.id} className="shadow-lg overflow-hidden flex flex-col">
                 <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                                src={persona.imageUrl}
                                alt={`Foto van ${persona.name}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                data-ai-hint={persona.imageHint}
                            />
                        </div>
                        <div>
                             <CardTitle className="text-xl font-bold text-primary">{persona.name}</CardTitle>
                             <CardDescription className="font-semibold text-muted-foreground">{persona.title}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm flex-grow">
                     <div>
                        <h4 className="font-semibold text-foreground mb-1">Biografie</h4>
                        <p className="text-muted-foreground leading-relaxed">{persona.bio}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground mb-1">Bijdrage aan Platform</h4>
                        <p className="text-muted-foreground leading-relaxed">{persona.contribution}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground mb-1">AI Prompt Instructie</h4>
                        <blockquote className="border-l-2 border-primary/30 pl-3 italic text-xs text-muted-foreground">
                            "{persona.description}"
                        </blockquote>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-3 flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-3">
                         {persona.linkedinUrl && (
                            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary h-auto p-1">
                                <Link href={persona.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin className="mr-1.5 h-4 w-4" /> LinkedIn</Link>
                            </Button>
                        )}
                         <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary h-auto p-1">
                            <Link href="#" target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-1.5 h-4 w-4" /> Website</Link>
                        </Button>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                        <Edit className="mr-2 h-4 w-4" /> Bewerken
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
