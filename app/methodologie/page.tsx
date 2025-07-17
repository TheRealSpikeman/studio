// src/app/methodologie/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  GitBranch, Brain, BookOpenCheck, GraduationCap, MessageSquareText, ShieldCheck, ArrowRight, Gavel
} from 'lucide-react';
import { cn } from '@/lib/utils';


const allFeatures = [
  { title: 'Adaptieve Quiz Methodologie', description: 'Een diepgaande uitleg van de twee-fase-structuur, het algoritme en de onderliggende principes van onze adaptieve quizzen.', link: '/adaptieve-quiz', icon: GitBranch },
  { title: 'AI Validatie & Kwaliteit', description: 'Een transparante blik op hoe we de accuraatheid en kwaliteit van AI-gegenereerde rapporten valideren en waarborgen.', link: '/methodologie/ai-validatie', icon: Gavel },
];

export default function MethodologieOverzichtPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl">
          
          <div className="text-center mb-12 md:mb-16">
              <Brain className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Onze Methodologie & Aanpak</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Ontdek de principes achter MindNavigator. We combineren educatieve inzichten met moderne technologie voor een veilige en effectieve ervaring.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allFeatures.map((feature, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={feature.link}>
                      Lees Meer <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
