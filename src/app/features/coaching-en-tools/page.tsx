
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Zap, Brain, BookOpenCheck, GraduationCap, MessageSquareText, ShieldCheck, ExternalLink } from 'lucide-react';

const allFeatures = [
  { title: 'Gepersonaliseerde Inzichten', link: '/features/gepersonaliseerde-inzichten', icon: Brain },
  { title: 'Coaching & Tools voor Groei', link: '/features/coaching-en-tools', icon: Zap },
  { title: 'Huiswerkondersteuning', link: '/features/huiswerkondersteuning', icon: BookOpenCheck },
  { title: '1-op-1 Begeleiding (Optioneel)', link: '/features/een-op-een-begeleiding', icon: GraduationCap },
  { title: 'Ouder Dashboard & Communicatie', link: '/features/ouder-dashboard', icon: MessageSquareText },
  { title: 'Veilig & Deskundig Platform', link: '/features/veilig-platform', icon: ShieldCheck },
];

export default function CoachingEnToolsPage() {
  const featureTitle = "Coaching & Tools voor Groei";
  const FeatureIcon = Zap;
  const currentLink = "/features/coaching-en-tools";

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
                Ondersteun uw kind met dagelijkse, laagdrempelige coaching en praktische tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-base leading-relaxed text-foreground/90">
              <p>
                De "Coaching & Tools voor Groei" module van MindNavigator is ontworpen om uw kind dagelijks te ondersteunen. Gebaseerd op de resultaten van hun persoonlijke assessment, bieden we:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-5 text-base">
                <li><strong>Dagelijkse Coaching Berichten:</strong> Korte, motiverende en inzichtgevende berichten die helpen bij zelfreflectie en het ontwikkelen van een positieve mindset.</li>
                <li><strong>Interactief Dagboek:</strong> Een veilige plek voor uw kind om gedachten, gevoelens en ervaringen te noteren, wat bijdraagt aan zelfinzicht.</li>
                <li><strong>Planningstools:</strong> Hulpmiddelen om taken, huiswerk en andere activiteiten te organiseren, gericht op het verbeteren van focus en timemanagement.</li>
                <li><strong>Routinebouwers:</strong> Ondersteuning bij het opzetten en vasthouden van gezonde routines die passen bij hun energielevel en behoeften.</li>
                <li><strong>Zelfvertrouwen Oefeningen:</strong> Activiteiten en reflecties gericht op het versterken van zelfvertrouwen en het leren omgaan met uitdagingen.</li>
              </ul>
              <p>
                Deze tools zijn laagdrempelig en ontworpen om naadloos aan te sluiten bij het dagelijks leven van een tiener, en hen te empoweren om hun volledige potentieel te bereiken.
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
