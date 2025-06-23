
// src/lib/quiz-data/tools-data.ts
import { Timer, Gamepad2, ShieldBan, NotebookText, BarChart, Bell, PauseCircle, Fingerprint, Waves, Sun, Gauge, BarChartHorizontal, GitBranch, Share2, Lightbulb, Users, Compass, BookOpenCheck, Brain, Zap, Sparkles, MessageCircle, ClipboardList } from 'lucide-react';
import type { ElementType } from 'react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  category: 'Focus & Concentratie' | 'Energie & Beweging' | 'Rust & Regulatie' | 'Stemming & Emotie' | 'Sociaal & Communicatie' | 'Interesses & Hobby';
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

export const allTools: Tool[] = [
  // Focus & Concentratie Tools
  {
    id: 'focus-timer-pro',
    title: 'Focus Timer Pro',
    description: 'Een Pomodoro timer met optionele achtergrondgeluiden om je te helpen in de zone te komen.',
    icon: Timer,
    category: 'Focus & Concentratie',
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
    icon: Gamepad2,
    category: 'Focus & Concentratie',
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
  {
    id: 'distraction-blocker',
    title: 'Distraction Blocker',
    description: 'Blokkeer tijdelijk afleidende websites en apps tijdens je studiesessies.',
    icon: ShieldBan,
    category: 'Focus & Concentratie',
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
    icon: NotebookText,
    category: 'Focus & Concentratie',
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
    icon: BarChart,
    category: 'Energie & Beweging',
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
    icon: Bell,
    category: 'Energie & Beweging',
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
    icon: PauseCircle,
    category: 'Energie & Beweging',
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
    icon: Fingerprint,
    category: 'Energie & Beweging',
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

  // Rust & Regulatie Tools
  {
    id: 'sensory-calm-space',
    title: 'Sensory Calm Space',
    description: 'Een aanpasbare digitale ruimte met kalmerende beelden (lava lamp, regen) en geluiden (ruis, natuur).',
    icon: Waves,
    category: 'Rust & Regulatie',
    reasoning: {
      high: "Je bent snel overweldigd door prikkels. Deze tool is je persoonlijke 'chill-zone' om je zenuwstelsel tot rust te brengen.",
      medium: "Soms is de wereld wat te veel. Gebruik deze ruimte om even te ontsnappen en je batterij op te laden.",
      low: "Ook al ben je niet snel overprikkeld, dit kan een fijne manier zijn om te ontspannen na een lange dag."
    },
    usage: {
      when: "Als je je overprikkeld voelt, voor het slapengaan, of als je een rustige achtergrond wilt tijdens het studeren.",
      benefit: "Directe vermindering van stress en overprikkeling, en een hulpmiddel om tot rust te komen."
    }
  },
  {
    id: 'ademhalings-gids',
    title: 'Ademhalings Gids',
    description: "Visuele gidsen voor verschillende ademhalingstechnieken zoals de 'box breathing' en 4-7-8 methode.",
    icon: Sun,
    category: 'Rust & Regulatie',
    reasoning: {
      high: "Je ervaart regelmatig stress of onrust. Ademhaling is de snelste manier om je zenuwstelsel te kalmeren. Dit is een essentiële tool voor jou.",
      medium: "Je hebt af en toe last van spanning. Deze oefeningen zijn een effectieve manier om snel te ontspannen.",
      low: "Je bent van nature rustig. Toch is dit een goede vaardigheid om te leren voor onverwacht stressvolle momenten."
    },
    usage: {
      when: "Als je stress, angst of onrust voelt, of als dagelijkse routine om je basisrustniveau te verlagen.",
      benefit: "Snelle stressvermindering, betere controle over je emoties en een verhoogd gevoel van kalmte."
    }
  },
  {
    id: 'progressive-relaxatie',
    title: 'Progressive Relaxatie',
    description: 'Geleide audio-oefeningen om je spieren systematisch aan te spannen en te ontspannen.',
    icon: Gauge,
    category: 'Rust & Regulatie',
    reasoning: {
      high: "Je hebt vaak last van fysieke spanning door stress of overprikkeling. Deze tool helpt je om die spanning bewust los te laten.",
      medium: "Dit is een goede manier om na een drukke dag diep te ontspannen en je lichaam tot rust te brengen.",
      low: "Je hebt dit waarschijnlijk niet dagelijks nodig, maar het kan heerlijk zijn om te ontspannen voor het slapen."
    },
    usage: {
      when: "Voor het slapengaan, na een stressvolle dag, of als je fysieke spanning voelt.",
      benefit: "Diepe fysieke ontspanning, vermindering van spanningshoofdpijn en beter inslapen."
    }
  },
  {
    id: 'overprikkel-alarm',
    title: 'Overprikkel Alarm',
    description: "Leer je eigen signalen van overprikkeling herkennen en stel een 'alarm' in om op tijd een pauze te nemen.",
    icon: BarChartHorizontal,
    category: 'Rust & Regulatie',
    reasoning: {
      high: "Je raakt snel overweldigd. Deze tool maakt je bewust van je vroege waarschuwingssignalen, zodat je kunt ingrijpen voordat het te veel wordt.",
      medium: "Soms overkomt de drukte je. Het 'alarm' helpt je om proactief je grenzen te bewaken.",
      low: "Je hebt een hoge drempel voor prikkels, dus dit is voor jou minder relevant."
    },
    usage: {
      when: "Vul de checklist in aan het begin van de week. Reflecteer aan het einde van de dag op de signalen.",
      benefit: "Voorkomen van overprikkeling, beter energiemanagement en meer controle over je welzijn."
    }
  },

  // Stemming & Emotie Tools
  {
    id: 'mood-tracker',
    title: 'Mood Tracker',
    description: 'Een simpele, visuele manier om dagelijks je stemming en de mogelijke oorzaken bij te houden.',
    icon: GitBranch,
    category: 'Stemming & Emotie',
    reasoning: {
      high: "Je stemming wisselt regelmatig. Deze tracker helpt jou en ons om patronen te zien en te begrijpen wat je stemming beïnvloedt.",
      medium: "Je hebt af en toe een mindere dag. De tracker kan helpen om inzicht te krijgen in de triggers.",
      low: "Je stemming is stabiel. Dit is een minder essentiële tool voor jou, maar kan interessant zijn om bij te houden."
    },
    usage: {
      when: "Dagelijks, bijvoorbeeld aan het einde van de dag, om kort te reflecteren op je gevoel.",
      benefit: "Inzicht in je emotionele patronen, het herkennen van triggers en een startpunt voor gesprekken over je gevoel."
    }
  },
  {
    id: 'emotie-gids',
    title: 'Emotie Gids',
    description: 'Een bibliotheek van emoties met uitleg, herkenningstips en gezonde manieren om ermee om te gaan.',
    icon: Lightbulb,
    category: 'Stemming & Emotie',
    reasoning: {
      high: "Je vindt het soms moeilijk om je emoties te begrijpen of te uiten. Deze gids is je persoonlijke 'woordenboek' voor gevoelens.",
      medium: "Je begrijpt je basisemoties, maar deze gids kan helpen om de nuances beter te herkennen en te benoemen.",
      low: "Je bent al goed in het herkennen van je emoties. Gebruik dit als naslagwerk."
    },
    usage: {
      when: "Als je een sterk gevoel ervaart maar niet goed weet wat het is, of om proactief over emoties te leren.",
      benefit: "Een grotere emotionele woordenschat, betere zelfregulatie en meer grip op je gevoelens."
    }
  },
  {
    id: 'zorgen-dagboek',
    title: 'Zorgen Dagboek',
    description: "Een gestructureerde methode om piekergedachten op te schrijven en een vast 'piekerkwartier' in te plannen.",
    icon: NotebookText,
    category: 'Stemming & Emotie',
    reasoning: {
      high: "Je maakt je vaak zorgen. Deze tool helpt om het piekeren te beperken tot een vast moment, zodat het niet je hele dag overneemt.",
      medium: "Af en toe pieker je. Dit dagboek kan helpen om die gedachten uit je hoofd te krijgen en te relativeren.",
      low: "Je maakt je weinig zorgen. Deze tool is waarschijnlijk niet nodig voor jou."
    },
    usage: {
      when: "Schrijf zorgen op zodra ze opkomen. Plan dagelijks 15 minuten om er bewust bij stil te staan.",
      benefit: "Minder piekeren gedurende de dag, meer controle over zorgelijke gedachten en een rustiger hoofd."
    }
  },
  {
    id: 'gratitude-journal',
    title: 'Gratitude Journal',
    description: 'Een eenvoudige tool om elke dag drie dingen op te schrijven waar je dankbaar voor bent.',
    icon: Sparkles,
    category: 'Stemming & Emotie',
    reasoning: {
      high: "Je focus ligt vaak op wat er niet goed gaat. Dit dagboek traint je brein om actief op zoek te gaan naar het positieve.",
      medium: "Dit is een krachtige en eenvoudige manier om je algehele welzijn en positiviteit te verhogen.",
      low: "Je hebt al een positieve instelling. Dit kan helpen om die te onderhouden en te versterken."
    },
    usage: {
      when: "Elke avond voor het slapengaan, of elke ochtend om de dag positief te starten.",
      benefit: "Een positievere mindset, meer waardering voor kleine dingen en een bewezen boost voor je geluksgevoel."
    }
  },

  // Sociaal & Communicatie Tools
  {
    id: 'sociale-scripts',
    title: 'Sociale Scripts',
    description: 'Een bibliotheek met voorbeelden en stappenplannen voor veelvoorkomende sociale situaties (bv. een praatje maken, iets vragen).',
    icon: Users,
    category: 'Sociaal & Communicatie',
    reasoning: {
      high: "Je vindt sociale situaties soms onvoorspelbaar en moeilijk. Deze scripts geven je concrete handvatten en zelfvertrouwen.",
      medium: "Je redt je prima sociaal, maar sommige situaties zijn nog lastig. Gebruik dit voor specifieke momenten.",
      low: "Je bent sociaal vaardig. Dit is voor jou waarschijnlijk niet nodig."
    },
    usage: {
      when: "Ter voorbereiding op een sociale gebeurtenis, zoals een feestje, presentatie of een gesprek.",
      benefit: "Minder sociale angst, meer zelfvertrouwen in gesprekken en duidelijkheid over sociale verwachtingen."
    }
  },
  {
    id: 'empathie-balancer',
    title: 'Empathie Balancer',
    description: 'Oefeningen om je inlevingsvermogen te gebruiken zonder de emoties van anderen volledig over te nemen.',
    icon: Compass,
    category: 'Sociaal & Communicatie',
    reasoning: {
      high: "Jouw empathie is een superkracht, maar soms ook vermoeiend. Deze tool helpt je om grenzen te stellen en voor jezelf te zorgen.",
      medium: "Je bent empathisch. De balancer helpt je om het verschil te voelen tussen meeleven en meelijden.",
      low: "Je hebt van nature een goede balans in je empathie. Deze tool is minder relevant voor jou."
    },
    usage: {
      when: "Na een intens gesprek, of als je merkt dat de emoties van een ander je uitputten.",
      benefit: "Bescherming van je eigen energie, het stellen van gezonde grenzen en het behouden van je empathische kracht."
    }
  },
  {
    id: 'conflict-navigator',
    title: 'Conflict Navigator',
    description: 'Een stappenplan en voorbeelden om op een constructieve manier meningsverschillen of conflicten te bespreken.',
    icon: MessageCircle,
    category: 'Sociaal & Communicatie',
    reasoning: {
      high: "Je vermijdt conflicten of vindt het moeilijk om voor jezelf op te komen. Deze tool geeft je een veilige structuur.",
      medium: "Je gaat conflicten niet uit de weg, maar wilt leren hoe je dit nog constructiever kunt doen.",
      low: "Je bent al een ster in het oplossen van conflicten."
    },
    usage: {
      when: "Ter voorbereiding op een moeilijk gesprek met een vriend, ouder of leraar.",
      benefit: "Meer zelfvertrouwen in het aangaan van moeilijke gesprekken en het oplossen van conflicten."
    }
  },
  {
    id: 'vriendschap-tracker',
    title: 'Vriendschap Tracker',
    description: 'Een simpele tool om bij te houden met welke vrienden je contact hebt gehad en wie je weer eens zou willen zien.',
    icon: BookOpenCheck,
    category: 'Sociaal & Communicatie',
    reasoning: {
      high: "Je vindt het onderhouden van vriendschappen soms lastig. Deze tracker is een simpel geheugensteuntje.",
      medium: "Dit kan een leuke manier zijn om bewuster met je vriendschappen om te gaan.",
      low: "Je bent al een sociaal dier. Deze tool heb je waarschijnlijk niet nodig."
    },
    usage: {
      when: "Wekelijks even bijwerken om te zien wie je al een tijdje niet gesproken hebt.",
      benefit: "Helpt bij het onderhouden van sociale contacten en het bewust investeren in belangrijke vriendschappen."
    }
  },

  // Interesses & Hobby Tools
  {
    id: 'hobby-organizer',
    title: 'Hobby Organizer',
    description: 'Een visuele tool om je vele interesses en hobby-projecten te beheren en prioriteren.',
    icon: Brain,
    category: 'Interesses & Hobby',
    reasoning: {
      high: "Je hebt ontzettend veel interesses en begint overal aan. Deze tool helpt je het overzicht te bewaren en projecten af te maken.",
      medium: "Je hebt diverse hobby's. De organizer kan helpen om te kiezen waar je je tijd aan wilt besteden.",
      low: "Je hebt een duidelijke focus in je hobby's. Deze tool is minder relevant."
    },
    usage: {
      when: "Als je een nieuw idee hebt, of als je het overzicht over je projecten kwijt bent.",
      benefit: "Meer overzicht, minder onafgemaakte projecten en een duidelijk beeld van waar je passies liggen."
    }
  },
  {
    id: 'deep-dive-planner',
    title: 'Deep Dive Planner',
    description: 'Gestructureerde planning om een onderwerp waar je gepassioneerd over bent volledig uit te diepen.',
    icon: ClipboardList,
    category: 'Interesses & Hobby',
    reasoning: {
      high: "Je kunt je helemaal verliezen in een interesse. Deze planner helpt je om die passie om te zetten in een gestructureerd leerproject.",
      medium: "Als je een onderwerp echt interessant vindt, helpt deze tool je om er systematisch meer over te leren.",
      low: "Je leert liever op een meer organische manier. Deze tool is minder passend voor jou."
    },
    usage: {
      when: "Als je een nieuw, intensief interessegebied ontdekt.",
      benefit: "Je passie omzetten in diepgaande kennis en een gevoel van meesterschap."
    }
  },
  {
    id: 'creative-outlet',
    title: 'Creative Outlet',
    description: 'Een verzameling laagdrempelige creatieve opdrachten (schrijven, tekenen, muziek maken) om je ideeën te uiten.',
    icon: Sparkles,
    category: 'Interesses & Hobby',
    reasoning: {
      high: "Je hebt een rijk innerlijk leven en veel creatieve ideeën. Dit is een perfecte uitlaatklep.",
      medium: "Soms wil je creatief zijn, maar weet je niet hoe te beginnen. Deze tool geeft je de start.",
      low: "Je hebt je eigen creatieve uitlaatkleppen al gevonden."
    },
    usage: {
      when: "Als je je creatief voelt, je verveelt, of je gedachten wilt uiten op een niet-verbale manier.",
      benefit: "Een gezonde uitlaatklep voor creativiteit en emoties, en het ontdekken van nieuwe talenten."
    }
  },
  {
    id: 'interest-sharing',
    title: 'Interest Sharing',
    description: 'Een (afgeschermd) platform om je passies en projecten te delen met gelijkgestemden.',
    icon: Share2,
    category: 'Interesses & Hobby',
    reasoning: {
      high: "Je vindt het soms moeilijk om mensen te vinden die jouw specifieke interesses delen. Hier vind je ze wel.",
      medium: "Het kan leuk zijn om je werk te delen en feedback te krijgen van anderen met dezelfde hobby.",
      low: "Je deelt je hobby's liever met je huidige vriendenkring."
    },
    usage: {
      when: "Als je een project hebt afgerond waar je trots op bent, of als je inspiratie zoekt.",
      benefit: "Erkenning en waardering voor je passies, en het vinden van een community van gelijkgestemden."
    }
  }
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

  const findToolById = (id: string): Tool | undefined => allTools.find(tool => tool.id === id);
  return {
    high: Array.from(recommendations.high).map(findToolById).filter((t): t is Tool => !!t),
    medium: Array.from(recommendations.medium).map(findToolById).filter((t): t is Tool => !!t),
    low: Array.from(recommendations.low).map(findToolById).filter((t): t is Tool => !!t),
  };
};
