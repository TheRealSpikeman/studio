// src/components/quiz/quiz-card.tsx
"use client";

import type { ElementType } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, HelpCircle, BarChart, ArrowRight, Users, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import type { QuizAudience, QuizCategory, QuizAdmin } from '@/types/quiz-admin';
import { getCategoryLabel } from '@/types/quiz-admin';
import { EditableImage } from '@/components/common/EditableImage';
import { useToast } from '@/hooks/use-toast';
import { storageService } from '@/services/storageService';


export type QuizStatus = 'Nog niet gestart' | 'Bezig' | 'Voltooid';

export interface QuizCardProps {
  id: string; 
  title: string;
  description: string; 
  status: QuizStatus; 
  audience: QuizAudience;
  category: QuizCategory;
  progress?: number;
  imageUrl?: string;
  dataAiHint?: string;
  ageGroup: '12-14' | '15-18' | 'all';
  duration?: string; 
  questionCount?: number; 
  difficulty?: 'laag' | 'gemiddeld' | 'moeilijk';
  icon?: ElementType; 
  badgeText?: string; 
  badgeClass?: string; 
  isNeuroIntake?: boolean;
  focusFlags?: string[];
  onQuizUpdate?: (updatedQuiz: QuizAdmin) => void;
}

const getDifficultyClass = (difficulty?: 'laag' | 'gemiddeld' | 'moeilijk') => {
  switch (difficulty) {
    case 'laag': return 'text-green-600';
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
  audience,
  category,
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
  isNeuroIntake,
  focusFlags,
  onQuizUpdate,
}: QuizCardProps) => {
  const { toast } = useToast();

  const handleImageSave = async (newUrl: string) => {
    const quizToUpdate = await storageService.getQuizById(id);
    if (!quizToUpdate) {
        toast({ title: 'Fout', description: 'Kon de quiz niet vinden om bij te werken.', variant: 'destructive' });
        return;
    }
    
    const updatedQuiz = { ...quizToUpdate, thumbnailUrl: newUrl };
    
    await storageService.updateQuiz(updatedQuiz);
    
    if (onQuizUpdate) {
        onQuizUpdate(updatedQuiz);
    }

    toast({ title: 'Afbeelding opgeslagen!' });
  };

  const linkHref = `/quiz/${id}`;
  
  const IconComponent = Icon || HelpCircle;
  const isForParent = typeof audience === 'string' && audience.toLowerCase().includes('ouder');
  const categoryLabel = getCategoryLabel(category);

  return (
    <Card className="group flex h-full flex-col overflow-visible rounded-xl border-2 border-border/50 bg-card shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="relative p-0">
         <EditableImage
            wrapperClassName="aspect-[16/9] w-full overflow-hidden rounded-t-lg"
            src={imageUrl || 'https://placehold.co/400x225.png'}
            alt={`Afbeelding voor ${title}`}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={dataAiHint || "abstract illustration"}
            onSave={handleImageSave}
            uploadPath="images/quizzes"
        />
        {badgeText && (
          <Badge className={cn("absolute top-3 right-3 z-10 shadow-md", badgeClass)}>
            {badgeText}
          </Badge>
        )}
         {/* Overlapping Icon */}
        <div className="absolute -bottom-8 left-6 z-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-lg ring-4 ring-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <IconComponent className="h-7 w-7 text-primary" />
              </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-grow flex-col p-4 pt-10">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        
        <div className="mt-2 space-y-2">
          {/* Audience */}
          <div className="flex items-center gap-2 text-sm text-primary">
            <Users className="h-4 w-4 shrink-0" />
            <span>{audience}</span>
          </div>
          
          {/* Category */}
          {categoryLabel && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconComponent className="h-4 w-4 shrink-0" />
              <span>Categorie: {categoryLabel}</span>
            </div>
          )}

          {/* Focus Flags */}
          {focusFlags && focusFlags.length > 0 && !focusFlags.includes('general') && (
            <div className="flex items-center gap-2 pt-1">
              <Sparkles className="h-4 w-4 shrink-0 text-teal-500" />
              <p className="text-sm font-medium text-muted-foreground">Focus:</p>
              <div className="flex flex-wrap gap-1">
                {focusFlags.map(flag => (
                  <Badge key={flag} variant="outline" className="text-xs capitalize border-teal-300 bg-teal-50 text-teal-800">
                    {flag.replace(/-friendly|-focus/g, '').replace(/(^\w)/, c => c.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="mt-3 flex-grow text-sm text-muted-foreground">{description}</p>
        
        {status === 'Bezig' && progress !== undefined && (
          <div className="mt-4">
             <Progress value={progress} className="h-1.5"/>
             <p className="text-xs text-muted-foreground mt-1.5">{progress}% voltooid</p>
          </div>
        )}
        
        {/* Meta Info moved into CardContent and positioned at the bottom */}
        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t mt-4">
          <div className="flex items-center gap-3">
            {duration && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5"/>{duration}</span>}
            {questionCount && <span className="flex items-center gap-1.5"><HelpCircle className="h-3.5 w-3.5"/>{questionCount} Vragen</span>}
          </div>
          {difficulty && <span className={cn("flex items-center gap-1.5 font-medium capitalize", getDifficultyClass(difficulty))}><BarChart className="h-3.5 w-3.5"/>{difficulty}</span>}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full font-semibold">
          <Link href={linkHref}>
            {isForParent ? 'Start Vragenlijst' : (status === 'Nog niet gestart' ? 'Start Quiz' : status === 'Bezig' ? 'Ga Verder' : 'Bekijk Resultaten')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
