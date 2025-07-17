// src/app/about/page.tsx
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Users, Target, Lightbulb, HeartHandshake, ExternalLink } from '@/lib/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12 md:mb-16">
            <Users className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Ons Verhaal</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Hoe een persoonlijke reis de start werd van MindNavigator.
            </p>
          </div>
          
          <div className="space-y-12 text-base leading-relaxed text-foreground/90">

            <section className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2">
                 <Image
                    src="https://placehold.co/400x500.png"
                    alt="Foto van Glenn Bosch"
                    width={400}
                    height={500}
                    className="rounded-lg shadow-lg object-cover"
                    data-ai-hint="man portrait professional"
                />
              </div>
              <div className="md:col-span-3">
                <h2 className="text-2xl font-semibold text-primary mb-3">Het startpunt: Een lerares en een vraag</h2>
                <p className="mb-3">
                  Het verhaal van MindNavigator begint bij Glenn Bosch, vader van een energieke en creatieve dochter. Het leven leek zijn gang te gaan, totdat een oplettende lerares een vraag stelde. Zij herkende, vanuit haar eigen ervaring met ADHD, bepaalde patronen in het gedrag van Glenn's dochter. "Heeft u haar weleens laten onderzoeken op ADHD?", vroeg ze.
                </p>
                <p>
                  Die vraag zette alles in beweging. Als bezorgde ouders gingen Glenn en zijn partner direct aan de slag. Ze werden geconfronteerd met een realiteit die veel gezinnen kennen: een lang, ingewikkeld en ondoorzichtig zorgtraject. Maandenlange wachttijden voor een eerste afspraak bij een kinderpsycholoog, gevolgd door een periode van onzekerheid voordat er duidelijkheid kwam.
                </p>
              </div>
            </section>

            <section className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3 order-last md:order-first">
                 <h2 className="text-2xl font-semibold text-primary mb-3">Twee werelden komen samen</h2>
                 <p className="mb-3">
                    Gefrustreerd door de complexiteit, zocht Glenn contact met zijn goede vriend, Rob van der Linden. Glenn wist dat Rob zelf het label ADHD had, maar zoals dat vaak gaat, was het nooit een diepgaand gespreksonderwerp geweest. Nu wel. Rob bevestigde het frustrerende landschap en deelde zijn eigen ervaringen als ervaringsdeskundige.
                 </p>
                 <p>
                    Tijdens hun gesprekken kwam een cruciale vraag naar boven: "Waarom bestaat er geen toegankelijk, interactief platform waar ouders en kinderen zélf kunnen beginnen met ontdekken, leren en begrijpen?" Er was een duidelijke leegte tussen 'niets weten' en een 'formele diagnose'.
                 </p>
              </div>
               <div className="md:col-span-2 order-first md:order-last">
                 <Image
                    src="https://placehold.co/400x500.png"
                    alt="Foto van Rob van der Linden"
                    width={400}
                    height={500}
                    className="rounded-lg shadow-lg object-cover"
                    data-ai-hint="man portrait creative"
                />
              </div>
            </section>
            
             <section className="text-center bg-muted/50 p-8 rounded-lg border">
                <Lightbulb className="mx-auto h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground">De Geboorte van MindNavigator</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Dit moest anders kunnen. Met hun gezamenlijke achtergrond in IT en marketing, besloten Glenn en Rob hun krachten te bundelen. Ze stelden een plan op met één helder doel: de technologie van de 21e eeuw inzetten om een platform te bouwen dat ouders en kinderen ondersteunt, inzicht geeft en de eerste stappen op het pad van neurodiversiteit eenvoudiger en duidelijker maakt. Zo werd MindNavigator geboren.
                </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t">
              <section>
                  <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                    <Target className="h-7 w-7" />
                    Onze Missie
                  </h2>
                  <p>
                    Onze missie is om een brug te slaan tussen onzekerheid en inzicht. We bieden laagdrempelige, wetenschappelijk onderbouwde tools die jongeren helpen hun unieke brein te begrijpen en hun talenten te benutten, terwijl we ouders de handvatten geven om hen optimaal te ondersteunen.
                  </p>
              </section>
              <section>
                  <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                    <HeartHandshake className="h-7 w-7" />
                    Onze Belofte
                  </h2>
                  <p>
                     MindNavigator is geen vervanging voor professionele zorg, maar een krachtige eerste stap. We beloven een veilige, positieve en eerlijke omgeving te bieden, vrij van medische claims, maar vol met praktische inzichten die een wereld van verschil kunnen maken in het dagelijks leven van uw gezin.
                  </p>
              </section>
            </div>
            
             <div className="text-center pt-10">
                <p className="text-lg text-muted-foreground mb-4">Meer weten over onze partners en de experts die ons adviseren?</p>
                <Button asChild>
                    <Link href="/samenwerkingen">Bekijk Onze Partners & Deskundigheid <ExternalLink className="ml-2 h-4 w-4"/></Link>
                </Button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
