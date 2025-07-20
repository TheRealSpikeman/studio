// src/components/pricing/ToolShowcase.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from '@/lib/icons';
import type { PlatformTool } from '@/types/subscription';
import { cn } from '@/lib/utils';

interface ToolShowcaseProps {
    tools: PlatformTool[];
}

export function ToolShowcase({ tools }: ToolShowcaseProps) {
    if (!tools || tools.length === 0) {
        return null;
    }
    
    return (
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 text-2xl font-semibold text-primary mb-2">
                    <Package className="h-7 w-7" />
                    <h2>Inbegrepen in Elk Betaald Plan</h2>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Elk "Gezins Gids" abonnement geeft u en uw kind(eren) volledige toegang tot onze groeiende bibliotheek van tools en features.
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map(tool => (
                <Card 
                  key={tool.id} 
                  className="bg-muted/30 border-border/50 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out"
                >
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-foreground">{tool.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
    );
}
