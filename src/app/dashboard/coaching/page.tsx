// src/app/dashboard/coaching/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, MessageSquare, Zap } from 'lucide-react'; 
import { useState } from 'react';

// Dummy data for demonstration
const coachingMessages = [
  { day: 1, title: "Welkom bij je coachingstraject!", body: "Vandaag beginnen we met het verkennen van je sterke punten. Reflecteer op een moment waarop je je echt in je element voelde. Wat deed je toen?" },
  { day: 2, title: "Structuur en Routine", body: "Een voorspelbare dagstructuur kan helpen om overprikkeling te verminderen en focus te verbeteren. Probeer vandaag één vast rustmoment in te plannen." },
  { day: 3, title: "Communicatiestijlen", body: "Iedereen communiceert anders. Let vandaag eens op hoe anderen informatie overbrengen en hoe jij daarop reageert. Zijn er patronen te ontdekken?" },
  { day: 4, title: "Energiebeheer", body: "Neurodivergente breinen verwerken informatie soms intensiever. Herken je signalen van vermoeidheid? Plan korte pauzes in om je energieniveau op peil te houden." },
  { day: 5, title: "Zelfcompassie", body: "Wees mild voor jezelf. Niet elke dag zal hetzelfde zijn. Erken je inspanningen, ongeacht het resultaat. Wat kun je vandaag doen om goed voor jezelf te zorgen?" },
];

export default function CoachingPage() {
  const [receiveDailyEmails, setReceiveDailyEmails] = useState(false);
  const { toast } = useToast();

  const handleEmailPreferenceChange = (checked: boolean) => {
    setReceiveDailyEmails(checked);
    // TODO: Implement actual backend logic to save this preference
    toast({
      title: "Voorkeur bijgewerkt",
      description: checked 
        ? "Je ontvangt nu dagelijkse coaching tips per e-mail." 
        : "Je ontvangt geen dagelijkse coaching tips meer per e-mail.",
      variant: "default",
    });
    console.log(`Daily email preference set to: ${checked}`);
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Dagelijkse Coaching</h1>
        <p className="text-muted-foreground">
          Hier vind je al je dagelijkse coachingberichten, tips en inzichten.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Dagelijkse Tips per E-mail
          </CardTitle>
          <CardDescription>
            Ontvang elke dag een nieuwe coaching tip direct in je inbox.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch 
              id="daily-email-toggle" 
              checked={receiveDailyEmails}
              onCheckedChange={handleEmailPreferenceChange}
              aria-label="Ontvang dagelijkse coaching tips per e-mail"
            />
            <Label htmlFor="daily-email-toggle" className="cursor-pointer">
              Ja, ik wil graag dagelijkse coaching tips per e-mail ontvangen.
            </Label>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Je kunt je op elk moment weer afmelden. We sturen je geen spam.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-accent" />
            Jouw Persoonlijke Inzichten
          </CardTitle>
          <CardDescription>
            Blader door je coachingberichten en ontdek nieuwe strategieën.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {coachingMessages.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {coachingMessages.slice().reverse().map((message) => ( // Show newest first
                <AccordionItem value={`day-${message.day}`} key={message.day}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Dag {message.day}: {message.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-10">
                    {/* This could be rich text / markdown in a real app */}
                    {message.body}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              Er zijn nog geen coachingberichten voor jou. Start een quiz om gepersonaliseerde coaching te ontvangen.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
