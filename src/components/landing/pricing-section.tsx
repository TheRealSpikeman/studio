import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Gratis Basisquiz',
    price: 'Gratis',
    priceDetail: '',
    features: {
      basisvragen: true,
      subquizzen: false,
      dagelijkseTips: false,
      pdfRapport: 'beperkt',
    },
    ctaText: 'Start gratis quiz',
    ctaLink: '/quiz/teen-neurodiversity-quiz', // Or /quizzes
    isPopular: false,
  },
  {
    name: 'Coaching Maandelijks',
    price: '€2,50',
    priceDetail: 'p/m',
    features: {
      basisvragen: true,
      subquizzen: true,
      dagelijkseTips: true,
      pdfRapport: 'volledig',
    },
    ctaText: 'Kies Maandelijks',
    ctaLink: '/signup?plan=monthly', // Example link
    isPopular: true,
  },
  {
    name: 'Coaching Jaarlijks',
    price: '€25',
    priceDetail: 'per jaar',
    features: {
      basisvragen: true,
      subquizzen: true,
      dagelijkseTips: true,
      pdfRapport: 'volledig',
    },
    ctaText: 'Kies Jaarlijks',
    ctaLink: '/signup?plan=annual', // Example link
    isPopular: false,
  },
];

const featureLabels: { [key: string]: string } = {
  basisvragen: 'Basisvragen',
  subquizzen: 'Verdiepende Subquizzen',
  dagelijkseTips: 'Dagelijkse Coaching Tips',
  pdfRapport: 'PDF Rapportage',
};

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Kies jouw pad naar zelfinzicht
        </h2>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          Start gratis of krijg volledige toegang tot alle coaching en tools.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col shadow-lg relative ${plan.isPopular ? 'border-2 border-primary ring-2 ring-primary/50' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                    Meest gekozen
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
                <p className="text-4xl font-bold text-primary">
                  {plan.price}
                  {plan.priceDetail && <span className="text-lg font-normal text-muted-foreground"> {plan.priceDetail}</span>}
                </p>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <ul className="space-y-3">
                  {Object.entries(plan.features).map(([key, value]) => (
                    <li key={key} className="flex items-center">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="mr-2 h-5 w-5 text-red-500 flex-shrink-0" />
                        )
                      ) : (
                        <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                      <span className="text-muted-foreground">
                        {featureLabels[key]}
                        {typeof value === 'string' && ` (${value})`}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button asChild className="w-full" variant={plan.isPopular ? 'default' : 'outline'}>
                  <Link href={plan.ctaLink}>{plan.ctaText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
