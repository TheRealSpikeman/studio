/src/app/features/gepersonaliseerde-inzichten/page.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Brain } from 'lucide-react';

export default function GepersonaliseerdeInzichtenPage() {
  const featureTitle = "Gepersonaliseerde Inzichten";
  const FeatureIcon = Brain;

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
                Ontdek hoe uw kind start met een assessment en directe inzichten krijgt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-lg leading-relaxed text-foreground/90">
              <p>
                Bij MindNavigator geloven we dat elk kind uniek is. Daarom begint de reis met een persoonlijke assessment. Via interactieve zelfreflectie-instrumenten krijgt uw kind direct inzicht in zijn of haar denkstijl, sterke punten, en mogelijke uitdagingen.
              </p>
              <p>
                Na het voltooien van de assessment ontvangt u (met toestemming van uw kind) en uw kind heldere, begrijpelijke overzichten. Deze rapporten zijn ontworpen om:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-5">
                <li>Unieke krachten en talenten te identificeren en te benadrukken.</li>
                <li>Potentiële uitdagingen in kaart te brengen en handvatten te bieden om hiermee om te gaan.</li>
                <li>Een basis te leggen voor effectieve communicatie en ondersteuning thuis en op school.</li>
                <li>Suggesties te doen voor vervolgstappen, zoals specifieke tools binnen MindNavigator of het overwegen van professionele begeleiding.</li>
              </ul>
              <p>
                De inzichten zijn gekoppeld aan onze <Link href="/neurodiversiteit" className="text-primary hover:underline">uitgebreide informatie over neurodiversiteit</Link>, zodat u de resultaten beter kunt plaatsen en begrijpen.
              </p>
              <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground italic">Meer gedetailleerde content over de assessments volgt hier binnenkort...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
