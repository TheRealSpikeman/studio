/src/app/features/huiswerkondersteuning/page.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookOpenCheck } from 'lucide-react';

export default function HuiswerkondersteuningPage() {
  const featureTitle = "Huiswerkondersteuning";
  const FeatureIcon = BookOpenCheck;

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
                Effectieve tools en strategieën om studie-uitdagingen te overwinnen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-lg leading-relaxed text-foreground/90">
              <p>
                Schoolwerk kan soms een uitdaging zijn. MindNavigator biedt praktische huiswerkondersteuning die is afgestemd op de individuele leerstijl en behoeften van uw kind. Dit omvat:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-5">
                <li><strong>Planning Tools:</strong> Digitale planners en schema's om huiswerk, toetsen en projecten overzichtelijk te maken.</li>
                <li><strong>Focus Technieken:</strong> Hulp bij het toepassen van methoden zoals de Pomodoro-techniek om concentratie te verbeteren.</li>
                <li><strong>Studievaardigheden Tips:</strong> Strategieën voor effectief leren, samenvatten, en voorbereiden op toetsen.</li>
                <li><strong>Vakspecifieke Hulpmiddelen:</strong> Toegang tot geselecteerde online bronnen, uitlegvideo's en oefeningen per vak (indien beschikbaar).</li>
                <li><strong>Motivatie & Doelen Stellen:</strong> Ondersteuning bij het stellen van realistische doelen en het behouden van motivatie.</li>
              </ul>
              <p>
                Ons doel is om uw kind te helpen zelfstandiger en met meer vertrouwen hun schoolwerk aan te pakken, en vaardigheden te ontwikkelen waar ze hun hele leven profijt van hebben.
              </p>
              <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground italic">Voorbeelden van de tools komen hier...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
