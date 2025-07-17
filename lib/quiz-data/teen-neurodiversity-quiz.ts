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

// Basisvragen gericht op het verkennen van patronen, niet op specifieke diagnoses
export const baseQuestionsTeen15_18: string[] = [
  "Ik merk dat mijn gedachten afdwalen, zelfs als ik probeer te focussen op schoolwerk.", // Aandacht/focus
  "Ik moet bladzijdes of opdrachten vaak opnieuw lezen omdat ik niet oplet wat ik lees.", // Aandacht/focus
  "Kleine afleidingen zoals tikkende pennen of pratende klasgenoten verstoren mijn concentratie volledig.", // Aandacht/focus & prikkelverwerking
  "Ik voel me onrustig als ik lang stil moet zitten in de klas.", // Energie/bewegingsdrang
  "Ik flap weleens dingen eruit voordat mijn beurt is of zonder er goed over na te denken.", // Impulsiviteit
  "Ik speel vaak met mijn pen, haar of andere dingen tijdens de les.", // Energie/bewegingsdrang & focus
  "Ik lig 's avonds in bed vaak lang wakker door alle gedachten in mijn hoofd.", // Prikkelverwerking/innerlijke rust
  "Na een lange schooldag of drukke activiteit heb ik echt tijd nodig om bij te komen.", // Prikkelverwerking/energiebalans
  "Ik voel me snel overweldigd in drukke plekken zoals de kantine of bij schoolfeesten.", // Prikkelverwerking (sensorisch/sociaal)
  "Ik merk geuren, geluiden of aanrakingen sterker op dan mijn vrienden of klasgenoten.", // Sensorische gevoeligheid
  "Ik begrijp niet altijd waarom mensen lachen om bepaalde grappen of waarom ze boos of verdrietig zijn.", // Sociale interpretatie
  "Ik raak gefrustreerd of angstig als er plotseling iets verandert in de planning of routine.", // Behoefte aan voorspelbaarheid/structuur
  "Ik voel me regelmatig somber of heb dagen waarop ik nergens energie voor heb.", // Stemming/energie
  "Ik kan met plezier lang bezig zijn met onderwerpen die ik interessant vind.", // Focus/interesses
  "Ik maak me veel zorgen over toetsen en opdrachten, zelfs als ik goed heb geleerd." // Zorgen/spanning
];

