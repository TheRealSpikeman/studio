import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizCard, QuizStatus } from '@/components/quiz/quiz-card';
import Link from 'next/link';
import { MessageSquare, TrendingUp } from 'lucide-react';
import { ResultsChart } from '@/components/dashboard/results-chart';

// Dummy data for demonstration
const userName = "Alex"; // TODO: Fetch actual user name

const quizzes = [
  { id: 'neuroprofile-101', title: 'Basis Neuroprofiel Quiz', description: 'Ontdek je fundamentele neurodiversiteitskenmerken.', status: 'Nog niet gestart' as QuizStatus, imageUrl: 'https://picsum.photos/seed/neuro1/400/200', dataAiHint: 'brain puzzle' },
  { id: 'adhd-focus-201', title: 'ADHD & Focus Verdieping', description: 'Specifieke vragen rondom aandacht en hyperactiviteit.', status: 'In progress' as QuizStatus, progress: 60, imageUrl: 'https://picsum.photos/seed/adhd1/400/200', dataAiHint: 'focus target' },
  { id: 'autism-spectrum-202', title: 'Autisme Spectrum Verkenning', description: 'Verken kenmerken gerelateerd aan het autismespectrum.', status: 'Voltooid' as QuizStatus, imageUrl: 'https://picsum.photos/seed/autism1/400/200', dataAiHint: 'social connection' },
];

const latestCoachingTip = {
  title: "Tip van de dag: Structuur en Routine",
  message: "Een voorspelbare dagstructuur kan helpen om overprikkeling te verminderen en focus te verbeteren. Probeer vandaag één vast rustmoment in te plannen.",
};

const resultsData = [
  { name: 'Basis Neuroprofiel', score: 75, date: '2024-03-15' },
  { name: 'ADHD & Focus', score: 60, date: '2024-03-20' },
  { name: 'Autisme Spectrum', score: 85, date: '2024-03-25' },
  // Add more data as needed
];


export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">
          Welkom terug, <span className="text-primary">{userName}</span>!
        </h1>
        <p className="text-muted-foreground">Klaar om meer over jezelf te ontdekken?</p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground">Jouw Quizzen</h2>
            <Button variant="outline" asChild>
                <Link href="/dashboard/quizzes">Alle Quizzen</Link>
            </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.slice(0,3).map((quiz) => ( // Show first 3 quizzes
            <QuizCard key={quiz.id} {...quiz} />
          ))}
        </div>
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
