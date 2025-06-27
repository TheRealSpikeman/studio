// src/app/dashboard/ouder/faq/page.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircleQuestion } from 'lucide-react';

const parentDashboardFaqs = [
  {
    id: "faq-progress",
    question: "Hoe kan ik de voortgang van mijn kind volgen?",
    answer: "U kunt de voortgang van uw kind volgen via de 'Mijn Kinderen' link in uw Ouder Dashboard. Klik op het kind van wie u de voortgang wilt zien en ga naar het tabblad 'Voortgang'. Hier vindt u een overzicht van voltooide quizzen en lesverslagen (indien van toepassing)."
  },
  {
    id: "faq-cancel-lesson",
    question: "Wat als mijn kind een les wil annuleren of verzetten?",
    answer: "Lessen kunnen geannuleerd of (binnenkort) verzet worden via het 'Aankomende Lessen' of 'Lessen Overzicht' tabblad onder 'Lessen Kinderen'. Houd rekening met de annuleringsvoorwaarden die gelden (zie de pagina 'Les Plannen' voor details). Voor het verzetten van lessen kunt u binnenkort een verzoek indienen bij de tutor."
  },
  {
    id: "faq-payment-lessons",
    question: "Hoe werkt de betaling voor bijlessen?",
    answer: "Bijlessen worden per sessie of via een lessenbundel betaald. U kunt uw betaalmethoden en factuurhistorie beheren via de 'Facturatie' sectie in uw dashboard. Abonnementen voor de coaching-hub worden maandelijks of jaarlijks vooraf betaald via de 'Abonnementen' pagina."
  },
  {
    id: "faq-view-quiz-results",
    question: "Kan ik de quizresultaten van mijn kind inzien?",
    answer: "Ja, als uw kind zijn/haar account aan uw ouderaccount heeft gekoppeld en toestemming heeft gegeven via de 'Privacy & Delen' instellingen, kunt u een samenvatting van de quizresultaten en eventuele AI-gegenereerde analyses inzien op de voortgangspagina van het kind. De volledige rapporten zijn primair voor het kind bedoeld om zelfinzicht te bevorderen."
  },
  {
    id: "faq-add-child",
    question: "Hoe voeg ik een nieuw kind toe aan mijn account?",
    answer: "U kunt een nieuw kind toevoegen via de 'Mijn Kinderen' pagina in uw dashboard. Klik op de knop 'Nieuw Kind Toevoegen' en vul de gevraagde gegevens in. Uw kind ontvangt dan een uitnodiging per e-mail om het account te activeren en te koppelen."
  },
  {
    id: "faq-coaching-hub-benefits",
    question: "Wat zijn de voordelen van de premium coaching-hub voor mijn kind?",
    answer: "De premium coaching-hub ('Gezins Gids' of hoger) biedt dagelijkse, gepersonaliseerde tips, reflectie-oefeningen, een digitaal dagboek, en andere tools die uw kind helpen bij zelfinzicht, het ontwikkelen van routines, en het omgaan met uitdagingen gerelateerd aan hun neurodiversiteit."
  }
];

export default function OuderFaqPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            Veelgestelde Vragen (Ouders)
          </h1>
          <p className="text-muted-foreground">
            Antwoorden op veelvoorkomende vragen over het MindNavigator platform voor ouders.
          </p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircleQuestion className="h-6 w-6 text-primary"/> Vragen & Antwoorden
          </CardTitle>
          <CardDescription>
            Vind hier snel antwoord op uw vragen. Staat uw vraag er niet bij? Neem dan contact op.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {parentDashboardFaqs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className="bg-muted/30 rounded-md border border-border"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-4 px-5 text-md data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4 pt-1 text-base leading-relaxed text-foreground/80">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
