// src/lib/quiz-data/dummy-quizzes.ts
import type { QuizAdmin } from '@/types/quiz-admin';

export const DUMMY_QUIZZES_DATA: QuizAdmin[] = [
  { 
    id: 'teen-neuro-15-18', 
    title: 'Basis Zelfreflectie (15-18 jr)', 
    description: 'Algemene neurodiversiteitstest voor oudere tieners, ontdek jouw unieke eigenschappen.', 
    audience: ['Tiener (15-18 jr, voor zichzelf)'], 
    category: 'Basis', 
    status: 'published', 
    questions: [
        {id:'q_tn_1518_1', text:'Ik merk dat mijn gedachten afdwalen, zelfs als ik probeer te focussen op schoolwerk.', weight: 2}, 
        {id:'q_tn_1518_2', text:'Na een lange schooldag heb ik echt tijd nodig om bij te komen.', weight: 1},
        {id:'q_tn_1518_3', text:'Ik voel me snel overweldigd in drukke plekken zoals de kantine.', weight: 3}
    ],
    subtestConfigs: [{subtestId: 'ADD', threshold: 2.6}, {subtestId: 'HSP', threshold: 3.1}],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    slug: 'basis-neuro-15-18', 
    metaTitle: 'Basis Neuroprofiel Quiz (15-18 jaar)', 
    metaDescription: 'Doe de neurodiversiteitstest voor 15-18 jarigen.',
    thumbnailUrl: 'https://picsum.photos/seed/teenquiz1518/400/200',
    analysisDetailLevel: 'standaard',
    analysisInstructions: 'Focus op het geven van concrete, leeftijdsspecifieke tips voor 15-18 jarigen.',
  },
  { 
    id: 'teen-neuro-12-14', 
    title: 'Basis Zelfreflectie (12-14 jr)', 
    description: 'Speciaal voor 12-14 jaar, ontdek jouw unieke eigenschappen.', 
    audience: ['Tiener (12-14 jr, voor zichzelf)'], 
    category: 'Basis', 
    status: 'published', 
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
    id: 'ouder-ken-je-kind-6-11', 
    title: 'Ken je Kind (6-11 jr)', 
    description: 'Vragenlijst voor ouders om gedrag en kenmerken van hun kind (6-11 jr) beter te begrijpen.', 
    audience: ['Ouder (over kind 6-11 jr)'], 
    category: 'Ouder Observatie', 
    status: 'concept', 
    questions: [
        {id:'q_okk_611_1', text:'Hoe vaak merkt u dat uw kind moeite heeft met stilzitten tijdens maaltijden of rustige activiteiten?', weight: 1}, 
        {id:'q_okk_611_2', text:'In welke mate lijkt uw kind details op te merken die anderen vaak ontgaan?', weight: 2},
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    slug: 'ken-je-kind-6-11',
    thumbnailUrl: 'https://picsum.photos/seed/kenjekind611/400/200',
    analysisDetailLevel: 'standaard',
  },
  { 
    id: 'exam-stress-planning', 
    title: 'Examenvrees & Planning (Tieners)', 
    description: 'Leer stress te beheersen en je planning scherp te houden voor examens.', 
    audience: ['Tiener (15-18 jr, voor zichzelf)', 'Tiener (12-14 jr, voor zichzelf)'], 
    category: 'Thema', 
    status: 'concept', 
    questions: [
      {id:'q_esp_1', text:'Maak je je veel zorgen over toetsen, zelfs als je goed hebt geleerd?', weight: 3},
      {id:'q_esp_2', text:'Vind je het moeilijk om te beginnen met een examen?', weight: 2}
    ],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 5).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    slug: 'examenvrees-planning-quiz',
    thumbnailUrl: 'https://picsum.photos/seed/examstress/400/200',
    analysisDetailLevel: 'beknopt',
    analysisInstructions: 'Houd de analyse over examenvrees kort en to-the-point.',
  },
  { 
    id: 'focus-digital-distraction', 
    title: 'Focus & Digitale Afleiding (Alle)', 
    description: 'Ontdek hoe social media en andere digitale afleidingen je concentratie beïnvloeden.', 
    audience: ['Algemeen (alle leeftijden, voor zichzelf)'], 
    category: 'Thema', 
    status: 'published', 
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
];
