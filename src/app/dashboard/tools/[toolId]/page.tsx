// src/app/dashboard/tools/[toolId]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

// Import all available tool components
import { FocusTimer } from '@/components/tools/FocusTimer';
import { ConcentrationGames } from '@/components/tools/ConcentrationGames';
import { DistractionBlocker } from '@/components/tools/DistractionBlocker';
import { FidgetSimulator } from '@/components/tools/FidgetSimulator';

// Map tool IDs to their components
const toolComponents: Record<string, React.ComponentType> = {
  'focus-timer-pro': FocusTimer,
  'concentratie-games': ConcentrationGames,
  'distraction-blocker': DistractionBlocker,
  'fidget-simulator': FidgetSimulator,
  // Add other tools here as they are created
};

export default function ToolDisplayPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  const ToolComponent = toolComponents[toolId];

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div className="flex-1">
          {/* Title can be dynamically set later if needed */}
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/tool-management">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Toolbeheer
          </Link>
        </Button>
      </div>

      {ToolComponent ? (
        <ToolComponent />
      ) : (
        <Card className="text-center">
          <CardHeader>
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardTitle>Tool Component Niet Gevonden</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              De component voor de tool met ID '<strong>{toolId}</strong>' is nog niet aangemaakt of correct gekoppeld.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Zorg ervoor dat u een bestand heeft aangemaakt op <code>src/components/tools/{toolId}.tsx</code> en dat het hier geïmporteerd is.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
