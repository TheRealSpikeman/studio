// src/lib/quiz-data/tools-data.ts
import { Timer, Gamepad2, ShieldBan, NotebookPen, BarChart, Bell, PauseCircle, Fingerprint, Waves, Sun, Gauge, GitBranch, Share2, Lightbulb, Users, Compass, BookOpenCheck, Brain, Zap, Sparkles, MessageCircle, ClipboardList } from '@/lib/icons';
import type { ElementType } from 'react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string; // Changed to string to store the icon name
  category: 'Focus & Concentratie' | 'Energie & Beweging' | 'Rust & Regulatie' | 'Stemming & Emotie' | 'Sociaal & Communicatie' | 'Interesses & Hobby';
  status?: 'online' | 'offline'; // Added status
  reasoning: {
    high: string;
    medium: string;
    low: string;
  };
  usage: {
    when: string;
    benefit: string;
  }
}

// Export categories for use in forms
export const allToolCategories: Tool['category'][] = [
  'Focus & Concentratie',
  'Energie & Beweging',
  'Rust & Regulatie',
  'Stemming & Emotie',
  'Sociaal & Communicatie',
  'Interesses & Hobby'
];

// Export icons and a lookup function for use in forms
export const allToolIcons: { name: string, component: ElementType }[] = [
  { name: 'Timer', component: Timer }, { name: 'Gamepad2', component: Gamepad2 }, { name: 'ShieldBan', component: ShieldBan },
  { name: 'NotebookPen', component: NotebookPen }, { name: 'BarChart', component: BarChart }, { name: 'Bell', component: Bell },
  { name: 'PauseCircle', component: PauseCircle }, { name: 'Fingerprint', component: Fingerprint }, { name: 'Waves', component: Waves },
  { name: 'Sun', component: Sun }, { name: 'Gauge', component: Gauge }, { name: 'GitBranch', component: GitBranch },
  { name: 'Share2', component: Share2 }, { name: 'Lightbulb', component: Lightbulb }, { name: 'Users', component: Users },
  { name: 'Compass', component: Compass }, { name: 'BookOpenCheck', component: BookOpenCheck }, { name: 'Brain', component: Brain },
  { name: 'Zap', component: Zap }, { name: 'Sparkles', component: Sparkles }, { name: 'MessageCircle', component: MessageCircle },
  { name: 'ClipboardList', component: ClipboardList },
];

export const getToolIconComponent = (iconName: string): ElementType | undefined => {
    return allToolIcons.find(icon => icon.name === iconName)?.component;
};

