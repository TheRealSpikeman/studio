// src/components/pricing/ToolShowcase.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, MessageSquareText, BookOpenCheck, Users, BarChart3, Handshake } from '@/lib/icons';
import type { PlatformTool } from '@/types/subscription';
import { cn } from '@/lib/utils';
import type { ElementType } from 'react';

interface ToolShowcaseProps {
    tools: PlatformTool[];
}

const iconMap: { [key: string]: ElementType } = {
  'full-access-tools': FileText,
  'daily-coaching': MessageSquareText,
  'homework-tools': BookOpenCheck,
  'progress-reports': BarChart3,
  'parent-dashboard': Users,
  'expert-network': Handshake,
};

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
              {tools.map(tool => {
                const Icon = iconMap[tool.id] || Package;
                return (
                  <Card 
                    key={tool.id} 
                    className="text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out border-transparent hover:border-primary/20 bg-muted/20"
                  >
                      <CardHeader className="items-center pb-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4 transition-transform duration-300 group-hover:scale-110">
                              <Icon className="h-8 w-8 text-primary" />
                          </div>
                          <CardTitle className="text-base font-semibold text-foreground">{tool.label}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
    );
}
