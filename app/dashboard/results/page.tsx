// src/app/dashboard/results/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { QuizResult } from '@/types';
import { storageService } from '@/services/storageService';
import { LoggedInResultsView } from '@/components/dashboard/results/LoggedInResultsView';
import { AnonymousResultView } from './AnonymousResultView';
import { Loader2, BookOpen } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ResultsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [completedQuizzes, setCompletedQuizzes] = useState<QuizResult[]>([]);
  const [recentResult, setRecentResult] = useState<QuizResult | null>(null);
  
  const tempResultChecked = useRef(false);

  useEffect(() => {
    const loadResults = async () => {
      if (!tempResultChecked.current) {
        // De getTempQuizResult functie wist het resultaat al uit de sessie.
        const tempResult = storageService.getTempQuizResult();
        if (tempResult) {
          setRecentResult(tempResult);
        }
        tempResultChecked.current = true;
      }
      
      if (user?.id) {
        const quizzes = await storageService.getCompletedQuizzesForUser(user.id);
        setCompletedQuizzes(quizzes);
      }
      
      setIsLoading(false);
    };

    if (!isAuthLoading) {
      loadResults();
    }
    
  }, [user, isAuthLoading]);
  
  if (isLoading || isAuthLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Resultaten laden...</p>
        </div>
      );
  }

  if (recentResult) {
    const handleClose = () => {
      setRecentResult(null);
      if (!user) {
        router.push('/quizzes');
      }
    };
    return <AnonymousResultView result={recentResult} onClose={handleClose} />;
  }
  
  if (user) {
    return <LoggedInResultsView completedQuizzes={completedQuizzes} user={user} />;
  }

  return (
    <div className="flex h-screen items-center justify-center p-4 text-center">
      <div className="space-y-4">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Geen Resultaten Gevonden</h1>
        <p className="text-muted-foreground">
            Voltooi een quiz om je resultaten hier te zien.
        </p>
        <Button asChild>
          <Link href="/quizzes">Start een Zelfreflectie Tool</Link>
        </Button>
      </div>
    </div>
  );
}
