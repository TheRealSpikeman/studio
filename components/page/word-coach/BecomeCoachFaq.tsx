
// src/components/page/word-coach/BecomeCoachFaq.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const coachFaqs = [
  {
    question: 'Wat zijn de vereisten om coach te worden bij MindNavigator?',
    answer:
      'Wij zoeken gekwalificeerde professionals zoals (kinder)psychologen NIP, orthopedagogen (generalist), of GZ-psychologen met ervaring in het begeleiden van jongeren (12-18 jaar), bij voorkeur met expertise in neurodiversiteit. Een VOG (Verklaring Omtrent Gedrag) is vereist.',
  },
  {
    question: 'Hoe werkt het aanmeldproces voor coaches?',
    answer:
      'Het proces is vergelijkbaar met dat voor tutors. U start met een basisaanmelding (naam, e-mail). Vervolgens doorloopt u een onboarding wizard waar u uw specialisaties, tarief, methodieken, relevante werkervaring, diploma\'s en VOG kunt opgeven. Na beoordeling en goedkeuring wordt uw profiel geactiveerd.',
  },
  {
    question: 'Hoe wordt de privacy van cliëntgegevens gewaarborgd?',
    answer:
      'Privacy is cruciaal. U krijgt alleen toegang tot gegevens van cliënten als de ouder (en/of cliënt, afhankelijk van leeftijd) hier expliciet toestemming voor geeft via hun privacy-instellingen. Alle communicatie en dataopslag verloopt via beveiligde systemen conform AVG/GDPR.',
  },
   {
    question: 'Hoe worden betalingen voor coachingsessies afgehandeld?',
    answer:
      'Betalingen van ouders/cliënten voor sessies lopen via ons platform. MindNavigator draagt zorg voor de facturatie en verwerking. Wij keren uw verdiensten periodiek uit, na aftrek van een kleine servicefee voor het gebruik van het platform en de administratieve afhandeling.',
  },
  {
    question: 'Kan ik mijn eigen tarieven en beschikbaarheid bepalen?',
    answer:
      'Ja, u heeft volledige vrijheid in het bepalen van uw sessietarieven en de tijden waarop u beschikbaar bent voor online coachingsessies. Dit kunt u beheren via uw coach-dashboard.',
  }
];

export function BecomeCoachFaq() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Veelgestelde Vragen (voor Coaches)
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {coachFaqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`coach-faq-${index}`} 
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
            <p className="text-muted-foreground mb-4">Andere vragen? Neem contact op via <a href="mailto:coaches@mindnavigator.app" className="text-primary hover:underline">coaches@mindnavigator.app</a></p>
        </div>
      </div>
    </section>
  );
}
