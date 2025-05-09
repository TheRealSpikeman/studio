// src/components/homework-assistance/SubjectCard.tsx
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckSquare, ListPlus, X, EyeOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SubjectCardProps {
  subjectId: string;
  subjectName: string;
  icon: ReactNode;
  description: string;
  onDismiss: (subjectId: string) => void;
}

export function SubjectCard({ subjectId, subjectName, icon, description, onDismiss }: SubjectCardProps) {

  return (
    <Card className="relative flex flex-col hover:shadow-xl transition-shadow duration-300 group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.preventDefault(); // Prevent link navigation if card is wrapped in Link
                e.stopPropagation(); // Prevent link navigation
                onDismiss(subjectId);
              }}
              aria-label={`Verberg ${subjectName}`}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Verberg dit vak uit het overzicht</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CardHeader className="items-center text-center pb-3">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold">{subjectName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-center pb-3">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      
      <div className="px-6 pb-4 space-y-2">
        <Separator />
        <div className="pt-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <CheckSquare className="h-4 w-4" />
                Jouw To-Do's voor {subjectName}:
            </h4>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5 pl-1">
                <li>Opdracht X afmaken</li>
                <li>Hoofdstuk Y leren</li>
                <li>Oefentoets Z maken</li>
            </ul>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto mt-1" asChild>
                <Link href={`/dashboard/homework-assistance/${subjectId}#todos`}>
                    Beheer To-Do's <ListPlus className="ml-1 h-3 w-3" />
                </Link>
            </Button>
        </div>
      </div>

      <CardFooter className="border-t pt-4">
        <Button asChild className="w-full">
          <Link href={`/dashboard/homework-assistance/${subjectId}`}>
            Bekijk {subjectName} Tips & Tools <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
