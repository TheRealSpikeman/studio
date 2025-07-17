// src/app/vacatures/page.tsx
"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, Mail, CheckCircle2, Handshake, Target, Users } from 'lucide-react';
import { EditableImage } from '@/components/common/EditableImage';
import { useToast } from '@/hooks/use-toast';

const vacancies = [
  {
    title: 'Student Content Ontwikkelaar (Psychologie / Neurodiversiteit)',
    type: 'Part-time / Stage',
    responsibilities: [
      'Onderzoek doen naar en schrijven over onderwerpen gerelateerd aan neurodiversiteit.',
      'Meehelpen met het opstellen van vragen voor onze zelfreflectie-instrumenten.',
      'Vertalen van wetenschappelijke inzichten naar begrijpelijke en praktische content voor jongeren en ouders.',
    ],
    requirements: [
      'Je volgt een relevante WO-opleiding (Psychologie, Pedagogische Wetenschappen, etc.).',
      'Aantoonbare affiniteit en specialisatie in neurodiversiteit.',
      'Uitstekende schrijfvaardigheid in het Nederlands.',
    ],
    applyLink: 'mailto:jobs@mindnavigator.app?subject=Sollicitatie%20Content%20Ontwikkelaar',
  },
  {
    title: 'Commercieel Medewerker / Partnership Manager',
    type: 'Full-time / Part-time',
    responsibilities: [
      'Identificeren en benaderen van potentiële partners (scholen, zorginstellingen, bedrijven).',
      'Opzetten en onderhouden van duurzame samenwerkingen.',
      'Ontwikkelen van een B2B-strategie om MindNavigator binnen organisaties te positioneren.',
    ],
    requirements: [
      'Je hebt een commerciële drive en ervaring in sales of business development.',
      'Je bent een netwerker en een sterke relatiebouwer.',
      'Affiniteit met de zorg-, onderwijs- of techsector is een grote pre.',
    ],
    applyLink: 'mailto:jobs@mindnavigator.app?subject=Sollicitatie%20Partnership%20Manager',
  },
];

export default function VacaturesPage() {
  const { toast } = useToast();
  const [vacaturesImageUrl, setVacaturesImageUrl] = useState('https://placehold.co/600x400.png');

  const handleImageSave = (newUrl: string) => {
    setVacaturesImageUrl(newUrl);
    console.log("New vacatures image URL to save:", newUrl);
    toast({
      title: 'Afbeelding opgeslagen!',
      description: 'De afbeelding is bijgewerkt.',
    });
  };

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

          <div className="space-y-10 text-base leading-relaxed text-foreground/90">
            <section className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-3">
                  <Target className="h-7 w-7" />
                  Onze Missie: Impact Maken
                </h2>
                <p className="mb-4">
                  Bij MindNavigator zijn we gedreven door een missie: het empoweren van neurodivergente jongeren en hun gezinnen. We creëren tools die niet alleen inzicht geven, maar ook praktisch toepasbaar zijn. Werken bij ons betekent bijdragen aan een wereld waarin iedereen zijn unieke denkstijl als een kracht kan zien.
                </p>
                <p>
                  We zijn een klein, gepassioneerd team met grote ambities. Innovatie, empathie en een focus op de gebruiker staan centraal in alles wat we doen.
                </p>
              </div>
              <EditableImage
                wrapperClassName="relative aspect-video rounded-lg overflow-hidden shadow-lg"
                src={vacaturesImageUrl}
                alt="Team MindNavigator dat samenwerkt"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="team collaboration office"
                onSave={handleImageSave}
                uploadPath="images/website"
              />
            </section>
            
            <Card className="shadow-lg bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-accent">
                  <Users className="h-7 w-7" />Openstaande Vacatures
                </CardTitle>
                <CardDescription>
                  Ben jij de collega die we zoeken? Bekijk onze openstaande posities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {vacancies.map((vacancy, index) => (
                  <Card key={index} className="shadow-md bg-card border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">{vacancy.title}</CardTitle>
                      <CardDescription>{vacancy.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Verantwoordelijkheden:</h4>
                        <ul className="list-none space-y-1">
                          {vacancy.responsibilities.map((item, i) => (
                            <li key={i} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/><span>{item}</span></li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Kwalificaties:</h4>
                        <ul className="list-none space-y-1">
                          {vacancy.requirements.map((item, i) => (
                            <li key={i} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/><span>{item}</span></li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                       <Button asChild>
                        <Link href={vacancy.applyLink}>
                          <Mail className="mr-2 h-4 w-4" /> Solliciteer op deze functie
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <section className="text-center mt-16 pt-10 border-t">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
                Staat jouw droombaan er niet tussen?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                We zijn altijd op zoek naar getalenteerde en gepassioneerde mensen. Stuur ons een open sollicitatie en vertel ons hoe jij kunt bijdragen aan de missie van MindNavigator.
              </p>
              <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="mailto:jobs@mindnavigator.app?subject=Open%20Sollicitatie">
                  Stuur een open sollicitatie <Mail className="ml-2 h-5 w-5"/>
                </Link>
              </Button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
