
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  GraduationCap, Brain, Zap, BookOpenCheck, MessageSquareText, ShieldCheck, ExternalLink, ArrowRight, 
  Users, Search, MessageCircle, CalendarDays, Settings, Eye, CheckCircle2, AlertTriangle, Info, Target,
  ThumbsUp, Edit2Icon, Lightbulb, HelpCircle, Sparkles, Compass, BookHeart, MessageCircleQuestion, Lock, Wallet,
  Video, ListChecks, UserCheck as UserCheckIcon, HeartHandshake, PieChart
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertTitle as AlertTitleUi, AlertDescription as AlertDescUi } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

const allFeatures = [
  { title: 'Gepersonaliseerde Inzichten', link: '/features/gepersonaliseerde-inzichten', icon: Brain },
  { title: 'Coaching & Tools voor Groei', link: '/features/coaching-en-tools', icon: Zap },
  { title: 'Huiswerkondersteuning', link: '/features/huiswerkondersteuning', icon: BookOpenCheck },
  { title: '1-op-1 Begeleiding (Optioneel)', link: '/features/een-op-een-begeleiding', icon: GraduationCap },
  { title: 'Ouder Dashboard & Communicatie', link: '/features/ouder-dashboard', icon: MessageSquareText },
  { title: 'Veilig & Deskundig Platform', link: '/features/veilig-platform', icon: ShieldCheck },
];

const faqItems = [
  {
    id: "faq-klik",
    question: "Wat als mijn kind niet klikt met de begeleider?",
    answer: "Een goede klik is essentieel. Na het gratis kennismakingsgesprek kunt u meestal 1-2 sessies proberen. Mocht er geen klik zijn, dan kunt u eenvoudig op zoek naar een andere begeleider via het platform. Er zijn geen langdurige verplichtingen per begeleider."
  },
  {
    id: "faq-frequentie",
    question: "Hoe vaak zijn de sessies en hoe lang duren ze?",
    answer: "Dit bepaalt u in overleg met de begeleider, afgestemd op de behoeften van uw kind. Sessies duren meestal 45-60 minuten. De frequentie kan variëren van wekelijks tot tweewekelijks of incidenteel, afhankelijk van de doelen."
  },
  {
    id: "faq-privacy-toggle",
    question: "Kan ik het delen van informatie met een begeleider later weer stopzetten?",
    answer: "Ja, absoluut. Via uw Ouder Dashboard kunt u per kind en per gekoppelde begeleider de privacy-instellingen op elk moment eenvoudig aanpassen. U behoudt volledige controle over welke informatie gedeeld wordt."
  },
  {
    id: "faq-veiligheid-communicatie",
    question: "Is de communicatie en het delen van informatie veilig?",
    answer: "Ja, alle communicatie via het platform, inclusief eventuele video-oproepen voor sessies, is versleuteld. Begeleiders zien alleen de informatie die u expliciet met hen deelt via de privacy-instellingen. We hechten veel waarde aan de veiligheid en privacy van uw gegevens."
  },
  {
    id: "faq-annuleren",
    question: "Kan ik een geplande sessie annuleren?",
    answer: "Ja, dat kan. De meeste begeleiders hanteren een annuleringsbeleid waarbij u tot 24 uur van tevoren kosteloos kunt annuleren. Bij annulering binnen 24 uur of bij een no-show kunnen kosten in rekening worden gebracht. In geval van onvoorziene omstandigheden of noodgevallen is er vaak flexibiliteit in overleg met de begeleider."
  }
];


