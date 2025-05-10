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
    questions: [{id:'q1a', text:'Vraag 1', weight: 1}, {id:'q1b', text:'Vraag 2', weight: 1}],
    subtestConfigs: [{subtestId: 'ADD', threshold: 2.6}, {subtestId: 'HSP', threshold: 3.1}],
    lastUpdatedAt: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    slug: 'basis-neuro-15-18', metaTitle: 'Basis Neuroprofiel Quiz voor 15-18 jaar', metaDescription: 'Doe de neurodiversiteitstest voor 15-18 jarigen.'
  },
  { 
    id: 'q2', title: 'Examenvrees Check', description: 'Quiz over omgaan met examenstress.', 
    audience: ['15-18', '12-14'], category: 'Thema', status: 'concept', 
    questions: [{id:'q2a', text:'Hoe voel je je vlak voor een belangrijk examen?', weight: 2}],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    slug: 'examenvrees-check', metaTitle: 'Examenvrees Check Quiz', metaDescription: 'Test je niveau van examenstress.'
  },
  { 
    id: 'q3', title: 'Focus Test (12-14 jr)', description: 'Concentratiecheck voor jongere tieners.', 
    audience: ['12-14'], category: 'ADD', status: 'published', 
    questions: [
        {id:'q3a', text:'Raak je snel afgeleid tijdens het maken van huiswerk?', weight: 1},
        {id:'q3b', text:'Vergeet je vaak wat je net gelezen hebt?', weight: 1}
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

  if (id.startsWith('ai-')) {
    // Return a generic AI-generated quiz structure for editing
    // This is a placeholder as the actual generated content is not persisted across pages in this dummy setup
    const aiQuizIdSuffix = id.substring(3); // Extract the part after 'ai-'
    // Find the AI generated quiz from the DUMMY_QUIZZES list if it was added there by page.tsx
    // This part is tricky because the main list is in another component. For now, we'll generate new dummy AI data.
    const tempAiQuiz = DUMMY_QUIZZES_FOR_EDIT.find(q => q.id === id) || 
    {
        id: id,
        title: `AI Gegenereerde Quiz ${aiQuizIdSuffix.substring(0, 5)}... (Bewerk)`,
        description: "Pas de details van deze AI-gegenereerde quiz aan. De oorspronkelijke AI-gegenereerde content is hier niet beschikbaar voor bewerking in deze demo-omgeving, tenzij eerder opgeslagen.",
        audience: ['15-18'], 
        category: 'Thema', 
        status: 'concept',
        questions: Array.from({ length: 5 }, (_, i) => ({ 
            id: `ai-q${i+1}-${Date.now()}`,
            text: `Voorbeeld AI Vraag ${i + 1}: Pas deze vraag aan.`, 
            example: "Voeg hier een voorbeeld of toelichting toe.", 
            weight: (i % 3) + 1 
        })),
        subtestConfigs: [],
        slug: `ai-gegenereerde-quiz-${aiQuizIdSuffix}`,
        metaTitle: `Bewerk AI Quiz ${aiQuizIdSuffix.substring(0,5)}`,
        metaDescription: "Een door AI gegenereerde quiz, klaar om bewerkt te worden.",
        thumbnailUrl: "https://picsum.photos/seed/aiquizthumb/400/200",
    };
    
    return {
        id: tempAiQuiz.id,
        title: tempAiQuiz.title,
        description: tempAiQuiz.description,
        audience: tempAiQuiz.audience,
        category: tempAiQuiz.category,
        status: tempAiQuiz.status,
        questions: tempAiQuiz.questions.map(q => ({ text: q.text, example: q.example || "", weight: q.weight || 1 })),
        subtestConfigs: tempAiQuiz.subtestConfigs?.map(sc => ({subtestId: sc.subtestId, threshold: sc.threshold})) || [],
        slug: tempAiQuiz.slug || "",
        metaTitle: tempAiQuiz.metaTitle || "",
        metaDescription: tempAiQuiz.metaDescription || "",
        thumbnailUrl: tempAiQuiz.thumbnailUrl || "",
    };
  }

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
        questions: quiz.questions.map(q => ({ text: q.text, example: q.example || "", weight: q.weight || 1})), // Ensure weight is passed
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
