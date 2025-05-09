import { QuizCard, QuizStatus } from '@/components/quiz/quiz-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

// Dummy data for demonstration, in a real app this would come from an API
const allQuizzes = [
  { id: 'neuroprofile-101', title: 'Basis Neuroprofiel Quiz', description: 'Ontdek je fundamentele neurodiversiteitskenmerken.', status: 'Nog niet gestart' as QuizStatus, imageUrl: 'https://picsum.photos/seed/neuro1/400/200', dataAiHint: 'brain puzzle' },
  { id: 'adhd-focus-201', title: 'ADHD & Focus Verdieping', description: 'Specifieke vragen rondom aandacht en hyperactiviteit.', status: 'Nog niet gestart' as QuizStatus, progress: 0, imageUrl: 'https://picsum.photos/seed/adhd1/400/200', dataAiHint: 'focus target' }, // Changed from In progress for public view
  { id: 'autism-spectrum-202', title: 'Autisme Spectrum Verkenning', description: 'Verken kenmerken gerelateerd aan het autismespectrum.', status: 'Nog niet gestart' as QuizStatus, imageUrl: 'https://picsum.photos/seed/autism1/400/200', dataAiHint: 'social connection' }, // Changed from Voltooid for public view
  { id: 'dyslexia-reading-203', title: 'Dyslexie & Leesvaardigheid', description: 'Inzicht in lees- en schrijfpatronen.', status: 'Nog niet gestart' as QuizStatus, imageUrl: 'https://picsum.photos/seed/dyslexia1/400/200', dataAiHint: 'open book' },
  { id: 'sensory-processing-204', title: 'Sensorische Prikkelverwerking', description: 'Begrijp hoe je reageert op zintuiglijke input.', status: 'Nog niet gestart' as QuizStatus, imageUrl: 'https://picsum.photos/seed/sensory1/400/200', dataAiHint: 'sound waves' },
];

export default function QuizzesOverviewPage() {
  // TODO: Implement search/filter functionality
  // const [searchTerm, setSearchTerm] = useState('');
  // const filteredQuizzes = allQuizzes.filter(quiz => 
  //   quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredQuizzes = allQuizzes; // Placeholder

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container space-y-8">
          <section>
            <h1 className="text-3xl font-bold text-foreground">Alle Quizzen</h1>
            <p className="text-muted-foreground">
              Verken alle beschikbare quizzen en verdiep je inzicht in neurodiversiteit.
            </p>
          </section>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Zoek quizzen..." 
              className="pl-10 max-w-sm"
              // onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          {filteredQuizzes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} {...quiz} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">Geen quizzen gevonden die overeenkomen met je zoekopdracht.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