export const subTestsTeen15_18: Record<string, string[]> = {
  ADD: [ // Hernoemd naar Aandacht & Focus
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
  ADHD: [ // Hernoemd naar Energie & Impulsiviteit
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
  HSP: [ // Hernoemd naar Prikkelverwerking & Empathie
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
  ASS: [ // Hernoemd naar Sociale & Sensorische Voorkeuren
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
  AngstDepressie: [ // Hernoemd naar Stemmings- & Zorgpatronen
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

export const thresholdsTeen15_18: Record<string, number> = { 
  ADD: 2.5, 
  ADHD: 2.5, 
  HSP: 3.0, 
  ASS: 3.0, 
  AngstDepressie: 3.0 
};

export const baseQuestionsTeen12_14: string[] = [
  "Dwalen je gedachten makkelijk af als je je probeert te concentreren, bijvoorbeeld op school?", // Aandacht/focus
  "Moet je dingen vaak opnieuw lezen omdat je niet goed oplette?", // Aandacht/focus
  "Als je stil moet zitten, bijvoorbeeld in de klas, voel je je dan vaak onrustig?", // Energie/bewegingsdrang
  "Flap je er wel eens antwoorden uit voordat je aan de beurt bent?", // Impulsiviteit
  "Heb je na een drukke schooldag of een feestje echt even tijd voor jezelf nodig om bij te komen?", // Prikkelverwerking/energiebalans
  "Voel je je snel overweldigd op drukke plekken, zoals de pauze op het schoolplein?", // Prikkelverwerking (sensorisch/sociaal)
  "Vind je het lastig als plannen plotseling veranderen?", // Behoefte aan voorspelbaarheid/structuur
  "Kun je heel lang bezig zijn met een onderwerp of hobby die je super interessant vindt?", // Focus/interesses
  "Maak je je vaak zorgen, bijvoorbeeld over huiswerk of wat anderen van je denken?", // Zorgen/spanning
  "Voel je je soms somber zonder dat je precies weet waarom?", // Stemming/energie
  "Heb je moeite om te beginnen met taken, ook al weet je dat je ze moet doen?", // Executieve functies (starten)
  "Raak je snel afgeleid door geluiden of dingen die om je heen gebeuren?" // Aandacht/focus & prikkelverwerking
];

export const subTestsTeen12_14: Record<string, string[]> = {
  ADD: [ // Hernoemd naar Aandacht & Focus
    "Vergeet je vaak spullen, zoals je gymkleren of je agenda?",
    "Vind je het moeilijk om te luisteren als iemand lang praat?",
    "Begin je enthousiast aan iets nieuws, maar haak je snel af?",
    "Stel je huiswerk of klusjes vaak uit?",
    "Raak je makkelijk dingen kwijt, zoals je sleutels of potloden?",
    "Vind je het lastig om je kamer of schooltas netjes te houden?",
    "Droom je vaak weg tijdens de les?",
    "Als je instructies krijgt met meerdere stappen, onthoud je ze dan moeilijk?"
  ],
  ADHD: [ // Hernoemd naar Energie & Impulsiviteit
    "Wiebel je vaak op je stoel of tik je met je pen?",
    "Vind je het moeilijk om op je beurt te wachten, bijvoorbeeld in een spelletje?",
    "Ren je liever rond dan dat je rustig stilzit?",
    "Praat je soms heel veel of heel druk?",
    "Doe je dingen soms zonder er eerst goed over na te denken?",
    "Verveel je je snel als iets niet spannend genoeg is?",
    "Heb je moeite om stil te zijn als dat moet?",
    "Onderbreek je anderen vaak als ze praten?"
  ],
  HSP: [ // Hernoemd naar Prikkelverwerking & Empathie
    "Merk je kleine dingen op die anderen niet zien, zoals een nieuwe poster in de klas?",
    "Voel je snel aan hoe een ander zich voelt (blij, boos, verdrietig)?",
    "Vind je kleren die kriebelen of labeltjes in je nek heel vervelend?",
    "Schrik je snel van harde geluiden of onverwachte dingen?",
    "Heb je meer tijd nodig om te wennen aan nieuwe situaties of plekken?",
    "Kun je erg genieten van mooie muziek, kunst of de natuur?",
    "Denk je diep na over dingen?",
    "Word je moe van veel mensen om je heen?"
  ],
  ASS: [ // Hernoemd naar Sociale & Sensorische Voorkeuren
    "Vind je het fijn als dingen elke dag op dezelfde manier gaan?",
    "Snap je grapjes of spreekwoorden niet altijd meteen?",
    "Vind je het lastig om te weten wat je moet zeggen in een gesprek met nieuwe mensen?",
    "Speel je het liefst alleen of met één of twee vaste vrienden?",
    "Kun je helemaal opgaan in je favoriete hobby of onderwerp?",
    "Vind je het moeilijk om oogcontact te maken als je met iemand praat?",
    "Heb je duidelijke regels nodig om te weten wat je moet doen?",
    "Raak je van streek als dingen anders gaan dan je had verwacht?"
  ],
  AngstDepressie: [ // Hernoemd naar Stemmings- & Zorgpatronen
    "Pieker je veel, bijvoorbeeld voor een toets of een logeerpartijtje?",
    "Voel je je vaak moe, ook als je genoeg geslapen hebt?",
    "Heb je minder zin in dingen die je eerst wel leuk vond?",
    "Ben je bang om fouten te maken op school?",
    "Heb je soms buikpijn of hoofdpijn als je je zorgen maakt?",
    "Vind je het moeilijk om in slaap te komen omdat je ligt te denken?",
    "Ben je snel verdrietig of huil je makkelijk?",
    "Trek je je liever terug als je je niet fijn voelt?"
  ]
};

export const thresholdsTeen12_14: Record<string, number> = { 
  ADD: 2.0, 
  ADHD: 2.0, 
  HSP: 2.8, 
  ASS: 2.8, 
  AngstDepressie: 2.8 
};

export const subtestDescriptionsTeen: Record<string, string> = {
  ADD: "Aandacht & Focus: Je lijkt eigenschappen te herkennen die passen bij moeite met aandacht en concentratie.",
  ADHD: "Energie & Impulsiviteit: Je lijkt eigenschappen te herkennen die passen bij een combinatie van concentratieproblemen en behoefte aan beweging of snelle actie.",
  HSP: "Prikkelverwerking & Empathie: Je lijkt eigenschappen te herkennen die passen bij een diepere verwerking van zintuiglijke prikkels en emoties.",
  ASS: "Sociale & Sensorische Voorkeuren: Je lijkt eigenschappen te herkennen die passen bij een behoefte aan voorspelbaarheid en een andere manier van sociale informatieverwerking.",
  AngstDepressie: "Stemmings- & Zorgpatronen: Je lijkt eigenschappen te herkennen die passen bij verhoogde zorgen en/of somberheid."
};

export interface NeurotypeDescription {
  title: string;
  eigenschappen: string;
  text: string;
  detail: string;
  color: string; 
  uitleg: string;
  sterktepunten: string[];
  tips: {
    school: string;
    thuis: string;
    sociaal: string;
    werk: string; 
  };
}

export const neurotypeDescriptionsTeen: Record<string, NeurotypeDescription> = {
  ADD: { 
    title:'Aandacht & Focus', // Aangepast
    eigenschappen:'Moeite met focus en details, interne gedachtestroom.', 
    text:'Je herkent mogelijk moeite met concentreren en het vasthouden van aandacht.', 
    detail:'Personen die patronen van onoplettendheid herkennen, ervaren vaak een constante stroom van gedachten die de aandacht kan afleiden. Dit kan het lastig maken om details op te merken of instructies volledig te volgen, vooral bij taken die minder boeiend zijn.',
    color: 'rgba(75, 192, 192, 0.7)',
    uitleg: 'Aandachtspatronen waarbij de focus snel kan verspringen of waarbij interne gedachten de overhand nemen, kunnen het lastig maken om je langdurig op één taak te concentreren, vooral als deze niet direct boeiend is. Dit wordt soms in verband gebracht met ADD-kenmerken.',
    sterktepunten: ['Creatief en associatief denken', 'Vermogen om originele verbanden te leggen', 'Ontwikkelen van unieke ideeën', 'Intense focus (hyperfocus) op onderwerpen van grote interesse'],
    tips: {
      school: 'Werk in kortere blokken met een timer. Maak beknopte notities en vraag om schriftelijke instructies of samenvattingen. Voor jongeren: overleg met een docent over een seintje bij afdwalen.',
      thuis: 'Creëer een rustige, opgeruimde studieplek. Gebruik visuele planners en deel taken op in kleinere stappen. Voor jongeren: stel een vast huiswerkschema op met ingebouwde pauzes.',
      sociaal: 'Geef voorkeur aan één-op-één contact of kleine groepen. Neem bewust pauzes tijdens drukke sociale evenementen. Voor jongeren: spreek af met een beperkt aantal vrienden tegelijk.',
      werk: 'Gebruik een koptelefoon om omgevingsgeluiden te dempen. Vraag om duidelijke, schriftelijke instructies bij complexe taken. Voor jongeren (bijbaan/stage): kies taken die overzichtelijk zijn en waar je je goed op kunt focussen.'
    }
  },
  ADHD: { 
    title:'Energie & Impulsiviteit', // Aangepast
    eigenschappen:'Veel energie, bewegingsdrang en soms impulsief handelen.', 
    text:'Je herkent mogelijk een innerlijke onrust en de neiging om snel te handelen.', 
    detail:'Patronen van veel energie en impulsiviteit omvatten vaak een aanhoudende behoefte aan beweging en moeite met stilzitten. Impulsiviteit kan leiden tot snelle reacties zonder vooraf diep na te denken. Gedachten kunnen snel gaan, wat zowel tot creativiteit als tot ongeorganiseerdheid kan leiden. Dit wordt soms in verband gebracht met ADHD-kenmerken.',
    color: 'rgba(255, 99, 132, 0.7)',
    uitleg: 'Energie- en impulsiviteitspatronen, soms geassocieerd met ADHD, worden gekenmerkt door een combinatie van aandachtsuitdagingen, een hoge mate van energie/bewegingsdrang en de neiging tot impulsief reageren. De informatieverwerking in de hersenen kan anders verlopen, wat resulteert in een verhoogde gevoeligheid voor prikkels en een sterke drang naar activiteit.',
    sterktepunten: ['Hoge energie en enthousiasme', 'Snel kunnen schakelen', 'Spontaniteit en vindingrijkheid', 'Goed presteren onder druk of in dynamische situaties'],
    tips: {
      school: 'Plan korte beweegmomenten na studieblokken. Gebruik een stressbal of ander klein object om handen bezig te houden. Voor jongeren: bespreek met docenten de mogelijkheid om af en toe te staan of kort te bewegen.',
      thuis: 'Deel grote taken op in kleinere, behapbare stappen. Werk met timers voor specifieke activiteiten zoals opruimen. Voor jongeren: zorg voor voldoende fysieke uitlaatkleppen zoals sport of buitenspelen.',
      sociaal: 'Communiceer openlijk over je behoefte aan beweging. Kies voor actieve sociale bezigheden. Voor jongeren: onderneem actieve activiteiten met vrienden.',
      werk: 'Overweeg een sta-bureau of een dynamische zitoplossing. Integreer korte bewegingspauzes in je werkdag. Voor jongeren (bijbaan/stage): zoek een bijbaan die fysieke activiteit toelaat.'
    }
  },
  HSP: { 
    title:'Prikkelverwerking & Empathie', // Aangepast
    eigenschappen:'Diepgaande verwerking van prikkels, sterke empathie en gevoeligheid voor de omgeving.', 
    text:'Je herkent mogelijk een intense beleving van geluiden, licht of emoties.', 
    detail:'Als je patronen van hoge sensitiviteit herkent, verwerk je zintuiglijke informatie (geluiden, licht, geuren) en emotionele signalen vaak dieper en gedetailleerder. Dit kan leiden tot een rijk innerlijk leven en een sterk inlevingsvermogen, maar ook tot snellere overprikkeling in intense omgevingen. Dit wordt soms in verband gebracht met HSP-kenmerken.',
    color: 'rgba(153, 102, 255, 0.7)',
    uitleg: 'Patronen van hoge sensitiviteit voor prikkels (soms HSP genoemd) betekenen dat prikkels intenser worden waargenomen en verwerkt. Dit resulteert vaak in een genuanceerde waarneming, een sterk empathisch vermogen en een diep reflectief vermogen, maar kan ook leiden tot overstimulatie.',
    sterktepunten: ['Grote empathie en inlevingsvermogen', 'Sterke intuïtie', 'Opmerkzaamheid voor details en subtiele signalen', 'Creativiteit en diepgaande reflectie'],
    tips: {
      school: 'Neem regelmatig korte, rustige pauzes. Zoek indien mogelijk een rustige werkplek op. Voor jongeren: vind een rustig plekje op school tijdens pauzes om even op te laden.',
      thuis: 'Creëer een eigen rustige en prikkelarme ruimte. Plan bewust ontspanningsmomenten in je dagelijkse routine. Voor jongeren: zorg voor een eigen plek waar je je kunt terugtrekken als het te veel wordt.',
      sociaal: 'Plan hersteltijd na sociale activiteiten. Communiceer je behoeften en grenzen aan anderen. Voor jongeren: kies bewust met wie je afspreekt en voor hoe lang, en neem pauzes indien nodig.',
      werk: 'Overweeg noise-cancelling koptelefoons in drukke omgevingen. Vraag naar mogelijkheden voor een rustige werkplek. Voor jongeren (bijbaan/stage): zoek een omgeving die niet constant overstimulerend is.'
    }
  },
  ASS: { 
    title:'Sociale & Sensorische Voorkeuren', // Aangepast
    eigenschappen:'Behoefte aan structuur en voorspelbaarheid, specifieke interesses, unieke sociale interactie.', 
    text:'Je herkent mogelijk een voorkeur voor routines en een duidelijke communicatiestijl.', 
    detail:'Patronen die vaak passen bij sociale en sensorische voorkeuren (soms geassocieerd met ASS-kenmerken) omvatten een voorkeur voor voorspelbaarheid en structuur; onverwachte veranderingen kunnen stressvol zijn. Er kan sprake zijn van intense focus op specifieke interesses en een gedetailleerde manier van informatieverwerking. Sociale interactie en communicatie kunnen anders ervaren worden.',
    color: 'rgba(255, 206, 86, 0.7)',
    uitleg: 'Voorkeuren voor structuur en een specifieke manier van sociale en sensorische informatieverwerking (soms geassocieerd met ASS) uiten zich vaak in een sterke behoefte aan routine, een gedetailleerde manier van denken, intense focus op specifieke interesses, en een andere manier van sociale communicatie en interactie.',
    sterktepunten: ['Sterk analytisch denkvermogen', 'Oog voor detail en patronen', 'Eerlijkheid en loyaliteit', 'Diepgaande expertise in interessegebieden'],
    tips: {
      school: 'Gebruik visuele schema\'s en checklists. Vraag om duidelijke, concrete instructies voor opdrachten. Voor jongeren: vraag om een voorspelbaar weekschema en expliciete uitleg van verwachtingen.',
      thuis: 'Hanteer een consequente dagstructuur. Bereid veranderingen zorgvuldig en tijdig voor. Voor jongeren: communiceer veranderingen duidelijk en geef tijd om aan te passen.',
      sociaal: 'Kies sociale activiteiten met een duidelijke structuur of doel. Neem pauzes tussen sociale interacties. Voor jongeren: oefen sociale scenario\'s of vraag uitleg over ongeschreven sociale regels.',
      werk: 'Zoek een werkplek die structuur biedt en waar verwachtingen helder zijn. Maak afspraken over de gewenste communicatiestijl. Voor jongeren (bijbaan/stage): kies werk met duidelijke taken en routines.'
    }
  },
  AngstDepressie: { 
    title:'Stemmings- & Zorgpatronen', // Aangepast
    eigenschappen:'Neiging tot piekeren, mogelijke somberheid, behoefte aan steun en duidelijkheid.', 
    text:'Je herkent mogelijk dat je je vaak zorgen maakt of je soms neerslachtig voelt.', 
    detail:'Patronen van zorgen en/of somberheid kunnen invloed hebben op concentratie, energie en de beleving van sociale activiteiten. Het kan lastig zijn om positieve gedachten vast te houden of motivatie te vinden voor dagelijkse bezigheden.',
    color: 'rgba(54, 162, 235, 0.7)',
    uitleg: 'Stemmings- en zorgpatronen komen vaak voor en kunnen het dagelijks functioneren beïnvloeden. Zorgen kunnen zich uiten in overmatig piekeren en spanning, terwijl sombere gevoelens vaak gepaard gaan met neerslachtigheid, verlies van interesse en verminderde energie. Het is belangrijk hier aandacht aan te besteden en zo nodig professionele hulp te zoeken.',
    sterktepunten: ['Verhoogde zelfreflectie', 'Groot inlevingsvermogen in anderen', 'Voorzichtigheid en het zien van mogelijke risico\'s', 'Streven naar kwaliteit en grondigheid'],
    tips: {
      school: 'Houd een dagboek bij met positieve ervaringen. Bespreek zorgen met een vertrouwenspersoon. Voor jongeren: praat met een mentor, docent of schoolpsycholoog.',
      thuis: 'Integreer dagelijks ontspannings- of mindfulnessoefeningen. Focus op kleine, haalbare doelen en vier je successen. Voor jongeren: praat open met je ouders of een andere volwassene die je vertrouwt.',
      sociaal: 'Kies sociale activiteiten die je energie geven en niet te overweldigend zijn. Wees eerlijk naar vrienden over wat je nodig hebt. Voor jongeren: spreek af met vrienden bij wie je je veilig en begrepen voelt.',
      werk: 'Stel realistische doelen en deel grote taken op. Neem korte pauzes bij oplopende spanning. Voor jongeren (bijbaan/stage): geef je grenzen aan en vraag om hulp als het te veel wordt. Zoek professionele hulp als de klachten aanhouden.'
    }
  }
};

export const calculateAverage = (arr: (number | undefined)[]): number => {
  const validNumbers = arr.filter(n => typeof n === 'number' && n > 0) as number[];
  if (validNumbers.length === 0) {
    return 0; // Return 0 if no valid numbers to avoid NaN, which AI model might not like.
  }
  return validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length;
};

export const quizCategoryLabels: Record<string, string> = {
  // Main categories from creator
  'emoties_gevoelens': 'Emoties & Gevoelens',
  'vriendschappen_sociaal': 'Vriendschappen & Sociaal',
  'leren_school': 'Leren & School',
  'prikkels_omgeving': 'Prikkels & Omgeving',
  'wie_ben_ik': 'Wie ben ik?',
  'dromen_toekomst': 'Dromen & Toekomst',
  
  // Neurotypes from adaptive quiz
  'ADD': 'Aandacht & Focus',
  'ADHD': 'Energie & Impulsiviteit',
  'HSP': 'Prikkelverwerking & Empathie',
  'ASS': 'Sociale & Sensorische Voorkeuren',
  'AngstDepressie': 'Stemmings- & Zorgpatronen',
  
  // Quiz creator categories
  'Basis': 'Basis Zelfreflectie',
  'Thema': 'Thema Quiz',
  'Ouder Observatie': 'Ouder Observatie',
  
  // Specific quiz titles that might be used as keys
  'Omgaan met Examenvrees': 'Omgaan met Examenvrees',
  
  // Fallback
  'default': 'Algemeen Onderwerp'
};

export const getDisplayCategory = (key: string | undefined, title?: string): string => {
  if (!key) return quizCategoryLabels['default'];
  
  // For thematic quizzes, the title of the quiz itself is often the best display name.
  if (key === 'Thema' && title) {
    return title;
  }
  
  return quizCategoryLabels[key] || key.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
};


// Behoud de oude export voor compatibiliteit indien nodig, maar nieuwe code kan de specifiekere exports gebruiken.
export const baseQuestionsTeen = baseQuestionsTeen15_18;
export const subTestsTeen = subTestsTeen15_18;
export const thresholdsTeen = thresholdsTeen15_18;
