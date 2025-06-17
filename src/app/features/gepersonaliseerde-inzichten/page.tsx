
"use client"; 

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Brain, ExternalLink } from 'lucide-react';

const allFeatures = [
  { title: 'Gepersonaliseerde Inzichten', link: '/features/gepersonaliseerde-inzichten' },
  { title: 'Coaching & Tools voor Groei', link: '/features/coaching-en-tools' },
  { title: 'Huiswerkondersteuning', link: '/features/huiswerkondersteuning' },
  { title: '1-op-1 Begeleiding (Optioneel)', link: '/features/een-op-een-begeleiding' },
  { title: 'Ouder Dashboard & Communicatie', link: '/features/ouder-dashboard' },
  { title: 'Veilig & Deskundig Platform', link: '/features/veilig-platform' },
];

export default function GepersonaliseerdeInzichtenPage() {
  const featureTitle = "Gepersonaliseerde Inzichten";
  const FeatureIcon = Brain;
  const currentLink = "/features/gepersonaliseerde-inzichten";

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
                Ontdek hoe uw kind start met een assessment en directe inzichten krijgt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-base leading-relaxed text-foreground/90">
              <p>
                Bij MindNavigator geloven we dat elk kind uniek is. Daarom begint de reis met een persoonlijke assessment. Via interactieve zelfreflectie-instrumenten krijgt uw kind direct inzicht in zijn of haar denkstijl, sterke punten, en mogelijke uitdagingen.
              </p>
              <p>
                Na het voltooien van de assessment ontvangt u (met toestemming van uw kind) en uw kind heldere, begrijpelijke overzichten. Deze rapporten zijn ontworpen om:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-5 text-base">
                <li>Unieke krachten en talenten te identificeren en te benadrukken.</li>
                <li>Potentiële uitdagingen in kaart te brengen en handvatten te bieden om hiermee om te gaan.</li>
                <li>Een basis te leggen voor effectieve communicatie en ondersteuning thuis en op school.</li>
                <li>Suggesties te doen voor vervolgstappen, zoals specifieke tools binnen MindNavigator of het overwegen van professionele begeleiding.</li>
              </ul>
              <p>
                De inzichten zijn gekoppeld aan onze <Link href="/neurodiversiteit" className="text-primary hover:underline font-medium">uitgebreide informatie over neurodiversiteit <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>, zodat u de resultaten beter kunt plaatsen en begrijpen.
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
