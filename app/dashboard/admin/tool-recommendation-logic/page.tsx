// src/app/dashboard/admin/tool-recommendation-logic/page.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, GitBranch, Lightbulb, TrendingUp, TrendingDown, Minus } from '@/lib/icons';
import type { Tool } from '@/lib/quiz-data/tools-data';
import { DEFAULT_TOOLS, getToolIconComponent } from '@/lib/quiz-data/tools-data';
import { Badge } from '@/components/ui/badge';
import type { ElementType } from 'react';

interface RecommendationLogic {
  profile: string;
  recommendations: {
    high: string[];
    medium: string[];
    low: string[];
  };
}

// This hardcoded data represents the logic from the calculateToolRecommendations function
const recommendationMatrix: RecommendationLogic[] = [
  {
    profile: "Aandacht & Focus",
    recommendations: {
      high: ['focus-timer-pro', 'concentratie-games'],
      medium: ['study-planner'],
      low: ['distraction-blocker']
    }
  },
  {
    profile: "Energie & Impulsiviteit",
    recommendations: {
      high: ['bewegings-breaks', 'impulse-pause'],
      medium: ['energie-monitor', 'fidget-simulator'],
      low: []
    }
  },
  {
    profile: "Prikkelverwerking",
    recommendations: {
      high: ['sensory-calm-space', 'overprikkel-alarm'],
      medium: ['ademhalings-gids', 'progressive-relaxatie'],
      low: ['empathie-balancer']
    }
  },
  {
    profile: "Stemming & Emotie",
    recommendations: {
      high: ['mood-tracker', 'emotie-gids'],
      medium: ['zorgen-dagboek', 'gratitude-journal'],
      low: []
    }
  },
  {
    profile: "Sociaal & Communicatie",
    recommendations: {
      high: ['deep-dive-planner', 'interest-sharing'],
      medium: ['sociale-scripts', 'vriendschap-tracker'],
      low: ['conflict-navigator']
    }
  }
];

const ToolCard = ({ tool }: { tool: Tool }) => {
    const Icon = getToolIconComponent(tool.icon);
    if (!Icon) return null;
    return (
        <div className="p-3 border rounded-md bg-background shadow-sm flex items-start gap-3">
            <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
                <p className="font-semibold text-sm">{tool.title}</p>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
            </div>
        </div>
    );
}

const ScoreLevelCard = ({ title, icon, toolIds, scoreRange }: { title: string, icon: ElementType, toolIds: string[], scoreRange: string }) => {
    const Icon = icon;
    const tools = toolIds.map(id => DEFAULT_TOOLS.find(t => t.id === id)).filter((t): t is Tool => !!t);

    return (
        <Card className="flex-1 min-w-[280px]">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 text-lg">
                     <div className="flex items-center gap-2">
                        <Icon className="h-6 w-6 text-primary"/>
                        {title}
                    </div>
                    <Badge variant="outline" className="font-mono text-xs font-semibold">{scoreRange}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {tools.length > 0 ? tools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                )) : (
                    <p className="text-sm text-muted-foreground italic">Geen specifieke aanbevelingen voor dit niveau.</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function ToolRecommendationLogicPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <GitBranch className="h-8 w-8 text-primary" />
          Logica voor Tool Aanbevelingen
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        Dit overzicht toont welke tools worden aanbevolen op basis van de scores (schaal 0-8) op de verschillende neurodiversiteitsprofielen. Deze logica wordt toegepast op de resultatenpagina van de quiz.
      </p>

      <div className="space-y-10">
        {recommendationMatrix.map(matrixItem => (
          <Card key={matrixItem.profile} className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">{matrixItem.profile}</CardTitle>
              <CardDescription>Aanbevelingen gebaseerd op scoreniveau voor dit profiel.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                    <ScoreLevelCard icon={TrendingUp} toolIds={matrixItem.recommendations.high} scoreRange="> 5.0" />
                    <ScoreLevelCard icon={Minus} toolIds={matrixItem.recommendations.medium} scoreRange="2.1 - 5.0" />
                    <ScoreLevelCard icon={TrendingDown} toolIds={matrixItem.recommendations.low} scoreRange="0.0 - 2.0" />
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
