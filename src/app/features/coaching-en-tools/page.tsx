/src/app/features/coaching-en-tools/page.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react'; // Zap for Coaching & Tools

export default function CoachingEnToolsPage() {
  const featureTitle = "Coaching & Tools voor Groei";
  const FeatureIcon = Zap;

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
                Ondersteun uw kind met dagelijkse, laagdrempelige coaching en praktische tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-lg leading-relaxed text-foreground/90">
              <p>
                De "Coaching & Tools voor Groei" module van MindNavigator is ontworpen om uw kind dagelijks te ondersteunen. Gebaseerd op de resultaten van hun persoonlijke assessment, bieden we:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-5">
                <li><strong>Dagelijkse Coaching Berichten:</strong> Korte, motiverende en inzichtgevende berichten die helpen bij zelfreflectie en het ontwikkelen van een positieve mindset.</li>
                <li><strong>Interactief Dagboek:</strong> Een veilige plek voor uw kind om gedachten, gevoelens en ervaringen te noteren, wat bijdraagt aan zelfinzicht.</li>
                <li><strong>Planningstools:</strong> Hulpmiddelen om taken, huiswerk en andere activiteiten te organiseren, gericht op het verbeteren van focus en timemanagement.</li>
                <li><strong>Routinebouwers:</strong> Ondersteuning bij het opzetten en vasthouden van gezonde routines die passen bij hun energielevel en behoeften.</li>
                <li><strong>Zelfvertrouwen Oefeningen:</strong> Activiteiten en reflecties gericht op het versterken van zelfvertrouwen en het leren omgaan met uitdagingen.</li>
              </ul>
              <p>
                Deze tools zijn laagdrempelig en ontworpen om naadloos aan te sluiten bij het dagelijks leven van een tiener, en hen te empoweren om hun volledige potentieel te bereiken.
              </p>
              <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground italic">Screenshots en meer details over de tools komen hier...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
