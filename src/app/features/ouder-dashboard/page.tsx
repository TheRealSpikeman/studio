/src/app/features/ouder-dashboard/page.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MessageSquareText } from 'lucide-react';

export default function OuderDashboardPage() {
  const featureTitle = "Ouder Dashboard & Communicatie";
  const FeatureIcon = MessageSquareText;

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
                Inzicht, beheer en communicatie, allemaal op één plek.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-lg leading-relaxed text-foreground/90">
              <p>
                Als ouder speelt u een cruciale rol in de ontwikkeling van uw kind. Het MindNavigator Ouder Dashboard is ontworpen om u te ondersteunen en te betrekken bij de voortgang van uw kind, met respect voor hun privacy.
              </p>
              <p>
                Met uw eigen ouderportaal kunt u:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-5">
                <li>(Met toestemming van uw kind) Inzichten bekijken uit de voltooide assessments en zelfreflectie-instrumenten.</li>
                <li>De algemene voortgang en activiteit van uw kind op het platform volgen.</li>
                <li>Abonnementen voor uw gezin eenvoudig beheren en aanpassen.</li>
                <li>Veilig en direct communiceren met eventueel gekoppelde tutors of coaches.</li>
                <li>Toegang krijgen tot specifieke artikelen, tips en bronnen die voor u als ouder relevant zijn.</li>
                <li>Privacy- en deelinstellingen per kind beheren.</li>
              </ul>
              <p>
                Het Ouder Dashboard is uw centrale punt voor informatie en beheer, en helpt u om samen met uw kind een positief pad naar groei en zelfontdekking te bewandelen.
              </p>
              <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground italic">Voorbeelden van het Ouder Dashboard komen hier...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
