
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ParentalApprovalDialog } from '@/components/auth/parental-approval-dialog';

interface PlanFeature {
  basisQuiz: boolean;             // "Basis Neurodiversiteit Quiz"
  alleQuizzen: boolean;           // "Alle Quizzen (Basis + Subtests)"
  coachingHubToegang: boolean;    // "Volledige Toegang Coaching Hub"
  huiswerkToolsToegang: boolean;  // "Toegang tot Huiswerk Tools"
  pdfRapport: 'geen' | 'beperkt' | 'volledig'; // "PDF Rapportage"
  oneOnOneTutorPremium: boolean; // New feature
}

interface Plan {
  name: string;
  price: string;
  priceDetail: string;
  features: PlanFeature;
  ctaText: string;
  ctaBaseLink: string; // Base link before adding query params or changing for checkout
  isPopular: boolean;
  savingsText?: string;
  planId: string; // e.g., 'monthly', 'annual'
}

const plans: Plan[] = [
  {
    name: 'Gratis Basisquiz',
    price: 'Gratis',
    priceDetail: '',
    features: {
      basisQuiz: true,
      alleQuizzen: false,
      coachingHubToegang: false,
      huiswerkToolsToegang: false,
      pdfRapport: 'beperkt',
      oneOnOneTutorPremium: false,
    },
    ctaText: 'Start gratis quiz',
    ctaBaseLink: '/quizzes',
    isPopular: false,
    planId: 'free',
  },
  {
    name: 'Coaching Maandelijks',
    price: '€2,50',
    priceDetail: 'p/m',
    features: {
      basisQuiz: true, // Included in 'alleQuizzen'
      alleQuizzen: true,
      coachingHubToegang: true,
      huiswerkToolsToegang: true,
      pdfRapport: 'volledig',
      oneOnOneTutorPremium: true,
    },
    ctaText: 'Kies Maandelijks',
    ctaBaseLink: '/signup', // Will append ?plan=monthly
    isPopular: true,
    planId: 'monthly',
  },
  {
    name: 'Coaching Jaarlijks',
    price: '€25',
    priceDetail: 'per jaar',
    features: {
      basisQuiz: true, // Included in 'alleQuizzen'
      alleQuizzen: true,
      coachingHubToegang: true,
      huiswerkToolsToegang: true,
      pdfRapport: 'volledig',
      oneOnOneTutorPremium: true,
    },
    ctaText: 'Kies Jaarlijks',
    ctaBaseLink: '/signup', // Will append ?plan=annual
    isPopular: false,
    savingsText: 'Bespaar €5 (gelijk aan €2,08 p/m)',
    planId: 'annual',
  },
];

const featureLabels: Record<keyof PlanFeature, string> = {
  basisQuiz: "Basis Neurodiversiteit Quiz",
  alleQuizzen: "Alle Quizzen (Basis + Subtests)",
  coachingHubToegang: "Volledige Toegang Coaching Hub (Tips, Dagboek, Forum etc.)",
  huiswerkToolsToegang: "Toegang tot Huiswerk Tools (Planning, Pomodoro etc.)",
  pdfRapport: "PDF Rapportage",
  oneOnOneTutorPremium: "1-op-1 Tutor Premium Sessies (korting/extra's)",
};

// Simulate user data. In a real app, this would come from an auth context.
interface MockUser {
  isLoggedIn: boolean;
  name: string;
  email: string;
  age: number;
}
// const MOCKED_USER: MockUser | null = { isLoggedIn: true, name: "Test Kid", email: "kid@example.com", age: 15 };
const MOCKED_USER: MockUser | null = null; // Simulate not logged in
// const MOCKED_USER: MockUser | null = { isLoggedIn: true, name: "Test Adult", email: "adult@example.com", age: 25 };


export function PricingSection() {
  const router = useRouter();
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<Plan | null>(null);

  const handlePlanSelection = (plan: Plan) => {
    if (plan.planId === 'free') {
      router.push(plan.ctaBaseLink);
      return;
    }

    if (MOCKED_USER?.isLoggedIn) {
      if (MOCKED_USER.age < 18) {
        setSelectedPlanForModal(plan);
        setIsParentModalOpen(true);
      } else {
        // Logged in and adult, redirect to checkout (placeholder)
        router.push(`/checkout?plan=${plan.planId}`);
      }
    } else {
      // Not logged in, redirect to signup with plan
      router.push(`${plan.ctaBaseLink}?plan=${plan.planId}`);
    }
  };


  return (
    <section id="pricing" className="py-16 md:py-24 bg-secondary/30 flex flex-col items-center">
      <div className="container">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Kies jouw pad naar zelfinzicht
        </h2>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          Start gratis of krijg volledige toegang tot alle coaching en tools.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.planId}
              className={`flex flex-col shadow-lg relative 
                ${plan.isPopular ? 'border-2 border-primary ring-2 ring-primary/50' : 'border border-border hover:shadow-xl transition-shadow'}`}
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
                  <p className="text-xs text-muted-foreground">{plan.savingsText}</p>
                )}
              </CardHeader>
              <CardContent className="flex-grow space-y-4 mt-2">
                <ul className="space-y-3" style={{ lineHeight: '1.6' }}>
                  {Object.entries(plan.features).map(([key, value]) => {
                    const featureKey = key as keyof PlanFeature;
                    // Conditional rendering for basisQuiz on paid plans if alleQuizzen is true
                    if (featureKey === 'basisQuiz' && plan.features.alleQuizzen && plan.planId !== 'free') {
                      return null; 
                    }

                    return (
                      <li key={featureKey} className="flex items-center">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="mr-2 h-5 w-5 text-red-500 flex-shrink-0" />
                          )
                        ) : ( // For pdfRapport which can be 'geen', 'beperkt', 'volledig'
                          value !== 'geen' ? 
                          <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                          : <XCircle className="mr-2 h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className="text-muted-foreground">
                          {featureLabels[featureKey]}
                          {featureKey === 'pdfRapport' && typeof value === 'string' && value !== 'geen' && ` (${value})`}
                        </span>
                        {featureKey === 'pdfRapport' && value === 'beperkt' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Samenvatting van je resultaten. Volledige tips & strategieën in betaalde plannen.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-4">
                <Button
                  onClick={() => handlePlanSelection(plan)}
                  className="w-full h-11"
                  variant={plan.isPopular ? 'default' : (plan.price === 'Gratis' ? 'outline' : 'secondary')}
                >
                  {plan.ctaText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {selectedPlanForModal && (
        <ParentalApprovalDialog
          isOpen={isParentModalOpen}
          onOpenChange={setIsParentModalOpen}
          planName={selectedPlanForModal.name}
        />
      )}
    </section>
  );
}

