// src/app/dashboard/admin/quiz-management/edit/[quizId]/page.tsx
"use client";

import { QuizEditForm, type QuizFormData } from '@/components/admin/quiz-management/QuizEditForm';
import type { QuizAdmin } from '@/types/quiz-admin'; 
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DUMMY_QUIZZES_DATA } from '@/lib/quiz-data/dummy-quizzes';

async function fetchQuizData(id: string): Promise<(QuizFormData & {id: string}) | null> {
  console.log("Fetching quiz data for ID:", id);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));

  if (id.startsWith('ai-quiz-')) {
    let quiz: QuizAdmin | null = null;
    try {
        const storedQuizData = localStorage.getItem(id); // Corrected: key is the full ID
        if (storedQuizData) {
            console.log("Found AI quiz in localStorage:", id);
            quiz = JSON.parse(storedQuizData) as QuizAdmin;
        }
    } catch (error) {
        console.error("Error reading AI quiz from localStorage:", error);
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
    } else {
      console.warn(`AI quiz ${id} not found. Editing may not reflect actual generated content if it was dynamically created and not stored/found.`);
      return null;
    }
  }

  const nonAiQuiz = DUMMY_QUIZZES_DATA.find(q => q.id === id);
  if (nonAiQuiz) {
    return {
        id: nonAiQuiz.id,
        title: nonAiQuiz.title,
        description: nonAiQuiz.description,
        audience: nonAiQuiz.audience,
        category: nonAiQuiz.category,
        status: nonAiQuiz.status,
        questions: nonAiQuiz.questions.map(q => ({ text: q.text, example: q.example || "", weight: q.weight || 1})),
        subtestConfigs: nonAiQuiz.subtestConfigs?.map(sc => ({subtestId: sc.subtestId, threshold: sc.threshold})) || [],
        slug: nonAiQuiz.slug || "",
        metaTitle: nonAiQuiz.metaTitle || "",
        metaDescription: nonAiQuiz.metaDescription || "",
        thumbnailUrl: nonAiQuiz.thumbnailUrl || "",
        analysisDetailLevel: nonAiQuiz.analysisDetailLevel || 'standaard',
        analysisInstructions: nonAiQuiz.analysisInstructions || "",
    };
  }
  return null;
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
    // Here you would typically have logic to save to your backend.
    // For this demo, we can update localStorage for AI quizzes.
    if (quizId.startsWith('ai-quiz-')) {
      const updatedQuiz: QuizAdmin = {
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
        createdAt: (quizData as any)?.createdAt || new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      };
      localStorage.setItem(quizId, JSON.stringify(updatedQuiz)); // Corrected: key is the quizId itself
    }
    toast({
      title: "Quiz opgeslagen!",
      description: `De wijzigingen voor "${data.title}" zijn opgeslagen (simulatie).`,
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
