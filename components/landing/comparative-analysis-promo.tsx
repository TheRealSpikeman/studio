
// src/components/landing/comparative-analysis-promo.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowRight, CheckCircle2 } from '@/lib/icons';

export function ComparativeAnalysisPromoSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <Card className="bg-orange-50/70 border-2 border-primary/30 shadow-lg max-w-3xl mx-auto">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
                NIEUW: Ouder-Kind Vergelijkende Analyse
              </CardTitle>
            </div>
            <CardDescription className="text-base text-muted-foreground leading-relaxed">
              Verkrijg dieper inzicht in de dynamiek tussen u en uw kind. Onze nieuwe module analyseert de resultaten van de "Ken je Kind" quiz (die u invult) en de zelfreflectie van uw kind.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground/90">
            <ul className="list-none space-y-2 pl-0">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Identificeer verschillen en overeenkomsten in perceptie.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Ontvang AI-gegenereerde tips voor betere communicatie.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Krijg een concreet familie actieplan met haalbare stappen.</span>
              </li>
            </ul>
            <div className="pt-4">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/for-parents/vergelijkende-analyse">
                  Lees meer over de Vergelijkende Analyse <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
