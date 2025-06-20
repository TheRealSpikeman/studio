
"use client"; 

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Brain, Zap, BookOpenCheck, GraduationCap, MessageSquareText, ShieldCheck, ExternalLink, ArrowRight, FileText, CheckCircle2, Target, Lightbulb, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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

export default function GepersonaliseerdeInzichtenPage() {
  const featureTitle = "Gepersonaliseerde Inzichten";
  const FeatureIcon = Brain;
  const currentLink = "/features/gepersonaliseerde-inzichten";

  const otherFeatures = allFeatures.filter(feature => feature.link !== currentLink);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl">
          
          <div className="text-center mb-12 md:mb-16">
            <Link href="/#platform-features-overview" aria-label={`Terug naar feature overzicht: ${featureTitle}`}>
              <FeatureIcon className="mx-auto h-16 w-16 text-primary mb-4 cursor-pointer transition-transform hover:scale-110" />
            </Link>
            <h1 className="text-4xl font-bold text-foreground">{featureTitle}</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Ontdek hoe uw kind start met een persoonlijke assessment en direct waardevolle inzichten krijgt in hun unieke denkstijl en talenten.
            </p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section>
              <p className="mb-4">
                Bij MindNavigator geloven we dat elk kind uniek is. Daarom begint de reis naar zelfontdekking en groei met een persoonlijke assessment. Via interactieve, kindvriendelijke zelfreflectie-instrumenten krijgt uw kind direct inzicht in zijn of haar denkstijl, natuurlijke sterke punten, en mogelijke uitdagingen. Deze eerste stap is cruciaal en legt de basis voor een persoonlijk ontwikkelingstraject.
              </p>
            </section>

            <Card className="shadow-lg bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-primary">
                        <Target className="h-7 w-7" />De Start: Persoonlijke Assessment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-3">De assessment is ontworpen om op een laagdrempelige manier een beeld te krijgen van hoe uw kind de wereld ervaart, informatie verwerkt en leert. Het is geen test met 'goede' of 'foute' antwoorden, maar een verkenning van individuele eigenschappen.</p>
                    <p>Deze eerste analyse helpt ons om een gepersonaliseerd dashboard en relevante tools aan te bieden die écht aansluiten bij de behoeften van uw kind.</p>
                </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg order-last md:order-first">
                    <Image
                        src="https://placehold.co/600x400.png"
                        alt="Abstracte visualisatie van data die leidt tot inzicht"
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint="data insight abstract"
                    />
                </div>
                <div className="space-y-4 order-first md:order-last">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                        <Lightbulb className="h-6 w-6"/>Van Data naar Duidelijkheid
                    </h3>
                    <p>De resultaten van de assessment worden vertaald naar begrijpelijke taal. We focussen op:</p>
                    <ul className="list-disc list-inside space-y-1.5 pl-5">
                        <li><strong>Herkenning:</strong> Patronen en eigenschappen benoemen.</li>
                        <li><strong>Verklaring:</strong> Uitleg over wat dit kan betekenen in het dagelijks leven.</li>
                        <li><strong>Acceptatie:</strong> Het normaal maken van verschillen.</li>
                        <li><strong>Actie:</strong> Concrete handvatten en volgende stappen.</li>
                    </ul>
                </div>
            </div>


            <Card className="shadow-lg bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-accent">
                    <FileText className="h-7 w-7" />Concrete Inzichten & Overzichten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Na het voltooien van de assessment ontvangen zowel u (met toestemming van uw kind) als uw kind heldere, begrijpelijke overzichten. Deze rapporten zijn meer dan alleen scores; ze zijn ontworpen om:
                </p>
                <ul className="list-none space-y-3 pl-0">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Unieke krachten en talenten</strong> te identificeren en te benadrukken, zodat uw kind zijn/haar sterktes kan inzetten.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Potentiële uitdagingen</strong> in kaart te brengen en concrete handvatten te bieden om hiermee om te gaan, zowel thuis als op school.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Een <strong>basis te leggen voor effectieve communicatie</strong> en begrip binnen het gezin en met leerkrachten.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Suggesties te doen voor <strong>vervolgstappen</strong>, zoals specifieke tools binnen MindNavigator of het overwegen van aanvullende professionele begeleiding indien nodig.</span>
                  </li>
                </ul>
                <p className="mt-4">
                  De inzichten zijn altijd gekoppeld aan onze <Link href="/neurodiversiteit" className="text-primary hover:underline font-medium">uitgebreide informatie over neurodiversiteit <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>, zodat u en uw kind de resultaten beter kunnen plaatsen en begrijpen.
                </p>
              </CardContent>
            </Card>
            
            <section className="text-center mt-16 pt-10 border-t">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                Klaar om <span className="text-primary">de unieke denkstijl</span> van uw kind te ontdekken?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                De eerste stap naar begrip en gerichte ondersteuning is slechts een paar klikken verwijderd.
              </p>
              <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/quizzes">
                  Start de Zelfreflectie Tool <ArrowRight className="ml-2 h-5 w-5"/>
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-1">
                <Sparkles className="h-4 w-4 text-accent" /> Direct inzicht, geen wachttijden.
              </p>
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
