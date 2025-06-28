
// src/app/dashboard/admin/documentation/ai-persona/page.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Linkedin, ExternalLink, ShieldCheck, Lightbulb, BookHeart, GraduationCap, ArrowLeft } from '@/lib/icons';
import { aiPersonas } from '@/ai/personas';

export default function AiPersonaCvPage() {
  const persona = aiPersonas.find(p => p.id === 'dr-florentine-sage');

  if (!persona) {
    return <div>Persona Dr. Florentine Sage niet gevonden in de data.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary" />
            AI Persona Profiel
          </h1>
          <p className="text-muted-foreground">
            Een gedetailleerd overzicht van de primaire AI persona voor content creatie.
          </p>
        </div>
         <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex-shrink-0 relative">
                <div className="aspect-[4/5] w-full md:w-full h-auto md:h-full">
                <Image
                    src={persona.imageUrl}
                    alt={`Foto van ${persona.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={persona.imageHint}
                />
                </div>
            </div>
            <div className="md:w-2/3 flex flex-col">
                <CardHeader className="pb-4">
                    <h2 className="text-2xl font-bold text-primary">{persona.name}</h2>
                    <p className="font-semibold text-muted-foreground">{persona.title}</p>
                    <div className="flex items-center gap-4 pt-2">
                        {persona.linkedinUrl && (
                            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary">
                                <Link href={persona.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin className="mr-2 h-4 w-4" /> LinkedIn</Link>
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary">
                            <Link href="#" target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-4 w-4" /> Website</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 text-base">
                    <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><BookHeart className="h-5 w-5 text-primary/80"/> Biografie</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">{persona.bio}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary/80"/> Expertise & Bijdrage</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">{persona.contribution}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary/80"/> AI Prompt Instructie</h4>
                        <blockquote className="border-l-4 border-primary/30 pl-4 italic text-sm text-muted-foreground">
                            "{persona.description}"
                        </blockquote>
                    </div>
                </CardContent>
            </div>
        </div>
      </Card>
    </div>
  );
}
