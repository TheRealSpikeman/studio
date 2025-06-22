import Link from 'next/link';
import type { ElementType } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, PlayCircle, Clock, User, List, Brain } from 'lucide-react'; // Added User, List, Brain for metadata icons
import Image from 'next/image';
import { cn } from '@/lib/utils';

export type QuizStatus = 'Nog niet gestart' | 'In progress' | 'Voltooid';

interface QuizCardProps {
  id: string;
  title: string;
  description: string; // Short summary
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

export function QuizCard({ 
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
  icon: QuizIcon, // Renamed to avoid conflict with statusIcon
  badgeText,
  badgeClass,
  isNeuroIntake
}: QuizCardProps) {
  let statusIcon;
  let actionButtonText;
  let actionButtonVariant: "default" | "outline" | "secondary" = "default";
  
  let href: string;
  if (isNeuroIntake) {
    href = `/quiz/teen-neurodiversity-quiz?ageGroup=${ageGroup}`;
  } else {
    href = `/quiz/${id}`;
  }


  switch (status) {
    case 'Nog niet gestart':
      statusIcon = <PlayCircle className="h-5 w-5 text-primary" />;
      actionButtonText = isNeuroIntake ? 'Start Intake Test' : 'Start Quiz';
      break;
    case 'In progress':
      statusIcon = <Clock className="h-5 w-5 text-yellow-500" />;
      actionButtonText = 'Doorgaan';
      actionButtonVariant = "secondary";
      break;
    case 'Voltooid':
      statusIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
      actionButtonText = 'Bekijk Resultaten';
      actionButtonVariant = "outline";
      if (isNeuroIntake) {
         href = `/quiz/teen-neurodiversity-quiz/results?ageGroup=${ageGroup}`; // Ensure results link for intake is also correct
      } else {
        href = `/quiz/${id}/results`;
      }
      break;
    default:
      statusIcon = null;
      actionButtonText = 'Details';
  }

  const difficultyColors = {
    makkelijk: 'text-green-600',
    gemiddeld: 'text-yellow-600',
    moeilijk: 'text-red-600',
  };

  return (
    <Card className="group flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
      {badgeText && (
        <div className={cn(
          "absolute top-2 right-2 z-10 rounded-full px-2.5 py-0.5 text-xs font-semibold",
          badgeClass || "bg-primary text-primary-foreground"
        )}>
          {badgeText}
        </div>
      )}
      {imageUrl && (
        <div className="relative h-40 w-full">
          <Image 
            src={imageUrl} 
            alt={title} 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint={dataAiHint || "abstract quiz"}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
            <span className="text-white text-xs font-semibold">Meer info &raquo;</span>
          </div>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="text-lg font-semibold leading-tight">{title}</CardTitle>
          {QuizIcon && <QuizIcon className="h-6 w-6 text-primary/80" />}
        </div>
        <CardDescription className="text-xs h-10 overflow-hidden text-ellipsis">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-1 pb-3 space-y-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {duration && (
            <span className="flex items-center gap-1" title="Duur">
              <Clock className="h-3.5 w-3.5" /> {duration}
            </span>
          )}
          {ageGroup !== 'all' && (
             <span className="flex items-center gap-1" title="Leeftijd">
                <User className="h-3.5 w-3.5" /> {ageGroup} jr
            </span>
          )}
          {questionCount && (
            <span className="flex items-center gap-1" title="Aantal vragen">
              <List className="h-3.5 w-3.5" /> {questionCount} vragen
            </span>
          )}
          {difficulty && (
            <span className={cn("flex items-center gap-1 font-medium", difficultyColors[difficulty])} title="Moeilijkheid">
              <Brain className="h-3.5 w-3.5" /> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          )}
        </div>
        
        {status === 'In progress' && progress !== undefined && (
          <div className="space-y-1 pt-1">
            <Progress value={progress} aria-label={`${progress}% voltooid`} className="h-2"/>
            <p className="text-xs text-muted-foreground">{progress}% voltooid</p>
          </div>
        )}
         {status === 'Voltooid' && (
          <p className="text-sm text-green-600 font-medium flex items-center gap-1 pt-1"><CheckCircle className="h-4 w-4"/>Quiz afgerond!</p>
        )}
         {status === 'Nog niet gestart' && !progress && (
          <p className="text-sm text-muted-foreground pt-1">{isNeuroIntake ? "Start hier je ontdekkingsreis!" : "Klaar om te beginnen?"}</p>
        )}
      </CardContent>
      <CardFooter className="mt-auto pt-2 pb-4">
        <Button asChild className="w-full" variant={actionButtonVariant}>
          <Link href={href}>{actionButtonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
