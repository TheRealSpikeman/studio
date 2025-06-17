// src/app/pricing/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, XCircle, Info, Users, BarChart3, BookOpenText, MessageSquare, GraduationCap, ShieldCheck, Sparkles, Star, HelpCircle, Percent, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle as AlertTitleUi, AlertDescription as AlertDescUi } from "@/components/ui/alert";


interface PlanFeature {
  text: string;
  included: boolean;
  tooltip?: string;
}

interface Plan {
  name: string;
  price: string;
  priceDetail: string;
  features: PlanFeature[];
  ctaText: string;
  ctaBaseLink: string;
  isPopular?: boolean;
  yearlyOptionText?: string;
  yearlySavingsHighlight?: string;
  planId: string;
  highlightClass?: string;
  extraInfo?: string;
  icon: React.ElementType;
  colorClass?: string;
}

const yearlyCoachingPrice = (19.99 * 12 * 0.85).toFixed(2); // Assume 15% discount
const monthlyEquivalentForYearlyCoaching = (parseFloat(yearlyCoachingPrice) / 12).toFixed(2);
const yearlySavingsCoaching = ((19.99 * 12) - parseFloat(yearlyCoachingPrice)).toFixed(2);

const yearlyPremiumPrice = (39.99 * 12 * 0.85).toFixed(2); // Assume 15% discount
const monthlyEquivalentForYearlyPremium = (parseFloat(yearlyPremiumPrice) / 12).toFixed(2);
const yearlySavingsPremium = ((39.99 * 12) - parseFloat(yearlyPremiumPrice)).toFixed(2);

const plansData: Plan[] = [
  {
    name: 'Gratis Ontdekking',
    icon: Sparkles,
    price: 'Gratis',
    priceDetail: 'Proef de kracht',
    features: [
      { text: 'Start-assessment inbegrepen', included: true },
      { text: 'Wekelijkse motivatie-email met praktische tips', included: true },
      { text: 'Basis zelfreflectie tool (beperkte toegang)', included: true },
      { text: 'Sample coaching content (5 voorbeeldberichten)', included: true },
      { text: 'Basis PDF overzicht van sterke punten', included: true },
      { text: 'Browse coaches & tutors (profielen bekijken)', included: true },
      { text: 'Tarieven en specialisaties zien', included: true },
      { text: 'Geen sessies boeken', included: false },
      { text: 'Account beheer en basisinstellingen', included: true },
      { text: 'Geen voortgangsanalytics', included: false },
    ],
    ctaText: 'Start gratis ontdekking',
    ctaBaseLink: '/quizzes', // Ga direct naar de quizzen pagina voor de assessment
    planId: 'free_start',
    colorClass: "border-gray-300 hover:border-gray-400",
  },
  {
    name: 'Familie Coaching',
    icon: Users,
    price: '€19,99',
    priceDetail: 'p/gezin/maand',
    features: [
      { text: 'Start-assessment inbegrepen', included: true },
      { text: 'Dagelijkse coaching berichten (gepersonaliseerd)', included: true },
      { text: 'Alle zelfreflectie instrumenten (unlimited)', included: true },
      { text: 'Interactieve dagboek en reflectie-oefeningen', included: true },
      { text: 'Huiswerk planner en focus tools (Pomodoro)', included: true },
      { text: 'Motivatie tracking met voortgangsvisualisatie', included: true },
      { text: 'Uitgebreide PDF overzichten met diepgaande insights', included: true },
      { text: 'Sessies boeken en betalen bij coaches & tutors', included: true },
      { text: 'Direct contact en communicatie met professionals', included: true },
      { text: 'Review en rating systeem', included: true },
      { text: 'Sessie planning met automatische herinneringen', included: true },
      { text: 'Voortgangsvolging en trends van uw kind', included: true },
      { text: 'Familie insights en gepersonaliseerde aanbevelingen', included: true },
      { text: 'Tot 3 kinderen inbegrepen', included: true },
      { text: 'Communicatie met gekoppelde coaches en tutors', included: true },
    ],
    ctaText: 'Kies Familie Coaching',
    ctaBaseLink: '/signup',
    isPopular: true,
    planId: 'family_guide_monthly', 
    yearlyOptionText: `Of kies jaarlijks: €${yearlyCoachingPrice}/jaar (€${monthlyEquivalentForYearlyCoaching}/mnd)`,
    yearlySavingsHighlight: `bespaar €${yearlySavingsCoaching}`,
    highlightClass: "border-primary ring-2 ring-primary/50",
    colorClass: "border-primary hover:border-primary/80",
  },
  {
    name: 'Premium Familie',
    icon: Star,
    price: '€39,99',
    priceDetail: 'p/gezin/maand',
    features: [
      { text: 'Start-assessment inbegrepen', included: true },
      { text: 'Uitgebreide assessment analyse & rapportage', included: true },
      { text: 'Alles van Familie Coaching PLUS:', included: true, tooltip: "Omvat alle digitale tools, coaching en platformtoegang van het Familie Coaching plan." },
      { text: 'AI-powered insights en gepersonaliseerde aanbevelingen', included: true },
      { text: 'Advanced analytics en trendanalyse', included: true },
      { text: 'Exclusieve coaching modules en premium content', included: true },
      { text: 'Prioriteit algoritme voor beste coach matching', included: true },
      { text: 'Prioriteit booking bij populaire coaches & tutors', included: true },
      { text: 'Extended zoekfilters en matching criteria', included: true },
      { text: 'Bulk session planning voor gemak', included: true },
      { text: 'Premium support (24u response tijd)', included: true },
      { text: 'Unlimited kinderen (geen limiet meer)', included: true },
      { text: 'Maandelijkse familie coaching calls (30 min)', included: true },
      { text: 'School integratie tools en rapportage', included: true },
      { text: 'Advanced ouder training modules', included: true },
    ],
    ctaText: 'Kies Premium Familie',
    ctaBaseLink: '/signup',
    planId: 'premium_family_monthly',
    yearlyOptionText: `Of kies jaarlijks: €${yearlyPremiumPrice}/jaar (€${monthlyEquivalentForYearlyPremium}/mnd)`,
    yearlySavingsHighlight: `bespaar €${yearlySavingsPremium}`,
    colorClass: "border-accent hover:border-accent/80",
  },
];

