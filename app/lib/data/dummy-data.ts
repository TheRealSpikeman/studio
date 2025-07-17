dTime: '15:00', durationMinutes: 90 },
  { date: new Date(Date.now() - 86400000 * 3).toISOString(), startTime: '10:15', endTime: '12:00', durationMinutes: 105 },
  { date: new Date(Date.now() - 86400000 * 2).toISOString(), startTime: '14:30', endTime: '16:45', durationMinutes: 135 },
  { date: new Date(Date.now() - 86400000 * 1).toISOString(), startTime: '11:00', endTime: '13:30', durationMinutes: 150 },
  { date: new Date().toISOString(), startTime: '09:05', endTime: '11:30', durationMinutes: 145 },
];
@gmail.com', status: 'actief', role: 'admin', lastLogin: new Date(Date.now() - 86400000 * 1).toISOString(), createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), avatarUrl: 'https://picsum.photos/seed/glenna/40/40' },
  { id: 'hvoirlp9KENHsYw5Je2dnRFW', name: 'Glenn Bosch', email: 'glenn.bosch@outlook.com', status: 'actief', role: 'ouder', lastLogin: new Date(Date.now() - 86400000 * 2).toISOString(), createdAt: new Date(Date.now() - 86400000 * 50).toISOString(), avatarUrl: 'https://picsum.photos/seed/glennb/40/40', children: ['aEBZ4voLmgSzx4Ww9ZbK6x'] },
  { id: 'aEBZ4voLmgSzx4Ww9ZbK6x', name: 'R.G.M. Bosch', email: 'bosch.rgm@gmail.com', status: 'actief', role: 'leerling', ageGroup: '15-18', parentId: 'hvoirlp9KENHsYw5Je2dnRFW', lastLogin: new Date(Date.now() - 86400000 * 0.5).toISOString(), createdAt: new Date(Date.now() - 86400000 * 40).toISOString(), avatarUrl: 'https://picsum.photos/seed/rgmb/40/40' },
  { id: 'tutor1', name: 'Anna Visser', email: 'anna.visser@tutor-platform.com', status: 'actief', role: 'tutor', lastLogin: new Date(Date.now() - 86400000 * 3).toISOString(), createdAt: new Date(Date.now() - 86400000 * 60).toISOString(), avatarUrl: 'https://picsum.photos/seed/annav/40/40', tutorDetails: { subjects: ['Wiskunde', 'Natuurkunde'], hourlyRate: 35, bio: "Ervaren docent met passie voor exacte vakken.", availability: "Ma, Wo, Vr avond", totalRevenue: 1250, averageRating: 4.8 } },
  { 
    id: 'coach1', 
    name: 'Edward Coachman', 
    email: 'edward.coach@coach-circle.net', 
    status: 'actief', 
    role: 'coach', 
    lastLogin: new Date(Date.now() - 86400000 * 1).toISOString(), 
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), 
    avatarUrl: 'https://picsum.photos/seed/edwardc/40/40', 
    coaching: { startDate: new Date(Date.now() - 86400000 * 5).toISOString(), interval: 1, currentDayInFlow: 5 },
    coachDetails: {
        specializations: ['Faalangst reductie', 'Zelfvertrouwen opbouwen'],
        hourlyRate: 85,
        bio: "Gecertificeerd coach met een focus op de sociaal-emotionele ontwikkeling van adolescenten.",
        availability: "Ma, Di avond",
    }
  },
  { id: '2', name: 'Bob De Bouwer', email: 'bob@example.com', status: 'niet geverifieerd', role: 'leerling', ageGroup: '15-18', lastLogin: new Date(Date.now() - 86400000 * 5).toISOString(), createdAt: new Date(Date.now() - 86400000 * 20).toISOString(), avatarUrl: 'https://picsum.photos/seed/bob/40/40' },
  { id: '5', name: 'Diana Prince', email: 'diana@example.com', status: 'actief', role: 'leerling', ageGroup: '12-14', lastLogin: new Date(Date.now() - 86400000 * 12).toISOString(), createdAt: new Date(Date.now() - 86400000 * 60).toISOString(), avatarUrl: 'https://picsum.photos/seed/diana/40/40' },
];

