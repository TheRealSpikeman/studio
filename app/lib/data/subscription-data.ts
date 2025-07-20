
// src/lib/data/subscription-data.ts
import type { SubscriptionPlan, PlatformTool } from '@/types/subscription';

// New source of truth for all tools available on the platform.
// This is now separate from the subscription plans.
export const DEFAULT_PLATFORM_TOOLS: PlatformTool[] = [
    { id: 'full-access-tools', label: 'Volledige toegang tot alle zelfreflectie-instrumenten', description: 'Ontgrendel alle quizzen en tests om een compleet beeld te krijgen.', targetAudience: ['leerling'], category: 'Core' },
    { id: 'daily-coaching', label: 'Dagelijkse coaching en motivatie', description: 'Ontvang elke dag persoonlijke tips, affirmaties en micro-taken.', targetAudience: ['leerling'], category: 'Coaching' },
    { id: 'homework-tools', label: 'Huiswerk- en planningstools', description: 'Gebruik tools zoals de Focus Timer en slimme planners.', targetAudience: ['leerling'], category: 'Tools' },
    { id: 'progress-reports', label: 'Persoonlijke voortgangsrapporten', description: 'Volg de ontwikkeling en groei over tijd met gedetailleerde rapportages.', targetAudience: ['leerling', 'ouder'], category: 'Analyse' },
    { id: 'parent-dashboard', label: 'Ouder-dashboard met inzichten', description: 'Krijg als ouder inzicht en tools om uw kind optimaal te ondersteunen.', targetAudience: ['ouder'], category: 'Ouder Portaal' },
    { id: 'expert-network', label: 'Toegang tot expert netwerk', description: 'Vind, boek en communiceer met gekwalificeerde tutors en coaches.', targetAudience: ['ouder'], category: 'Begeleiding' },
];

// New subscription plans according to the brief
export const initialDefaultPlans: SubscriptionPlan[] = [
  {
    id: 'free_start',
    name: 'Gratis Start',
    shortName: 'Gratis',
    description: 'Doe de basis assessment en krijg een eerste inzicht in jouw unieke profiel. Ideaal om te starten.',
    price: 0,
    currency: 'EUR',
    billingInterval: 'once',
    maxParents: 1,
    maxChildren: 1, // Adjusted based on latest user feedback/image
    active: true,
    trialPeriodDays: 0,
    isPopular: false,
  },
  {
    id: 'gezin_1_kind_maand',
    name: 'Gezins Gids (1 Kind)',
    shortName: '1 Kind',
    tagline: 'Perfect voor een gericht begin.',
    description: 'Alle tools en het ouder-dashboard voor één kind. Ideaal voor gerichte ondersteuning.',
    price: 15.00,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 10,
    maxParents: 2,
    maxChildren: 1,
    active: true,
    trialPeriodDays: 14,
    isPopular: false,
  },
  {
    id: 'gezin_2_kinderen_maand',
    name: 'Gezins Gids (2 Kinderen)',
    shortName: '2 Kinderen',
    tagline: 'De meest gekozen optie.',
    description: 'Volledige toegang voor twee kinderen, inclusief alle ouder-functionaliteiten.',
    price: 27.00,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 10,
    maxParents: 2,
    maxChildren: 2,
    active: true,
    trialPeriodDays: 14,
    isPopular: true,
  },
   {
    id: 'gezin_plus_maand',
    name: 'Gezins Gids+ (3+ Kinderen)',
    shortName: '3+ Kinderen',
    tagline: 'Voor grotere gezinnen.',
    description: 'De beste waarde voor grotere gezinnen, met ondersteuning voor maximaal 4 kinderen.',
    price: 35.00,
    currency: 'EUR',
    billingInterval: 'month',
    yearlyDiscountPercent: 10,
    maxParents: 2,
    maxChildren: 4,
    active: true,
    trialPeriodDays: 14,
    isPopular: false,
  },
];
