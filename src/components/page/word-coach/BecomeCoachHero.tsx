
// src/components/page/word-coach/BecomeCoachHero.tsx
"use client";

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function BecomeCoachHero() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-primary/5">
      <div className="container mx-auto grid grid-cols-1 items-center justify-items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
        <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-xl lg:max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Word Coach bij <span className="text-primary">MindNavigator</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Deel jouw expertise en begeleid jongeren (12–18 jaar) op hun pad naar zelfinzicht, welzijn en persoonlijke groei. Werk flexibel en maak een waardevolle impact.
          </p>
          <div className="mt-10">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow px-8 py-6 text-lg">
              <Link href="/coach-application">
                Start je aanmelding als Coach
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-xl">
          <Image
            src="https://placehold.co/800x600.png"
            alt="Professionele coach in een online gesprekssessie."
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint="coach online session professional"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
