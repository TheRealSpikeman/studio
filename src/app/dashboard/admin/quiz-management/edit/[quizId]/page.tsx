// src/app/dashboard/admin/quiz-management/edit/[quizId]/page.tsx
"use client";

import { QuizEditForm, type QuizFormData } from '@/components/admin/quiz-management/QuizEditForm';
import type { QuizAdmin } from '@/types/quiz-admin'; 
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// This function fetches quiz data from localStorage.
async function fetchQuizData(id: string): Promise<(QuizFormData & {id: string}) | null> {
  console.log("Fetching quiz data for ID:", id);
  // Simulate API call delay for loading states
  await new Promise(resolve => setTimeout(resolve, 100));

  let quiz: QuizAdmin | null = null;
  try {
      const storedQuizData = localStorage.getItem(id);
      if (storedQuizData) {
          console.log("Found quiz in localStorage:", id);
          quiz = JSON.parse(storedQuizData) as QuizAdmin;
      }
  } catch (error) {
      console.error("Error reading quiz from localStorage:", error);
  }

  if (quiz) {
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      audience: quiz.audience,
      category: quiz.category,
      status: quiz.status,
      questions: quiz.questions.map(q => ({ text: q.text, example: q.example || "", weight: q.weight || 1 })),
      subtestConfigs: quiz.subtestConfigs?.map(sc => ({subtestId: sc.subtestId, threshold: sc.threshold})) || [],
      slug: quiz.slug || "",
      metaTitle: quiz.metaTitle || "",
      metaDescription: quiz.metaDescription || "",
      thumbnailUrl: quiz.thumbnailUrl || "",
      analysisDetailLevel: quiz.analysisDetailLevel || 'standaard',
      analysisInstructions: quiz.analysisInstructions || "",
    };
  }
  
  return null; // Return null if not found
}

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const quizId = params.quizId as string;
  const [quizData, setQuizData] = useState<(QuizFormData & {id: string}) | null | undefined>(undefined); 

  useEffect(() => {
    if (quizId) {
      fetchQuizData(quizId).then(data => {
        setQuizData(data);
      });
    }
  }, [quizId]);

  const handleSave = (data: QuizFormData) => {
    console.log("Saving quiz data:", data);
    
    const storedQuizData = JSON.parse(localStorage.getItem(quizId) || '{}');
    const updatedQuiz: QuizAdmin = {
      ...storedQuizData, // Keep original data like createdAt
      id: quizId,
      title: data.title,
      description: data.description,
      audience: data.audience as QuizAdmin['audience'],
      category: data.category as QuizAdmin['category'],
      status: data.status,
      questions: data.questions.map((q, i) => ({ id: `q_${i}`, text: q.text, example: q.example, weight: q.weight })),
      subtestConfigs: data.subtestConfigs,
      slug: data.slug,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      thumbnailUrl: data.thumbnailUrl,
      analysisDetailLevel: data.analysisDetailLevel,
      analysisInstructions: data.analysisInstructions,
      lastUpdatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(quizId, JSON.stringify(updatedQuiz));

    toast({
      title: "Quiz opgeslagen!",
      description: `De wijzigingen voor "${data.title}" zijn opgeslagen.`,
    });
    router.push('/dashboard/admin/quiz-management');
  };

  if (quizData === undefined) {
    return <div className="p-8 text-center">Quizgegevens laden...</div>;
  }

  if (quizData === null) {
    return <div className="p-8 text-center text-destructive">Quiz niet gevonden. Controleer het ID.</div>;
  }
  
  return <QuizEditForm quizData={quizData} onSave={handleSave} />;
}
