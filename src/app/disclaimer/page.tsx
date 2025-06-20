
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { AlertTriangle, ExternalLink, Info, Users, Scale, Bot, Stethoscope } from 'lucide-react';
import { Alert, AlertTitle as AlertTitleUi, AlertDescription as AlertDescriptionUi } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 md:mb-16">
            <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Belangrijke Disclaimer</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Lees dit aandachtig voordat u gebruik maakt van onze tools en informatie.
            </p>
          </div>
          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <AlertTriangle className="h-7 w-7" />
                Geen Medische Diagnose of Advies
              </h2>
              <p className="mb-3">
                MindNavigator en de daarin aangeboden zelfreflectie-instrumenten, artikelen, en AI-gegenereerde inzichten zijn uitsluitend bedoeld voor educatieve doeleinden, zelfinzicht en persoonlijke ontwikkeling. De content op dit platform is <strong>nadrukkelijk geen vervanging</strong> voor professioneel medisch, psychologisch, psychiatrisch of orthopedagogisch advies, diagnose, of behandeling.
              </p>
              <p>
                De tools kunnen helpen bij het herkennen van bepaalde gedrags- en denkpatronen die geassocieerd worden met neurodivergente eigenschappen, maar ze stellen <strong>geen</strong> medische of psychologische diagnoses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Stethoscope className="h-7 w-7" />
                Raadpleeg Altijd een Professional
              </h2>
              <p className="mb-3">
                Als u of uw kind vragen of zorgen heeft over mentale gezondheid, gedrag, ontwikkeling, of als u een formele diagnose overweegt, dient u altijd contact op te nemen met een gekwalificeerde zorgverlener. Dit kan zijn:
              </p>
              <ul className="list-disc list-inside pl-5 space-y-1.5 text-muted-foreground mb-3">
                <li>Uw huisarts (voor een eerste consult en eventuele doorverwijzing)</li>
                <li>Een GZ-psycholoog, kinder- en jeugdpsycholoog, of orthopedagoog</li>
                <li>Een psychiater of kinder- en jeugdpsychiater</li>
                <li>Gespecialiseerde GGZ-instellingen</li>
                <li>De schoolarts, zorgcoördinator of intern begeleider op school</li>
              </ul>
              <p>
                Alleen gekwalificeerde professionals kunnen een juiste diagnose stellen en een passend behandelplan opstellen. Vertrouw niet uitsluitend op de informatie of de uitkomsten van de tools op MindNavigator voor het nemen van beslissingen over uw gezondheid of die van uw kind. Bezoek ook onze <Link href="/neurodiversiteit" className="text-primary hover:underline font-medium">Neurodiversiteit pagina <ExternalLink className="inline h-4 w-4 align-text-bottom"/></Link> voor meer context en tips om de juiste hulp te vinden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Scale className="h-7 w-7" />
                Beperking van Aansprakelijkheid
              </h2>
              <p className="mb-3">
                MindNavigator streeft ernaar zorgvuldige en accurate informatie te verstrekken. Echter, wij kunnen de volledigheid, juistheid of actualiteit van de content niet garanderen. Het gebruik van de informatie en tools op dit platform is geheel op eigen risico.
              </p>
              <p>
                MindNavigator, haar ontwikkelaars, en eventuele contentleveranciers zijn niet aansprakelijk voor enige directe of indirecte schade, in welke vorm dan ook, die voortvloeit uit of verband houdt met het gebruik van dit platform, de informatie die het bevat, of de onmogelijkheid om het platform te gebruiken. Dit omvat, maar is niet beperkt tot, beslissingen die worden genomen op basis van de verkregen inzichten.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                <Bot className="h-7 w-7" />
                Gebruik van AI-gegenereerde Content
              </h2>
              <p>
                Delen van de inzichten en samenvattingen op MindNavigator kunnen worden gegenereerd met behulp van kunstmatige intelligentie (AI). Hoewel we streven naar nuttige en relevante output, kan AI-gegenereerde content onnauwkeurigheden bevatten of niet altijd volledig aansluiten bij uw specifieke situatie. Gebruik deze inzichten als een startpunt voor reflectie en niet als definitieve waarheden of professioneel advies.
              </p>
            </section>

            <Alert variant="default" className="mt-12 bg-primary/10 border-primary/30 text-primary">
                <Info className="h-5 w-5 !text-primary" />
                <AlertTitleUi className="font-semibold text-primary">Akkoordverklaring</AlertTitleUi>
                <AlertDescriptionUi className="text-foreground/80">
                  Door gebruik te maken van de diensten en tools van MindNavigator, verklaart u deze disclaimer te hebben gelezen, begrepen en ermee akkoord te gaan.
                </AlertDescriptionUi>
            </Alert>

            <div className="mt-12 text-center">
              <Button asChild variant="outline">
                <Link href="/terms">Lees ook onze Algemene Voorwaarden</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
