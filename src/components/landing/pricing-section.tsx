// src/components/landing/pricing-section.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Users, BarChart3, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-secondary/30 flex flex-col items-center">
      <div className="container">
        <CardHeader className="text-center max-w-2xl mx-auto pb-10">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-3 flex items-center justify-center gap-2">
                <FileText className="h-9 w-9 text-primary" /> {/* Changed icon */}
                Ontdek Onze Plannen
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
                Kies het plan dat het beste past bij de behoeften van uw gezin. Elk pad begint met een persoonlijke assessment om de MindNavigator ervaring op maat te maken.
            </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow text-lg px-10 py-7">
              <Link href="/pricing">
                Bekijk Alle Plannen & Prijzen <ExternalLink className="ml-2 h-5 w-5"/>
              </Link>
            </Button>
             <p className="mt-6 text-sm text-muted-foreground">
                Alle plannen (inclusief gratis start) beginnen met een waardevolle persoonlijke assessment.
            </p>
        </CardContent>
      </div>
    </section>
  );
}
