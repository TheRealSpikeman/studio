// src/components/admin/tool-creator/ToolPreviewer.tsx
"use client";

import dynamic from 'next/dynamic';
import { toPascalCase } from '@/lib/string-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

const LoadingSkeleton = () => <Skeleton className="h-48 w-full" />;

const ComponentNotFound = ({ toolId }: { toolId: string }) => (
    <div className="text-center p-4 bg-destructive/10 border border-destructive/20 rounded-md">
        <AlertTriangle className="mx-auto h-8 w-8 text-destructive mb-2" />
        <h3 className="font-semibold text-destructive">Component Not Found</h3>
        <p className="text-sm text-destructive/80 mt-1">
            Could not load component for tool ID '<strong>{toolId}</strong>'.
            Please ensure the file <code>src/components/tools/{toPascalCase(toolId)}.tsx</code> exists. You may need to refresh the page.
        </p>
    </div>
);

export function ToolPreviewer({ toolId }: { toolId: string }) {
  if (!toolId) {
      return <ComponentNotFound toolId="(geen)" />;
  }

  const componentName = toPascalCase(toolId);
  const ToolComponent = dynamic(
    () => import(`@/components/tools/${componentName}`),
    {
      loading: () => <LoadingSkeleton />,
      ssr: false, // Important for client-side only components that may use hooks, etc.
      // This error boundary is key for when the file doesn't exist yet
      error: () => <ComponentNotFound toolId={toolId} />
    }
  );

  return <ToolComponent />;
}