export const DEFAULT_TOOLS: Tool[] = [
  // Focus & Concentratie Tools
  {
    id: 'focus-timer-pro',
    title: 'Focus Timer Pro',
    description: 'Een Pomodoro timer met optionele achtergrondgeluiden om je te helpen in de zone te komen.',
    icon: 'Timer',
    category: 'Focus & Concentratie',
    status: 'online',
    reasoning: {
      high: "Je focus kan soms alle kanten op gaan. Deze tool helpt je om werk in behapbare blokken op te delen, wat het starten en volhouden makkelijker maakt.",
      medium: "Je hebt een gemiddelde focus. Deze timer kan je helpen om die focus te trainen en bewuster met je tijd om te gaan.",
      low: "Je concentratie is al sterk. Gebruik deze tool om je productiviteit te optimaliseren en burn-out te voorkomen."
    },
    usage: {
      when: "Tijdens huiswerk, studeren of taken die concentratie vereisen.",
      benefit: "Verbeterde focus, minder uitstelgedrag en meer gedaan krijgen in minder tijd."
    }
  },
  {
    id: 'concentratie-games',
    title: 'Concentratie Games',
    description: 'Gamified trainingsoefeningen ontworpen om je aandachtsspanne op een leuke manier te vergroten.',
    icon: 'Gamepad2',
    category: 'Focus & Concentratie',
    status: 'online',
    reasoning: {
      high: "Je vindt het moeilijk om je lang te concentreren. Deze games trainen je 'focus-spier' op een leuke, laagdrempelige manier.",
      medium: "Je kunt je al redelijk concentreren. Deze games dagen je uit om je focus naar een hoger niveau te tillen.",
      low: "Je hebt al een goede focus. Gebruik deze games als een leuke mentale warming-up voor een grote taak."
    },
    usage: {
      when: "Als korte pauze, of dagelijks 5-10 minuten als training.",
      benefit: "Verbeterd vermogen om afleidingen te negeren en je aandacht vast te houden."
    }
  },
  // ... more tools from the original file ...
  {
    id: 'distraction-blocker',
    title: 'Distraction Blocker',
    description: 'Blokkeer tijdelijk afleidende websites en apps tijdens je studiesessies.',
    icon: 'ShieldBan',
    category: 'Focus & Concentratie',
    status: 'online',
    reasoning: {
      high: "Je bent snel afgeleid. Deze tool creëert een 'digitale stiltecoupé' zodat je brein niet constant wordt weggetrokken.",
      medium: "Je hebt soms moeite met de verleiding van social media. Deze tool is een extra steuntje in de rug.",
      low: "Je kunt je goed afsluiten. Gebruik dit voor die allerbelangrijkste momenten, zoals vlak voor een deadline."
    },
    usage: {
      when: "Tijdens belangrijke studieblokken of wanneer je echt niet afgeleid wilt worden.",
      benefit: "Een ongestoorde leeromgeving en meer controle over je digitale gewoonten."
    }
  },
  {
    id: 'study-planner',
    title: 'Study Planner',
    description: 'Een intelligente planner die je helpt taken op te delen en in te plannen op basis van je focuspatronen.',
    icon: 'NotebookPen',
    category: 'Focus & Concentratie',
    status: 'online',
    reasoning: {
      high: "Je bent snel afgeleid en vindt plannen lastig. Deze tool geeft je de structuur die je nodig hebt.",
      medium: "Je hebt een goede basis, maar kunt soms het overzicht verliezen. De planner helpt je om consistent te blijven.",
      low: "Je concentratie is al top. Gebruik deze planner om je studie-efficiëntie te maximaliseren en vooruit te werken."
    },
    usage: {
      when: "Wekelijks om je studieweek te plannen, dagelijks om je taken te bekijken.",
      benefit: "Minder stress door beter overzicht, en efficiënter gebruik van je studietijd."
    }
  },

  // Energie & Beweging Tools
  {
    id: 'energie-monitor',
    title: 'Energie Monitor',
    description: 'Houd dagelijks je energieniveau bij om patronen te ontdekken in wat je energie geeft of kost.',
    icon: 'BarChart',
    category: 'Energie & Beweging',
    status: 'online',
    reasoning: {
      high: "Jouw energieniveau wisselt sterk. Deze tool helpt je te begrijpen waar dat door komt, zodat je er beter op kunt inspelen.",
      medium: "Je hebt soms pieken en dalen in je energie. De monitor geeft je inzicht om je dagen beter in te delen.",
      low: "Je energie is stabiel. Gebruik deze tool om te zien hoe nieuwe activiteiten je energieniveau beïnvloeden."
    },
    usage: {
      when: "Een paar keer per dag kort invullen, bijvoorbeeld 's ochtends, 's middags en 's avonds.",
      benefit: "Meer bewustzijn van je eigen energiebalans en betere keuzes maken om je energiek te voelen."
    }
  },
  {
    id: 'bewegings-breaks',
    title: 'Bewegings Breaks',
    description: 'Korte, geleide video-oefeningen (2-5 min) om overtollige energie kwijt te raken en je daarna weer te kunnen focussen.',
    icon: 'Bell',
    category: 'Energie & Beweging',
    status: 'online',
    reasoning: {
      high: "Je hebt vaak veel energie en moeite met stilzitten. Deze korte breaks zijn een perfecte uitlaatklep.",
      medium: "Je voelt je soms onrustig. Gebruik deze breaks om je hoofd leeg te maken en je lichaam te activeren.",
      low: "Je bent rustig. Toch kan een korte bewegingspauze helpen om je bloedsomloop te stimuleren en je focus te vernieuwen."
    },
    usage: {
      when: "Tussen studieblokken door, of als je voelt dat je onrustig wordt.",
      benefit: "Betere concentratie na een korte pauze en een gezonde manier om met overtollige energie om te gaan."
    }
  },
  {
    id: 'impulse-pause',
    title: 'Impulse Pause',
    description: 'Een simpele tool die je helpt een korte pauze in te lassen voordat je reageert of handelt.',
    icon: 'PauseCircle',
    category: 'Energie & Beweging',
    status: 'online',
    reasoning: {
      high: "Je handelt vaak impulsief. Deze tool traint je om een moment van reflectie in te bouwen, wat leidt tot betere beslissingen.",
      medium: "Je bent soms wat ongeduldig. De 'Impulse Pause' helpt je om bewuster en rustiger te reageren.",
      low: "Je denkt goed na voor je iets doet. Deze tool is voor jou minder relevant."
    },
    usage: {
      when: "Als je een sterke drang voelt om iets te zeggen of doen, open de tool en volg de 3-seconden ademhaling.",
      benefit: "Minder impulsieve acties, betere zelfbeheersing en meer doordachte reacties."
    }
  },
  {
    id: 'fidget-simulator',
    title: 'Fidget Simulator',
    description: 'Een verzameling digitale fidgets (knoppen, schakelaars, etc.) om je handen bezig te houden tijdens het luisteren.',
    icon: 'Fingerprint',
    category: 'Energie & Beweging',
    status: 'online',
    reasoning: {
      high: "Je bent vaak onrustig en hebt iets nodig om mee te 'friemelen'. Dit is een stille, digitale oplossing.",
      medium: "Soms helpt het je te concentreren als je handen iets te doen hebben. Dit is een handig alternatief voor een tikkende pen.",
      low: "Je hebt dit waarschijnlijk niet nodig, maar het kan een leuke afleiding zijn tijdens een pauze."
    },
    usage: {
      when: "Tijdens een lange online les of uitleg waar je vooral moet luisteren.",
      benefit: "Verbeterde focus door het kanaliseren van de behoefte om te bewegen, zonder anderen te storen."
    }
  },
];


