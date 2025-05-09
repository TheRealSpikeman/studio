// src/lib/quiz-data/teen-neurodiversity-quiz.ts

export interface QuizOption {
  value: string;
  label: string;
}

export const answerOptions: QuizOption[] = [
  { value: '1', label: 'Nooit' },
  { value: '2', label: 'Soms' },
  { value: '3', label: 'Vaak' },
  { value: '4', label: 'Altijd' },
];

export const baseQuestionsTeen: string[] = [
  "Ik merk dat mijn gedachten afdwalen, zelfs als ik probeer te focussen op schoolwerk.",
  "Ik moet bladzijdes of opdrachten vaak opnieuw lezen omdat ik niet oplet wat ik lees.",
  "Kleine afleidingen zoals tikkende pennen of pratende klasgenoten verstoren mijn concentratie volledig.",
  "Ik voel me onrustig als ik lang stil moet zitten in de klas.",
  "Ik flap weleens dingen eruit voordat mijn beurt is of zonder er goed over na te denken.",
  "Ik speel vaak met mijn pen, haar of andere dingen tijdens de les.",
  "Ik lig 's avonds in bed vaak lang wakker door alle gedachten in mijn hoofd.",
  "Na een lange schooldag of drukke activiteit heb ik echt tijd nodig om bij te komen.",
  "Ik voel me snel overweldigd in drukke plekken zoals de kantine of bij schoolfeesten.",
  "Ik merk geuren, geluiden of aanrakingen sterker op dan mijn vrienden of klasgenoten.",
  "Ik begrijp niet altijd waarom mensen lachen om bepaalde grappen of waarom ze boos of verdrietig zijn.",
  "Ik raak gefrustreerd of angstig als er plotseling iets verandert in de planning of routine.",
  "Ik voel me regelmatig somber of heb dagen waarop ik nergens energie voor heb.",
  "Ik kan met plezier lang bezig zijn met onderwerpen die ik interessant vind.",
  "Ik maak me veel zorgen over toetsen en opdrachten, zelfs als ik goed heb geleerd."
];

