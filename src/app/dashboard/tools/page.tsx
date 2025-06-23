// src/app/dashboard/tools/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { allTools } from '@/lib/quiz-data/tools-data';
import { ArrowRight, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ToolsOverviewPage() {
  const availableTools = ['focus-timer-pro']; // List of implemented tools

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          Alle Tools
        </h1>
        <p className="text-muted-foreground">
          Ontdek alle beschikbare tools om je te helpen met focus, rust, planning en meer.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTools.map((tool) => {
          const Icon = tool.icon;
          const isAvailable = availableTools.includes(tool.id);
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
              <CardContent className="flex-grow"></CardContent>
              <CardFooter>
                 <Button asChild variant={isAvailable ? "default" : "outline"} disabled={!isAvailable} className="w-full">
                  <Link href={isAvailable ? `/dashboard/tools/${tool.id}` : '#'}>
                    {isAvailable ? 'Ga naar Tool' : 'Binnenkort Beschikbaar'}
                    {isAvailable && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
