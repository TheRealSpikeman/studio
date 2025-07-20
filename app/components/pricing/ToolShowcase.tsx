// src/components/pricing/ToolShowcase.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { detailedFeatureList } from '@/lib/data/features-data';
import { CheckCircle2, Package } from '@/lib/icons';

export function ToolShowcase() {
    return (
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 text-2xl font-semibold text-primary mb-2">
                    <Package className="h-8 w-8" />
                    <h2>Inbegrepen in Elk Betaald Plan</h2>
                </div>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                    Elk "Gezins Gids" abonnement geeft u en uw kind(eren) volledige toegang tot onze groeiende bibliotheek van tools en features om persoonlijke ontwikkeling te ondersteunen.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {detailedFeatureList.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                            <IconComponent className="h-7 w-7 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-semibold">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        {category.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                            <span>{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
    );
}