export const subTestsTeen: Record<string, string[]> = {
  ADD: [
    "Ik merk dat ik vaak dingen vergeet, zoals mijn agenda of boeken voor de juiste lessen.",
    "Ik betrap mezelf erop dat ik uit het raam staar of met andere dingen bezig ben terwijl de leraar uitleg geeft.",
    "Als ik aan een opdracht begin, ben ik vaak eerst enthousiast maar na een tijdje wil ik alweer iets anders doen.",
    "Ik laat me gemakkelijk afleiden als mijn telefoon trilt of als ik een melding krijg.",
    "Ik moet vaak vragen wat iemand heeft gezegd omdat ik niet goed heb opgelet.",
    "Ik stel huiswerk vaak uit tot het laatste moment, ook al had ik eerder tijd.",
    "Ik raak vaak spullen kwijt die ik net nog had, zoals pennen of mijn telefoon.",
    "Als ik instructies krijg met meerdere stappen, vergeet ik vaak een deel.",
    "Ik vind het moeilijk om mijn schoolspullen netjes en georganiseerd te houden.",
    "Ik vergeet soms belangrijke dingen zoals afspraken, inleverdata of huiswerk."
  ],
  ADHD: [
    "Als ik moet stilzitten, beweeg ik vaak met mijn voeten of vingers.",
    "Ik val anderen in de rede omdat ik niet kan wachten om iets te zeggen.",
    "Tijdens een lange uitleg loop ik weleens rond of vraag ik of ik even naar het toilet mag.",
    "Ik voel me soms alsof er een motor in me draait die niet kan stoppen.",
    "Ik begin enthousiast aan een opdracht maar stap snel over naar iets anders.",
    "Ik doe soms dingen zonder na te denken waar ik later spijt van heb.",
    "In de klas verander ik vaak van houding of positie om alert te blijven.",
    "Als een les saai is, zoek ik afleiding of dingen om me mee bezig te houden.",
    "Anderen zeggen soms dat ik te druk of te enthousiast ben.",
    "Het is moeilijk voor mij om te onthouden wat er net tegen me is gezegd."
  ],
  HSP: [
    "Na een feestje of drukke activiteit met vrienden moet ik tijd alleen doorbrengen om bij te komen.",
    "Harde muziek, felle lampen of sterke geuren vind ik sneller vervelend dan anderen.",
    "Ik merk dingen op in mijn omgeving die anderen niet opvallen, zoals geuren of kleine geluiden.",
    "Ik weet vaak hoe anderen zich voelen voordat ze het zelf zeggen.",
    "Als er onverwachts iets verandert in mijn rooster of planning, vind ik dat moeilijk.",
    "Als er te veel dingen tegelijk gebeuren, raak ik in de war of voel ik me onrustig.",
    "Ik zoek vaak een rustige plek op als het te druk wordt om me heen.",
    "Als iemand een negatieve opmerking over mij maakt, blijf ik daar lang aan denken.",
    "Ik plan bewust rustmomenten in na drukke dagen of activiteiten.",
    "Ik vang details op die anderen over het hoofd zien, zoals kleine veranderingen."
  ],
  ASS: [
    "Ik snap niet altijd wat er grappig is aan grappen die andere leerlingen maken.",
    "Ik vind het prettig als elke dag ongeveer hetzelfde verloopt.",
    "Ik raak in de war of gestrest als er plotseling dingen veranderen in mijn planning.",
    "Ik kan urenlang bezig zijn met onderwerpen of hobby's die ik leuk vind.",
    "Ik vind het ongemakkelijk om mensen aan te kijken tijdens een gesprek.",
    "Als het te druk of chaotisch is in de klas, trek ik me liever terug.",
    "Ik vraag vaak om meer uitleg, zelfs als anderen het al begrijpen.",
    "Ik volg liever vaste routines en doe dingen graag op dezelfde manier.",
    "Ik merk niet altijd dat anderen zich vervelen als ik over mijn interesses praat.",
    "Ik vind het fijn als regels duidelijk zijn en iedereen zich eraan houdt."
  ],
  AngstDepressie: [
    "Ik lig 's avonds vaak wakker door zorgen over toetsen of schoolopdrachten.",
    "Ik voel me soms somber of verdrietig, zonder dat er een duidelijke reden voor is.",
    "Ik maak me zorgen over wat klasgenoten of vrienden van me denken.",
    "Bij spannende situaties zoals een spreekbeurt voel ik mijn hart sneller kloppen.",
    "Activiteiten of hobby's die ik vroeger leuk vond, vind ik nu minder interessant.",
    "Ik blijf vaak piekeren over dingen die mis kunnen gaan.",
    "Zelfs na voldoende slaap voel ik me soms nog steeds moe of uitgeput.",
    "Ik vind het moeilijk om hulp te vragen als ik me niet goed voel.",
    "In grote groepen mensen voel ik me ongemakkelijk of gespannen.",
    "Ik vermijd soms activiteiten omdat ik bang ben dat het niet goed zal gaan."
  ]
};

export const subtestDescriptionsTeen: Record<string, string> = {
  ADD: "ADD (aandachtstekort zonder hyperactiviteit): Je lijkt eigenschappen te herkennen die passen bij moeite met aandacht en concentratie, zonder hyperactief gedrag.",
  ADHD: "ADHD (aandachtstekort met hyperactiviteit): Je lijkt eigenschappen te herkennen die passen bij een combinatie van concentratieproblemen en behoefte aan beweging.",
  HSP: "HSP (hoogsensitief): Je lijkt eigenschappen te herkennen die passen bij een diepere verwerking van zintuiglijke prikkels en emoties.",
  ASS: "ASS (autismespectrum): Je lijkt eigenschappen te herkennen die passen bij een behoefte aan voorspelbaarheid en een andere manier van sociale informatieverwerking.",
  AngstDepressie: "Angst/Depressie: Je lijkt eigenschappen te herkennen die passen bij verhoogde zorgen en/of somberheid."
};

export const thresholdsTeen: Record<string, number> = { 
  ADD: 2.5, 
  ADHD: 2.5, 
  HSP: 3.0, 
  ASS: 3.0, 
  AngstDepressie: 3.0 
};

export interface NeurotypeDescription {
  title: string;
  eigenschappen: string;
  text: string;
  detail: string;
  color: string; // For charts, if used later
  uitleg: string;
  sterktepunten: string[];
  tips: {
    school: string;
    thuis: string;
    sociaal: string;
    werk: string; // or stage/studie for teens
  };
}

