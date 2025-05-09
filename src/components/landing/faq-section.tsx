import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { Button } from '../ui/button';

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
];

export function FaqSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container max-w-3xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Veelgestelde Vragen
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">Heb je nog andere vragen?</p>
            <Button variant="outline" asChild>
                <Link href="/contact">Neem contact op</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