// From admin/tutor-management/page.tsx
export const DUMMY_TUTORS: User[] = [
  { id: 't1', name: 'Dr. Anna Visser', email: 'anna.visser@tutor-platform.com', status: 'actief', role: 'tutor', lastLogin: new Date(Date.now() - 86400000 * 1).toISOString(), createdAt: new Date(Date.now() - 86400000 * 90).toISOString(), avatarUrl: 'https://picsum.photos/seed/annavisser/40/40', tutorDetails: { subjects: ['Wiskunde', 'Natuurkunde'], hourlyRate: 35, bio: "Ervaren docent met passie voor exacte vakken.", availability: "Ma, Wo, Vr avond", totalRevenue: 1250, averageRating: 4.8 } },
  { id: 't2', name: 'Mark de Wit', email: 'mark.dewit@example.com', status: 'pending_approval', role: 'tutor', lastLogin: new Date(Date.now() - 86400000 * 3).toISOString(), createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), tutorDetails: { subjects: ['Engels'], hourlyRate: 25, bio: "Native speaker, focus op spreekvaardigheid.", availability: "Weekend" } },
  { id: 't3', name: 'Sofia El Amrani', email: 'sofia.elamrani@example.com', status: 'actief', role: 'tutor', lastLogin: new Date(Date.now() - 86400000 * 2).toISOString(), createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), avatarUrl: 'https://picsum.photos/seed/sofiaelamrani/40/40', tutorDetails: { subjects: ['Nederlands', 'Geschiedenis'], hourlyRate: 30, bio: "Geduldig en helpt met structuur.", availability: "Di, Do middag/avond", totalRevenue: 870, averageRating: 4.5 } },
  { id: 't4', name: 'Ben Scholten', email: 'ben.scholten@example.com', status: 'pending_onboarding', role: 'tutor', lastLogin: new Date().toISOString(), createdAt: new Date().toISOString(), tutorDetails: { bio: "Nieuwe aanmelding, wacht op afronden profiel."} },
  { id: 't5', name: 'Carla Dammers', email: 'carla.dammers@example.com', status: 'rejected', role: 'tutor', lastLogin: new Date(Date.now() - 86400000 * 10).toISOString(), createdAt: new Date(Date.now() - 86400000 * 12).toISOString(), tutorDetails: { bio: "Aanmelding afgewezen, VOG niet correct."} },
];

// From admin/feedback-overview/page.tsx
export const dummyFeedbackEntries: FeedbackEntry[] = [
  { id: 'fb1', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), name: 'Alice Tester', email: 'alice@example.com', feedbackType: 'bug', pageOrFeature: 'dashboard_leerling', description: 'De knop om resultaten te bekijken werkt niet op mobiel. Ik klik erop maar er gebeurt niets.', priority: 'hoog', status: 'nieuw' },
  { id: 'fb2', timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), feedbackType: 'suggestie', pageOrFeature: 'dashboard_coaching', description: 'Het zou fijn zijn als ik de dagelijkse affirmatie ook als pushnotificatie kan ontvangen.', priority: 'normaal', status: 'in behandeling' },
  { id: 'fb3', timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), name: 'Bob Admin', email: 'bob.admin@example.com', feedbackType: 'algemeen', pageOrFeature: 'algemeen_platform', description: 'De website laadt over het algemeen snel, goed werk! De kleuren zijn ook prettig.', priority: 'laag', status: 'afgehandeld' },
  { id: 'fb4', timestamp: new Date(Date.now() - 50 * 3600 * 1000).toISOString(), feedbackType: 'ui_ux', pageOrFeature: 'registratie_login', description: 'Het lettertype in het wachtwoordveld is erg klein op mijn Android telefoon.', priority: 'normaal', status: 'gesloten' },
  { id: 'fb5', timestamp: new Date().toISOString(), name: 'Charlie Feedbackgever', email: 'charlie.f@example.net', feedbackType: 'suggestie', pageOrFeature: 'anders', otherPageOrFeature: 'De FAQ sectie voor ouders', description: 'Ik mis een vraag over hoe je als ouder kunt zien welke specifieke coaching modules mijn kind heeft doorlopen.', priority: 'normaal', status: 'nieuw' },
];