export type ToolScores = {
  attention: number;
  energy: number;
  prikkels: number;
  sociaal: number;
  stemming: number;
};

const getCategoryForScore = (score: number, thresholds: [number, number, number]): 'low' | 'medium' | 'high' => {
  if (score <= thresholds[0]) return 'low';
  if (score <= thresholds[1]) return 'medium';
  return 'high';
}

export const calculateToolRecommendations = (scores: ToolScores): { high: Tool[], medium: Tool[], low: Tool[] } => {
  const recommendations: { high: Set<string>, medium: Set<string>, low: Set<string> } = { high: new Set(), medium: new Set(), low: new Set() };
  const addTools = (toolIds: string[], priority: 'high' | 'medium' | 'low') => {
    toolIds.forEach(id => {
      if (!recommendations.high.has(id) && !recommendations.medium.has(id)) {
        recommendations[priority].add(id);
      } else if (priority === 'medium' && !recommendations.high.has(id)) {
        recommendations.medium.add(id);
      } else if (priority === 'high') {
        recommendations.high.add(id);
      }
    });
  };

  // 1. Aandacht & Focus
  const attentionCat = getCategoryForScore(scores.attention, [2, 5, 8]);
  if (attentionCat === 'high') { addTools(['focus-timer-pro', 'concentratie-games'], 'high'); addTools(['distraction-blocker', 'study-planner'], 'medium'); addTools(['bewegings-breaks'], 'low'); }
  else if (attentionCat === 'medium') { addTools(['focus-timer-pro'], 'high'); addTools(['study-planner', 'concentratie-games'], 'medium'); addTools(['distraction-blocker'], 'low'); }
  else { addTools(['study-planner'], 'medium'); addTools(['focus-timer-pro', 'concentratie-games'], 'low'); }

  // 2. Energie & Impulsiviteit
  const energyCat = getCategoryForScore(scores.energy, [2, 5, 8]);
  if (energyCat === 'high') { addTools(['bewegings-breaks', 'impulse-pause'], 'high'); addTools(['fidget-simulator', 'energie-monitor'], 'medium'); addTools(['ademhalings-gids'], 'low'); }
  else if (energyCat === 'medium') { addTools(['bewegings-breaks'], 'high'); addTools(['energie-monitor', 'fidget-simulator'], 'medium'); addTools(['impulse-pause'], 'low'); }
  else { addTools(['energie-monitor'], 'medium'); }

  // 3. Prikkelverwerking
  const prikkelsCat = getCategoryForScore(scores.prikkels, [2, 5, 8]);
  if (prikkelsCat === 'high') { addTools(['sensory-calm-space', 'overprikkel-alarm'], 'high'); addTools(['ademhalings-gids', 'progressive-relaxatie'], 'medium'); addTools(['empathie-balancer'], 'low'); }
  else if (prikkelsCat === 'medium') { addTools(['sensory-calm-space'], 'high'); addTools(['ademhalings-gids'], 'medium'); addTools(['overprikkel-alarm'], 'low'); }
  else { addTools(['sensory-calm-space'], 'low'); }

  // 5. Sociale & Communicatie
  const sociaalCat = getCategoryForScore(scores.sociaal, [2, 5, 8]);
  if (sociaalCat === 'high') { addTools(['deep-dive-planner', 'interest-sharing'], 'high'); addTools(['hobby-organizer', 'sociale-scripts'], 'medium'); addTools(['creative-outlet'], 'low'); }
  else if (sociaalCat === 'medium') { addTools(['sociale-scripts'], 'high'); addTools(['vriendschap-tracker', 'conflict-navigator'], 'medium'); }
  else { addTools(['vriendschap-tracker'], 'medium'); addTools(['sociale-scripts'], 'low'); }

  // 4. Stemming & Emotie
  const stemmingCat = getCategoryForScore(scores.stemming, [2, 5, 8]);
  if (stemmingCat === 'high') { addTools(['mood-tracker', 'emotie-gids'], 'high'); addTools(['zorgen-dagboek', 'ademhalings-gids'], 'medium'); addTools(['sensory-calm-space'], 'low'); }
  else if (stemmingCat === 'medium') { addTools(['mood-tracker'], 'high'); addTools(['emotie-gids', 'gratitude-journal'], 'medium'); addTools(['zorgen-dagboek'], 'low'); }
  else { addTools(['gratitude-journal'], 'medium'); addTools(['mood-tracker'], 'low'); }

  // 6. Combinatieregels
  if (prikkelsCat === 'high' && stemmingCat === 'high' && attentionCat === 'high') {
    const rustTools = ['sensory-calm-space', 'mood-tracker', 'ademhalings-gids'].filter(id => recommendations.high.has(id));
    recommendations.high = new Set(rustTools.slice(0, 2));
  }
  if (sociaalCat === 'high' && prikkelsCat === 'low') {
    addTools(['creative-outlet'], 'medium');
    addTools(['deep-dive-planner'], 'high');
  }

  // Max 4 tools en fallback
  if (recommendations.high.size > 4) {
    recommendations.high = new Set(Array.from(recommendations.high).slice(0, 4));
  }
  if (recommendations.high.size === 0 && recommendations.medium.size > 0) {
    const topMedium = Array.from(recommendations.medium).slice(0, 3);
    topMedium.forEach(id => {
        recommendations.high.add(id);
        recommendations.medium.delete(id);
    });
  }

  const findToolById = (id: string): Tool | undefined => DEFAULT_TOOLS.find(tool => tool.id === id);
  return {
    high: Array.from(recommendations.high).map(findToolById).filter((t): t is Tool => !!t),
    medium: Array.from(recommendations.medium).map(findToolById).filter((t): t is Tool => !!t),
    low: Array.from(recommendations.low).map(findToolById).filter((t): t is Tool => !!t),
  };
};
