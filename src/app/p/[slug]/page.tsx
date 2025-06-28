// src/app/p/[slug]/page.tsx
"use client"; 

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert"; // Renamed AlertTitle to AlertTitleUi
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';


interface PageData {
  title: string;
  content: string; // Will now be HTML
  slug: string;
}

// Hardcoded data for now. In a real CMS, this would be fetched.
const hardcodedPages: Record<string, PageData> = {
  'over-ons-team': {
    slug: 'over-ons-team',
    title: 'Over Ons Geweldige Team',
    content: `
      <h2>Maak kennis met het Team!</h2>
      <p>Wij zijn een gepassioneerd team dat zich inzet om MindNavigator de beste ervaring te maken.</p>
      <h3>Alice (Lead Developer)</h3>
      <p>Alice is de drijvende kracht achter de technische ontwikkeling.</p>
      <h3>Bob (UX Designer)</h3>
      <p>Bob zorgt ervoor dat de app er fantastisch uitziet en makkelijk te gebruiken is.</p>
      <ul>
        <li>Passie voor neurodiversiteit</li>
        <li>Innovatief</li>
        <li>Gebruikersgericht</li>
      </ul>
    `,
  },
  'onze-missie': {
    slug: 'onze-missie',
    title: 'Onze Missie bij MindNavigator',
    content: `
      <h2>Onze Missie</h2>
      <p>Bij MindNavigator geloven we dat iedereen uniek is. Onze missie is om jongeren te helpen hun eigen krachten en uitdagingen te begrijpen, specifiek gericht op neurodiversiteit. We willen een platform bieden dat:</p>
      <ul>
        <li><strong>Inzicht Geeft:</strong> Door toegankelijke quizzen en duidelijke rapporten.</li>
        <li><strong>Ondersteunt:</strong> Met dagelijkse coaching en praktische tips.</li>
        <li><strong>Empowert:</strong> Door zelfkennis en zelfvertrouwen te bevorderen.</li>
      </ul>
      <p>We streven naar een wereld waarin neurodiversiteit wordt gezien als een kracht.</p>
    `,
  },
};

export default function DynamicContentPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let data: PageData | undefined | null = null;

    if (slug) {
        // Attempt to load from localStorage first for user-created pages
        try {
            const storedPageData = localStorage.getItem(`cms_page_${slug}`);
            if (storedPageData) {
            data = JSON.parse(storedPageData) as PageData;
            }
        } catch (error) {
            console.error("Error loading page from localStorage:", error);
        }

        // Fallback to hardcoded pages if not in localStorage
        if (!data) {
            data = hardcodedPages[slug];
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
  
  // Sanitize the HTML content before rendering
  const sanitizedContent = DOMPurify.sanitize(pageData.content);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-3xl">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-foreground">{pageData.title}</CardTitle>
            </CardHeader>
            <CardContent
              className="prose prose-lg max-w-none dark:prose-invert 
                         prose-headings:text-primary prose-headings:font-semibold
                         prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                         prose-a:text-accent hover:prose-a:text-accent/80
                         prose-strong:font-semibold
                         prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                         prose-code:bg-muted prose-code:px-1.5 prose-code:py-1 prose-code:rounded-sm prose-code:font-mono
                         prose-li:my-1
                         prose-hr:border-border
                         text-foreground/90"
            >
              <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

              <Alert variant="default" className="mt-12 bg-primary/10 border-primary/30 text-primary">
                  <Info className="h-5 w-5 !text-primary" />
                  <AlertTitleUi className="font-semibold text-accent">Over Deze Pagina</AlertTitleUi>
                  <AlertDescription className="text-foreground/80">
                    Deze pagina is dynamisch gegenereerd. De inhoud wordt beheerd via een eenvoudig content management systeem (momenteel gesimuleerd).
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