const faqItems = [
  {
    question: "Wat is het verschil tussen de plannen?",
    answer: "Gratis: Proef de basis digitale tools (beperkt). Familie Coaching: Complete digitale ondersteuning + marktplaats toegang voor max 3 kinderen. Premium Familie: Alles van Familie Coaching + premium features + unlimited kinderen + maandelijkse familie coaching calls.",
  },
  {
    question: "Zijn 1-op-1 coaching sessies inbegrepen?",
    answer: "Nee, live coaching en tutoring worden apart betaald per sessie (indicatie: €25-125/uur afhankelijk van specialist). Met een betaald abonnement krijgt u toegang tot onze marktplaats om deze professionals te boeken en te betalen.",
  },
  {
    question: "Kan ik upgraden of downgraden?",
    answer: "Ja, u kunt op elk moment van plan wisselen via uw accountinstellingen. Bij een upgrade wordt het verschil direct verrekend. Bij een downgrade gaat de wijziging in bij uw volgende factuurperiode.",
  },
  {
    question: "Hoeveel kinderen kan ik toevoegen?",
    answer: "Familie Coaching: Tot 3 kinderen. Premium Familie: Onbeperkt aantal kinderen. Heeft u meer dan 3 kinderen en wilt u het Familie Coaching plan? Neem dan contact op voor een aangepast aanbod.",
  },
  {
    question: "Hoe werkt de jaarlijkse betaling?",
    answer: "Bij een jaarlijkse betaling betaalt u voor 12 maanden vooruit en ontvangt u een korting (gelijk aan ongeveer 2 maanden gratis). Uw abonnement wordt dan jaarlijks verlengd, tenzij u opzegt.",
  },
];

