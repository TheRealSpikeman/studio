// services/documentationService.ts

// Define the structure for our content blocks
export interface ContentBlock {
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'info';
  content: string | string[]; // string for most, string[] for lists
  language?: 'sql' | 'typescript' | 'bash'; // Optional for code blocks
  metadata?: {
    tags?: string[];
    faq_question?: string; // Explicitly for FAQ generation
    targetAudiences?: ('ouder' | 'leerling' | 'tutor' | 'coach' | 'admin' | 'public')[];
  }
}

// Define the structure for a full documentation page
export interface DocumentationPage {
  id: string;
  title: string;
  content: ContentBlock[];
  metadata?: {
      tags?: string[];
      targetAudiences?: ('ouder' | 'leerling' | 'tutor' | 'coach' | 'admin' | 'public')[];
  }
}

// Mock data, now including the FAQ for coaches and tutors
let MOCK_DOCUMENTATION_PAGES: DocumentationPage[] = [
  {
    id: 'platform-handleiding',
    title: 'Platform Handleiding',
    content: [
      // ... platform handleiding content
    ],
    metadata: {
        targetAudiences: ['admin']
    }
  },
  {
      id: 'faq-coaches',
      title: 'Veelgestelde Vragen voor Coaches',
      content: [
          // ... coach faq content
      ],
      metadata: {
          tags: ['faq', 'coach'],
          targetAudiences: ['coach', 'admin', 'public']
      }
  },
  {
      id: 'faq-tutors',
      title: 'Veelgestelde Vragen voor Tutors',
      content: [
          {
              type: 'heading',
              content: 'Wat is het aanmeldproces als tutor?',
              metadata: { faq_question: 'Wat is het aanmeldproces als tutor?' }
          },
          {
              type: 'paragraph',
              content: 'Het aanmeldproces bestaat uit een paar stappen. Eerst vul je op onze "Word Tutor" pagina je naam en e-mailadres in. Je ontvangt dan een e-mail met een tijdelijk wachtwoord en een link om in te loggen. Na je eerste login doorloop je een korte wizard waarin je je definitieve wachtwoord instelt, je vakken en uurtarief kiest, je CV en VOG uploadt, en je beschikbaarheid opgeeft. Zodra je profiel compleet is, wordt het door ons team beoordeeld. Dit duurt meestal 1-2 werkdagen. Na goedkeuring is je account actief en kun je starten met het geven van bijles!'
          },
          {
              type: 'heading',
              content: 'Hoe werkt de 10% servicekost?',
              metadata: { faq_question: 'Hoe werkt de 10% servicekost?' }
          },
          {
              type: 'paragraph',
              content: 'MindNavigator faciliteert het platform, de administratie en de betalingen. Voor deze service rekenen we 10% over het door jou ingestelde uurtarief. Bijvoorbeeld: als jij €20 per uur vraagt, ontvang jij €18 en gaat €2 naar MindNavigator.'
          },
          {
              type: 'heading',
              content: 'Hoe wordt mijn VOG behandeld?',
              metadata: { faq_question: 'Hoe wordt mijn VOG behandeld?' }
          },
          {
              type: 'paragraph',
              content: 'Je Verklaring Omtrent Gedrag (VOG) wordt vertrouwelijk behandeld en alleen gebruikt ter verificatie. We slaan deze veilig op conform de AVG-richtlijnen. Het is een vereiste om de veiligheid van onze leerlingen te waarborgen.'
          },
          {
              type: 'heading',
              content: 'Kan ik mijn eigen uren en tarief bepalen?',
              metadata: { faq_question: 'Kan ik mijn eigen uren en tarief bepalen?' }
          },
          {
              type: 'paragraph',
              content: 'Ja, absoluut! Je bent volledig vrij in het bepalen van je uurtarief en de momenten waarop je beschikbaar bent. Dit kun je te allen tijde aanpassen in je tutor-profiel na goedkeuring.'
          }
      ],
      metadata: {
          tags: ['faq', 'tutor'],
          targetAudiences: ['tutor', 'admin', 'public']
      }
  }
];

/**
 * Fetches a single documentation page by its ID from the mock data.
 * @param {string} id - The ID of the documentation page to fetch.
 * @returns {Promise<DocumentationPage | null>} A promise that resolves to the page object or null if not found.
 */
export const getDocumentationPage = async (id: string): Promise<DocumentationPage | null> => {
  const page = MOCK_DOCUMENTATION_PAGES.find(p => p.id === id);
  return page ? Promise.resolve(page) : Promise.resolve(null);
};

/**
 * Updates a documentation page's content in the mock data.
 * @param {string} id - The ID of the page to update.
 * @param {ContentBlock[]} content - The new content for the page.
 * @returns {Promise<DocumentationPage | null>} A promise that resolves to the updated page or null if not found.
 */
export const updateDocumentationPage = async (id: string, content: ContentBlock[]): Promise<DocumentationPage | null> => {
    const pageIndex = MOCK_DOCUMENTATION_PAGES.findIndex(p => p.id === id);
    if (pageIndex !== -1) {
        MOCK_DOCUMENTATION_PAGES[pageIndex].content = content;
        return Promise.resolve(MOCK_DOCUMENTATION_PAGES[pageIndex]);
    }
    return Promise.resolve(null);
}

/**
 * Extracts content blocks that are marked as FAQ questions.
 * @param {DocumentationPage} page - The documentation page to extract FAQs from.
 * @returns {ContentBlock[]} An array of content blocks that are FAQ questions.
 */
export const getFaqBlocks = (page: DocumentationPage): ContentBlock[] => {
    return page.content.filter(block => block.metadata?.faq_question);
}
