// src/app/p/[slug]/page.tsx
"use client"; 

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert"; // Renamed AlertTitle to AlertTitleUi


interface PageData {
  title: string;
  content: string; // Can be simple text, Markdown, or HTML
  slug: string;
}

// Hardcoded data for now. In a real CMS, this would be fetched.
const hardcodedPages: Record<string, PageData> = {
  'over-ons-team': {
    slug: 'over-ons-team',
    title: 'Over Ons Geweldige Team',
    content: `
## Maak kennis met het Team!

Wij zijn een gepassioneerd team dat zich inzet om MindNavigator de beste ervaring te maken.

### Alice (Lead Developer)
Alice is de drijvende kracht achter de technische ontwikkeling.

### Bob (UX Designer)
Bob zorgt ervoor dat de app er fantastisch uitziet en makkelijk te gebruiken is.

*   Passie voor neurodiversiteit
*   Innovatief
*   Gebruikersgericht
    `,
  },
  'onze-missie': {
    slug: 'onze-missie',
    title: 'Onze Missie bij MindNavigator',
    content: `
## Onze Missie

Bij MindNavigator geloven we dat iedereen uniek is. Onze missie is om jongeren te helpen hun eigen krachten en uitdagingen te begrijpen, specifiek gericht op neurodiversiteit. We willen een platform bieden dat:

*   **Inzicht Geeft:** Door toegankelijke quizzen en duidelijke rapporten.
*   **Ondersteunt:** Met dagelijkse coaching en praktische tips.
*   **Empowert:** Door zelfkennis en zelfvertrouwen te bevorderen.

We streven naar een wereld waarin neurodiversiteit wordt gezien als een kracht.
    `,
  },
   'voorbeeld-markdown': {
    slug: 'voorbeeld-markdown',
    title: 'Markdown Voorbeeld Pagina',
    content: `
# Dit is een H1 Titel

## Dit is een H2 Subtitel

Dit is een paragraaf met **vetgedrukte** tekst en *cursieve* tekst.

Je kunt ook lijsten maken:
* Item 1
* Item 2
  * Genest item 2.1
  * Genest item 2.2
* Item 3

1. Geordende lijst item 1
2. Geordende lijst item 2

> Dit is een blockquote. Handig voor citaten.

\`\`\`javascript
// Dit is een codeblok
function greet(name) {
  console.log("Hallo, " + name + "!");
}
\`\`\`

[Dit is een link naar de homepage](/)

---
Horizontale lijn.
    `,
  }
};

// Basic Markdown to HTML converter (very simplified)
function markdownToHtml(markdown: string): string {
  if (typeof markdown !== 'string') return '';
  let html = markdown;

  // Headers (H1 to H6)
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.*?)\*\*|__(.*?)__/gim, '<strong>$1$2</strong>');
  // Italic (*text* or _text_)
  html = html.replace(/\*(.*?)\*|_(.*?)_/gim, '<em>$1$2</em>');
  
  // Links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-primary hover:underline">$1</a>');

  // Unordered lists (*, -, +)
  html = html.replace(/^\s*[\*\-\+]\s+(.*)/gim, '<li>$1</li>');
  html = html.replace(/<\/li>\n<ul>/gim, '</li><li>'); // Fix for consecutive list items creating nested lists
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/gim, ''); // Remove multiple ul tags

  // Ordered lists (1., 2.)
  html = html.replace(/^\s*\d\.\s+(.*)/gim, '<li>$1</li>');
  html = html.replace(/<\/li>\n<ol>/gim, '</li><li>'); 
  html = html.replace(/(<li>.*<\/li>)/gim, '<ol>$1</ol>');
  html = html.replace(/<\/ol>\s*<ol>/gim, '');

  // Blockquotes (> text)
  html = html.replace(/^\>\s+(.*)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/gim, '\n'); // Combine consecutive blockquotes


  // Code blocks (```lang\ncode\n```)
  html = html.replace(/```(\w*)\n([\s\S]*?)\n```/gim, (match, lang, code) => {
    const languageClass = lang ? `language-${lang}` : '';
    return `<pre class="bg-muted p-4 rounded-md overflow-x-auto ${languageClass}"><code class="${languageClass}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  });
  
  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
  
  // Horizontal Rule (---, ***, ___)
  html = html.replace(/^\s*(?:---|___|\*\*\*)\s*$/gm, '<hr class="my-6 border-border" />');

  // Paragraphs (split by double newlines, then wrap in <p>)
  // Make sure not to wrap existing block elements like <ul> <ol> <blockquote> <pre> <h1>-<h6> <hr>
  html = html.split(/\n\s*\n/).map(paragraph => {
    const trimmedParagraph = paragraph.trim();
    if (trimmedParagraph.startsWith('<ul') || trimmedParagraph.startsWith('<ol') || 
        trimmedParagraph.startsWith('<blockquote') || trimmedParagraph.startsWith('<h') || 
        trimmedParagraph.startsWith('<pre') || trimmedParagraph.startsWith('<hr')) {
      return trimmedParagraph;
    }
    return trimmedParagraph ? `<p class="mb-4 leading-relaxed">${trimmedParagraph}</p>` : '';
  }).join('');

  return html;
}


export default function DynamicContentPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let data = hardcodedPages[slug];

    // Attempt to load from localStorage if not in hardcodedPages
    if (!data) {
      try {
        const storedPageData = localStorage.getItem(`cms_page_${slug}`);
        if (storedPageData) {
          data = JSON.parse(storedPageData) as PageData;
        }
      } catch (error) {
        console.error("Error loading page from localStorage:", error);
        // data remains undefined, will show "not found"
      }
    }

    setPageData(data || null);
    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Pagina laden...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center py-12 md:py-16 lg:py-20">
          <div className="container text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
            <h1 className="text-3xl font-bold text-destructive mb-4">Pagina Niet Gevonden</h1>
            <p className="text-muted-foreground mb-6">
              Sorry, de pagina met de URL <strong>/p/{slug}</strong> kon niet worden gevonden.
            </p>
            <Button asChild>
              <Link href="/">Terug naar Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const pageHtmlContent = markdownToHtml(pageData.content);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-3xl">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-foreground">{pageData.title}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert 
                                    prose-headings:text-primary prose-headings:font-semibold
                                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                                    prose-a:text-accent hover:prose-a:text-accent/80
                                    prose-strong:font-semibold
                                    prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                                    prose-code:bg-muted prose-code:px-1.5 prose-code:py-1 prose-code:rounded-sm prose-code:font-mono
                                    prose-li:my-1
                                    prose-hr:border-border
                                    text-foreground/90
                                    "
            >
              <div dangerouslySetInnerHTML={{ __html: pageHtmlContent }} />

              <Alert variant="default" className="mt-12 bg-primary/10 border-primary/30 text-primary">
                  <Info className="h-5 w-5 !text-primary" />
                  <AlertTitleUi className="font-semibold text-accent">Over Deze Pagina</AlertTitleUi>
                  <AlertDescription className="text-foreground/80">
                    Deze pagina is dynamisch gegenereerd. De inhoud wordt beheerd via een eenvoudig content management systeem (momenteel gesimuleerd).
                    Dit stelt beheerders in staat om snel nieuwe informatieve pagina's toe te voegen en te bewerken.
                  </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
