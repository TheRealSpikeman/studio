// src/components/dashboard/results/RecommendedToolsSection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { allTools, calculateToolRecommendations, type ToolScores, getToolIconComponent } from '@/lib/quiz-data/tools-data';
import { ArrowRight, Wrench, Lightbulb, HelpCircle } from '@/lib/icons';
import type { Tool } from '@/lib/quiz-data/tools-data';

interface RecommendedToolsSectionProps {
  scores: Record<string, number>;
}

export function RecommendedToolsSection({ scores }: RecommendedToolsSectionProps) {
    
  // Map scores from the quiz result to the format expected by the recommendation engine
  const toolScores: ToolScores = {
    attention: (scores.ADD || 0) * 2,
    energy: (scores.ADHD || 0) * 2,
    prikkels: (scores.HSP || 0) * 2,
    sociaal: (scores.ASS || 0) * 2,
    stemming: (scores.AngstDepressie || 0) * 2,
  };

  const recommendations = calculateToolRecommendations(toolScores);
  const recommendedTools: Tool[] = recommendations.high;
  
  if (recommendedTools.length === 0) {
    return null; // Don't render anything if there are no high-priority recommendations
  }

  return (
    <Card className="mt-8 shadow-lg bg-card border">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-primary">
                <Wrench className="h-7 w-7" />
                Jouw Aanbevolen Tools
            </CardTitle>
            <CardDescription>
                Op basis van jouw antwoorden, zijn dit de tools die jou op dit moment het beste kunnen helpen.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedTools.map((tool) => {
                const Icon = getToolIconComponent(tool.icon) || HelpCircle;
                return (
                    <Card key={tool.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow bg-background">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-base font-semibold">{tool.title}</CardTitle>
                            </div>
                            <CardDescription className="text-xs">{tool.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="p-2 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md text-xs">
                                <p className="font-semibold flex items-center gap-1.5"><Lightbulb className="h-4 w-4" />Waarom deze tool?</p>
                                <p className="mt-1">{tool.reasoning.high}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                        <Button asChild size="sm" className="w-full">
                            <Link href={`/dashboard/tools/${tool.id}`}>
                                Ga naar Tool <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </CardContent>
    </Card>
  );
}
