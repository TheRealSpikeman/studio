
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Users, BarChart3, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-secondary/30 flex flex-col items-center">
      <div className="container">
        <CardHeader className="text-center max-w-2xl mx-auto pb-10">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-3">
                Duidelijke & Flexibele Abonnementen
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
                Kies het plan dat het beste past bij de behoeften van uw gezin. Ontdek onze volledige prijsopties, inclusief gedetailleerde features en jaarlijkse kortingen.
            </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow text-lg px-10 py-7">
              <Link href="/pricing">
                Bekijk Alle Plannen & Prijzen <ExternalLink className="ml-2 h-5 w-5"/>
              </Link>
            </Button>
             <p className="mt-6 text-sm text-muted-foreground">
                Inclusief een gratis startoptie om kennis te maken.
            </p>
        </CardContent>
      </div>
    </section>
  );
}