// From ouder/berichten/page.tsx
export const dummyConversations: Conversation[] = [
    { id: 'conv1', tutorId: 'tutor1', tutorName: 'Mevr. Jansen', tutorAvatar: 'https://picsum.photos/seed/jansen/40/40', childName: 'Sofie de Tester', lastMessage: 'Prima, dan zie ik Sofie volgende week dinsdag om 15:00. We gaan dan verder met de voorbereiding voor de toets.', lastMessageTimestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), unreadCount: 0, messages: [ { id: 'm1a', sender: 'ouder', text: 'Hoi Mevr. Jansen, zou de les van Sofie aanstaande dinsdag een half uurtje later kunnen?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }, { id: 'm1b', sender: 'tutor', text: 'Hallo! Ja hoor, dat is geen probleem. Zullen we dan 15:00 uur afspreken?', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() }, { id: 'm1c', sender: 'ouder', text: 'Perfect, dank u wel!', timestamp: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString() }, { id: 'm1d', sender: 'tutor', text: 'Prima, dan zie ik Sofie volgende week dinsdag om 15:00. We gaan dan verder met de voorbereiding voor de toets.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }, ], },
    { id: 'conv2', tutorId: 'tutor2', tutorName: 'Dhr. Pietersen', tutorAvatar: 'https://picsum.photos/seed/pietersen/40/40', childName: 'Max de Tester', lastMessage: 'Dank voor het lesverslag, Dhr. Pietersen! Max vond de les erg nuttig en kijkt uit naar de volgende.', lastMessageTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), unreadCount: 1, messages: [ { id: 'm2a', sender: 'tutor', text: 'Max heeft vandaag goed gewerkt aan de onregelmatige werkwoorden. Zie lesverslag.', timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), isRead: false }, { id: 'm2b', sender: 'ouder', text: 'Dank voor het lesverslag, Dhr. Pietersen! Max vond de les erg nuttig en kijkt uit naar de volgende.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isRead: true }, ], },
    { id: 'conv3', tutorId: 'tutor3', tutorName: 'Juf Anja', tutorAvatar: `https://placehold.co/40x40.png?text=JA`, childName: 'Lisa Voorbeeld', lastMessage: 'Zou Lisa de volgende les de afronding van H3 willen voorbereiden? Dat zou enorm helpen.', lastMessageTimestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), unreadCount: 0, messages: [ { id: 'm3a', sender: 'tutor', text: 'Zou Lisa de volgende les de afronding van H3 willen voorbereiden? Dat zou enorm helpen.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }, ], },
    { id: 'conv4', tutorId: 'tutor4', tutorName: 'Meneer de Boer', tutorAvatar: 'https://picsum.photos/seed/deboer/40/40', childName: 'Sofie de Tester', lastMessage: 'De betaling voor de extra les van vorige week is nog niet verwerkt, kunt u daar naar kijken?', lastMessageTimestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), unreadCount: 2, messages: [ { id: 'm4a', sender: 'tutor', text: 'Hallo, kleine herinnering over de openstaande betaling.', timestamp: new Date(Date.now() - 3.1 * 24 * 60 * 60 * 1000).toISOString(), isRead: false }, { id: 'm4b', sender: 'tutor', text: 'De betaling voor de extra les van vorige week is nog niet verwerkt, kunt u daar naar kijken?', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), isRead: false }, ], },
    { id: 'conv5', tutorId: 'tutor5', tutorName: 'Dr. El Massih', tutorAvatar: `https://placehold.co/40x40.png?text=EM`, childName: 'Max de Tester', lastMessage: 'Absoluut, we kunnen volgende week maandag om 16:00 beginnen met de extra sessie over React Hooks.', lastMessageTimestamp: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(), unreadCount: 0, messages: [ { id: 'm5a', sender: 'ouder', text: 'Zou Max een extra les kunnen krijgen over React Hooks?', timestamp: new Date(Date.now() - 0.8 * 60 * 60 * 1000).toISOString() }, { id: 'm5b', sender: 'tutor', text: 'Absoluut, we kunnen volgende week maandag om 16:00 beginnen met de extra sessie over React Hooks.', timestamp: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString() }, ], },
];

