// src/app/dashboard/admin/quiz-management/edit/[quizId]/page.tsx
"use client";

import NewQuizPage from '@/app/dashboard/admin/quiz-management/new/page';
import type { QuizFormData } from '@/app/dashboard/admin/quiz-management/new/page'; // Ensure QuizFormData is exported
import type { QuizAdmin } from '@/types/quiz-admin'; // Assuming this type exists
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Updated dummy quizzes to match more closely with the main quiz list
const DUMMY_QUIZZES_FOR_EDIT: (QuizAdmin & {id: string})[] = [
  { 
    id: 'q1', title: 'Basis Neuroprofiel (15-18 jr)', description: 'Algemene neurodiversiteitstest voor oudere tieners.', 
    audience: ['15-18'], category: 'Basis', status: 'published', 
    questions: [{id:'q1a', text:'Vraag 1'}, {id:'q1b', text:'Vraag 2'}],
    subtestConfigs: [{subtestId: 'ADD', threshold: 2.6}, {subtestId: 'HSP', threshold: 3.1}],
    lastUpdatedAt: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    slug: 'basis-neuro-15-18', metaTitle: 'Basis Neuroprofiel Quiz voor 15-18 jaar', metaDescription: 'Doe de neurodiversiteitstest voor 15-18 jarigen.'
  },
  { 
    id: 'q2', title: 'Examenvrees Check', description: 'Quiz over omgaan met examenstress.', 
    audience: ['15-18', '12-14'], category: 'Thema', status: 'concept', 
    questions: [{id:'q2a', text:'Hoe voel je je vlak voor een belangrijk examen?'}],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    slug: 'examenvrees-check', metaTitle: 'Examenvrees Check Quiz', metaDescription: 'Test je niveau van examenstress.'
  },
  { 
    id: 'q3', title: 'Focus Test (12-14 jr)', description: 'Concentratiecheck voor jongere tieners.', 
    audience: ['12-14'], category: 'ADD', status: 'published', 
    questions: [
        {id:'q3a', text:'Raak je snel afgeleid tijdens het maken van huiswerk?'},
        {id:'q3b', text:'Vergeet je vaak wat je net gelezen hebt?'}
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 10).toISOString(), createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    slug: 'focus-test-12-14', metaTitle: 'Focus Test voor 12-14 Jaar', metaDescription: 'Doe de concentratiecheck.'
  },
];


// Dummy function to simulate fetching quiz data
async function fetchQuizData(id: string): Promise<(QuizFormData & {id: string}) | null> {
  console.log("Fetching quiz data for ID:", id);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

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

