// src/components/landing/pricing-section.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, ExternalLink, FileText } from '@/lib/icons';
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
                Start met een abonnement dat past bij uw gezin en krijg direct volledige toegang tot alle tools, inzichten en het ouder-dashboard.
            </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow text-lg px-10 py-7">
              <Link href="/pricing">
                Bekijk Alle Plannen & Prijzen <ExternalLink className="ml-2 h-5 w-5"/>
              </Link>
            </Button>
             <p className="mt-6 text-sm text-muted-foreground">
                Transparante prijzen, maandelijks opzegbaar.
            </p>
        </CardContent>
      </div>
    </section>
  );
}
