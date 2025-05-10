// src/app/dashboard/admin/quiz-management/edit/[quizId]/page.tsx
"use client";

import NewQuizPage from '@/app/dashboard/admin/quiz-management/new/page';
import type { QuizFormData } from '@/app/dashboard/admin/quiz-management/new/page'; // Ensure QuizFormData is exported
import type { QuizAdmin } from '@/types/quiz-admin'; // Assuming this type exists
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Dummy function to simulate fetching quiz data
async function fetchQuizData(id: string): Promise<(QuizFormData & {id: string}) | null> {
  console.log("Fetching quiz data for ID:", id);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  const DUMMY_QUIZZES_FOR_EDIT: (QuizAdmin & {id: string})[] = [ // Use QuizAdmin here
    { 
      id: 'q1', title: 'Basis Neuroprofiel (15-18 jr) - Bewerkt', description: 'Algemene neurodiversiteitstest voor oudere tieners, bewerkte versie.', 
      audience: ['15-18'], category: 'Basis', status: 'published', 
      questions: [{id: 'q1a', text:'Vraag 1 - Aangepast'}, {id: 'q1b', text:'Vraag 2 - Herformulering'}],
      subtestConfigs: [{subtestId: 'ADD', threshold: 2.6}, {subtestId: 'HSP', threshold: 3.1}],
      lastUpdatedAt: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      slug: 'basis-neuro-15-18-edit', metaTitle: 'Bewerkte Quiz Titel', metaDescription: 'Dit is een bewerkte meta omschrijving.'
    },
  ];
  const quiz = DUMMY_QUIZZES_FOR_EDIT.find(q => q.id === id);
  if (quiz) {
    // Map QuizAdmin to QuizFormData
    return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        audience: quiz.audience,
        category: quiz.category,
        status: quiz.status,
        questions: quiz.questions.map(q => ({ text: q.text, example: q.example || ""})), // Ensure example is string
        subtestConfigs: quiz.subtestConfigs?.map(sc => ({subtestId: sc.subtestId, threshold: sc.threshold})) || [],
        slug: quiz.slug || "",
        metaTitle: quiz.metaTitle || "",
        metaDescription: quiz.metaDescription || "",
        thumbnailUrl: quiz.thumbnailUrl || "",
    };
  }
  return null;
}


export default function EditQuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const [quizData, setQuizData] = useState<(QuizFormData & {id: string}) | null | undefined>(undefined); // undefined for loading state

  useEffect(() => {
    if (quizId) {
      fetchQuizData(quizId).then(data => {
        setQuizData(data);
      });
    }
  }, [quizId]);

  if (quizData === undefined) {
    return <div className="p-8 text-center">Quizgegevens laden...</div>;
  }

  if (quizData === null) {
    return <div className="p-8 text-center text-destructive">Quiz niet gevonden. Controleer het ID.</div>;
  }
  
  return <NewQuizPage quizData={quizData} />;
}
