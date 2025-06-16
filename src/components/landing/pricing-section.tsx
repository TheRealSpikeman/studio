
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2, XCircle, Info, Users, BarChart3, BookOpenText, MessageSquare, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

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
  isPopular: boolean;
  yearlyOptionText?: string; // Nieuw: "Of kies jaarlijks: €XX.XX/jaar (omgerekend €Y.YY/mnd)"
  yearlySavingsHighlight?: string; // Nieuw: "bespaar €Z.ZZ"
  planId: string;
  highlightClass?: string;
}

const yearlyCoachingPrice = (3.99 * 12 * 0.85).toFixed(2); // 40.70
const monthlyEquivalentForYearlyCoaching = (parseFloat(yearlyCoachingPrice) / 12).toFixed(2); // 3.39
const yearlySavingsCoaching = ((3.99*12) - parseFloat(yearlyCoachingPrice)).toFixed(2); // 7.18

const yearlyFamilyGuidePrice = (9.99 * 12 * 0.85).toFixed(2); // 101.90
const monthlyEquivalentForFamilyGuide = (parseFloat(yearlyFamilyGuidePrice) / 12).toFixed(2); // 8.49
const yearlySavingsFamilyGuide = ((9.99*12) - parseFloat(yearlyFamilyGuidePrice)).toFixed(2); // 17.98

const plansData: Plan[] = [
  {
    name: 'Gratis Start',
    price: 'Gratis',
    priceDetail: '',
    features: [
      { text: 'Basis Neurodiversiteit Quiz (voor uw kind)', included: true },
      { text: 'Direct Uitgebreid PDF Rapport', included: true, tooltip: 'Een volledig rapport op basis van de gemaakte basisquiz, direct beschikbaar voor u en uw kind.' },
      { text: 'Toegang tot Subquizzen', included: false },
      { text: 'Coaching Hub (Tips, Dagboek)', included: false },
      { text: 'Huiswerk Tools (Planner, Pomodoro)', included: false },
      { text: 'Toegang tot Tutors & Coaches', included: false },
      { text: 'Uitgebreid Ouder Dashboard', included: false },
    ],
    ctaText: 'Start gratis quiz voor uw kind',
    ctaBaseLink: '/quizzes',
    isPopular: false,
    planId: 'free_start', 
  },
  {
    name: 'Coaching & Tools',
    price: '€3,99',
    priceDetail: 'p/kind/mnd',
    features: [
      { text: 'Basis Neurodiversiteit Quiz', included: true },
      { text: 'Direct Uitgebreid PDF Rapport', included: true },
      { text: 'Toegang tot Alle Subquizzen', included: true, tooltip: "Verdiepende quizzen voor een completer beeld van uw kind's profiel." },
      { text: 'Coaching Hub (Virtueel, Dagboek, Tools)', included: true, tooltip: "Dagelijkse tips, reflectie-oefeningen en tools voor zelfmanagement voor uw kind." },
      { text: 'Huiswerk Tools (Planner, Pomodoro)', included: true, tooltip: "Praktische hulpmiddelen voor planning, focus en studievaardigheden." },
      { text: 'Toegang tot Tutors & Coaches', included: false },
      { text: 'Uitgebreid Ouder Dashboard', included: false },
    ],
    ctaText: 'Kies Coaching & Tools (Maandelijks)',
    ctaBaseLink: '/signup',
    isPopular: true,
    planId: 'coaching_tools_monthly',
    yearlyOptionText: `Of kies jaarlijks: €${yearlyCoachingPrice}/jaar (omgerekend €${monthlyEquivalentForYearlyCoaching}/mnd)`,
    yearlySavingsHighlight: `bespaar €${yearlySavingsCoaching}`,
    highlightClass: "border-primary ring-2 ring-primary/50",
  },
  {
    name: 'Gezins Gids',
    price: '€9,99',
    priceDetail: 'p/gezin/mnd',
    features: [
      { text: 'Alles van Coaching & Tools (voor max. 3 kinderen)', included: true, tooltip: 'Inclusief alle quizzen, coaching hub en huiswerk tools voor elk kind in uw gezin (tot 3).' },
      { text: 'Toegang tot Pool Persoonlijke Coaches', included: true, tooltip: "Vind en boek sessies met gespecialiseerde coaches voor persoonlijke begeleiding." },
      { text: 'Toegang tot Pool Huiswerktutors', included: true, tooltip: "Koppel uw kind aan gekwalificeerde tutors voor vakspecifieke ondersteuning." },
      { text: 'Uitgebreid Ouder Dashboard', included: true, tooltip: "Volg de voortgang van uw kinderen, beheer abonnementen en communiceer eenvoudig." },
    ],
    ctaText: 'Kies Gezins Gids (Maandelijks)',
    ctaBaseLink: '/signup',
    isPopular: false,
    planId: 'family_guide_monthly',
    yearlyOptionText: `Of kies jaarlijks: €${yearlyFamilyGuidePrice}/jaar (omgerekend €${monthlyEquivalentForFamilyGuide}/mnd)`,
    yearlySavingsHighlight: `bespaar €${yearlySavingsFamilyGuide}`,
  },
];

