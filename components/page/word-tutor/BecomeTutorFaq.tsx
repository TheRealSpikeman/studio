// src/components/page/word-tutor/BecomeTutorFaq.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const tutorFaqs = [
  {
    question: 'Wat is het aanmeldproces als tutor?',
    answer:
      'Het aanmeldproces bestaat uit een paar stappen. Eerst vul je op onze "Word Tutor" pagina je naam en e-mailadres in. Je ontvangt dan een e-mail met een tijdelijk wachtwoord en een link om in te loggen. Na je eerste login doorloop je een korte wizard waarin je je definitieve wachtwoord instelt, je vakken en uurtarief kiest, je CV en VOG uploadt, en je beschikbaarheid opgeeft. Zodra je profiel compleet is, wordt het door ons team beoordeeld. Dit duurt meestal 1-2 werkdagen. Na goedkeuring is je account actief en kun je starten met het geven van bijles!',
  },
  {
    question: 'Hoe werkt de 10% servicekost?',
    answer:
      'MindNavigator faciliteert het platform, de administratie en de betalingen. Voor deze service rekenen we 10% over het door jou ingestelde uurtarief. Bijvoorbeeld: als jij €20 per uur vraagt, ontvang jij €18 en gaat €2 naar MindNavigator.',
  },
  {
    question: 'Hoe wordt mijn VOG behandeld?',
    answer:
      'Je Verklaring Omtrent Gedrag (VOG) wordt vertrouwelijk behandeld en alleen gebruikt ter verificatie. We slaan deze veilig op conform de AVG-richtlijnen. Het is een vereiste om de veiligheid van onze leerlingen te waarborgen.',
  },
   {
    question: 'Hoe en wanneer word ik betaald?',
    answer:
      'Betalingen van leerlingen (of hun ouders) lopen via ons platform. Wij keren wekelijks of maandelijks (afhankelijk van je voorkeur) je verdiende bedragen uit, na aftrek van de servicekosten.',
  },
  {
    question: 'Kan ik mijn eigen uren en tarief bepalen?',
    answer:
      'Ja, absoluut! Je bent volledig vrij in het bepalen van je uurtarief en de momenten waarop je beschikbaar bent. Dit kun je te allen tijde aanpassen in je tutor-profiel na goedkeuring.',
  }
];

export function BecomeTutorFaq() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Veelgestelde Vragen (voor Tutors)
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {tutorFaqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`tutor-faq-${index}`} 
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
            <p className="text-muted-foreground mb-4">Andere vragen? Neem contact op via <a href="mailto:tutors@mindnavigator.nl" className="text-primary hover:underline">tutors@mindnavigator.nl</a></p>
        </div>
      </div>
    </section>
  );
}
