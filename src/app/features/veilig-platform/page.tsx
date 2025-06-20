
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheck, Brain, Zap, BookOpenCheck, GraduationCap, MessageSquareText, ExternalLink, ArrowRight, Lock, AlertTriangle, Lightbulb, Users, CheckCircle2, Info, FileText as FileTextIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const allFeatures = [
  { title: 'Gepersonaliseerde Inzichten', link: '/features/gepersonaliseerde-inzichten', icon: Brain },
  { title: 'Coaching & Tools voor Groei', link: '/features/coaching-en-tools', icon: Zap },
  { title: 'Huiswerkondersteuning', link: '/features/huiswerkondersteuning', icon: BookOpenCheck },
  { title: '1-op-1 Begeleiding (Optioneel)', link: '/features/een-op-een-begeleiding', icon: GraduationCap },
  { title: 'Ouder Dashboard & Communicatie', link: '/features/ouder-dashboard', icon: MessageSquareText },
  { title: 'Veilig & Deskundig Platform', link: '/features/veilig-platform', icon: ShieldCheck },
];

interface DetailItem {
  icon: React.ElementType;
  title: string;
  description: string | React.ReactNode; // Allow ReactNode for links
}

const platformPrinciples: DetailItem[] = [
  {
    icon: Lock,
    title: "Privacy Voorop",
    description: (
      <>
        Wij begrijpen het belang van privacy, zeker als het om jongeren gaat. Alle persoonlijke gegevens en resultaten worden vertrouwelijk behandeld en beveiligd opgeslagen conform de AVG/GDPR-richtlijnen. U en uw kind behouden controle over welke informatie gedeeld wordt. 
        Lees ons volledige <Link href="/privacy" className="text-primary hover:underline font-medium">Privacybeleid <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link> voor details.
      </>
    )
  },
  {
    icon: Brain,
    title: "Educatieve Principes & Deskundigheid",
    description: (
      <>
        De content en tools op MindNavigator zijn ontwikkeld op basis van erkende educatieve principes en inzichten uit de psychologie en orthopedagogiek. We werken samen met <Link href="/samenwerkingen" className="text-primary hover:underline font-medium">professionals en experts</Link> om de kwaliteit en relevantie van ons aanbod te waarborgen.
      </>
    )
  },
  {
    icon: AlertTriangle,
    title: "Geen Diagnoses",
    description: (
      <>
        Het is cruciaal om te begrijpen dat MindNavigator <strong>geen</strong> medische of psychologische diagnoses stelt. Onze tools zijn bedoeld voor zelfreflectie, educatie en het bieden van handvatten. Voor een formele diagnose of professionele behandeling verwijzen wij u altijd naar een gekwalificeerde zorgverlener. 
        Zie ook onze <Link href="/disclaimer" className="text-primary hover:underline font-medium">Disclaimer <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>.
      </>
    )
  }
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
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 md:mb-16">
            <Link href="/#platform-features-overview" aria-label={`Terug naar feature overzicht: ${featureTitle}`}>
              <FeatureIcon className="mx-auto h-16 w-16 text-primary mb-4 cursor-pointer transition-transform hover:scale-110" />
            </Link>
            <h1 className="text-4xl font-bold text-foreground">{featureTitle}</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Een betrouwbare omgeving, gebouwd op expertise en privacy, speciaal voor neurodivergente jongeren en hun ouders.
            </p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                        <ShieldCheck className="h-7 w-7" />
                        Onze Toewijding aan een Veilige Ervaring
                    </h2>
                    <p className="mb-4">
                        MindNavigator is toegewijd aan het bieden van een veilige, privacygerichte en deskundig onderbouwde ervaring voor jongeren en hun ouders. Wij begrijpen dat het verkennen van neurodiversiteit een persoonlijk proces is, en we nemen de verantwoordelijkheid om dit proces te ondersteunen met de grootst mogelijke zorgvuldigheid.
                    </p>
                    <p>
                        Onze tools en content zijn ontwikkeld om te empoweren, inzicht te bieden en een positieve bijdrage te leveren aan zelfontdekking en welzijn.
                    </p>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src="https://placehold.co/600x400.png"
                        alt="Visualisatie van een veilige digitale omgeving"
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint="secure digital environment shield"
                    />
                </div>
            </section>
            
            <Card className="shadow-lg bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-accent">
                    <FileTextIcon className="h-7 w-7" />Kernprincipes van ons Platform
                </CardTitle>
                <CardDescription>
                    De pijlers waarop MindNavigator is gebouwd voor een betrouwbare en ondersteunende ervaring.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {platformPrinciples.map((item, index) => (
                  <div key={index} className="p-4 bg-card border rounded-md shadow-sm">
                    <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
                      <item.icon className="h-6 w-6" />
                      {item.title}
                    </h3>
                    <div className="text-muted-foreground leading-relaxed text-sm space-y-2">
                      {typeof item.description === 'string' ? <p>{item.description}</p> : item.description}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <section className="text-center mt-16 pt-10 border-t">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                Meer weten over <span className="text-primary">ons beleid</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Transparantie is belangrijk voor ons. Lees onze gedetailleerde documenten voor meer informatie.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
                  <Link href="/privacy">
                    Privacybeleid <ArrowRight className="ml-2 h-5 w-5"/>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow">
                  <Link href="/terms">
                    Algemene Voorwaarden
                  </Link>
                </Button>
              </div>
            </section>

            <div className="mt-16 pt-10 border-t border-border">
              <h4 className="text-xl font-semibold text-foreground mb-6 text-center">Ontdek ook onze andere features:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {otherFeatures.map(feature => (
                  <Button
                    key={feature.link}
                    variant="link"
                    asChild
                    className="p-0 h-auto justify-start text-left text-base text-primary hover:text-accent group"
                  >
                    <Link href={feature.link} className="inline-flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-primary/80 group-hover:text-accent transition-colors" />
                      <span>{feature.title}</span>
                      <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-1" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
