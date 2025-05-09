import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, PlayCircle, Clock } from 'lucide-react';
import Image from 'next/image';

export type QuizStatus = 'Nog niet gestart' | 'In progress' | 'Voltooid';

interface QuizCardProps {
  id: string;
  title: string;
  description: string;
  status: QuizStatus;
  progress?: number; // Percentage, 0-100, only relevant if 'In progress'
  imageUrl?: string;
  dataAiHint?: string;
}

export function QuizCard({ id, title, description, status, progress, imageUrl, dataAiHint }: QuizCardProps) {
  let statusIcon;
  let actionButtonText;
  let actionButtonVariant: "default" | "outline" | "secondary" = "default";
  let href = `/quiz/${id}`;

  switch (status) {
    case 'Nog niet gestart':
      statusIcon = <PlayCircle className="h-5 w-5 text-primary" />;
      actionButtonText = 'Start Quiz';
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
      href = `/quiz/${id}/results`; // Or a general results page: `/dashboard/results/${id}`
      break;
    default:
      statusIcon = null;
      actionButtonText = 'Details';
  }

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {imageUrl && (
        <div className="relative h-40 w-full">
          <Image 
            src={imageUrl} 
            alt={title} 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint={dataAiHint || "abstract quiz"}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {statusIcon}
        </div>
        <CardDescription className="h-12 overflow-hidden text-ellipsis">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {status === 'In progress' && progress !== undefined && (
          <div className="space-y-1">
            <Progress value={progress} aria-label={`${progress}% voltooid`} />
            <p className="text-xs text-muted-foreground">{progress}% voltooid</p>
          </div>
        )}
         {status === 'Voltooid' && (
          <p className="text-sm text-green-600 font-medium">Quiz afgerond!</p>
        )}
         {status === 'Nog niet gestart' && (
          <p className="text-sm text-muted-foreground">Klaar om te beginnen?</p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant={actionButtonVariant}>
          <Link href={href}>{actionButtonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