// From ouder/facturatie/page.tsx
export const dummySubscriptions: OuderSubscription[] = [
  { id: 'sub1', childName: 'Sofie de Tester', planName: 'Coaching Maandelijks', price: '€2,50/mnd', status: 'actief', nextBillingDate: '15-07-2024' },
  { id: 'sub2', childName: 'Max de Tester', planName: 'Coaching Jaarlijks', price: '€25/jaar', status: 'actief', nextBillingDate: '01-01-2025' },
];
export const dummyPayableLessons: PayableLesson[] = [
  { id: 'lesson1', childName: 'Sofie de Tester', subject: 'Wiskunde A', tutorName: 'Mevr. Jansen', lessonDate: new Date(Date.now() - 2 * 86400000).toISOString(), amount: 20.00 },
  { id: 'lesson2', childName: 'Max de Tester', subject: 'Engels', tutorName: 'Dhr. Pietersen', lessonDate: new Date(Date.now() - 1 * 86400000).toISOString(), amount: 18.50 },
];

// From ouder/gekoppelde-tutors/page.tsx
export const dummyChildrenData: ChildBase[] = [
  { id: 'child1', name: 'Sofie de Tester', avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80' },
  { id: 'child2', name: 'Max de Tester', avatarUrl: 'https://picsum.photos/seed/maxchild/80/80' },
  { id: 'child3', name: 'Lisa Voorbeeld' },
];
export const dummyProfessionalsData: ProfessionalBase[] = [
  { id: 'tutor1', name: 'Mevr. A. Jansen', type: 'tutor', avatarUrl: 'https://picsum.photos/seed/tutorJansen/80/80', specializations: ['wiskunde', 'natuurkunde'] },
  { id: 'tutor2', name: 'Dhr. B. de Vries', type: 'tutor', avatarUrl: 'https://picsum.photos/seed/tutorDeVries/80/80', specializations: ['nederlands', 'engels'] },
  { id: 'tutor3', name: 'Dr. C. El Amrani', type: 'tutor', avatarUrl: 'https://picsum.photos/seed/tutorElAmrani/80/80', specializations: ['biologie', 'scheikunde'] },
];

// From ouder/kinderen/page.tsx & profiel
export const dummyChildren: ChildProfile[] = [
   { id: 'child1', firstName: 'Sofie', lastName: 'de Tester', name: 'Sofie de Tester', age: 13, ageGroup: '12-14', avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80', subscriptionStatus: 'actief', planId: 'family_guide_monthly', planName: 'Gezins Gids - Maandelijks', lastActivity: 'Quiz "Basis Neuroprofiel" voltooid', childEmail: 'sofie.tester@example.com', schoolType: 'HAVO', className: '2B', helpSubjects: ['wiskunde', 'nederlands'], hulpvraagType: ['tutor', 'coach'], leerdoelen: 'Geselecteerd: Beter leren plannen voor toetsen, Omgaan met faalangst. Overig: Kind heeft moeite met beginnen aan taken.', voorkeurTutor: 'Geselecteerde voorkeuren: Ervaring met HSP, Geduldig. Overig: Iemand met ervaring met visueel ingestelde leerlingen.', deelResultatenMetTutor: true, linkedTutorIds: ['tutor1'], },
  { id: 'child2', firstName: 'Max', lastName: 'de Tester', name: 'Max de Tester', age: 16, ageGroup: '15-18', avatarUrl: 'https://picsum.photos/seed/maxchild/80/80', subscriptionStatus: 'actief', planId: 'family_guide_monthly', planName: 'Gezins Gids - Maandelijks', lastActivity: 'Laatste les: Engels (1 dag geleden)', childEmail: 'max.tester@example.com', schoolType: 'VWO', helpSubjects: ['engels', 'geschiedenis'], hulpvraagType: ['tutor', 'coach'], leerdoelen: 'Geselecteerd: Concentratie verbeteren tijdens de les. Overig: Verbeteren van spreekvaardigheid Engels en essay schrijven.', voorkeurTutor: 'Geselecteerde voorkeuren: Man. Overig: Tutor die ook kan helpen met motivatie.', deelResultatenMetTutor: false, linkedTutorIds: [], },
  { id: 'child3', firstName: 'Lisa', lastName: 'Voorbeeld', name: 'Lisa Voorbeeld', age: 12, ageGroup: '12-14', subscriptionStatus: 'geen', planId: undefined, planName: undefined, lastActivity: 'Coaching tip van gisteren bekeken', childEmail: 'lisa.voorbeeld@example.com', schoolType: 'Anders', otherSchoolType: 'Internationale School', helpSubjects: [], hulpvraagType: ['coach'], leerdoelen: 'Geselecteerd: Zelfvertrouwen vergroten.', voorkeurTutor: 'Geselecteerde voorkeuren: Vrouw, Ervaring met faalangst.', deelResultatenMetTutor: true, linkedTutorIds: ['tutor2', 'tutor3'], },
];

// From ouder/kinderen/[kindId]/voortgang/page.tsx
export const dummyProgressData: Record<string, ChildProgressData> = {
  'child1': { id: 'child1', name: 'Sofie de Tester', avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80', ageGroup: '12-14', recentQuizzes: [ { id: 'neuro1', quizId: 'quiz-abc', title: 'Basis Neuroprofiel (12-14 jr)', dateCompleted: new Date(Date.now() - 5 * 86400000).toISOString(), score: 'HSP & Focus', reportData: { summary: 'Sofie laat een sterk ontwikkeld empathisch vermogen zien en een goed oog voor detail. Concentratie bij routineuze taken is een aandachtspunt.', answers: [ { question: "Hoe voel je je meestal in sociale situaties?", answer: "Afhankelijk van de situatie" }, { question: "Hoe ga je om met onverwachte veranderingen?", answer: "Ik vind het lastig, maar pas me aan." }, { question: "Wat doe je als je overprikkeld raakt?", answer: "Ik zoek een rustig plekje op." } ], }, isShared: true, reportLink: '#' }, { id: 'focus1', quizId: 'quiz-def', title: 'Focus & Planning Quiz', dateCompleted: new Date(Date.now() - 12 * 86400000).toISOString(), score: 'Gemiddeld', reportData: { summary: 'Resultaten wijzen op een behoefte aan meer structuur in planning. Tips voor Pomodoro techniek gegeven.', answers: [ { question: "Hoe vaak stel je huiswerk uit?", answer: "Soms" }, { question: "Gebruik je een agenda of planner?", answer: "Niet altijd consequent" } ], }, isShared: true, }, ], tutorFeedback: [ { feedbackId: 'fb1', date: new Date(Date.now() - 3 * 86400000).toISOString(), tutorName: 'Mevr. Jansen', lessonSubject: 'Wiskunde A', comment: 'Sofie was vandaag erg betrokken en stelde goede vragen over algebra. We hebben de basis van vergelijkingen oplossen doorgenomen. Huiswerk: oefeningen 1 t/m 5.' }, { feedbackId: 'fb2', date: new Date(Date.now() - 10 * 86400000).toISOString(), tutorName: 'Dhr. Pietersen', lessonSubject: 'Engels Grammatica', comment: 'De onregelmatige werkwoorden blijven lastig. Extra oefening met de lijst is aanbevolen. Goed gewerkt aan de uitspraak.' }, ], activityData: [ { month: 'Jan', completedLessons: 3, completedQuizzes: 1 }, { month: 'Feb', completedLessons: 4, completedQuizzes: 2 }, { month: 'Maa', completedLessons: 2, completedQuizzes: 1 }, ], goals: [ { goalId: 'goal1', description: 'Alle wiskunde huiswerk op tijd af hebben deze maand.', status: 'in_progress' } ] },
  'child2': { id: 'child2', name: 'Max de Tester', avatarUrl: 'https://picsum.photos/seed/maxchild/80/80', ageGroup: '15-18', recentQuizzes: [ { id: 'neuro2', quizId: 'quiz-ghi', title: 'Basis Neuroprofiel (15-18 jr)', dateCompleted: new Date(Date.now() - 8 * 86400000).toISOString(), score: 'ADHD Kenmerken', reportData: { summary: 'Max is een creatieve denker en komt snel tot oplossingen. Het vasthouden van aandacht bij langere uitleg kan een uitdaging zijn.', answers: [ { question: "Hoe ga je om met deadlines?", answer: "Ik werk het beste onder druk, dus vaak op het laatste moment." }, ] }, isShared: false, }, ], tutorFeedback: [ { feedbackId: 'fb3', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), tutorName: 'Mevr. de Wit', lessonSubject: 'Nederlands', comment: 'Tekstanalyse van gedichten ging goed. Max kan zijn argumenten goed onderbouwen. Focus volgende keer op synoniemen.' }, ], activityData: [ { month: 'Jan', completedLessons: 2, completedQuizzes: 0 }, { month: 'Feb', completedLessons: 1, completedQuizzes: 1 }, { month: 'Maa', completedLessons: 3, completedQuizzes: 0 }, ], },
};

// From ouder/lessen pages
export const initialScheduledLessons: ScheduledLesson[] = [
  { id: 'sl1', childId: 'child1', childName: 'Sofie de Tester', subject: 'Wiskunde', subjectId: 'wiskunde', dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Jansen', status: 'Gepland' },
  { id: 'sl1-short', childId: 'child1', childName: 'Sofie de Tester', subject: 'Wiskunde Kort', subjectId: 'wiskunde', dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Jansen', status: 'Gepland' },
  { id: 'sl1-medium', childId: 'child1', childName: 'Sofie de Tester', subject: 'Wiskunde Medium', subjectId: 'wiskunde', dateTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Jansen', status: 'Bezig' },
  { id: 'sl2', childId: 'child2', childName: 'Max de Tester', subject: 'Engels', subjectId: 'engels', dateTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, tutorName: 'Dhr. Pietersen', status: 'Gepland' },
  { id: 'sl3', childId: 'child1', childName: 'Sofie de Tester', subject: 'Nederlands', subjectId: 'nederlands', dateTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. de Wit', status: 'Voltooid', report: "Sofie heeft goed geoefend met werkwoordspelling. De d/t regels zijn nog een aandachtspunt. Tip: extra oefeningen maken op www.voorbeeld.nl/dt. Volgende les focussen op onregelmatige werkwoorden." },
  { id: 'sl4', childId: 'child2', childName: 'Max de Tester', subject: 'Geschiedenis', subjectId: 'geschiedenis', dateTime: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, tutorName: 'Dhr. Bakker', status: 'Voltooid' },
  { id: 'sl5', childId: 'child1', childName: 'Sofie de Tester', subject: 'Biologie', subjectId: 'biologie', dateTime: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Groen', status: 'Geannuleerd' },
  { id: 'sl6', childId: 'child3', childName: 'Lisa Voorbeeld', subject: 'Aardrijkskunde', subjectId: 'aardrijkskunde', dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Sterre', status: 'Gepland', recurringGroupId: 'recur-lisa-ak' },
  { id: 'sl7', childId: 'child3', childName: 'Lisa Voorbeeld', subject: 'Aardrijkskunde', subjectId: 'aardrijkskunde', dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, tutorName: 'Mevr. Sterre', status: 'Gepland', recurringGroupId: 'recur-lisa-ak' },
];

// From coach/lessons/page.tsx
export const dummyUpcomingCoachSessions: CoachingSession[] = [
  { id: 'cs1', clientId: 'clientA', clientName: 'Anna Visser', clientAvatar: 'https://picsum.photos/seed/annavisser/40/40', sessionTopic: 'Doelen stellen & motivatie', dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), durationMinutes: 50, status: 'Gepland', meetingLink: '#' },
  { id: 'cs2', clientId: 'clientB', clientName: 'Ben Kramer', sessionTopic: 'Omgaan met studiestress', dateTime: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(), durationMinutes: 50, status: 'Gepland' },
];
export const dummyPastCoachSessions: CoachingSession[] = [
  { id: 'pcs1', clientId: 'clientC', clientName: 'Carla de Jong', clientAvatar: 'https://picsum.photos/seed/carladejong/40/40', sessionTopic: 'Communicatievaardigheden', dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 50, status: 'Voltooid', report: "Carla heeft goede stappen gezet in het assertief uiten van haar behoeften. Oefening voor volgende week: een 'ik'-boodschap formuleren in een lastige situatie." },
  { id: 'pcs2', clientId: 'clientD', clientName: 'David Smit', sessionTopic: 'Zelfvertrouwen versterken', dateTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 50, status: 'Geannuleerd', report: "Sessie geannuleerd door cliënt ivm ziekte." },
];

// From tutor/lessons/page.tsx
export const dummyUpcomingLessons: Lesson[] = [
  { id: 'l1', studentId: 's1', studentName: 'Eva de Vries', studentAvatar: 'https://picsum.photos/seed/evavries/40/40', subject: 'Wiskunde A', dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Gepland', meetingLink: '#' },
  { id: 'l2', studentId: 's2', studentName: 'Tom Bakker', subject: 'Engels Spreken', dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Gepland' },
  { id: 'l3', studentId: 's3', studentName: 'Sara El Idrissi', studentAvatar: 'https://picsum.photos/seed/saraidrissi/40/40', subject: 'Natuurkunde H.5', dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Gepland' },
];
export const dummyPastLessons: Lesson[] = [
  { id: 'p1', studentId: 's1', studentName: 'Jan Janssen', subject: 'Wiskunde B', dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Voltooid', report: "Jan heeft goed gewerkt aan de stelling van Pythagoras. Oefenen met toepassingen is nog nodig." },
  { id: 'p2', studentId: 's2', studentName: 'Pien de Wit', studentAvatar: 'https://picsum.photos/seed/piendewit/40/40', subject: 'Nederlands Grammatica', dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Voltooid' },
  { id: 'p3', studentId: 's3', studentName: 'Mo El Hamdaoui', subject: 'Scheikunde', dateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Geannuleerd', report: "Les geannuleerd door student." },
];

// From coach/students/page.tsx
export const dummyClients: ClientEntry[] = [
  { id: 'clientA', name: 'Anna Visser', avatarUrl: 'https://picsum.photos/seed/annavisser/40/40', coachingFocusAreas: ['Zelfvertrouwen', 'Stressmanagement'], lastSessionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), totalSessionsWithCoach: 8 },
  { id: 'clientB', name: 'Ben Kramer', coachingFocusAreas: ['Communicatievaardigheden'], lastSessionDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), totalSessionsWithCoach: 4 },
  { id: 'clientC', name: 'Carla de Jong', avatarUrl: 'https://picsum.photos/seed/carladejong/40/40', coachingFocusAreas: ['Doelen stellen', 'Perfectionisme'], totalSessionsWithCoach: 12 },
];

// From tutor/students/page.tsx
export const dummyStudents: StudentEntry[] = [
  { id: 's1', name: 'Eva de Vries', avatarUrl: 'https://picsum.photos/seed/evavries/40/40', subjectsTaughtByTutor: ['Wiskunde A', 'Natuurkunde'], lastLessonDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), totalLessonsWithTutor: 5 },
  { id: 's2', name: 'Tom Bakker', subjectsTaughtByTutor: ['Engels Spreken'], lastLessonDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), totalLessonsWithTutor: 8 },
  { id: 's3', name: 'Sara El Idrissi', avatarUrl: 'https://picsum.photos/seed/saraidrissi/40/40', subjectsTaughtByTutor: ['Scheikunde'], totalLessonsWithTutor: 2 },
  { id: 'p1', name: 'Jan Janssen', subjectsTaughtByTutor: ['Wiskunde B'], lastLessonDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), totalLessonsWithTutor: 12 },
];

// From tutor/students/[studentId]/page.tsx
export const allStudentDetails: Record<string, StudentDetails> = {
  s1: { id: 's1', name: 'Eva de Vries', avatarUrl: 'https://picsum.photos/seed/evavries/80/80', email: 'eva.devries@example.com', lessonHistory: [ { id: 'l1', subject: 'Wiskunde A', dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Gepland' }, { id: 'p1s1', subject: 'Wiskunde A', dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: 'Voltooid', report: "Eva begrijpt de basis van functies goed. Volgende keer focussen op afgeleiden." }, { id: 'p4s1', subject: 'Natuurkunde', dateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Voltooid', report: "Mechanica doorgenomen, huiswerkopgaven besproken. Goede vooruitgang." }, ], },
  s2: { id: 's2', name: 'Tom Bakker', email: 'tom.bakker@example.com', lessonHistory: [ { id: 'l2', subject: 'Engels Spreken', dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Gepland' }, { id: 'p2s2', subject: 'Engels Grammatica', dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 45, status: 'Voltooid' }, ], },
};

// New: Central source for all completed quizzes
export const dummyCompletedQuizzes: Omit<QuizResult, 'id'>[] = [
  { quizId: 'teen-neurodiversity-quiz-15-18-default', title: 'Zelfreflectie Start (15-18 jr)', dateCompleted: new Date(Date.now() - 86400000).toISOString(), score: 'Profiel: HSP & Focus', userId: 'aEBZ4voLmgSzx4Ww9ZbK6x', userName: 'R.G.M. Bosch', reportData: { summary: 'Hoge score op prikkelgevoeligheid.' }, isShared: true },
  { quizId: 'exam-stress-quiz-default', title: 'Omgaan met Examenvrees', dateCompleted: new Date(Date.now() - 86400000 * 3).toISOString(), score: 'Gem. score: 2.8/4', userId: '5', userName: 'Diana Prince', reportData: { summary: 'Indicatie van milde examenvrees.' }, isShared: false },
  { quizId: 'ouder-ken-je-kind-quiz', title: 'Ken Je Kind: Basis Observatie', dateCompleted: new Date(Date.now() - 86400000 * 2).toISOString(), score: 'Indicatie: Aandachtspunten bij planning', userId: 'hvoirlp9KENHsYw5Je2dnRFW', userName: 'Glenn Bosch', reportData: { summary: 'Ouder observeert moeite met starten van taken.' }, isShared: true },
];

// New: Central source for activity log data
export const dummyActivityLog: Omit<ActivityLogEntry, 'id'>[] = [
  { date: new Date(Date.now() - 86400000 * 5).toISOString(), startTime: '13:00', endTime: '16:00', durationMinutes: 180 },
  { date: new Date(Date.now() - 86400000 * 4).toISOString(), startTime: '09:30', endTime: '12:30', durationMinutes: 180 },
  { date: new Date(Date.now() - 86400000 * 4).toISOString(), startTime: '13:30', en