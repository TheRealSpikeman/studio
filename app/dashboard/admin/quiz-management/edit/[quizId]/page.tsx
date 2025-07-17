// src/app/dashboard/admin/quiz-management/edit/[quizId]/page.tsx
"use client";

import dynamic from 'next/dynamic';
import type { QuizAdmin } from '@/types/quiz-admin'; 
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { storageService } from '@/services/storageService'; // Import the service

// Dynamically import the form component to prevent build hangs
const QuizEditForm = dynamic(
  () => import('@/components/admin/quiz-management/QuizEditForm').then(mod => mod.QuizEditForm),
  { 
    ssr: false, 
    loading: () => (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }
);

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const quizId = params.quizId as string;
  const [quizData, setQuizData] = useState<QuizAdmin | null | undefined>(undefined); 

  useEffect(() => {
    if (quizId) {
      const fetchQuiz = async () => {
        const data = await storageService.getQuizById(quizId);
        setQuizData(data);
      };
      fetchQuiz();
    }
  }, [quizId]);

  const handleSave = async (data: QuizAdmin) => {
    try {
        const updatedQuiz: QuizAdmin = {
          ...data,
          lastUpdatedAt: new Date().toISOString(),
        };
        await storageService.updateQuiz(updatedQuiz);
        toast({
          title: "Quiz opgeslagen!",
          description: `De wijzigingen voor "${data.title}" zijn opgeslagen.`,
        });
        router.push('/dashboard/admin/quiz-management');
    } catch(e) {
        console.error("Error saving quiz:", e);
        toast({ title: "Fout bij opslaan", description: "Kon de quiz niet opslaan in de database.", variant: "destructive"});
    }
  };

  if (quizData === undefined) {
    return (
       <div className="space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (quizData === null) {
    return <div className="p-8 text-center text-destructive">Quiz niet gevonden. Controleer het ID.</div>;
  }
  
  return <QuizEditForm quizData={quizData} onSave={handleSave} />;
}
