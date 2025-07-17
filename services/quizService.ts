// services/quizService.ts
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import type { QuizAdmin } from '@/types/quiz-admin';

// This data is now self-contained within the service, acting as a mock database.
// This allows us to remove the original `default-quizzes.ts` file.
const MOCK_QUIZZES: QuizAdmin[] = [
  {
    id: 'teen-neurodiversity-quiz-15-18-default',
    title: 'Zelfreflectie Start (15-18 jr)',
    description: 'Een startpunt voor jongeren om hun unieke eigenschappen en denkstijl te verkennen.',
    audience: 'Tiener (15-18 jr, voor zichzelf)',
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
    settings: {
      showRecommendedTools: true,
      accessibility: {
        isPublic: true
      }
    }
  },
  {
    id: 'exam-stress-quiz-default',
    title: 'Omgaan met Examenvrees',
    description: 'Verken strategieën om stress rondom toetsen en examens te beheersen.',
    audience: 'Tiener (15-18 jr, voor zichzelf)',
    category: 'Thema',
    status: 'published',
    questions: [
      { id: 'q1', text: 'Ik maak me al weken voor een belangrijke toets zorgen.', weight: 1 },
      { id: 'q2', text: 'Tijdens een toets heb ik soms een black-out, ook al heb ik goed heb geleerd.', weight: 2 },
      { id: 'q3', text: 'Ik vermijd het om over mijn toetsresultaten te praten.', weight: 1 },
    ],
    lastUpdatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    slug: 'omgaan-met-examenvrees',
    settings: {
      showRecommendedTools: false,
      accessibility: {
        isPublic: true,
        allowedPlans: [],
      }
    }
  },
  {
    id: 'ouder-ken-je-kind-quiz',
    title: 'Ken Je Kind: Basis Observatie',
    description: 'Een vragenlijst om gedrag en leerstijl van een kind te observeren.',
    descriptionForParent: 'Beantwoord de vragen vanuit uw perspectief als ouder. Dit helpt om patronen te herkennen en biedt een basis voor een vergelijkende analyse met de zelfreflectie van uw kind.',
    audience: 'Ouder (over kind 12-18 jr)',
    category: 'Ouder Observatie',
    status: 'published',
    questions: [
      { id: 'pq1', text: 'Hoe vaak observeert u dat uw kind moeite heeft met het starten van schooltaken?', weight: 1 },
      { id: 'pq2', text: 'In welke mate lijkt uw kind gevoelig voor drukke of lawaaierige omgevingen?', weight: 1 },
      { id: 'pq3', text: 'Hoe vaak zoekt uw kind sociale interactie op met leeftijdsgenoten uit eigen initiatief?', weight: 2 },
    ],
    lastUpdatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    slug: 'ken-je-kind-observatie',
    thumbnailUrl: 'https://placehold.co/400x225.png?text=Ken+Je+Kind',
    settings: {
      showRecommendedTools: false,
      accessibility: {
        isPublic: true,
      },
      resultPresentation: {
          showToParent: true,
          format: 'visual_report_with_cta',
          showChart: false,
          showParentalCta: true,
      }
    }
  },
  // Add other quizzes here...
];


/**
 * Fetches all available quizzes.
 * @returns {Promise<QuizAdmin[]>} A promise that resolves to an array of all quizzes.
 */
export const getQuizzes = async (): Promise<QuizAdmin[]> => {
  if (!isFirebaseConfigured || !db) {
    console.warn("Firebase not configured. Returning local mock data for quizzes.");
    return MOCK_QUIZZES;
  }
  try {
    const quizzesCollectionRef = collection(db, "quizzes");
    const q = query(quizzesCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return MOCK_QUIZZES; // Fallback to mock data if Firestore is empty
    }
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as QuizAdmin));
  } catch (error) {
    console.error("Error fetching quizzes from Firestore, falling back to mock data:", error);
    return MOCK_QUIZZES;
  }
};

/**
 * Fetches a single quiz by its unique slug.
 * @param {string} slug - The slug of the quiz to fetch.
 * @returns {Promise<QuizAdmin | null>} A promise that resolves to the quiz object or null if not found.
 */
export const getQuizBySlug = async (slug: string): Promise<QuizAdmin | null> => {
  const allQuizzes = await getQuizzes(); // This now handles the fallback internally
  const quiz = allQuizzes.find(q => q.slug === slug);
  return quiz || null;
};

/**
 * Fetches a single quiz by its ID.
 * @param {string} id - The ID of the quiz to fetch.
 * @returns {Promise<QuizAdmin | null>} A promise that resolves to the quiz object or null if not found.
 */
export const getQuizById = async (id: string): Promise<QuizAdmin | null> => {
    const allQuizzes = await getQuizzes(); // This now handles the fallback internally
    const quiz = allQuizzes.find(q => q.id === id);
    return quiz || null;
};
