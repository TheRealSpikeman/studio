
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Target, Lightbulb, CheckCircle, Milestone } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/20 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl max-w-4xl mx-auto">
            <CardHeader className="text-center pb-8">
              <Users className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-4xl font-bold text-foreground">Over MindNavigator</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Jouw partner in het ontdekken en benutten van neurodiversiteit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 text-lg leading-relaxed text-foreground/90">
              
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
                    Onze Aanpak
                    </h2>
                    <p className="mb-3">
                    Onze quizzen zijn zorgvuldig samengesteld en gebaseerd op erkende psychologische modellen en inzichten in neurodiversiteit. We combineren wetenschappelijke onderbouwing met een gebruiksvriendelijke en laagdrempelige aanpak, speciaal afgestemd op tieners.
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-5">
                        <li>Gebaseerd op recente inzichten</li>
                        <li>Afgestemd op de belevingswereld van jongeren</li>
                        <li>Focus op sterke punten en praktische tips</li>
                        <li>Continue ontwikkeling en verbetering</li>
                    </ul>
                </section>
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src="https://picsum.photos/seed/teamcollaboration/600/400"
                        alt="Team MindNavigator werkt samen aan innovatieve oplossingen"
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="team collaboration"
                    />
                </div>
              </div>

              <section>
                <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary mb-4">
                  <Milestone className="h-7 w-7" />
                  Toekomstplannen
                </h2>
                <p>
                  MindNavigator is constant in ontwikkeling. We werken aan uitbreiding van onze coaching-hub, nieuwe thematische quizzen, en integraties met planningstools. Ons doel is om dé gids te worden voor jongeren die hun neurodiversiteit willen omarmen.
                </p>
                {/* Voorbeeld van hoe testimonials hier geïntegreerd kunnen worden:
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-xl font-semibold mb-3">Wat gebruikers zeggen:</h3>
                  <blockquote className="italic border-l-4 border-primary pl-4 py-2 bg-muted/50 rounded-r-md">
                    "MindNavigator heeft me echt geholpen mezelf beter te begrijpen. De tips zijn super handig!" - Anoniem, 16 jaar
                  </blockquote>
                </div>
                */}
              </section>

            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
