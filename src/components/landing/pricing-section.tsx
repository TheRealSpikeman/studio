
// src/components/landing/pricing-section.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2, Users, BarChart3, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

export function PricingSection() {
  return (
    <section id="pricing" className="py-12 md:py-16 flex flex-col items-center">
      <div className="container px-4 sm:px-6 lg:px-8">
        <CardHeader className="text-center max-w-2xl mx-auto pb-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-3 flex items-center justify-center gap-2">
                <FileText className="h-9 w-9 text-primary" />
                Heldere Plannen, Directe Waarde
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
                Start gratis om de basis te ontdekken, of kies een compleet pakket voor de volledige MindNavigator ervaring. Elk pad begint met een waardevolle, persoonlijke assessment voor uw kind.
            </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow text-lg px-10 py-7">
              <Link href="/pricing">
                Bekijk Alle Plannen & Prijzen <ExternalLink className="ml-2 h-5 w-5"/>
              </Link>
            </Button>
             <p className="mt-6 text-sm text-muted-foreground">
                Transparante prijzen, geen verborgen kosten. Inclusief een gratis startoptie.
            </p>
        </CardContent>
      </div>
    </section>
  );
}