export default function EenOpEenBegeleidingPage() {
  const featureTitle = "1-op-1 Begeleiding bij MindNavigator";
  const FeatureIcon = GraduationCap;
  const currentLink = "/features/een-op-een-begeleiding";

  const otherFeatures = allFeatures.filter(feature => feature.link !== currentLink);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 md:mb-16">
            <Link href="/#platform-features-overview" aria-label={`Terug naar feature overzicht: ${featureTitle}`}>
              <FeatureIcon className="mx-auto h-16 w-16 text-primary mb-4 cursor-pointer transition-transform hover:scale-110" />
            </Link>
            <h1 className="text-4xl font-bold text-foreground">{featureTitle}</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Persoonlijke ondersteuning voor uw neurodivergente kind.
            </p>
          </div>

          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3"><GraduationCap className="h-7 w-7" />Twee Soorten Begeleiding</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-blue-50/70 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-blue-700"><BookOpenCheck className="h-7 w-7"/>Online Huiswerk Begeleiding</CardTitle>
                    <CardDescription className="text-blue-600">Voor praktische schoolondersteuning.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-blue-800 space-y-1.5">
                    <p className="flex items-center gap-2"><Target className="h-4 w-4"/>Huiswerk planning en structuur</p>
                    <p className="flex items-center gap-2"><HelpCircle className="h-4 w-4"/>Moeilijke vakken uitleggen</p>
                    <p className="flex items-center gap-2"><Brain className="h-4 w-4"/>Leer- en concentratietechnieken</p>
                    <p className="flex items-center gap-2"><ThumbsUp className="h-4 w-4"/>Motivatie en zelfvertrouwen</p>
                    <p className="mt-3 font-medium flex items-center gap-2"><Users className="h-4 w-4"/>Neurodiversiteit specialisten beschikbaar.</p>
                    <p className="text-xs">Filter op ADHD, autisme of dyslexie ervaring.</p>
                    <p className="mt-2 font-semibold">💰 Tarieven: €25-65/uur</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50/70 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-green-700"><Brain className="h-7 w-7"/>Coaching met Psychologen</CardTitle>
                    <CardDescription className="text-green-600">Voor diepere ondersteuning en ontwikkeling.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-green-800 space-y-1.5">
                    <p className="flex items-center gap-2"><MessageSquareText className="h-4 w-4"/>Persoonlijke coaching gesprekken</p>
                    <p className="flex items-center gap-2"><Users className="h-4 w-4"/>Strategieën voor sociale situaties</p>
                    <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/>Omgaan met stress en emoties</p>
                    <p className="flex items-center gap-2"><Sparkles className="h-4 w-4"/>Zelfbeeld en zelfvertrouwen versterken</p>
                    <p className="mt-3 font-medium flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/>Alle coaches zijn BIG-geregistreerde psychologen.</p>
                    <p className="mt-2 font-semibold">💰 Tarieven: €75-125/uur</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-3"><Settings className="h-7 w-7"/>Hoe Het Werkt</h2>
              <div className="space-y-6">
                {[
                  { num: 1, icon: Search, title: "Zoek & Match", content: "Filter op specialiteit, prijs en beschikbaarheid. Bekijk profielen, ervaring en reviews. Vergelijk tarieven (wat u ziet = wat u betaalt)." },
                  { num: 2, icon: MessageCircle, title: "Kennismaking", content: "Gratis 15-minuten gesprek. Bespreek doelen en werkwijze. Voel of er een 'klik' is." },
                  { num: 3, icon: Lock, title: "Privacy Instellen", content: "U bepaalt wat u deelt: 'Ken je Kind' assessment, onboarding resultaten, platform voortgang. Per coach/begeleider apart instelbaar en altijd wijzigbaar." },
                  { num: 4, icon: CalendarDays, title: "Sessies Plannen", content: "Boek direct via platform. Automatische herinneringen. Beveiligde video-oproepen. Flexibele tijden." }
                ].map(step => (
                  <div key={step.num} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">{step.num}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-1"><step.icon className="h-5 w-5 text-primary"/>{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3"><Wallet className="h-7 w-7"/>Transparante Prijzen</h2>
              <Card className="bg-yellow-50/50 border-yellow-200">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-yellow-700 flex items-center gap-2"><Info className="h-6 w-6"/>Geen Verborgen Kosten</h3>
                  <p className="text-yellow-800">
                    Begeleider vraagt €50/uur → U betaalt €50/uur <br/>
                    Coach vraagt €90/uur → U betaalt €90/uur
                  </p>
                  <div className="pt-3 mt-3 border-t border-yellow-300">
                    <h4 className="text-lg font-semibold text-yellow-700 flex items-center gap-2 mb-1"><Settings className="h-5 w-5"/>Wat MindNavigator Regelt</h4>
                    <p className="text-xs text-yellow-800">Voor 6% commissie (betaald door de begeleider/coach, niet door u) verzorgen wij:</p>
                    <ul className="list-disc list-inside pl-4 text-xs text-yellow-800 space-y-0.5 mt-1">
                      <li>Beveiligde betalingen via iDEAL/Creditcard</li>
                      <li>Stabiele en beveiligde video-oproepen</li>
                      <li>Planningstool met automatische herinneringen</li>
                      <li>Kwaliteitsbewaking en VOG-check</li>
                      <li>Ondersteuning bij geschillen</li>
                      <li>Facturatie en administratie</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3"><Compass className="h-7 w-7"/>Voorbeeld Zoektocht</h2>
              <Alert variant="default" className="bg-indigo-50/70 border-indigo-200">
                <UserCheckIcon className="h-5 w-5 !text-indigo-600" />
                <AlertTitleUi className="text-indigo-700 font-semibold">Situatie: 14-jarige zoon, herkent ADHD-kenmerken, wiskunde problemen</AlertTitleUi>
                <AlertDescUi className="text-indigo-800 space-y-1 text-sm">
                  <p><strong>Zoek:</strong> "Huiswerkbegeleiding + ADHD + Wiskunde" → 12 resultaten.</p>
                  <p><strong>Filter:</strong> €30-50/uur, na schooltijd → 5 resultaten.</p>
                  <p><strong>Keuze:</strong> Lisa - Wiskundeleraar, 8 jaar ervaring met ADHD, €45/uur ⭐⭐⭐⭐⭐.</p>
                  <p><strong>Privacy:</strong> U deelt de "Ken je Kind" assessment met Lisa voor een gerichte aanpak.</p>
                  <p><strong>Resultaat:</strong> Lisa start direct met visuele wiskundetechnieken die passen bij zijn leerstijl.</p>
                </AlertDescUi>
              </Alert>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3"><MessageCircleQuestion className="h-7 w-7"/>Veelgestelde Vragen</h2>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqItems.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="bg-muted/40 rounded-lg border">
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-4 px-5 text-lg data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 pt-1 text-base leading-relaxed text-foreground/80">
                      <p>{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-6 text-center flex items-center gap-3 justify-center"><HeartHandshake className="h-7 w-7"/>Waarom Onze 1-op-1 Begeleiding?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-card border-border shadow-sm">
                  <CardHeader><CardTitle className="text-lg font-semibold text-accent flex items-center gap-2"><Sparkles className="h-5 w-5"/>Voor Uw Kind</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>100% persoonlijke aandacht</p>
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>Eigen tempo, geen groepsdruk</p>
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>Vertrouwde thuisomgeving</p>
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>Aanpak op maat</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-sm">
                  <CardHeader><CardTitle className="text-lg font-semibold text-accent flex items-center gap-2"><Users className="h-5 w-5"/>Voor U (Ouders)</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>Transparante prijzen</p>
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>Flexibele planning</p>
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>Kwaliteitsgarantie (VOG, intake)</p>
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>Volledige privacy-controle</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-sm">
                  <CardHeader><CardTitle className="text-lg font-semibold text-accent flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/>Toegevoegde Waarde</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>Assessment inzichten direct bruikbaar</p>
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>Alle administratie geregeld</p>
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>Continue kwaliteitsbewaking</p>
                    <p className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500"/>24/7 klantenservice</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mt-10 pt-8 border-t border-border/50">
              <h2 className="text-2xl font-semibold text-primary mb-6 text-center flex items-center gap-3 justify-center"><Target className="h-7 w-7"/>Start Nu Met Persoonlijke Begeleiding</h2>
              <div className="space-y-4 max-w-md mx-auto">
                {[
                  { step: 1, text: "Ga naar uw Ouder Dashboard en klik op \"Zoek Begeleiding\"." },
                  { step: 2, text: "Filter op vak, specialisatie en wat uw kind nodig heeft." },
                  { step: 3, text: "Plan gratis kennismakingsgesprekken met interessante begeleiders." },
                  { step: 4, text: "Stel in welke informatie u wilt delen voor een optimale match." },
                  { step: 5, text: "Kies de beste begeleider en start de eerste sessie!" }
                ].map(item => (
                  <div key={item.step} className="flex items-center gap-3 p-3 bg-muted/30 rounded-md border">
                     <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-md font-semibold">{item.step}</div>
                     <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button size="lg" asChild>
                  <Link href="/dashboard/ouder/zoek-professional">Zoek een Tutor of Coach</Link>
                </Button>
                <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-yellow-500"/>
                  Tip: De meeste ouders plannen 2-3 kennismakingsgesprekken om de beste match te vinden.
                </p>
              </div>
            </section>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <h4 className="text-xl font-semibold text-foreground mb-6 text-center">Ontdek ook onze andere features:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 w-full max-w-lg mx-auto">
              {otherFeatures.map(feature => (
                <Button
                  key={feature.link}
                  variant="link"
                  asChild
                  className="p-0 h-auto justify-start text-left text-base text-primary hover:text-accent group"
                >
                  <Link href={feature.link} className="inline-flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary/80 group-hover:text-accent transition-colors" />
                    <span>{feature.title}</span>
                    <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-1" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
