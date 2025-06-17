
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheck, Brain, MessageCircleQuestion, HeartHandshake, Users, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const parentFaqs = [
  {
    question: "Wat is neurodiversiteit precies?",
    answer: "Neurodiversiteit betekent dat ieders brein uniek is en anders werkt. Net zoals er variatie is in haarkleur of lengte, is er ook variatie in hoe onze hersenen informatie verwerken, hoe we leren, en hoe we de wereld ervaren. Eigenschappen zoals ADD, ADHD, HSP, en autisme zijn voorbeelden van neurodivergente profielen. MindNavigator helpt uw kind deze unieke eigenschappen te ontdekken als sterke punten en uitdagingen. Bekijk onze <a href='/neurodiversiteit' class='text-primary hover:underline font-medium'>uitgebreide informatiepagina over neurodiversiteit <ExternalLink class='inline-block h-4 w-4'/></a> voor meer details.",
  },
  {
    question: "Hoe helpt MindNavigator mijn kind?",
    answer: "Via laagdrempelige zelfreflectie-instrumenten krijgt uw kind inzicht in zijn of haar persoonlijke neurodiversiteitsprofiel. Dit overzicht biedt herkenning en concrete tips voor school, thuis en sociale situaties. Onze (premium) coaching-hub biedt dagelijkse ondersteuning met routines, reflectie en tools om zelfvertrouwen op te bouwen en beter om te gaan met uitdagingen.",
  },
  {
    question: "Is MindNavigator veilig en hoe zit het met privacy?",
    answer: "Veiligheid en privacy zijn onze topprioriteit. Alle gegevens worden vertrouwelijk behandeld en beveiligd opgeslagen conform de AVG/GDPR-richtlijnen. Resultaten van zelfreflectie-instrumenten zijn persoonlijk en worden niet zonder toestemming gedeeld. Voor betaalde abonnementen voor minderjarigen is altijd ouderlijke toestemming en betaling vereist. Lees meer in ons <a href='/privacy' class='text-primary hover:underline'>Privacybeleid <ExternalLink class='inline-block h-4 w-4'/></a>.",
  },
  {
    question: "Wat als mijn kind professionele hulp nodig heeft?",
    answer: "MindNavigator is een tool voor zelfinzicht en ondersteuning, maar vervangt geen professionele diagnose of behandeling. Als u of uw kind zorgen heeft, raden wij altijd aan contact op te nemen met een huisarts, psycholoog of andere gekwalificeerde zorgverlener. Meer informatie en verwijzingen vindt u ook op onze <a href='/neurodiversiteit' class='text-primary hover:underline font-medium'>neurodiversiteit pagina <ExternalLink class='inline-block h-4 w-4'/></a>.",
  },
  {
    question: "Hoe werkt de betaling voor een abonnement?",
    answer: "Als uw kind (jonger dan 18) een betaald abonnement kiest, vragen wij tijdens de registratie om uw e-mailadres. U ontvangt dan een e-mail met een beveiligde link om de betaling af te ronden en toestemming te geven. Pas na uw goedkeuring en betaling wordt het abonnement geactiveerd. U kunt de abonnementsdetails altijd inzien en beheren via uw eigen account (indien u een hoofdaccount aanmaakt) of via de support.",
  },
];


export default function ForParentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto">
          <Card className="shadow-xl max-w-4xl mx-auto">
            <CardHeader className="text-center pb-8">
              <Users className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-4xl font-bold text-foreground">Informatie voor Ouders</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Ontdek hoe MindNavigator uw kind kan ondersteunen op hun reis naar zelfinzicht en groei.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 text-lg leading-relaxed text-foreground/90">
              
              <section>
                <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                  <Brain className="h-7 w-7" />
                  Wat is MindNavigator?
                </h2>
                <p>
                  MindNavigator is een online platform speciaal ontwikkeld voor jongeren (12-18 jaar) om hen te helpen hun neurodiversiteit te begrijpen. Door middel van interactieve zelfreflectie-instrumenten, persoonlijke overzichten en een (optionele) dagelijkse coaching-hub, bieden we tools en inzichten die bijdragen aan zelfbewustzijn, het herkennen van talenten en het omgaan met uitdagingen. Lees meer over <Link href='/neurodiversiteit' className='text-primary hover:underline font-medium'>wat neurodiversiteit precies inhoudt <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/> </Link> op onze infopagina.
                </p>
                 <p className="mt-3">
                  We focussen op een positieve benadering van neurodiversiteit, waarbij we de unieke manier van denken en leren van elk kind als een kracht zien.
                </p>
              </section>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                 <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src="https://placehold.co/600x400.png"
                        alt="Ouder en kind die samen praten en leren"
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint="parent child learning discussion"
                    />
                </div>
                <section>
                    <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                    <HeartHandshake className="h-7 w-7" />
                    Hoe ondersteunen wij uw kind?
                    </h2>
                    <ul className="list-disc list-inside space-y-2 pl-5">
                        <li><strong>Zelfinzicht:</strong> Heldere overzichten die neurodivergente eigenschappen (zoals ADD, ADHD, HSP, ASS-kenmerken) uitleggen in begrijpelijke taal.</li>
                        <li><strong>Praktische Tips:</strong> Concrete strategieën voor school, thuis, en sociale situaties, afgestemd op hun leeftijd en profiel.</li>
                        <li><strong>Dagelijkse Groei:</strong> Via de (premium) coaching-hub dagelijkse affirmaties, reflectie-oefeningen en tools voor planning en focus.</li>
                        <li><strong>Positieve Benadering:</strong> We benadrukken sterke punten en helpen bij het ontwikkelen van copingmechanismen voor uitdagingen.</li>
                    </ul>
                </section>
              </div>

              <section>
                <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                  <ShieldCheck className="h-7 w-7" />
                  Veiligheid & Privacy
                </h2>
                <p>
                  De veiligheid en privacy van uw kind staan bij ons voorop. We voldoen aan de AVG (GDPR) en zorgen voor een beveiligde omgeving. Persoonlijke resultaten van de tools zijn strikt vertrouwelijk. Voor jongeren onder de 18 jaar is voor betaalde diensten altijd uw toestemming en betalingsafhandeling nodig. U kunt hierover meer lezen in ons <Link href="/privacy" className="text-primary hover:underline font-medium">Privacybeleid <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>.
                </p>
              </section>

              <section id="faq-payment">
                <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                  <MessageCircleQuestion className="h-7 w-7" />
                  Veelgestelde Vragen door Ouders
                </h2>
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {parentFaqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`parent-faq-${index}`}
                      className="bg-muted/30 rounded-md border border-border"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline py-4 px-5 text-md data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-4 pt-1 text-base leading-relaxed">
                        <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

              <section className="text-center border-t pt-8 mt-10">
                <h2 className="text-2xl font-semibold text-foreground mb-3">Heeft u nog vragen?</h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                    We staan klaar om uw vragen te beantwoorden en u meer te vertellen over hoe MindNavigator uw kind kan helpen.
                </p>
                <Button size="lg" asChild>
                    <Link href="/contact">Neem contact met ons op</Link>
                </Button>
              </section>

            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
