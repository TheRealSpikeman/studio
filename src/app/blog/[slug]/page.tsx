// src/app/blog/[slug]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Rss, Calendar, User, Facebook, Twitter, Linkedin, Copy, ArrowLeft, AlertTriangle } from 'lucide-react';
import type { BlogPost } from '@/types/blog';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

// Dummy Data - In a real app, this would be fetched from Firestore
const dummyBlogPosts: BlogPost[] = [
  {
    id: '1', slug: 'hoe-help-ik-mijn-tiener-focussen', title: 'Hoe help ik mijn tiener focussen in een wereld vol afleiding?',
    excerpt: 'In de digitale wereld van vandaag is focus een superkracht. Ontdek 5 concrete, direct toepasbare tips om uw tiener te helpen de concentratie te verbeteren en schoolwerk effectiever aan te pakken.',
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
    status: 'published', tags: ['Focus', 'Ouders', 'Studietips'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  // Add other posts here for direct navigation testing
];

function markdownToHtml(markdown: string): string {
  if (typeof markdown !== 'string') return '';
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\* (.*$)/gim, '<li class="ml-5 list-disc">$1</li>')
    .replace(/<\/li>\n<li/g, '</li><li')
    .replace(/(<li>.*<\/li>)/gs, '<ul class="mb-4">$1</ul>')
    .replace(/<\/ul>\n<ul>/g, '')
    .split(/\n\s*\n/).map(p => {
      if (p.startsWith('<') || p.trim() === '') return p;
      return `<p class="mb-4 leading-relaxed">${p}</p>`;
    }).join('');
  return html;
}

const ShareButtons = ({ title, url }: { title: string, url: string }) => {
  const { toast } = useToast();
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: "Link gekopieerd!", description: "Je kunt de link nu plakken." });
    }, (err) => {
      toast({ title: "Kopiëren mislukt", description: "Kon de link niet naar het klembord kopiëren.", variant: "destructive" });
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-semibold mr-2">Deel dit artikel:</span>
      <Button variant="outline" size="sm" asChild>
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch from Firestore here based on the slug
    const foundPost = dummyBlogPosts.find(p => p.slug === slug && p.status === 'published');
    setPost(foundPost || null);
    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Laden...</div>;
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
             <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
            <h1 className="text-3xl font-bold">Blogpost niet gevonden</h1>
            <p className="text-muted-foreground mt-2">Sorry, we konden dit artikel niet vinden.</p>
            <Button asChild className="mt-6">
              <Link href="/blog">Terug naar de blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <article>
            <header className="mb-8">
                <Button variant="outline" size="sm" asChild className="mb-4">
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Terug naar blog overzicht
                  </Link>
                </Button>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">{post.title}</h1>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.authorName}</span>
                    </div>
                    {post.publishedAt && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(parseISO(post.publishedAt), 'd MMMM yyyy', { locale: nl })}</span>
                        </div>
                    )}
                </div>
            </header>
            
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-8">
              <Image
                src={post.featuredImageUrl}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint={post.featuredImageHint}
                priority
              />
            </div>
            
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
            />

            <div className="mt-12 pt-8 border-t">
              <ShareButtons title={post.title} url={typeof window !== 'undefined' ? window.location.href : ''} />
            </div>

          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
