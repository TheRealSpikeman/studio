
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FileText, Puzzle, MessageSquareText, BookOpenCheck, Users, BarChart3, ExternalLink, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="pt-8 pb-8 md:pt-12 md:pb-12 lg:pt-16 lg:pb-16 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto grid grid-cols-1 items-center gap-y-12 md:grid-cols-[minmax(0,_1.2fr)_minmax(0,_1fr)] lg:grid-cols-[minmax(0,_1.5fr)_minmax(0,_1fr)] md:gap-x-12 lg:gap-x-16">
        {/* Text content column */}
        <div className="flex flex-col items-center text-center gap-6 md:items-start md:text-left max-w-xl lg:max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Navigeer Samen met uw Kind door <span className="text-primary">Neurodiversiteit</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Herkent u dat uw tiener anders denkt, leert, of de wereld beleeft? Worstel u met concentratie, sociale interacties, of schoolprestaties? MindNavigator biedt u en uw kind concrete inzichten in neurodiversiteit (zoals aandachtspatronen, sociale en sensorische voorkeuren). Lees meer over <Link href='/neurodiversiteit' className='text-primary hover:underline font-medium'>neurodiversiteit <ExternalLink className="inline-block h-4 w-4 align-text-bottom"/></Link>. Ontdek samen sterke punten en praktische strategieën voor thuis en op school.
          </p>
          <ul className="space-y-3 text-muted-foreground md:text-lg text-left self-center md:self-start">
            <li className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary flex-shrink-0" />
              <span>Krijg uitgebreide PDF-overzichten voor diepgaand inzicht.</span>
            </li>
            <li className="flex items-center gap-3">
              <MessageSquareText className="h-6 w-6 text-primary flex-shrink-0" />
              <span>Ontvang dagelijkse coaching & routines voor uw kind (premium).</span>
            </li>
            <li className="flex items-center gap-3">
              <BookOpenCheck className="h-6 w-6 text-primary flex-shrink-0" />
              <span>Benut praktische huiswerkbegeleiding tools en tips.</span>
            </li>
             <li className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary flex-shrink-0" />
              <span>Volg de voortgang eenvoudig via uw eigen ouder-dashboard.</span>
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-stretch sm:items-center justify-center md:justify-start pt-4">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow px-8 py-3 text-base sm:py-6 sm:text-lg">
              <Link href="/quiz/ouder-symptomen-check">Doe de "Ken je Kind" Check (voor ouders) <ArrowRight className="ml-2 h-5 w-5"/></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow px-8 py-3 text-base sm:py-6 sm:text-lg">
              <Link href="/for-parents">Meer informatie voor ouders</Link>
            </Button>
          </div>
           <p className="text-sm text-muted-foreground mt-3">
            ★ 4.8 – Ouders waarderen onze concrete aanpak!
          </p>
        </div>
        {/* Image column */}
        <div className="relative aspect-[16/10] rounded-lg overflow-hidden shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-xl hidden md:block">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/neurodiversity-navigator.firebasestorage.app/o/homepage-2.gif?alt=media&token=57902da7-73b1-4c01-828c-9de735ef9bf4" 
            alt="Ouders die hun kind ondersteunen bij het leren en ontdekken."
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint="parent child support learning"
            priority
            unoptimized={true}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
