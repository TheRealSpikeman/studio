// src/lib/data/blog-data.ts
import type { BlogPost } from '@/types/blog';

// This is now the single source of truth for the initial dummy data.
export const initialBlogPosts: BlogPost[] = [
  {
    id: '1', slug: 'hoe-help-ik-mijn-tiener-focussen', title: 'Hoe help ik mijn tiener focussen?',
    excerpt: 'Ontdek 5 concrete, direct toepasbare tips...',
    content: `
## De Uitdaging van Focus in de 21e Eeuw

In een wereld vol constante notificaties, eindeloze social media feeds en de druk om altijd 'aan' te staan, is het voor tieners moeilijker dan ooit om zich te concentreren. Vooral voor neurodivergente jongeren, die prikkels vaak intenser ervaren, kan dit een dagelijkse strijd zijn. Het is echter geen verloren strijd. Met de juiste strategieën kunt u als ouder een omgeving creëren die focus bevordert.

### Tip 1: Creëer een 'Focus Oase'

De omgeving heeft een enorme impact op onze concentratie. Een 'focus oase' is een specifieke plek in huis die uitsluitend bedoeld is voor geconcentreerd werk.

*   **Geen telefoons:** Maak de regel dat telefoons (en andere afleidende apparaten) buiten deze zone blijven.
*   **Minimaliseer rommel:** Een opgeruimd bureau zorgt voor een opgeruimd hoofd.
*   **Goede verlichting en ergonomie:** Zorg voor een comfortabele stoel en voldoende licht.

### Tip 2: De Kracht van de Pomodoro Techniek

De Pomodoro Techniek is simpel maar effectief:

1.  Kies één taak.
2.  Zet een timer op 25 minuten.
3.  Werk onafgebroken aan die ene taak.
4.  Neem na 25 minuten een korte pauze van 5 minuten.
5.  Herhaal dit. Na 4 'pomodoros' neem je een langere pauze van 15-30 minuten.

Deze techniek doorbreekt de overweldigende gedachte van "uren moeten studeren" en maakt het starten veel laagdrempeliger.

### Tip 3: Samen Plannen, Niet Opleggen

Betrek uw tiener bij het maken van een weekplanning. In plaats van te zeggen "je moet nu huiswerk maken", kunt u vragen: "Wanneer voel je je het meest energiek om aan wiskunde te beginnen?". Dit geeft hen een gevoel van autonomie en eigenaarschap, wat de motivatie aanzienlijk kan verhogen.

### Tip 4: Digitale Hulpmiddelen Slim Inzetten

Technologie hoeft niet altijd de vijand te zijn. Er zijn apps die kunnen helpen:

*   **Site Blockers:** Apps zoals 'Focus' of 'Freedom' kunnen afleidende websites tijdelijk blokkeren.
*   **Achtergrondgeluiden:** Apps met 'white noise' of natuurgeluiden kunnen helpen om omgevingsgeluiden te dempen.

### Tip 5: Begrijp de 'Waarom'

Praat met uw tiener over het *waarom* achter focus. Het gaat niet alleen om betere cijfers, maar ook om het creëren van meer vrije tijd, het verminderen van stress en het gevoel van voldoening na het afronden van een taak. Wanneer ze het grotere voordeel zien, wordt de interne motivatie om te focussen sterker.

## Conclusie

Focus is een vaardigheid die getraind kan worden. Door samen te werken, een ondersteunende omgeving te creëren en slimme technieken toe te passen, kunt u uw tiener helpen om deze cruciale superkracht voor de toekomst te ontwikkelen.`,
    authorId: 'admin1', authorName: 'Dr. Florentine Sage',
    featuredImageUrl: 'https://placehold.co/1200x630.png', featuredImageHint: 'teenager studying focused',
    status: 'published', tags: ['Focus', 'Ouders'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '2', slug: 'de-kracht-van-neurodiversiteit', title: 'De Kracht van Anders Denken',
    excerpt: 'Waarom neurodiversiteit een voordeel is.',
    content: 'Volledige markdown content hier...',
    authorId: 'admin2', authorName: 'Team MindNavigator',
    featuredImageUrl: 'https://placehold.co/1200x630.png', featuredImageHint: 'diverse brains connection',
    status: 'published', tags: ['Neurodiversiteit', 'Inspiratie'],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: '3', slug: 'volgende-artikel', title: 'Volgende Artikel (Concept)',
    excerpt: 'Dit is een concept en nog niet zichtbaar voor publiek.',
    content: 'Volledige markdown content hier...',
    authorId: 'admin1', authorName: 'Dr. Florentine Sage',
    featuredImageUrl: 'https://placehold.co/1200x630.png', featuredImageHint: 'writing desk notes',
    status: 'draft', tags: ['Concept'],
    createdAt: new Date().toISOString(),
  },
];
