// src/components/homework-assistance/ToolPlaceholderCard.tsx
import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ToolPlaceholderCardProps {
  toolName: string;
  description: string;
  icon: ReactNode;
}

export function ToolPlaceholderCard({ toolName, description, icon }: ToolPlaceholderCardProps) {
  return (
    <Card className="flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader className="items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
        <CardTitle className="text-lg font-medium">{toolName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="w-full pt-2">
        <Button variant="outline" className="w-full" disabled>
          Start {toolName} (binnenkort)
        </Button>
      </CardFooter>
    </Card>
  );
}
