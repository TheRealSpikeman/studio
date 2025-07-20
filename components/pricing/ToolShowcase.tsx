// src/components/pricing/ToolShowcase.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package } from '@/lib/icons';
import type { PlatformTool } from '@/types/subscription';

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
                <p className="text-muted-foreground">
                    Elk "Gezins Gids" abonnement geeft u en uw kind(eren) volledige toegang tot onze groeiende bibliotheek van tools en features.
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map(tool => (
                <div key={tool.id} className="p-3 bg-muted/50 border rounded-lg text-center shadow-sm">
                  <p className="text-sm font-semibold text-foreground">{tool.label}</p>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
    );
}
