
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheck, Brain, Zap, BookOpenCheck, GraduationCap, MessageSquareText, ExternalLink } from 'lucide-react';

const allFeatures = [
  { title: 'Gepersonaliseerde Inzichten', link: '/features/gepersonaliseerde-inzichten', icon: Brain },
  { title: 'Coaching & Tools voor Groei', link: '/features/coaching-en-tools', icon: Zap },
  { title: 'Huiswerkondersteuning', link: '/features/huiswerkondersteuning', icon: BookOpenCheck },
  { title: '1-op-1 Begeleiding (Optioneel)', link: '/features/een-op-een-begeleiding', icon: GraduationCap },
  { title: 'Ouder Dashboard & Communicatie', link: '/features/ouder-dashboard', icon: MessageSquareText },
  { title: 'Veilig & Deskundig Platform', link: '/features/veilig-platform', icon: ShieldCheck },
];

export default function VeiligPlatformPage() {
  const featureTitle = "Veilig & Deskundig Platform";
  const FeatureIcon = ShieldCheck;
  const currentLink = "/features/veilig-platform";

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
                Een betrouwbare omgeving, gebouwd op expertise en privacy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-base leading-relaxed text-foreground/90">
              <p>
                MindNavigator is toegewijd aan het bieden van een veilige, privacygerichte en deskundig onderbouwde ervaring voor jongeren en hun ouders.
              </p>
              <h3 className="text-xl font-semibold text-primary mt-4">Privacy Voorop</h3>
              <p>
                Wij begrijpen het belang van privacy, zeker als het om jongeren gaat. Alle persoonlijke gegevens en resultaten worden vertrouwelijk behandeld en beveiligd opgeslagen conform de AVG/GDPR-richtlijnen. U en uw kind behouden controle over welke informatie gedeeld wordt. Lees ons volledige <Link href="/privacy" className="text-primary hover:underline font-medium">Privacybeleid <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link> voor details.
              </p>
              <h3 className="text-xl font-semibold text-primary mt-4">Educatieve Principes & Deskundigheid</h3>
              <p>
                De content en tools op MindNavigator zijn ontwikkeld op basis van erkende educatieve principes en inzichten uit de psychologie en orthopedagogiek. We werken samen met <Link href="/samenwerkingen" className="text-primary hover:underline font-medium">professionals en experts</Link> om de kwaliteit en relevantie van ons aanbod te waarborgen.
              </p>
              <h3 className="text-xl font-semibold text-primary mt-4">Geen Diagnoses</h3>
              <p>
                Het is cruciaal om te begrijpen dat MindNavigator <strong>geen</strong> medische of psychologische diagnoses stelt. Onze tools zijn bedoeld voor zelfreflectie, educatie en het bieden van handvatten. Voor een formele diagnose of professionele behandeling verwijzen wij u altijd naar een gekwalificeerde zorgverlener. Zie ook onze <Link href="/disclaimer" className="text-primary hover:underline font-medium">Disclaimer <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>.
              </p>
            </CardContent>
            <CardFooter className="flex-col items-start pt-8 mt-6 border-t">
              <h4 className="text-lg font-semibold text-foreground mb-6">Ontdek ook onze andere features:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full">
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
