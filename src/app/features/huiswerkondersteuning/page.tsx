
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpenCheck, Brain, Zap, GraduationCap, MessageSquareText, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';

const allFeatures = [
  { title: 'Gepersonaliseerde Inzichten', link: '/features/gepersonaliseerde-inzichten', icon: Brain },
  { title: 'Coaching & Tools voor Groei', link: '/features/coaching-en-tools', icon: Zap },
  { title: 'Huiswerkondersteuning', link: '/features/huiswerkondersteuning', icon: BookOpenCheck },
  { title: '1-op-1 Begeleiding (Optioneel)', link: '/features/een-op-een-begeleiding', icon: GraduationCap },
  { title: 'Ouder Dashboard & Communicatie', link: '/features/ouder-dashboard', icon: MessageSquareText },
  { title: 'Veilig & Deskundig Platform', link: '/features/veilig-platform', icon: ShieldCheck },
];

export default function HuiswerkondersteuningPage() {
  const featureTitle = "Huiswerkondersteuning";
  const FeatureIcon = BookOpenCheck;
  const currentLink = "/features/huiswerkondersteuning";

  const otherFeatures = allFeatures.filter(feature => feature.link !== currentLink);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto">
          <Card className="shadow-xl max-w-3xl mx-auto">
            <CardHeader className="text-center pb-8">
              <Link href="/#platform-features-overview" aria-label={`Terug naar feature overzicht: ${featureTitle}`}>
                <FeatureIcon className="mx-auto h-16 w-16 text-primary mb-4 cursor-pointer transition-transform hover:scale-110" />
              </Link>
              <CardTitle className="text-4xl font-bold text-foreground">{featureTitle}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Effectieve tools en strategieën om studie-uitdagingen te overwinnen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-base leading-relaxed text-foreground/90">
              <p>
                Schoolwerk kan soms een uitdaging zijn. MindNavigator biedt praktische huiswerkondersteuning die is afgestemd op de individuele leerstijl en behoeften van uw kind. Dit omvat:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-5 text-base">
                <li><strong>Planning Tools:</strong> Digitale planners en schema's om huiswerk, toetsen en projecten overzichtelijk te maken.</li>
                <li><strong>Focus Technieken:</strong> Hulp bij het toepassen van methoden zoals de Pomodoro-techniek om concentratie te verbeteren.</li>
                <li><strong>Studievaardigheden Tips:</strong> Strategieën voor effectief leren, samenvatten, en voorbereiden op toetsen.</li>
                <li><strong>Vakspecifieke Hulpmiddelen:</strong> Toegang tot geselecteerde online bronnen, uitlegvideo's en oefeningen per vak (indien beschikbaar).</li>
                <li><strong>Motivatie & Doelen Stellen:</strong> Ondersteuning bij het stellen van realistische doelen en het behouden van motivatie.</li>
              </ul>
              <p>
                Ons doel is om uw kind te helpen zelfstandiger en met meer vertrouwen hun schoolwerk aan te pakken, en vaardigheden te ontwikkelen waar ze hun hele leven profijt van hebben.
              </p>
            </CardContent>
            <CardFooter className="flex-col items-start pt-8 mt-6 border-t">
              <h4 className="text-lg font-semibold text-foreground mb-6">Ontdek ook onze andere features:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 w-full">
                {otherFeatures.map(feature => (
                  <Button
                    key={feature.link}
                    variant="link"
                    asChild
                    className="p-0 h-auto justify-start text-left text-base text-primary hover:text-primary/80 group"
                  >
                    <Link href={feature.link} className="inline-flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-primary/80 group-hover:text-primary transition-colors" />
                      <span>{feature.title}</span>
                      <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-1" />
                    </Link>
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
