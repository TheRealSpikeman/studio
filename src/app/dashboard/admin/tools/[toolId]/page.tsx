// src/app/dashboard/admin/tools/[toolId]/page.tsx
"use client";

import { FocusTimer } from '@/components/tools/FocusTimer';
import { DEFAULT_TOOLS } from '@/lib/quiz-data/tools-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Lightbulb } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";

export default function AdminToolDetailPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  const tool = DEFAULT_TOOLS.find(t => t.id === toolId);

  // Router to render the correct tool component based on the toolId
  const renderTool = () => {
    switch (toolId) {
      case 'focus-timer-pro':
        return <FocusTimer />;
      // Add cases for other tools here in the future
      // case 'concentratie-games':
      //   return <ConcentrationGamesTool />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Wrench className="h-8 w-8 text-primary" />
                {tool ? tool.title : 'Tool in ontwikkeling'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Deze tool is momenteel in ontwikkeling en zal binnenkort beschikbaar zijn.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <>
      {/* De alert is nu overbodig omdat de studio-omgeving zelf de bewerkmodus is. */}
      {renderTool()}
    </>
  );
}