export const neurotypeDescriptionsTeen: Record<string, NeurotypeDescription> = {
  ADD: { 
    title:'ADD - Onoplettend', 
    eigenschappen:'Rustig van buiten, druk van binnen; moeite met focus en details.', 
    text:'Je mist soms details in de les.', 
    detail:'Bij ADD is je aandacht snel afgeleid doordat je gedachtestroom alle kanten op gaat. Dit kan ervoor zorgen dat informatie je ontgaat, zelfs als je stil en rustig lijkt. Je kunt moeite hebben om je concentratie vast te houden bij taken die je niet boeien.',
    color: 'rgba(75, 192, 192, 0.7)',
    uitleg: 'ADD (Attention Deficit Disorder) is een variant van ADHD waarbij hyperactiviteit ontbreekt. Personen met ADD hebben vooral moeite met aandacht en concentratie, terwijl ze uiterlijk rustig overkomen. Hun gedachten zijn vaak druk en springen van onderwerp naar onderwerp.',
    sterktepunten: ['Creatief denken', 'Goed in verbanden leggen', 'Out-of-the-box ideeën', 'Hyperfocus bij interessante onderwerpen'],
    tips: {
      school: 'Werk in blokken van 15 minuten met een timer en maak korte notities. Vraag om herhaling of opschrijven van belangrijke instructies.',
      thuis: 'Creëer een prikkelarme studieplek. Gebruik visuele planners en checklists voor taken.',
      sociaal: 'Plan één-op-één afspraken in plaats van grote groepsactiviteiten. Neem korte pauzes tijdens sociale evenementen.',
      werk: 'Gebruik koptelefoons om afleiding te verminderen. Vraag om schriftelijke instructies bij complexe taken.'
    }
  },
  ADHD: { 
    title:'ADHD - Hyperactiviteit', 
    eigenschappen:'Veel energie en impulsief gedrag; je zoekt beweging.', 
    text:'Je voelt je vaak gejaagd en onrustig.', 
    detail:'Bij ADHD ervaar je een constante drang om te bewegen, wat kan leiden tot impulsief handelen. Je gedachten gaan snel, wat creatieve ideeën oplevert maar ook kan zorgen voor ongeorganiseerd werken.',
    color: 'rgba(255, 99, 132, 0.7)',
    uitleg: 'ADHD (Attention Deficit Hyperactivity Disorder) kenmerkt zich door moeite met aandacht, hyperactiviteit en impulsiviteit. De hersenen filteren minder effectief, waardoor meer prikkels binnenkomen en er een continue behoefte is aan beweging en actie.',
    sterktepunten: ['Energiek en enthousiast', 'Snel schakelen tussen taken', 'Spontaan en creatief', 'Goed in crisissituaties'],
    tips: {
      school: 'Plan korte beweegpauzes na elke 20 minuten om je focus te verbeteren. Gebruik een stressballetje of ander fidget-speelgoed om je handen bezig te houden.',
      thuis: 'Verdeel grote taken in kleine, overzichtelijke stappen. Stel timers in voor taken als opruimen of huiswerk.',
      sociaal: 'Wees open over je behoefte aan beweging. Kies actieve sociale activiteiten zoals sporten of wandelen.',
      werk: 'Vraag om een sta-bureau of stabiliteitsbal in plaats van een normale stoel. Plan korte bewegingsmomenten in je werkdag.'
    }
  },
  HSP: { 
    title:'HSP - Hoogsensitief', 
    eigenschappen:'Sterk gevoelig voor prikkels; creatief en empathisch.', 
    text:'Je ervaart prikkels zoals harde geluiden intenser.', 
    detail:'Als HSP verwerk je zintuiglijke indrukken diepgaand, waardoor drukke omgevingen overweldigend kunnen zijn. Je pikt emoties en sferen goed op, wat je tot een empathisch persoon maakt.',
    color: 'rgba(153, 102, 255, 0.7)',
    uitleg: 'Hoogsensitieve personen (HSP) verwerken zintuiglijke prikkels intenser en dieper dan gemiddeld. Dit zorgt voor een rijk innerlijk leven, grote empathie en creativiteit, maar kan ook leiden tot overprikkeling in drukke omgevingen.',
    sterktepunten: ['Diepgaande verwerking van informatie', 'Sterke intuïtie en empathisch vermogen', 'Oog voor detail en nuance', 'Rijk gevoelsleven en creativiteit'],
    tips: {
      school: 'Neem regelmatig rustige pauzes om op te laden. Vraag of je af en toe in een rustiger ruimte mag werken.',
      thuis: 'Creëer een eigen rustige plek waar je je kunt terugtrekken. Bouw bewust ontspanningsmomenten in je dag.',
      sociaal: 'Plan hersteltijd in na sociale activiteiten. Communiceer je grenzen duidelijk aan anderen.',
      werk: 'Gebruik noise-cancelling koptelefoons in drukke werkruimtes. Vraag om flexibele werktijden om drukke momenten te vermijden.'
    }
  },
  ASS: { 
    title:'ASS - Autisme', 
    eigenschappen:'Houdt van routines en duidelijke regels; eerlijk en rechtlijnig.', 
    text:'Je geeft de voorkeur aan voorspelbare routines en structuren.', 
    detail:'Voor leerlingen met ASS biedt voorspelbaarheid rust; onverwachte veranderingen kunnen stress veroorzaken. Je kunt intens focussen op specifieke interesses en merkt details op die anderen missen.',
    color: 'rgba(255, 206, 86, 0.7)',
    uitleg: 'Autismespectrumstoornis (ASS) kenmerkt zich door een andere manier van informatieverwerking. Personen met ASS hebben vaak behoefte aan voorspelbaarheid, kunnen intens focussen op interessegebieden en verwerken sociale signalen anders.',
    sterktepunten: ['Analytisch denkvermogen', 'Oog voor detail en patronen', 'Eerlijkheid en rechtvaardigheidsgevoel', 'Diepgaande kennis van interessegebieden'],
    tips: {
      school: 'Gebruik visuele planningen en checklists. Vraag om duidelijke, concrete instructies bij opdrachten.',
      thuis: 'Houd een vaste dagstructuur aan. Bereid veranderingen zo veel mogelijk van tevoren voor.',
      sociaal: 'Plan sociale activiteiten met een duidelijk doel en structuur. Neem rustmomenten tussen sociale interacties.',
      werk: 'Vraag om een rustige werkplek met minimale afleiding. Maak afspraken over communicatievormen (mail vs. bellen).'
    }
  },
  AngstDepressie: { 
    title:'Angst/Depressie', 
    eigenschappen:'Piekeren en somberheid; behoefte aan steun en duidelijkheid.', 
    text:'Je merkt dat je vaak piekert of je somber voelt.', 
    detail:'Angst en somberheid kunnen leiden tot concentratieproblemen en vermijding van sociale activiteiten. Het kan moeilijk zijn om positieve aspecten te zien en energie voor dagelijkse activiteiten te vinden.',
    color: 'rgba(54, 162, 235, 0.7)',
    uitleg: 'Angst- en stemmingsklachten komen regelmatig voor bij jongeren en volwassenen. Bij angst is er sprake van zorgen en fysieke spanning, terwijl depressieve gevoelens gepaard gaan met somberheid, energieverlies en verminderde interesse in activiteiten.',
    sterktepunten: ['Zelfreflectie en zelfbewustzijn', 'Empathisch vermogen door eigen ervaringen', 'Voorzichtigheid en oog voor risico\'s', 'Grondigheid en perfectionisme'],
    tips: {
      school: 'Schrijf dagelijks drie positieve ervaringen op om je stemming te verbeteren. Deel je zorgen met een vertrouwenspersoon op school.',
      thuis: 'Bouw dagelijks ontspanningsmomenten in. Focus op kleine, haalbare doelen en vier successen.',
      sociaal: 'Kies sociale activiteiten die niet te veel energie kosten. Wees open naar vrienden over wat je nodig hebt.',
      werk: 'Stel realistische doelen en verdeel grote taken in kleinere stappen. Neem korte pauzes als spanning oploopt.'
    }
  }
};

// Helper function to calculate average, returns 0 if array is empty or all zeros after filtering
export const calculateAverage = (arr: (number | undefined)[]): number => {
  const validNumbers = arr.filter(n => typeof n === 'number' && n > 0) as number[];
  if (validNumbers.length === 0) {
    return 0;
  }
  return validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length;
};
