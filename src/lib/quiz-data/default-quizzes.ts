// src/lib/quiz-data/default-quizzes.ts
import type { QuizAdmin } from '@/types/quiz-admin';

export const DEFAULT_QUIZZES: QuizAdmin[] = [
  {
    id: 'teen-neurodiversity-quiz-15-18-default',
    title: 'Zelfreflectie Start (15-18 jr)',
    description: 'Een startpunt voor jongeren om hun unieke eigenschappen en denkstijl te verkennen.',
    audience: ['Tiener (15-18 jr, voor zichzelf)'],
    category: 'Basis',
    status: 'published',
    questions: [
      { id: 'q1', text: 'Ik merk dat mijn gedachten afdwalen, zelfs als ik probeer te focussen op schoolwerk.', weight: 1 },
      { id: 'q2', text: 'Ik moet bladzijdes of opdrachten vaak opnieuw lezen omdat ik niet oplet wat ik lees.', weight: 1 },
      { id: 'q3', text: 'Kleine afleidingen zoals tikkende pennen verstoren mijn concentratie volledig.', weight: 2 },
      { id: 'q4', text: 'Ik voel me onrustig als ik lang stil moet zitten in de klas.', weight: 1 },
      { id: 'q5', text: 'Ik flap weleens dingen eruit voordat mijn beurt is of zonder er goed over na te denken.', weight: 2 },
    ],
    lastUpdatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    slug: 'zelfreflectie-start-15-18',
    showRecommendedTools: true,
  },
  {
    id: 'exam-stress-quiz-default',
    title: 'Omgaan met Examenvrees',
    description: 'Verken strategieën om stress rondom toetsen en examens te beheersen.',
    audience: ['Tiener (12-14 jr, voor zichzelf)', 'Tiener (15-18 jr, voor zichzelf)'],
    category: 'Thema',
    status: 'concept',
    questions: [
      { id: 'q1', text: 'Ik maak me al weken voor een belangrijke toets zorgen.', weight: 1 },
      { id: 'q2', text: 'Tijdens een toets heb ik soms een black-out, ook al heb ik goed geleerd.', weight: 2 },
      { id: 'q3', text: 'Ik vermijd het om over mijn toetsresultaten te praten.', weight: 1 },
    ],
    lastUpdatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    slug: 'omgaan-met-examenvrees',
    showRecommendedTools: false,
  }
];
