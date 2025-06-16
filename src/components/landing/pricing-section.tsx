
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2, XCircle, Info, Users, BarChart3, BookOpenText, MessageSquare, GraduationCap } from 'lucide-react'; // Added new icons
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
  savingsText?: string;
  planId: string;
  highlightClass?: string;
}

const yearlyCoachingPrice = (3.99 * 12 * 0.85).toFixed(2); // 40.70
const monthlyEquivalentForYearlyCoaching = (parseFloat(yearlyCoachingPrice) / 12).toFixed(2); // 3.39
const yearlySavingsCoaching = ((3.99*12) - parseFloat(yearlyCoachingPrice)).toFixed(2); // 7.18

const plansData: Plan[] = [
  {
    name: 'Gratis Start',
    price: 'Gratis',
    priceDetail: '',
    features: [
      { text: 'Basis Neurodiversiteit Quiz', included: true },
      { text: 'Direct Uitgebreid PDF Rapport', included: true, tooltip: 'Een volledig rapport op basis van de gemaakte basisquiz.' },
      { text: 'Toegang tot Subquizzen', included: false },
      { text: 'Coaching Hub (Tips, Dagboek)', included: false },
      { text: 'Huiswerk Tools (Planner, Pomodoro)', included: false },
      { text: 'Toegang tot Tutors & Coaches', included: false },
      { text: 'Uitgebreid Ouder Dashboard', included: false },
    ],
    ctaText: 'Start gratis quiz',
    ctaBaseLink: '/quizzes',
    isPopular: false,
    planId: 'free',
  },
  {
    name: 'Coaching & Tools',
    price: '€3,99',
    priceDetail: 'p/m',
    features: [
      { text: 'Basis Neurodiversiteit Quiz', included: true },
      { text: 'Direct Uitgebreid PDF Rapport', included: true },
      { text: 'Toegang tot Alle Subquizzen', included: true },
      { text: 'Coaching Hub (Virtueel, Dagboek, Tools)', included: true },
      { text: 'Huiswerk Tools (Planner, Pomodoro)', included: true },
      { text: 'Toegang tot Tutors & Coaches', included: false },
      { text: 'Uitgebreid Ouder Dashboard', included: false },
    ],
    ctaText: 'Kies Maandelijks',
    ctaBaseLink: '/signup',
    isPopular: true,
    planId: 'coaching_monthly',
    savingsText: `Of €${yearlyCoachingPrice}/jaar (gelijk aan €${monthlyEquivalentForYearlyCoaching}/mnd - bespaar €${yearlySavingsCoaching})`,
    highlightClass: "border-primary ring-2 ring-primary/50",
  },
  {
    name: 'Compleet Pakket',
    price: '€9,99',
    priceDetail: 'p/m',
    features: [
      { text: 'Basis Neurodiversiteit Quiz', included: true },
      { text: 'Direct Uitgebreid PDF Rapport', included: true },
      { text: 'Toegang tot Alle Subquizzen', included: true },
      { text: 'Coaching Hub (Virtueel, Dagboek, Tools)', included: true },
      { text: 'Huiswerk Tools (Planner, Pomodoro)', included: true },
      { text: 'Toegang tot Pool Persoonlijke Coaches', included: true },
      { text: 'Toegang tot Pool Huiswerk Tutors', included: true },
      { text: 'Uitgebreid Ouder Dashboard (kind volgen)', included: true },
    ],
    ctaText: 'Kies Compleet',
    ctaBaseLink: '/signup',
    isPopular: false,
    planId: 'complete_monthly',
    // Jaarlijkse optie kan hier later worden toegevoegd als de gebruiker dat specificeert
  },
];

export function PricingSection() {
  const router = useRouter();

  const handlePlanSelection = (plan: Plan) => {
    if (plan.planId === 'free') {
      router.push(plan.ctaBaseLink); 
    } else {
      let targetPlanId = plan.planId;
      // Specifieke logica als we een jaarlijkse CTA willen voor het "Coaching & Tools" plan
      if (plan.planId === 'coaching_monthly' && plan.savingsText) {
        // Voor nu laten we de maandelijkse planId in de URL, 
        // de ouder kan in de signup of dashboard later een jaarlijkse optie kiezen.
        // Als je direct naar een jaarlijks plan wilt linken, heb je een planId zoals 'coaching_annual' nodig.
      }
      router.push(`${plan.ctaBaseLink}?plan=${targetPlanId}`);
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-secondary/30 flex flex-col items-center">
      <div className="container">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Kies jouw pad naar zelfinzicht
        </h2>
        <p className="mb-12 text-center text-lg text-muted-foreground max-w-2xl mx-auto">
          Start gratis, of krijg volledige toegang tot coaching, alle tools en persoonlijke begeleiding. Registratie en beheer via het ouderaccount.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {plansData.map((plan) => (
            <Card
              key={plan.planId}
              className={`flex flex-col shadow-lg relative border border-border hover:shadow-xl transition-shadow ${plan.highlightClass || ''}`}
            >
              {plan.isPopular && (
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
                {plan.savingsText && (
                  <p className="text-xs text-muted-foreground mt-1">{plan.savingsText}</p>
                )}
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
              <CardFooter className="mt-auto pt-4 pb-6">
                <Button
                  onClick={() => handlePlanSelection(plan)}
                  className="w-full h-11 text-base"
                  variant={plan.planId === 'free' ? 'outline' : (plan.isPopular ? 'default' : 'secondary')}
                >
                  {plan.ctaText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         <p className="text-center text-sm text-muted-foreground mt-12">
            Alle betaalde abonnementen worden beheerd door de ouder/verzorger en kunnen maandelijks of jaarlijks worden opgezegd.
        </p>
      </div>
    </section>
  );
}
