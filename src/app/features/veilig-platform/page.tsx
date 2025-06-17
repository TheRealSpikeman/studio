/src/app/features/veilig-platform/page.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, ExternalLink } from 'lucide-react';

export default function VeiligPlatformPage() {
  const featureTitle = "Veilig & Deskundig Platform";
  const FeatureIcon = ShieldCheck;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto">
          <Button variant="outline" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Home
            </Link>
          </Button>
          <Card className="shadow-xl max-w-3xl mx-auto">
            <CardHeader className="text-center pb-8">
              <FeatureIcon className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-4xl font-bold text-foreground">{featureTitle}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Een betrouwbare omgeving, gebouwd op expertise en privacy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-lg leading-relaxed text-foreground/90">
              <p>
                MindNavigator is toegewijd aan het bieden van een veilige, privacygerichte en deskundig onderbouwde ervaring voor jongeren en hun ouders.
              </p>
              <h3 className="text-xl font-semibold text-primary mt-4">Privacy Voorop</h3>
              <p>
                Wij begrijpen het belang van privacy, zeker als het om jongeren gaat. Alle persoonlijke gegevens en resultaten worden vertrouwelijk behandeld en beveiligd opgeslagen conform de AVG/GDPR-richtlijnen. U en uw kind behouden controle over welke informatie gedeeld wordt. Lees ons volledige <Link href="/privacy" className="text-primary hover:underline">Privacybeleid <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link> voor details.
              </p>
              <h3 className="text-xl font-semibold text-primary mt-4">Educatieve Principes & Deskundigheid</h3>
              <p>
                De content en tools op MindNavigator zijn ontwikkeld op basis van erkende educatieve principes en inzichten uit de psychologie en orthopedagogiek. We werken samen met <Link href="/samenwerkingen" className="text-primary hover:underline">professionals en experts</Link> om de kwaliteit en relevantie van ons aanbod te waarborgen.
              </p>
              <h3 className="text-xl font-semibold text-primary mt-4">Geen Diagnoses</h3>
              <p>
                Het is cruciaal om te begrijpen dat MindNavigator <strong>geen</strong> medische of psychologische diagnoses stelt. Onze tools zijn bedoeld voor zelfreflectie, educatie en het bieden van handvatten. Voor een formele diagnose of professionele behandeling verwijzen wij u altijd naar een gekwalificeerde zorgverlener. Zie ook onze <Link href="/disclaimer" className="text-primary hover:underline">Disclaimer <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>.
              </p>
              <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground italic">Meer over onze veiligheidsmaatregelen en ethische richtlijnen komt hier...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
