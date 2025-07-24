// src/app/dashboard/tools/[toolId]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, AlertTriangle } from '@/lib/icons';
import dynamic from 'next/dynamic';
import { toPascalCase } from '@/lib/string-utils';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-48 w-full" />
        </CardContent>
    </Card>
);

const ComponentNotFound = ({ toolId } : { toolId: string }) => (
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
                Zorg ervoor dat er een bestand bestaat op <code>src/components/tools/{toPascalCase(toolId)}.tsx</code> en dat de server opnieuw is opgestart.
            </p>
        </CardContent>
    </Card>
);

export default function ToolDisplayPage() {
  const params = useParams();
  const toolId = params?.toolId as string;
  const componentName = toPascalCase(toolId);

  // Use next/dynamic to load the component based on the toolId
  const ToolComponent = dynamic(
    () => import(`@/components/tools/${componentName}`),
    { 
      loading: () => <LoadingSkeleton />,
      ssr: false, // Important for client-side only components
      // Provide a fallback component if the import fails
      error: () => <ComponentNotFound toolId={toolId} />
    }
  );

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
      
      {/* The ToolComponent will render here, or the error/loading state */}
      <ToolComponent />

    </div>
  );
}
