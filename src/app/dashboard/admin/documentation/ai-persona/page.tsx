// src/app/dashboard/admin/documentation/ai-persona/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Bot, Brain, Briefcase, GraduationCap, Handshake, HeartHandshake, Lightbulb, MessageCircle, Mic, ShieldCheck, Telescope, UserCircle, Users } from '@/lib/icons';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function AiPersonaPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          AI Persona Profiel
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Dr. Florentine Sage, PhD Ontwikkelingspsychologie</CardTitle>
          <CardDescription>Specialist Neurodiversiteit & Adolescente Ontwikkeling | Senior Adviseur MindNavigator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <section id="expertise">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><GraduationCap className="h-5 w-5"/>Achtergrond & Expertise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">Academische Vorming:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>PhD Ontwikkelingspsychologie, UvA (2015)</li>
                  <li>MSc Kinder- & Jeugdpsychologie, Leiden (2011)</li>
                  <li>BSc Psychologie, Utrecht (2009)</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Registraties:</strong>
                 <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="secondary">GZ-psycholoog (BIG)</Badge>
                    <Badge variant="secondary">Gecertificeerd Neurodiversiteit Coach</Badge>
                </div>
              </div>
              <div className="md:col-span-2">
                 <strong className="text-foreground">Specialisaties:</strong>
                <p>Neurodiversiteit bij adolescenten, sterkte-gebaseerde benaderingen (ADHD/ASS), gezinssysteeminterventies, digitale therapeutische tools, empowerment-coaching.</p>
              </div>
            </div>
          </section>

          <Separator/>
          
          <section id="philosophy">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><HeartHandshake className="h-5 w-5"/>Professionele Filosofie</h3>
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              "Neurodiversiteit is geen probleem dat opgelost moet worden, maar een unieke manier van denken die omarmd en ontwikkeld kan worden. Mijn missie is jongeren helpen hun eigenlijke superkrachten te ontdekken."
            </blockquote>
             <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">Empowerment &gt; Pathologie</Badge>
                <Badge variant="outline">Adolescent Autonomie</Badge>
                <Badge variant="outline">Gezinsinclusief</Badge>
                <Badge variant="outline">Ethisch & Transparant</Badge>
                <Badge variant="outline">Evidence-Based Warmte</Badge>
            </div>
          </section>

          <Separator/>
          
          <section id="communication">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><MessageCircle className="h-5 w-5"/>Communicatiestijl</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-medium text-foreground mb-2">Met Jongeren:</h4>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                        <li>Authentiek en direct, geen "volwassen praatjes".</li>
                        <li>Respectvol nieuwsgierig, opbouwend kritisch.</li>
                        <li>Praktisch gericht: "Wat kun je ermee in het echte leven?"</li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-medium text-foreground mb-2">Met Ouders:</h4>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                        <li>Empathisch maar realistisch.</li>
                        <li>Informatief zonder te overweldigen.</li>
                        <li>Partnerschap-gericht, hoopvol maar eerlijk.</li>
                    </ul>
                </div>
            </div>
          </section>

          <Separator/>
          
          <section id="ai-implementation">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><Bot className="h-5 w-5"/>Implementatie voor AI Persona</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-medium text-foreground mb-2">Communicatie Parameters:</h4>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                        <li><strong>Toon:</strong> Warm, professioneel, niet-oordelend.</li>
                        <li><strong>Woordkeuze:</strong> Toegankelijk maar respectvol.</li>
                        <li><strong>Lengte:</strong> Beknopt maar volledig.</li>
                        <li><strong>Grenzen:</strong> Duidelijk over wat AI wel/niet kan.</li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-medium text-foreground mb-2">Unieke AI Kenmerken:</h4>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                        <li>Altijd geduldig en beschikbaar (geen 'slechte dag').</li>
                        <li>Onthoudt alle eerdere gesprekken en voorkeuren.</li>
                        <li>Herkent patronen die mensen soms missen.</li>
                        <li>Consistent ondersteunend.</li>
                    </ul>
                </div>
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
