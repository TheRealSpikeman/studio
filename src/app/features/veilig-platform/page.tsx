
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheck, Brain, Zap, BookOpenCheck, GraduationCap, MessageSquareText, ExternalLink, ArrowRight } from 'lucide-react';

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
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 md:mb-16">
            <Link href="/#platform-features-overview" aria-label={`Terug naar feature overzicht: ${featureTitle}`}>
              <FeatureIcon className="mx-auto h-16 w-16 text-primary mb-4 cursor-pointer transition-transform hover:scale-110" />
            </Link>
            <h1 className="text-4xl font-bold text-foreground">{featureTitle}</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Een betrouwbare omgeving, gebouwd op expertise en privacy.
            </p>
          </div>
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section>
              <p className="mb-4">
                MindNavigator is toegewijd aan het bieden van een veilige, privacygerichte en deskundig onderbouwde ervaring voor jongeren en hun ouders.
              </p>
              <h2 className="text-2xl font-semibold text-primary mb-4">Privacy Voorop</h2>
              <p className="mb-4">
                Wij begrijpen het belang van privacy, zeker als het om jongeren gaat. Alle persoonlijke gegevens en resultaten worden vertrouwelijk behandeld en beveiligd opgeslagen conform de AVG/GDPR-richtlijnen. U en uw kind behouden controle over welke informatie gedeeld wordt. Lees ons volledige <Link href="/privacy" className="text-accent hover:underline font-medium">Privacybeleid <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link> voor details.
              </p>
              <h2 className="text-2xl font-semibold text-primary mb-4">Educatieve Principes & Deskundigheid</h2>
              <p className="mb-4">
                De content en tools op MindNavigator zijn ontwikkeld op basis van erkende educatieve principes en inzichten uit de psychologie en orthopedagogiek. We werken samen met <Link href="/samenwerkingen" className="text-accent hover:underline font-medium">professionals en experts</Link> om de kwaliteit en relevantie van ons aanbod te waarborgen.
              </p>
              <h2 className="text-2xl font-semibold text-primary mb-4">Geen Diagnoses</h2>
              <p>
                Het is cruciaal om te begrijpen dat MindNavigator <strong>geen</strong> medische of psychologische diagnoses stelt. Onze tools zijn bedoeld voor zelfreflectie, educatie en het bieden van handvatten. Voor een formele diagnose of professionele behandeling verwijzen wij u altijd naar een gekwalificeerde zorgverlener. Zie ook onze <Link href="/disclaimer" className="text-accent hover:underline font-medium">Disclaimer <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>.
              </p>
            </section>
            
            <div className="mt-12 pt-8 border-t border-border">
              <h4 className="text-2xl font-semibold text-primary mb-6 text-center">Ontdek ook onze andere features:</h4>
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