export default function PricingPage() {
  const router = useRouter();

  const handlePlanSelection = (plan: Plan, isYearlySelected?: boolean) => {
    let targetPlanId = plan.planId;
    if (isYearlySelected) {
      if (plan.planId === 'family_guide_monthly') targetPlanId = 'family_guide_yearly';
      if (plan.planId === 'premium_family_monthly') targetPlanId = 'premium_family_yearly';
    }

    if (targetPlanId === 'free_start') {
      router.push(plan.ctaBaseLink); // Linkt naar /quizzes of assessment start
    } else {
      router.push(`${plan.ctaBaseLink}?plan=${targetPlanId}`);
    }
  };


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background">
        <section className="py-16 md:py-20 text-center">
          <div className="container">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Kies het plan dat bij uw gezin past
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
              Start gratis om de basis te ontdekken, of kies voor volledige digitale coaching en ondersteuning voor uw kind en uzelf. Registratie en beheer via uw ouderaccount. Elk pad begint met een persoonlijke assessment.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
              {plansData.map((plan) => (
                <Card
                  key={plan.planId}
                  className={cn(
                    `flex flex-col shadow-lg relative border-2 hover:shadow-xl transition-all duration-300`,
                    plan.highlightClass || plan.colorClass || 'border-border'
                  )}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 transform">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-md">
                        <Star className="h-4 w-4 fill-current" /> Meest gekozen
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pt-10">
                    <plan.icon className="mx-auto h-12 w-12 text-primary mb-3" />
                    <CardTitle className="text-2xl font-semibold mb-1">{plan.name}</CardTitle>
                    <p className="text-4xl font-bold text-primary">
                      {plan.price}
                    </p>
                    <p className="text-sm font-normal text-muted-foreground -mt-1"> {plan.priceDetail}</p>
                    {plan.name === "Familie Coaching" && (
                        <p className="text-xs text-green-600 font-medium mt-1">€0,66 per dag - minder dan een kopje koffie!</p>
                    )}
                    {plan.name === "Premium Familie" && (
                        <p className="text-xs text-green-600 font-medium mt-1">Voor gezinnen die het beste willen - €1,33 per dag!</p>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3 mt-1">
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-left">
                          {feature.included ? (
                            <CheckCircle2 className="mr-2.5 mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="mr-2.5 mt-0.5 h-5 w-5 text-red-500 flex-shrink-0" />
                          )}
                          <span className="text-muted-foreground text-sm leading-snug">
                            {feature.text}
                            {feature.tooltip && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="inline-block h-3 w-3 ml-1 text-muted-foreground/70 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>{feature.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {plan.extraInfo && (
                      <p className="text-xs text-muted-foreground text-center pt-2">{plan.extraInfo}</p>
                    )}
                  </CardContent>
                  <CardFooter className="mt-auto pt-5 pb-6 flex flex-col gap-2.5">
                    <Button
                      onClick={() => handlePlanSelection(plan)}
                      className="w-full h-12 text-base font-semibold"
                      variant={plan.planId === 'free_start' ? 'outline' : (plan.isPopular ? 'default' : 'secondary')}
                    >
                      {plan.ctaText}
                    </Button>
                    {plan.yearlyOptionText && (
                      <div className="text-center mt-1.5">
                        <Button
                          onClick={() => handlePlanSelection(plan, true)}
                          variant="link"
                          className="h-auto text-xs text-primary py-1 px-2 text-center flex-wrap justify-center items-baseline leading-tight"
                        >
                          <span>{plan.yearlyOptionText}</span>
                          {plan.yearlySavingsHighlight && (
                            <span className="text-accent font-semibold ml-1">- {plan.yearlySavingsHighlight}</span>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-secondary/20">
          <div className="container max-w-3xl">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              <HelpCircle className="inline-block h-9 w-9 mr-2 text-primary" /> Veelgestelde Vragen
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card rounded-lg shadow-sm border"
                >
                  <AccordionTrigger className="text-left text-lg hover:no-underline font-medium text-foreground py-5 px-6 data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary [&[data-state=open]>svg]:rotate-180 transition-all">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-5 pt-0 bg-card rounded-b-lg text-base data-[state=open]:bg-muted/20">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-4xl text-center">
             <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-6">
              <ShieldCheck className="inline-block h-10 w-10 mr-2 text-primary" /> Onze Garanties
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <Card className="bg-green-50 border-green-200 shadow-sm">
                <CardHeader><CardTitle className="text-green-700">Privacy & Veiligheid</CardTitle></CardHeader>
                <CardContent className="text-sm text-green-800 space-y-1">
                  <p>AVG-conform platform speciaal voor tieners.</p>
                  <p>Geen data doorverkoop - uw informatie blijft privé.</p>
                  <p>Beveiligde betalingen via Nederlandse banken.</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200 shadow-sm">
                <CardHeader><CardTitle className="text-blue-700">Transparantie</CardTitle></CardHeader>
                <CardContent className="text-sm text-blue-800 space-y-1">
                  <p>Geen verborgen kosten of verrassingen.</p>
                  <p>Altijd duidelijk wat wel en niet inbegrepen is.</p>
                  <p>Wij bieden geen diagnoses - alleen ondersteuning.</p>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200 shadow-sm">
                <CardHeader><CardTitle className="text-yellow-700">Flexibiliteit</CardTitle></CardHeader>
                <CardContent className="text-sm text-yellow-800 space-y-1">
                  <p>Maandelijks opzegbaar (bij maandabonnement).</p>
                  <p>Geen langdurige binding of opstartkosten.</p>
                  <p>Probeer 14 dagen gratis bij elk betaald plan.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-8">
              <Percent className="inline-block h-10 w-10 mr-3 text-accent" /> Waarom MindNavigator?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="p-6 bg-card rounded-lg shadow-md border border-border">
                    <h3 className="font-semibold text-lg text-primary mb-1">Betaalbare Digitale Ondersteuning</h3>
                    <p className="text-sm text-muted-foreground">MindNavigator Familie: €19,99/maand voor het hele gezin. Traditionele coaching: vaak €100-150/uur per kind. Bespaar honderden euro's per maand.</p>
                </div>
                 <div className="p-6 bg-card rounded-lg shadow-md border border-border">
                    <h3 className="font-semibold text-lg text-primary mb-1">Direct Beschikbaar, Geen Wachttijden</h3>
                    <p className="text-sm text-muted-foreground">GGZ wachttijden: 6-12+ maanden. MindNavigator digitale tools: start vandaag nog, 24/7 toegankelijk. Live professionals beschikbaar via ons platform.</p>
                </div>
                 <div className="p-6 bg-card rounded-lg shadow-md border border-border">
                    <h3 className="font-semibold text-lg text-primary mb-1">Complete Oplossing</h3>
                    <p className="text-sm text-muted-foreground">Digitale tools voor dagelijkse ondersteuning van uw kind, toegang tot live professionals wanneer nodig, en een familie dashboard om alles centraal te beheren.</p>
                </div>
            </div>
            <Button size="lg" asChild className="mt-10 shadow-md hover:shadow-lg transition-shadow px-8 py-3">
                <Link href="/signup?plan=family_guide_monthly">
                    Start met Familie Coaching
                </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">14 dagen gratis proberen, daarna maandelijks opzegbaar.</p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

