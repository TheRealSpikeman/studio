// src/lib/data/blog-data.ts
import type { BlogPost } from '@/types/blog';

// This is now the single source of truth for the initial dummy data.
export const initialBlogPosts: BlogPost[] = [
  {
    id: '1', slug: 'hoe-help-ik-mijn-tiener-focussen', title: 'Hoe help ik mijn tiener focussen?',
    excerpt: 'Ontdek 5 concrete, direct toepasbare tips...',
    content: `<h2>De Uitdaging van Focus in de 21e Eeuw</h2>
<p>In een wereld vol constante notificaties, eindeloze social media feeds en de druk om altijd 'aan' te staan, is het voor tieners moeilijker dan ooit om zich te concentreren. Vooral voor neurodivergente jongeren, die prikkels vaak intenser ervaren, kan dit een dagelijkse strijd zijn. Het is echter geen verloren strijd. Met de juiste strategieën kunt u als ouder een omgeving creëren die focus bevordert.</p>
<h3>Tip 1: Creëer een 'Focus Oase'</h3>
<p>De omgeving heeft een enorme impact op onze concentratie. Een 'focus oase' is een specifieke plek in huis die uitsluitend bedoeld is voor geconcentreerd werk.</p>
<ul>
    <li><strong>Geen telefoons:</strong> Maak de regel dat telefoons (en andere afleidende apparaten) buiten deze zone blijven.</li>
    <li><strong>Minimaliseer rommel:</strong> Een opgeruimd bureau zorgt voor een opgeruimd hoofd.</li>
    <li><strong>Goede verlichting en ergonomie:</strong> Zorg voor een comfortabele stoel en voldoende licht.</li>
</ul>
<h3>Tip 2: De Kracht van de Pomodoro Techniek</h3>
<p>De Pomodoro Techniek is simpel maar effectief:</p>
<ol>
    <li>Kies één taak.</li>
    <li>Zet een timer op 25 minuten.</li>
    <li>Werk onafgebroken aan die ene taak.</li>
    <li>Neem na 25 minuten een korte pauze van 5 minuten.</li>
    <li>Herhaal dit. Na 4 'pomodoros' neem je een langere pauze van 15-30 minuten.</li>
</ol>
<p>Deze techniek doorbreekt de overweldigende gedachte van "uren moeten studeren" en maakt het starten veel laagdrempeliger.</p>
<h3>Tip 3: Samen Plannen, Niet Opleggen</h3>
<p>Betrek uw tiener bij het maken van een weekplanning. In plaats van te zeggen "je moet nu huiswerk maken", kunt u vragen: "Wanneer voel je je het meest energiek om aan wiskunde te beginnen?". Dit geeft hen een gevoel van autonomie en eigenaarschap, wat de motivatie aanzienlijk kan verhogen.</p>
<h3>Tip 4: Digitale Hulpmiddelen Slim Inzetten</h3>
<p>Technologie hoeft niet altijd de vijand te zijn. Er zijn apps die kunnen helpen:</p>
<ul>
    <li><strong>Site Blockers:</strong> Apps zoals 'Focus' of 'Freedom' kunnen afleidende websites tijdelijk blokkeren.</li>
    <li><strong>Achtergrondgeluiden:</strong> Apps met 'white noise' of natuurgeluiden kunnen helpen om omgevingsgeluiden te dempen.</li>
</ul>
<h3>Tip 5: Begrijp de 'Waarom'</h3>
<p>Praat met uw tiener over het <em>waarom</em> achter focus. Het gaat niet alleen om betere cijfers, maar ook om het creëren van meer vrije tijd, het verminderen van stress en het gevoel van voldoening na het afronden van een taak. Wanneer ze het grotere voordeel zien, wordt de interne motivatie om te focussen sterker.</p>
<h2>Conclusie</h2>
<p>Focus is een vaardigheid die getraind kan worden. Door samen te werken, een ondersteunende omgeving te creëren en slimme technieken toe te passen, kunt u uw tiener helpen om deze cruciale superkracht voor de toekomst te ontwikkelen.</p>`,
    authorId: 'admin1', authorName: 'Dr. Florentine Sage',
    personaId: 'dr-florentine-sage',
    featuredImageUrl: 'https://placehold.co/1200x630.png', featuredImageHint: 'teenager studying focused',
    status: 'published', tags: ['Focus', 'Ouders'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '2', slug: 'de-kracht-van-neurodiversiteit', title: 'De Kracht van Anders Denken',
    excerpt: 'Waarom neurodiversiteit een voordeel is.',
    content: `<h2>Anders Denken is een Superkracht</h2><p>Lange tijd werd neurodiversiteit gezien als een 'probleem' dat opgelost moest worden. Gelukkig verandert dat perspectief. Steeds meer mensen en bedrijven zien de unieke voordelen van denkstijlen die buiten de 'norm' vallen.</p><h3>Wat zijn de voordelen?</h3><ul><li><strong>Creativiteit:</strong> Neurodivergente breinen leggen vaak onverwachte verbanden, wat leidt tot baanbrekende ideeën.</li><li><strong>Hyperfocus:</strong> De mogelijkheid om diep in een onderwerp te duiken en complexe problemen op te lossen.</li><li><strong>Patroonherkenning:</strong> Een scherp oog voor details en patronen die anderen missen.</li></ul>`,
    authorId: 'admin2', authorName: 'Team MindNavigator',
    featuredImageUrl: 'https://placehold.co/1200x630.png', featuredImageHint: 'diverse brains connection',
    status: 'published', tags: ['Neurodiversiteit', 'Inspiratie'],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: '3', slug: 'volgende-artikel', title: 'Volgende Artikel (Concept)',
    excerpt: 'Dit is een concept en nog niet zichtbaar voor publiek.',
    content: `<p>Hier komt de content voor een toekomstig artikel.</p>`,
    authorId: 'admin1', authorName: 'Dr. Florentine Sage',
    personaId: 'dr-florentine-sage',
    featuredImageUrl: 'https://placehold.co/1200x630.png', featuredImageHint: 'writing desk notes',
    status: 'draft', tags: ['Concept'],
    createdAt: new Date().toISOString(),
  },
];
