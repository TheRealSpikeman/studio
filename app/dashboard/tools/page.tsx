// src/app/dashboard/tools/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { allTools, calculateToolRecommendations, type ToolScores, getToolIconComponent } from '@/lib/quiz-data/tools-data';
import { ArrowRight, Wrench, Lightbulb } from '@/lib/icons';
import type { Tool } from '@/lib/quiz-data/tools-data';

// Dummy scores for demonstration purposes. In a real app, these would come from the user's state.
const dummyScores: ToolScores = {
  attention: 6.5, // High
  energy: 4.0,    // Medium
  prikkels: 7.0,  // High
  sociaal: 3.0,   // Medium
  stemming: 5.5,  // High
};

export default function RecommendedToolsPage() {
  const recommendations = calculateToolRecommendations(dummyScores);
  const recommendedTools: Tool[] = recommendations.high;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          Jouw Aanbevolen Tools
        </h1>
        <p className="text-muted-foreground">
          Op basis van jouw quizresultaten, zijn dit de tools die jou op dit moment het beste kunnen helpen.
        </p>
      </section>

      {recommendedTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedTools.map((tool) => {
            const Icon = getToolIconComponent(tool.icon);
            if (!Icon) return null; // Skip rendering if icon component is not found

            return (
              <Card key={tool.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{tool.title}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   <div className="p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md text-xs">
                        <p className="font-semibold flex items-center gap-1.5"><Lightbulb className="h-4 w-4" />Waarom deze tool?</p>
                        <p className="mt-1">{tool.reasoning.high}</p>
                   </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/tools/${tool.id}`}>
                      Ga naar Tool <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
         <Card>
            <CardHeader>
                <CardTitle>Geen specifieke aanbevelingen</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">We hebben op dit moment geen specifieke tool-aanbevelingen voor je. Verken gerust zelf de bibliotheek!</p>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
