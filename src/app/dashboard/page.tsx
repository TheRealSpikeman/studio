
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizCard, QuizStatus } from '@/components/quiz/quiz-card';
import Link from 'next/link';
import { MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResultsChart } from '@/components/dashboard/results-chart';

// Dummy data for demonstration
// TODO: Fetch actual user data and their ageGroup from authentication context
const currentUser = {
  name: "Alex", 
  ageGroup: '15-18' as '12-14' | '15-18' | 'adult' // Example age group
};

const allDashboardQuizzes = [
  { 
    id: 'teen-neurodiversity-quiz?ageGroup=12-14', 
    title: 'Basis Neurodiversiteit (12-14 jr)', 
    description: 'Ontdek jouw unieke eigenschappen. Speciaal voor 12-14 jaar.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/dash1214/400/200',
    dataAiHint: 'teenager puzzle',
    ageGroup: '12-14',
  },
  { 
    id: 'teen-neurodiversity-quiz?ageGroup=15-18', 
    title: 'Basis Neurodiversiteit (15-18 jr)', 
    description: 'Ontdek jouw unieke eigenschappen. Speciaal voor 15-18 jaar.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/dash1518/400/200',
    dataAiHint: 'teenager study',
    ageGroup: '15-18',
  },
  { 
    id: 'exam-stress-planning', 
    title: 'Examenvrees & Planning (Tieners)', 
    description: 'Leer stress beheersen en je planning scherp te houden.', 
    status: 'In progress' as QuizStatus, 
    progress: 60, 
    imageUrl: 'https://picsum.photos/seed/dashexamstress/400/200', 
    dataAiHint: 'student exam',
    ageGroup: 'all', // Indicates suitable for all teen age groups
  },
  { 
    id: 'social-anxiety-friendships', 
    title: 'Sociale Angst & Vriendschap (Tieners)', 
    description: 'Verken hoe je je voelt in groepen en bij presentaties.', 
    status: 'Voltooid' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/dashsocialanxiety/400/200',
    dataAiHint: 'teenagers friends',
    ageGroup: 'all',
  },
   { 
    id: 'focus-digital-distraction', 
    title: 'Focus & Digitale Afleiding (Tieners)', 
    description: 'Ontdek hoe social media je concentratie beïnvloeden.', 
    status: 'Nog niet gestart' as QuizStatus, 
    imageUrl: 'https://picsum.photos/seed/dashdigitalfocus/400/200',
    dataAiHint: 'teenager phone',
    ageGroup: 'all',
  },
];

// Filter quizzes based on currentUser.ageGroup
const quizzes = allDashboardQuizzes.filter(quiz => 
  quiz.ageGroup === currentUser.ageGroup || quiz.ageGroup === 'all'
);

const latestCoachingTip = {
  title: "Tip van de dag: Structuur en Routine",
  message: "Een voorspelbare dagstructuur kan helpen om overprikkeling te verminderen en focus te verbeteren. Probeer vandaag één vast rustmoment in te plannen.",
};

const resultsData = [
  // Filter or ensure resultsData also aligns with user's quizzes or make it generic
  { name: 'Basis Neurodiversiteit (15-18 jr)', score: 75, date: '2024-03-15' }, // Example
  { name: 'Sociale Angst & Vriendschap', score: 85, date: '2024-03-25' }, // Example
  // Add more data as needed
];


export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">
          Welkom terug, <span className="text-primary">{currentUser.name}</span>!
        </h1>
        <p className="text-muted-foreground">Klaar om meer over jezelf te ontdekken?</p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground">Jouw Quizzen</h2>
            <Button variant="outline" asChild>
                <Link href="/quizzes">Alle Quizzen</Link>
            </Button>
        </div>
        {quizzes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.slice(0,3).map((quiz) => ( // Show first 3 relevant quizzes
              <QuizCard key={quiz.id} {...quiz} />
            ))}
          </div>
        ) : (
          <Card className="bg-secondary/50 border-secondary">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Geen quizzen beschikbaar</h3>
              <p className="text-muted-foreground">
                Er zijn op dit moment geen quizzen beschikbaar die specifiek zijn afgestemd op jouw leeftijdsgroep ({currentUser.ageGroup} jaar).
              </p>
              <Button asChild className="mt-4">
                <Link href="/quizzes">Bekijk alle tienerquizzen</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground">Recente Resultaten</h2>
            <Button variant="outline" asChild>
                <Link href="/dashboard/results">Alle Resultaten</Link>
            </Button>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Score Overzicht
              </CardTitle>
              <CardDescription>Een visuele weergave van je quizscores.</CardDescription>
            </CardHeader>
            <CardContent>
              {resultsData.length > 0 ? <ResultsChart data={resultsData} /> : <p className="text-muted-foreground">Nog geen resultaten om weer te geven. Start een quiz!</p>}
            </CardContent>
          </Card>
        </section>

        <section>
           <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground">Dagelijkse Coaching</h2>
            <Button variant="outline" asChild>
                <Link href="/dashboard/coaching">Bekijk alle tips</Link>
            </Button>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-accent" />
                {latestCoachingTip.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{latestCoachingTip.message}</p>
            </CardContent>
            <CardFooter>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Markeer als gelezen
                </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
}
