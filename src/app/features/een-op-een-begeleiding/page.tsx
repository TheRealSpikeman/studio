
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

const allFeatures = [
  { title: 'Gepersonaliseerde Inzichten', link: '/features/gepersonaliseerde-inzichten' },
  { title: 'Coaching & Tools voor Groei', link: '/features/coaching-en-tools' },
  { title: 'Huiswerkondersteuning', link: '/features/huiswerkondersteuning' },
  { title: '1-op-1 Begeleiding (Optioneel)', link: '/features/een-op-een-begeleiding' },
  { title: 'Ouder Dashboard & Communicatie', link: '/features/ouder-dashboard' },
  { title: 'Veilig & Deskundig Platform', link: '/features/veilig-platform' },
];

export default function EenOpEenBegeleidingPage() {
  const featureTitle = "1-op-1 Begeleiding (Optioneel)";
  const FeatureIcon = GraduationCap;
  const currentLink = "/features/een-op-een-begeleiding";

  const otherFeatures = allFeatures.filter(feature => feature.link !== currentLink);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto">
          <Card className="shadow-xl max-w-3xl mx-auto">
            <CardHeader className="text-center pb-8">
              <FeatureIcon className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-4xl font-bold text-foreground">{featureTitle}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Persoonlijke hulp van gekwalificeerde tutors en coaches.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-base leading-relaxed text-foreground/90">
              <p>
                Soms is er behoefte aan meer gepersonaliseerde ondersteuning. MindNavigator biedt de mogelijkheid om uw kind te koppelen aan zorgvuldig geselecteerde, gekwalificeerde tutors (voor vakinhoudelijke huiswerkbegeleiding) en coaches (voor persoonlijke ontwikkeling en welzijn).
              </p>
              <p>
                Via ons platform kunt u:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-5 text-base">
                <li>Profielen van beschikbare tutors en coaches bekijken.</li>
                <li>Filteren op specialisatie, ervaring en tarieven.</li>
                <li>Direct contact leggen en een kennismakingsgesprek plannen.</li>
                <li>Sessies boeken en beheren via een beveiligde omgeving.</li>
              </ul>
              <p>
                De begeleiding wordt afgestemd op het assessmentprofiel en de specifieke behoeften van uw kind, om zo de meest effectieve ondersteuning te bieden. Deze 1-op-1 begeleiding is een optionele, aanvullende dienst binnen MindNavigator.
              </p>
            </CardContent>
             <CardFooter className="flex-col items-start pt-6 mt-4 border-t">
              <h4 className="text-md font-semibold text-foreground mb-3">Ontdek ook onze andere features:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 w-full">
                {otherFeatures.map(feature => (
                  <Button key={feature.link} variant="link" asChild className="p-0 h-auto justify-start text-left text-sm">
                    <Link href={feature.link}>{feature.title}</Link>
                  </Button>
                ))}
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
