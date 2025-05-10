// src/app/dashboard/admin/quiz-management/edit/[quizId]/page.tsx
"use client";

import NewQuizPage from '@/app/dashboard/admin/quiz-management/new/page';
import type { QuizFormData } from '@/app/dashboard/admin/quiz-management/new/page'; 
import type { QuizAdmin } from '@/types/quiz-admin'; 
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// This DUMMY_QUIZZES_FOR_EDIT is for pre-defined examples.
// Dynamically created AI quizzes will be attempted to be loaded from localStorage.
const DUMMY_QUIZZES_FOR_EDIT: (QuizAdmin & {id: string})[] = [
  { 
    id: 'q1', title: 'Basis Neuroprofiel (15-18 jr)', description: 'Algemene neurodiversiteitstest voor oudere tieners.', 
    audience: ['15-18'], category: 'Basis', status: 'published', 
    questions: [{id:'q1a', text:'Vraag 1', weight: 1}, {id:'q1b', text:'Vraag 2', weight: 1}],
    subtestConfigs: [{subtestId: 'ADD', threshold: 2.6}, {subtestId: 'HSP', threshold: 3.1}],
    lastUpdatedAt: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    slug: 'basis-neuro-15-18', metaTitle: 'Basis Neuroprofiel Quiz voor 15-18 jaar', metaDescription: 'Doe de neurodiversiteitstest voor 15-18 jarigen.'
  },
  // ... other pre-defined quizzes
];


async function fetchQuizData(id: string): Promise<(QuizFormData & {id: string}) | null> {
  console.log("Fetching quiz data for ID:", id);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));

  if (id.startsWith('ai-')) {
    let quiz: QuizAdmin | null = null;
    try {
        const storedQuizData = localStorage.getItem(`ai-quiz-${id}`);
        if (storedQuizData) {
            console.log("Found AI quiz in localStorage:", id);
            quiz = JSON.parse(storedQuizData) as QuizAdmin;
        }
    } catch (error) {
        console.error("Error reading AI quiz from localStorage:", error);
        // Quiz not found in localStorage or error parsing, will fallback
    }
    
    if (!quiz) {
        // Fallback to DUMMY_QUIZZES_FOR_EDIT if not in localStorage
        quiz = DUMMY_QUIZZES_FOR_EDIT.find(q => q.id === id) || null;
        if (quiz) {
            console.log("Found AI quiz in DUMMY_QUIZZES_FOR_EDIT:", id);
        }
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
      };
    } else {
      // AI quiz not found in localStorage or predefined dummies
      console.warn(`AI quiz ${id} not found. Editing may not reflect actual generated content if it was dynamically created and not stored/found.`);
      // Return a placeholder structure indicating that the specific AI questions are not available for editing
      return {
          id: id,
          title: `AI Quiz ${id.substring(3, 8)} (Dynamisch gegenereerd)`,
          description: "De specifieke, door AI gegenereerde vragen voor deze quiz zijn niet beschikbaar voor directe bewerking in deze demo. Je kunt de algemene details hieronder aanpassen. Om specifieke vragen te bewerken, genereer de quiz opnieuw of maak de vragen handmatig aan.",
          audience: ['15-18'], 
          category: 'Thema', 
          status: 'concept',
          questions: [{ text: "Bewerk de algemene details van deze AI-quiz. Specifieke vragen zijn hier placeholder.", example: "", weight: 1 }],
          subtestConfigs: [],
          slug: `ai-dynamic-${id.substring(3,8)}`,
          metaTitle: `Bewerk AI Quiz ${id.substring(3,8)}`,
          metaDescription: "Een dynamisch gegenereerde AI quiz.",
          thumbnailUrl: "https://picsum.photos/seed/aidynamicedit/400/200",
      };
    }
  }

  // Handling for non-AI quizzes (original DUMMY_QUIZZES_FOR_EDIT)
  const nonAiQuiz = DUMMY_QUIZZES_FOR_EDIT.find(q => q.id === id);
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
    };
  }
  return null;
}


export default function EditQuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const [quizData, setQuizData] = useState<(QuizFormData & {id: string}) | null | undefined>(undefined); 

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
    return <div className="p-8 text-center text-destructive">Quiz niet gevonden. Controleer het ID of probeer de quiz opnieuw te genereren.</div>;
  }
  
  return <NewQuizPage quizData={quizData} />;
}
