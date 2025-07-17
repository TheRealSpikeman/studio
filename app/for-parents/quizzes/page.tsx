// src/app/for-parents/quizzes/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, BookOpen, Brain, Users as UsersIcon, HelpCircle, FileText, Loader2, ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react';
import { useState, useEffect, type ElementType } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { QuizAdmin, QuizCategory, QuizAudience } from '@/types/quiz-admin';
import { QuizCard } from '@/components/quiz/quiz-card';
import type { QuizCardProps } from '@/components/quiz/quiz-card';
import { EditableImage } from '@/components/common/EditableImage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const REPORT_IMAGE_URL_KEY = 'mindnavigator_for_parents_report_image';
const DEFAULT_REPORT_IMAGE_URL = 'https://placehold.co/600x400.png';

// --- Start of helper functions ---
const getIconForCategory = (category: QuizCategory): ElementType => {
  switch (category) {
    case 'Ouder Observatie': return UsersIcon;
    default: return HelpCircle;
  }
};
const getBadgeForCategory = (category: QuizCategory): { text: string; className: string } | null => {
  if (category === 'Ouder Observatie') return { text: "Voor Ouders", className: "bg-accent text-accent-foreground" };
  return null;
};
const getAgeGroupFromAudience = (audience: QuizAudience): '12-14' | '15-18' | 'all' => {
  if (!audience) return 'all';
  if (audience.includes('12-14')) return '12-14';
  if (audience.includes('15-18')) return '15-18';
  return 'all';
};

const mapQuizAdminToQuizCardProps = (quizAdmin: QuizAdmin): QuizCardProps => {
  const badge = getBadgeForCategory(quizAdmin.category);
  const quizDifficulty = quizAdmin.settings?.difficulty ?? 'gemiddeld';

  const isForParent = typeof quizAdmin.audience === 'string' && quizAdmin.audience.toLowerCase().includes('ouder');
  const descriptionForCard = (isForParent && quizAdmin.descriptionForParent) 
    ? quizAdmin.descriptionForParent 
    : quizAdmin.description;

  return {
    id: quizAdmin.id,
    title: quizAdmin.title,
    description: descriptionForCard,
    status: 'Nog niet gestart',
    audience: quizAdmin.audience,
    category: quizAdmin.category,
    imageUrl: quizAdmin.thumbnailUrl || `https://placehold.co/400x225.png?text=${quizAdmin.title.replace(/\s/g, '+')}`,
    dataAiHint: 'abstract illustration',
    ageGroup: getAgeGroupFromAudience(quizAdmin.audience),
    duration: quizAdmin.settings?.estimatedDuration || '5-10 min',
    questionCount: (quizAdmin.questions || []).length,
    difficulty: quizDifficulty,
    icon: getIconForCategory(quizAdmin.category),
    badgeText: badge?.text,
    badgeClass: badge?.className,
    isNeuroIntake: quizAdmin.category === 'Basis',
    focusFlags: quizAdmin.focusFlags,
  };
};
// --- End of helper functions ---

export default function ForParentsQuizzesPage() {
  const [allQuizzes, setAllQuizzes] = useState<QuizCardProps[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [reportImageUrl, setReportImageUrl] = useState(DEFAULT_REPORT_IMAGE_URL);

  useEffect(() => {
    const fetchQuizzes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/quizzes?audience=public');
            if (!response.ok) {
                throw new Error('Kon de quizzen niet ophalen.');
            }
            const loadedQuizzesAdmin: QuizAdmin[] = await response.json();
            setAllQuizzes(loadedQuizzesAdmin.map(mapQuizAdminToQuizCardProps));
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            toast({
                title: "Fout",
                description: "Kon de beschikbare vragenlijsten niet laden.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchQuizzes();

    // Load saved image URL from localStorage
    if (typeof window !== 'undefined') {
        const savedImageUrl = localStorage.getItem(REPORT_IMAGE_URL_KEY);
        if (savedImageUrl) {
            setReportImageUrl(savedImageUrl);
        }
    }
  }, [toast]);
  
  const handleQuizUpdate = (updatedQuizAdmin: QuizAdmin) => {
    // This function will likely not be used now that data is fetched,
    // but we can keep it for optimistic updates if needed later.
    const updatedCardProps = mapQuizAdminToQuizCardProps(updatedQuizAdmin);
    setAllQuizzes(prev =>
        prev.map(q => q.id === updatedCardProps.id ? updatedCardProps : q)
    );
  };

  const handleReportImageSave = (newUrl: string) => {
    setReportImageUrl(newUrl);
    if (typeof window !== 'undefined') {
        localStorage.setItem(REPORT_IMAGE_URL_KEY, newUrl);
    }
    toast({
      title: 'Afbeelding opgeslagen!',
      description: 'De afbeelding is bijgewerkt en blijft bewaard.',
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center py-12 md:py-16 lg:py-20 bg-muted/20">
        <div className="container space-y-16">
          <section className="text-center">
            <UsersIcon className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Ontdek de unieke wereld van uw kind</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
              Deze gratis vragenlijsten helpen u om vanuit uw perspectief naar het gedrag, de sterktes en de uitdagingen van uw kind te kijken. Krijg direct na afloop een helder rapport met inzichten.
            </p>
          </section>

          <section>
            {isLoading ? (
               <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
            ) : allQuizzes.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allQuizzes.map((quiz) => (
                  <QuizCard key={quiz.id} {...quiz} onQuizUpdate={handleQuizUpdate} />
                ))}
              </div>
            ) : (
                <Card className="text-center py-10">
                    <CardContent>
                        <h3 className="text-xl font-semibold">Geen vragenlijsten gevonden</h3>
                        <p className="text-muted-foreground mt-2">Er zijn momenteel geen publieke vragenlijsten voor ouders beschikbaar.</p>
                    </CardContent>
                </Card>
            )}
          </section>

          <section className="grid md:grid-cols-2 gap-8 items-center pt-8 border-t">
              <EditableImage
                wrapperClassName="relative aspect-video rounded-lg overflow-hidden shadow-lg"
                src={reportImageUrl}
                alt="Een voorbeeld van een AI-gegenereerd rapport"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="report analysis chart"
                onSave={handleReportImageSave}
                uploadPath="images/website"
              />
              <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Wat u ontvangt: Direct Inzicht</h2>
                  <p className="text-muted-foreground mb-4">Na elke vragenlijst genereren we direct een rapport. Dit is geen score of label, maar een startpunt voor begrip. Het rapport bevat:</p>
                  <ul className="list-none space-y-3">
                      <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><p>Een <strong>samenvatting</strong> van uw observaties in duidelijke taal.</p></li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><p><strong>Mogelijke aandachtspunten</strong> en de sterke kanten die u ziet.</p></li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/><p><strong>Concrete tips en gespreksstarters</strong> om de communicatie met uw kind te verbeteren.</p></li>
                  </ul>
              </div>
          </section>

          <section className="text-center pt-12 border-t">
              <Lightbulb className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold text-foreground">Klaar voor de volgende stap?</h2>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto mb-6">
                  Ontgrendel de volledige kracht van MindNavigator met het Gezins Gids abonnement. Krijg toegang tot alle tools voor uw kind, diepgaande analyses, het ouder-dashboard en de mogelijkheid om uw inzichten te vergelijken met de zelfreflectie van uw kind.
              </p>
              <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow text-lg px-8 py-6">
                <Link href="/pricing">
                  Start 14 Dagen Gratis Proberen <ArrowRight className="ml-2 h-5 w-5"/>
                </Link>
              </Button>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
