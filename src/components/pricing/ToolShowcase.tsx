// src/components/pricing/ToolShowcase.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, MessageSquareText, BookOpenCheck, Users, BarChart3, Handshake } from '@/lib/icons';
import type { PlatformTool } from '@/types/subscription';
import type { ElementType } from 'react';
import { FeatureList } from './FeatureList'; // Import the new component

const iconMap: { [key: string]: ElementType } = {
  'full-access-tools': FileText,
  'daily-coaching': MessageSquareText,
  'homework-tools': BookOpenCheck,
  'progress-reports': BarChart3,
  'parent-dashboard': Users,
  'expert-network': Handshake,
};

export function ToolShowcase() {
    return (
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto max-w-2xl">
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 text-2xl font-semibold text-primary mb-2">
                    <Package className="h-7 w-7" />
                    <h2>Inbegrepen in Elk Betaald Plan</h2>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Elk "Gezins Gids" abonnement geeft u en uw kind(eren) volledige toegang tot onze groeiende bibliotheek van tools en features. Hieronder een gedetailleerd overzicht.
                </p>
            </div>
            
            <FeatureList />
            
          </div>
        </section>
    );
}
