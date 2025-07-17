// src/app/word-coach/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BecomeCoachHero } from '@/components/page/word-coach/BecomeCoachHero';
import { BecomeCoachBenefits } from '@/components/page/word-coach/BecomeCoachBenefits';
import { BecomeCoachFaq } from '@/components/page/word-coach/BecomeCoachFaq';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BecomeCoachPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/20 to-background">
          <BecomeCoachHero />
          <BecomeCoachBenefits />
          <div className="py-16 md:py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-8">
              Klaar om een verschil te maken?
            </h2>
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow px-8 py-6 text-lg">
              <Link href="/coach-application">
                Meld je nu aan als Coach
              </Link>
            </Button>
          </div>
          <BecomeCoachFaq />
      </main>
      <Footer />
    </div>
  );
}