export function PricingSection() {
  const router = useRouter();

  const handlePlanSelection = (plan: Plan, isYearlySelected?: boolean) => {
    let targetPlanId = plan.planId;
    if (isYearlySelected) {
      if (plan.planId === 'coaching_tools_monthly') targetPlanId = 'coaching_tools_yearly';
      if (plan.planId === 'family_guide_monthly') targetPlanId = 'family_guide_yearly';
    }

    if (targetPlanId === 'free_start') {
      router.push(plan.ctaBaseLink);
    } else {
      router.push(`${plan.ctaBaseLink}?plan=${targetPlanId}`);
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-secondary/30 flex flex-col items-center">
      <div className="container">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Kies het plan dat bij uw gezin past
        </h2>
        <p className="mb-12 text-center text-lg text-muted-foreground max-w-2xl mx-auto">
          Start gratis om de basis te ontdekken, of kies voor uitgebreide coaching en ondersteuning voor uw kind en uzelf. Registratie en beheer via uw ouderaccount.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {plansData.map((plan) => (
            <Card
              key={plan.planId}
              className={`flex flex-col shadow-lg relative border border-border hover:shadow-xl transition-shadow ${plan.highlightClass || ''}`}
            >
              {plan.isPopular && plan.planId.includes('monthly') && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                    Meest gekozen
                  </span>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-semibold mb-2">{plan.name}</CardTitle>
                <p className="text-4xl font-bold text-primary">
                  {plan.price}
                  {plan.priceDetail && <span className="text-lg font-normal text-muted-foreground"> {plan.priceDetail}</span>}
                </p>
              </CardHeader>
              <CardContent className="flex-grow space-y-4 mt-2">
                <ul className="space-y-3" style={{ lineHeight: '1.6' }}>
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start text-left">
                      {feature.included ? (
                        <CheckCircle2 className="mr-2 mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="mr-2 mt-0.5 h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                      <span className="text-muted-foreground text-sm">
                        {feature.text}
                        {feature.tooltip && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="ml-1 h-5 w-5 p-0 inline-flex align-middle">
                                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-4 pb-6 flex flex-col gap-2">
                <Button
                  onClick={() => handlePlanSelection(plan)}
                  className="w-full h-11 text-base"
                  variant={plan.planId === 'free_start' ? 'outline' : (plan.isPopular ? 'default' : 'secondary')}
                >
                  {plan.ctaText}
                </Button>
                 {plan.yearlyOptionText && (
                  <div className="text-center mt-1">
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
         <p className="text-center text-sm text-muted-foreground mt-12">
            Alle betaalde abonnementen worden beheerd door u als ouder/verzorger en kunnen maandelijks of jaarlijks worden opgezegd.
        </p>
      </div>
    </section>
  );
}
