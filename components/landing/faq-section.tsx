
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { Button } from '../ui/button';
import { HelpCircle, MessageCircleQuestion } from '@/lib/icons';

const faqs = [
  {
    question: 'Werkt MindNavigator echt?',
    answer:
      'MindNavigator is gebaseerd op erkende psychologische modellen en vragenlijsten. De quizzen geven inzicht en handvatten, maar zijn geen vervanging voor een professionele diagnose. De coaching is ontworpen om je te ondersteunen in je dagelijkse leven.',
  },
  {
    question: 'Hoe vaak krijg ik coaching tips?',
    answer:
      'Met een actief abonnement ontvang je dagelijks een nieuwe coaching tip en heb je toegang tot alle gerelateerde oefeningen en reflecties in de app.',
  },
  {
    question: 'Kan ik mijn abonnement op elk moment stoppen?',
    answer:
      'Ja, je kunt je maand- of jaarabonnement op elk moment opzeggen. Je behoudt toegang tot de premium functies tot het einde van je huidige betaalperiode.',
  },
  {
    question: 'Voor welke leeftijd is de Tienerquiz bedoeld?',
    answer:
      'De Tienerquiz is speciaal ontworpen voor jongeren van ongeveer 12 tot 18 jaar. Voor volwassenen hebben we andere, meer geschikte quizzen beschikbaar.',
  },
  {
    question: 'Hoe werkt de betaling als ik jonger dan 18 ben?',
    answer:
      'Als je jonger dan 18 jaar bent en een betaald abonnement kiest, vragen we je om de gegevens van een ouder of verzorger. Zij ontvangen dan een e-mail met een beveiligde link om de betaling te voltooien en toestemming te geven. Zodra zij de betaling hebben afgerond, wordt je abonnement geactiveerd.'
  }
];

export function FaqSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Veelgestelde Vragen
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`} 
              className="bg-card rounded-lg shadow-sm border-0"
            >
              <AccordionTrigger className="text-left text-lg hover:no-underline font-semibold text-foreground py-5 px-6 data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary [&[data-state=open]>svg]:rotate-180 transition-all">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-5 pt-1 bg-card rounded-b-lg text-base data-[state=open]:bg-muted/30">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">Heb je nog andere vragen?</p>
            <Button variant="default" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/contact">Neem contact op</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
