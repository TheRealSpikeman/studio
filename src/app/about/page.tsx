
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Users, Target, Lightbulb, CheckCircle, Milestone, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 md:mb-16">
            <Users className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Over MindNavigator</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Jouw partner in het ontdekken en benutten van neurodiversiteit.
            </p>
          </div>
          
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section>
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                <Target className="h-7 w-7" />
                Onze Missie
              </h2>
              <p>
                MindNavigator is toegewijd aan het empoweren van jongeren (12-18 jaar) door hen te helpen hun unieke neurodivergente profiel te begrijpen. We streven ernaar een veilige en ondersteunende omgeving te bieden waarin zij hun sterke punten kunnen ontdekken, uitdagingen kunnen aanpakken en zelfvertrouwen kunnen opbouwen om succesvol te navigeren in het dagelijks leven, op school en in sociale interacties.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                <Lightbulb className="h-7 w-7" />
                Onze Visie
              </h2>
              <p>
                Wij geloven dat neurodiversiteit een kracht is. Onze visie is een wereld waarin elke jongere zich begrepen, gewaardeerd en uitgerust voelt om zijn of haar volledige potentieel te bereiken, ongeacht hun neurotype. We willen bijdragen aan een inclusievere samenleving door tools en inzichten te bieden die zelfbewustzijn en persoonlijke groei bevorderen.
              </p>
            </section>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <section>
                  <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                  <CheckCircle className="h-7 w-7" />
                  Onze Aanpak & Expertise
                  </h2>
                  <p className="mb-3">
                  De zelfreflectie-instrumenten en content op MindNavigator zijn zorgvuldig samengesteld met als doel inzicht en bewustwording te bevorderen. Ze zijn gebaseerd op algemeen erkende psychologische modellen en inzichten in neurodiversiteit. MindNavigator biedt educatieve tools en inzichten, maar stelt nadrukkelijk <strong>geen</strong> medische diagnoses en vervangt geen professionele zorg.
                  </p>
                  <p className="mb-3">
                   Momenteel is ons team toegewijd aan het creëren van een gebruiksvriendelijke en laagdrempelige ervaring, speciaal afgestemd op tieners. We combineren dit met een focus op sterke punten en het aanreiken van praktische tips.
                   Voor meer informatie over de professionals en experts die betrokken zijn bij de ontwikkeling en validatie van onze content, verwijzen wij u graag naar onze pagina over <Link href="/samenwerkingen" className="text-primary hover:underline font-medium">Partners & Deskundigheid <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>.
                  </p>
              </section>
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                  <Image
                      src="https://placehold.co/600x400.png"
                      alt="Team MindNavigator werkt samen aan innovatieve oplossingen"
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint="team collaboration discussion"
                  />
              </div>
            </div>
            
            <section>
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                <AlertTriangle className="h-7 w-7" /> 
                Onze Beperkingen & Verantwoordelijkheid
              </h2>
              <p className="mb-3">
                MindNavigator biedt educatieve tools en inzichten voor zelfreflectie. Wij bieden <strong>geen</strong> medische diensten of diagnostiek. De informatie en de resultaten van onze tools zijn niet bedoeld als vervanging voor professioneel medisch of psychologisch advies, diagnose of behandeling.
              </p>
              <p>
                Voor professionele zorg, diagnose of gespecialiseerde begeleiding verwijzen wij u naar gekwalificeerde professionals zoals uw huisarts, GGZ-instellingen, kinderartsen, (kinder- en jeugd)psychologen of orthopedagogen. Op onze <Link href="/neurodiversiteit" className="text-primary hover:underline">informatiepagina over neurodiversiteit</Link> vindt u meer context en tips om de juiste hulp te vinden. Lees ook onze volledige <Link href="/disclaimer" className="text-primary hover:underline font-medium">Disclaimer <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                <ShieldCheck className="h-7 w-7" />
                Privacy en Veiligheid
              </h2>
              <p>
                De privacy en veiligheid van onze gebruikers, met name jongeren, is van het grootste belang. We hanteren strikte databeschermingsprotocollen en zorgen ervoor dat persoonlijke informatie vertrouwelijk wordt behandeld. Lees ons volledige <Link href="/privacy" className="text-primary hover:underline font-medium">Privacybeleid</Link> voor details.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                <Milestone className="h-7 w-7" />
                Toekomstplannen
              </h2>
              <p>
                MindNavigator is constant in ontwikkeling. We werken aan uitbreiding van onze coaching-hub, nieuwe thematische tools, en integraties met planningstools. Ons doel is om dé gids te worden voor jongeren die hun neurodiversiteit willen omarmen.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
