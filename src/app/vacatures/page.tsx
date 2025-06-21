// src/app/vacatures/page.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Brain, Briefcase, Mail, CheckCircle2, Handshake } from 'lucide-react';

export default function VacaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 md:mb-16">
            <Briefcase className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Werken bij MindNavigator</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Help ons bouwen aan een platform dat écht een verschil maakt.
            </p>
          </div>
          
          <div className="space-y-12">
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold text-primary">Student Content Ontwikkelaar (Psychologie / Neurodiversiteit)</CardTitle>
                    <CardDescription className="text-md">Part-time / Stage</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Ben jij een student (Ortho)pedagogiek of Psychologie met een passie voor neurodiversiteit? Wij zoeken een creatieve en nauwkeurige student die ons kan helpen met de ontwikkeling van content voor ons platform.
                </p>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Jouw verantwoordelijkheden:</h4>
                  <ul className="list-none space-y-2 pl-0">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Onderzoek doen naar en schrijven over onderwerpen gerelateerd aan neurodiversiteit.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Meehelpen met het opstellen van vragen voor onze zelfreflectie-instrumenten.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Vertalen van wetenschappelijke inzichten naar begrijpelijke en praktische content voor jongeren en ouders.</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Wie zoeken wij?</h4>
                  <ul className="list-none space-y-2 pl-0">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Je volgt een relevante WO-opleiding (Psychologie, Pedagogische Wetenschappen, etc.).</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Aantoonbare affiniteit en specialisatie in neurodiversiteit.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Uitstekende schrijfvaardigheid in het Nederlands.</span></li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                 <Button asChild>
                  <Link href="mailto:jobs@mindnavigator.app?subject=Sollicitatie%20Content%20Ontwikkelaar">
                    <Mail className="mr-2 h-4 w-4" /> Solliciteer nu
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
               <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    <Handshake className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold text-primary">Commercieel Medewerker / Partnership Manager</CardTitle>
                    <CardDescription className="text-md">Full-time / Part-time</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Ben jij een commercieel talent met een hart voor maatschappelijke impact? Wij zoeken een gedreven professional die verantwoordelijk is voor de groei van MindNavigator door het opzetten van strategische partnerships.
                </p>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Jouw verantwoordelijkheden:</h4>
                  <ul className="list-none space-y-2 pl-0">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Identificeren en benaderen van potentiële partners (scholen, zorginstellingen, bedrijven).</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Opzetten en onderhouden van duurzame samenwerkingen.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Ontwikkelen van een B2B-strategie om MindNavigator binnen organisaties te positioneren.</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Wie zoeken wij?</h4>
                   <ul className="list-none space-y-2 pl-0">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Je hebt een commerciële drive en ervaring in sales of business development.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Je bent een netwerker en een sterke relatiebouwer.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0"/><span>Affiniteit met de zorg-, onderwijs- of techsector is een grote pre.</span></li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                 <Button asChild>
                  <Link href="mailto:jobs@mindnavigator.app?subject=Sollicitatie%20Partnership%20Manager">
                    <Mail className="mr-2 h-4 w-4" /> Solliciteer nu
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="text-center pt-8 border-t mt-12">
                <h3 className="text-xl font-semibold text-foreground mb-3">Geen passende vacature?</h3>
                <p className="text-muted-foreground mb-4">
                    We zijn altijd op zoek naar getalenteerde en gepassioneerde mensen. Stuur gerust een open sollicitatie!
                </p>
                <Button variant="outline" asChild>
                  <Link href="mailto:jobs@mindnavigator.app?subject=Open%20Sollicitatie">
                    Stuur een open sollicitatie
                  </Link>
                </Button>
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}