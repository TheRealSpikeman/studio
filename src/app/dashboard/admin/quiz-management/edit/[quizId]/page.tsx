// src/app/dashboard/admin/quiz-management/edit/[quizId]/page.tsx
"use client";

import ManualNewQuizPage from '@/app/dashboard/admin/quiz-management/new/manual/page'; // Aangepaste import
import type { QuizFormData } from '@/app/dashboard/admin/quiz-management/new/manual/page'; // Aangepaste import
import type { QuizAdmin } from '@/types/quiz-admin'; 
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// This DUMMY_QUIZZES_FOR_EDIT should contain all quizzes that are listed on the quiz-management page and are not AI-generated.
// It should mirror the DUMMY_QUIZZES from quiz-management/page.tsx
const DUMMY_QUIZZES_FOR_EDIT: (QuizAdmin & {id: string})[] = [
  { 
    id: 'teen-neuro-15-18', title: 'Basis Neuroprofiel (15-18 jr)', 
    description: 'Algemene neurodiversiteitstest voor oudere tieners, ontdek jouw unieke eigenschappen.', 
    audience: ['Tiener (15-18 jr, voor zichzelf)'], category: 'Basis', status: 'published', 
    questions: [
        {id:'q_tn_1518_1', text:'Ik merk dat mijn gedachten afdwalen, zelfs als ik probeer te focussen op schoolwerk.', weight: 2}, 
        {id:'q_tn_1518_2', text:'Na een lange schooldag heb ik echt tijd nodig om bij te komen.', weight: 1},
        {id:'q_tn_1518_3', text:'Ik voel me snel overweldigd in drukke plekken zoals de kantine.', weight: 3}
    ],
    subtestConfigs: [{subtestId: 'ADD', threshold: 2.6}, {subtestId: 'HSP', threshold: 3.1}],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    slug: 'basis-neuro-15-18', metaTitle: 'Basis Neuroprofiel Quiz (15-18 jaar)', metaDescription: 'Doe de neurodiversiteitstest voor 15-18 jarigen.',
    thumbnailUrl: 'https://picsum.photos/seed/teenquiz1518/400/200',
    analysisDetailLevel: 'standaard',
    analysisInstructions: 'Focus op het geven van concrete, leeftijdsspecifieke tips voor 15-18 jarigen.',
  },
  { 
    id: 'teen-neuro-12-14', title: 'Basis Neuroprofiel (12-14 jr)', 
    description: 'Speciaal voor 12-14 jaar, ontdek jouw unieke eigenschappen.', 
    audience: ['Tiener (12-14 jr, voor zichzelf)'], category: 'Basis', status: 'published', 
    questions: [
      {id:'q_tn_1214_1', text:'Dwalen je gedachten makkelijk af als je je probeert te concentreren?', weight: 2},
      {id:'q_tn_1214_2', text:'Heb je na een drukke schooldag tijd voor jezelf nodig om bij te komen?', weight: 1}
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 3).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    slug: 'basis-neuro-12-14',
    thumbnailUrl: 'https://picsum.photos/seed/teenquiz1214/400/200',
    analysisDetailLevel: 'standaard',
  },
  { 
    id: 'exam-stress-planning', title: 'Examenvrees & Planning', 
    description: 'Leer stress te beheersen en je planning scherp te houden voor examens.', 
    audience: ['Tiener (15-18 jr, voor zichzelf)', 'Tiener (12-14 jr, voor zichzelf)'], category: 'Thema', status: 'concept', 
    questions: [
      {id:'q_esp_1', text:'Maak je je veel zorgen over toetsen, zelfs als je goed hebt geleerd?', weight: 3},
      {id:'q_esp_2', text:'Vind je het moeilijk om te beginnen met leren voor een examen?', weight: 2}
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 5).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    slug: 'examenvrees-planning-quiz',
    thumbnailUrl: 'https://picsum.photos/seed/examstress/400/200',
    analysisDetailLevel: 'beknopt',
    analysisInstructions: 'Houd de analyse over examenvrees kort en to-the-point.',
  },
  { 
    id: 'focus-digital-distraction', title: 'Focus & Digitale Afleiding', 
    description: 'Ontdek hoe social media en andere digitale afleidingen je concentratie beïnvloeden.', 
    audience: ['Tiener (12-14 jr, voor zichzelf)', 'Tiener (15-18 jr, voor zichzelf)', 'Algemeen (alle leeftijden, voor zichzelf)'], category: 'Thema', status: 'published', 
    questions: [
      {id:'q_fdd_1', text:'Raak je snel afgeleid door meldingen op je telefoon tijdens het huiswerk?', weight: 1},
      {id:'q_fdd_2', text:'Hoe vaak controleer je social media terwijl je eigenlijk zou moeten studeren?', weight: 2}
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    slug: 'focus-digitale-afleiding',
    thumbnailUrl: 'https://picsum.photos/seed/digitalfocus/400/200',
    analysisDetailLevel: 'uitgebreid',
  },
   { 
    id: 'social-anxiety-friendships', title: 'Sociale Angst & Vriendschap', 
    description: 'Verken hoe je je voelt in sociale situaties en bij het maken van vrienden.', 
    audience: ['Tiener (12-14 jr, voor zichzelf)', 'Tiener (15-18 jr, voor zichzelf)', 'Algemeen (alle leeftijden, voor zichzelf)'], category: 'Thema', status: 'concept', 
    questions: [
        {id:'q_saf_1', text:'Vind je het spannend om nieuwe mensen te ontmoeten?', weight: 2},
        {id:'q_saf_2', text:'Maak je je zorgen over wat anderen van je denken in een groep?', weight: 3}
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 6).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    slug: 'sociale-angst-vriendschap',
    thumbnailUrl: 'https://picsum.photos/seed/socialanxiety/400/200',
    analysisDetailLevel: 'standaard',
  },
  { 
    id: 'motivation-goals', title: 'Motivatie & Doelen Stellen', 
    description: 'Leer hoe je gemotiveerd blijft en effectieve doelen kunt stellen voor jezelf.', 
    audience: ['Tiener (12-14 jr, voor zichzelf)', 'Tiener (15-18 jr, voor zichzelf)', 'Algemeen (alle leeftijden, voor zichzelf)'], category: 'Thema', status: 'published', 
    questions: [
        {id:'q_md_1', text:'Vind je het moeilijk om gemotiveerd te blijven voor schoolwerk dat je niet leuk vindt?', weight: 1},
        {id:'q_md_2', text:'Stel je vaak doelen voor jezelf, maar vind je het lastig om ze te bereiken?', weight: 2}
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 4).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    slug: 'motivatie-doelen-quiz',
    thumbnailUrl: 'https://picsum.photos/seed/motivationgoals/400/200'
  },
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
    }
    
    if (!quiz) {
        quiz = DUMMY_QUIZZES_FOR_EDIT.find(q => q.id === id) || null;
        if (quiz) {
            console.log("Found AI quiz in DUMMY_QUIZZES_FOR_EDIT (this should be rare):", id);
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
        analysisDetailLevel: quiz.analysisDetailLevel || 'standaard',
        analysisInstructions: quiz.analysisInstructions || "",
      };
    } else {
      console.warn(`AI quiz ${id} not found. Editing may not reflect actual generated content if it was dynamically created and not stored/found.`);
      return null;
    }
  }

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
        analysisDetailLevel: nonAiQuiz.analysisDetailLevel || 'standaard',
        analysisInstructions: nonAiQuiz.analysisInstructions || "",
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
  
  return <ManualNewQuizPage quizData={quizData} />;
}
