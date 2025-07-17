// src/lib/data/documentation-data.ts
import type { DocumentationPage } from '@/types';
import { Timestamp } from 'firebase/firestore';

// This is the definitive source for the initial documentation pages.
export const MOCK_DOCUMENTATION_PAGES: DocumentationPage[] = [
  {
    id: 'getting-started-ouder',
    title: 'Aan de slag voor Ouders',
    category: 'Accountbeheer',
    tags: ['onboarding', 'ouders', 'account'],
    userRoles: ['ouder'],
    status: 'published',
    viewCount: 150,
    helpfulVotes: { up: 18, down: 1 },
    createdAt: Timestamp.fromDate(new Date('2023-10-01T10:00:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2023-10-10T11:00:00Z')),
    createdBy: 'system',
    structuredContent: {
      themeColor: 'blue',
      sections: [
        {
          iconName: 'UserPlus',
          title: 'Aanmelden van uw kind',
          paragraph: 'Het aanmelden van uw kind op MindNavigator is de eerste stap naar een ondersteunende leeromgeving. Volg deze eenvoudige stappen om een account aan te maken en uw kind toegang te geven tot onze tools en community.',
          points: [
            "Ga naar de MindNavigator website en klik op 'Aanmelden'.",
            "Kies de optie 'Ouder' en vul uw eigen gegevens in.",
            "Maak een apart account aan voor elk kind, gebruik makend van hun eigen e-mailadres (indien van toepassing) of een unieke gebruikersnaam.",
          ],
        },
        {
          iconName: 'ShieldCheck',
          title: 'Account Verificatie',
          paragraph: 'Na de aanmelding is het belangrijk het account te verifiëren. Dit zorgt ervoor dat je kind toegang heeft tot alle functies en updates.',
          points: [
            "Check de inbox van het opgegeven e-mailadres.",
            "Klik op de verificatielink in de e-mail.",
            "Volg de instructies op het scherm om de verificatie te voltooien.",
          ],
        },
      ],
    },
  },
  {
    id: 'privacy-settings-leerling',
    title: 'Jouw Privacy Instellingen',
    category: 'Privacy',
    tags: ['privacy', 'leerling', 'instellingen'],
    userRoles: ['leerling', 'ouder'],
    status: 'published',
    viewCount: 210,
    helpfulVotes: { up: 25, down: 0 },
    createdAt: Timestamp.fromDate(new Date('2023-09-15T14:00:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2023-10-01T15:30:00Z')),
    createdBy: 'system',
    structuredContent: {
      themeColor: 'rose',
      sections: [
        {
          iconName: 'EyeOff',
          title: 'Zichtbaarheid van je Profiel',
          paragraph: 'Bepaal zelf wie jouw voortgang en profiel kan zien. Standaard delen we geen persoonlijke data zonder jouw toestemming.',
          points: [
            "Ga naar 'Instellingen' in je dashboard.",
            "Kies het tabblad 'Privacy'.",
            "Selecteer wie je resultaten mag zien: 'Niemand', 'Alleen mijn Ouders/Tutors', of 'Community (anoniem)'.",
          ],
        },
      ],
    },
  },
];
