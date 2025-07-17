// src/lib/data/blog-data.ts
import type { BlogPost } from '@/types/blog';

// This is now the single source of truth for the initial dummy data.
// The slugs are generated from the title to ensure consistency.
export const initialBlogPosts: BlogPost[] = [
  {
    id: '1', 
    slug: 'superfocus-adhd-je-game-skills-ook-voor-huiswerk',
    title: 'Superfocus! ADHD: Je Game-Skills Ook Voor Huiswerk!',
    excerpt: 'Ontdek hoe je de unieke kracht van je ADHD-brein kunt inzetten voor gamen én school, want focus is te leren!',
    content: `<h2>Jouw ADHD is een Superkracht in Disguise</h2>
<p>Veel jongeren met ADHD-kenmerken horen vaak dat ze 'moeite hebben met concentreren'. Maar als het op gamen aankomt, kun je je vaak urenlang hyperfocussen. Wat als je diezelfde superkracht kunt gebruiken voor je huiswerk? De sleutel is niet om harder te proberen, maar om slimmer te leren.</p>
<h3>De Game-Mechanics van Leren</h3>
<p>Denk aan je huiswerk als een game met verschillende levels en quests. Hier zijn een paar 'game mechanics' die je kunt toepassen:</p>
<ul>
    <li><strong>Level Up:</strong> Verdeel een grote taak (zoals een hoofdstuk leren) in kleine 'levels' (paragrafen). Elke voltooide paragraaf is een level up!</li>
    <li><strong>Side Quests:</strong> Gebruik de Pomodoro Techniek. Werk 20 minuten (een 'quest'), en neem dan 5 minuten pauze om een 'side quest' te doen (iets drinken, even bewegen).</li>
    <li><strong>Boss Battle:</strong> De eindtoets is de 'eindbaas'. Elke studiesessie is een training om sterker te worden voor die strijd.</li>
</ul>
<h3>Creëer Je Eigen Gaming Setup... voor Huiswerk</h3>
<p>Net als bij gamen, is je omgeving cruciaal. Creëer een 'focus zone' zonder afleidingen. Gebruik een koptelefoon met rustige muziek (je 'game-soundtrack') en zorg dat je telefoon buiten bereik is. Zo maak je van je bureau een high-score zone voor je huiswerk.</p>
`,
    authorId: 'admin1', authorName: 'Dr. Florentine Sage (Psycholoog)',
    personaId: 'dr-florentine-sage',
    featuredImageUrl: 'https://placehold.co/1200x630.png', featuredImageHint: 'teenager gaming focused',
    status: 'published', tags: ['adhd', 'gamen', 'huiswerk', 'focus', 'tieners'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '2', 
    slug: 'puberteit-met-een-neurodivergent-kind-tips', 
    title: 'Puberteit met een Neurodivergent Kind: Tips',
    excerpt: 'Navigeren door de puberteit met een neurodivergent kind kan uitdagend zijn, maar met de juiste strategieën kun je stress verminderen en de verbinding versterken.',
    content: `<h2>Een Dubbele Uitdaging: Puberteit en Neurodiversiteit</h2><p>De puberteit is al een rollercoaster van emoties en veranderingen. Voor een neurodivergent kind kunnen deze veranderingen nog intenser zijn. Hun gevoeligheid voor prikkels, behoefte aan structuur, of unieke manier van sociale interactie kan botsen met de chaos van de tienerjaren.</p><h3>Tip 1: Valideer, Valideer, Valideer</h3><p>Het belangrijkste wat je kunt doen, is de ervaring van je kind erkennen. Zeg niet "stel je niet aan", maar "ik zie dat dit overweldigend voor je is, hoe kan ik helpen?". Dit bouwt vertrouwen en veiligheid op.</p><h3>Tip 2: De 'Prikkel-Thermometer'</h3><p>Maak samen een schaal van 1 tot 10 voor prikkels. Vraag gedurende de dag: "Hoe staat je thermometer?". Dit geeft je kind een taal om hun interne staat te communiceren voordat het tot een uitbarsting komt. Bij een 7 of 8 is het tijd voor een rustmoment.</p><h3>Tip 3: Kies je Strijd</h3><p>Is een opgeruimde kamer echt de belangrijkste strijd als je kind al zijn energie nodig heeft om de schooldag door te komen? Prioriteer wat echt belangrijk is (welzijn, school, familieband) en laat minder belangrijke zaken soms varen.</p>`,
    authorId: 'admin1', authorName: 'Dr. Florentine Sage (Psycholoog)',
    personaId: 'dr-florentine-sage',
    featuredImageUrl: 'https://placehold.co/1200x630.png', featuredImageHint: 'teenager pensive papers',
    status: 'published', tags: ['puberteit', 'neurodiversiteit', 'ouders', 'tips'],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    linkedQuizId: 'exam-stress-quiz-default',
    linkedQuizTitle: 'Omgaan met Examenvrees',
  },
  {
    id: '3', 
    slug: 'volgende-artikel-concept', 
    title: 'Volgende Artikel (Concept)',
    excerpt: 'Dit is een concept en nog niet zichtbaar voor publiek.',
    content: `<p>Hier komt de content voor een toekomstig artikel.</p>`,
    authorId: 'admin1', authorName: 'Dr. Florentine Sage',
    personaId: 'dr-florentine-sage',
    featuredImageUrl: 'https://placehold.co/1200x630.png', featuredImageHint: 'writing desk notes',
    status: 'draft', tags: ['Concept'],
    createdAt: new Date().toISOString(),
  },
];
