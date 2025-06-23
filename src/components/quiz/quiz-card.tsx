
"use client";

import type { ElementType } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, HelpCircle, BarChart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export type QuizStatus = 'Nog niet gestart' | 'Bezig' | 'Voltooid';

// Reusing the interface from the page for props definition
export interface QuizCardProps {
  id: string; 
  title: string;
  description: string; 
  status: QuizStatus; 
  progress?: number;
  imageUrl?: string;
  dataAiHint?: string;
  ageGroup: '12-14' | '15-18' | 'all';
  duration?: string; 
  questionCount?: number; 
  difficulty?: 'makkelijk' | 'gemiddeld' | 'moeilijk';
  icon?: ElementType; 
  badgeText?: string; 
  badgeClass?: string; 
  isNeuroIntake?: boolean; 
}

const getDifficultyClass = (difficulty?: 'makkelijk' | 'gemiddeld' | 'moeilijk') => {
  switch (difficulty) {
    case 'makkelijk': return 'text-green-600';
    case 'gemiddeld': return 'text-yellow-600';
    case 'moeilijk': return 'text-red-600';
    default: return 'text-muted-foreground';
  }
};

export const QuizCard = ({
  id,
  title,
  description,
  status,
  progress,
  imageUrl,
  dataAiHint,
  ageGroup,
  duration,
  questionCount,
  difficulty,
  icon: Icon,
  badgeText,
  badgeClass,
  isNeuroIntake
}: QuizCardProps) => {

  const linkHref = isNeuroIntake
    ? `/quiz/teen-neurodiversity-quiz?ageGroup=${ageGroup}`
    : `/quiz/${id}`;
  
  const IconComponent = Icon || HelpCircle;

  return (
    <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        {badgeText && (
            <Badge className={cn("absolute top-3 right-3 z-10", badgeClass)}>
                {badgeText}
            </Badge>
        )}
        <div className="aspect-[16/9] w-full relative">
            <Image
                src={imageUrl || 'https://placehold.co/400x225.png'}
                alt={`Afbeelding voor ${title}`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-lg"
                data-ai-hint={dataAiHint || "abstract illustration"}
            />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-start gap-3 mb-2">
            {Icon && <IconComponent className="h-6 w-6 text-primary flex-shrink-0 mt-1" />}
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
        {status === 'Bezig' && progress !== undefined && (
          <div className="mt-3">
             <Progress value={progress} className="h-2"/>
             <p className="text-xs text-muted-foreground mt-1">{progress}% voltooid</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto">
        <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
            {duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{duration}</span>}
            {questionCount && <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3"/>{questionCount} Vragen</span>}
            {difficulty && <span className={cn("flex items-center gap-1 capitalize", getDifficultyClass(difficulty))}><BarChart className="h-3 w-3"/>{difficulty}</span>}
        </div>
        <Button asChild size="sm" className="ml-auto">
          <Link href={linkHref}>
            {status === 'Nog niet gestart' ? 'Start' : status === 'Bezig' ? 'Ga verder' : 'Bekijk'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
