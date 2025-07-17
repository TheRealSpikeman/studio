// src/app/dashboard/admin/quiz-management/create/page.tsx
import { QuizCreatorProvider } from '@/contexts/QuizCreatorContext';
import { QuizCreatorWizard } from '@/components/admin/quiz-creator/QuizCreatorWizard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Brain } from '@/lib/icons';

export default function CreateQuizPage() {
  return (
    <QuizCreatorProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Quiz Creator
            </h1>
            <Button variant="outline" asChild>
                <Link href="/dashboard/admin/quiz-management">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Overzicht
                </Link>
            </Button>
        </div>
        <QuizCreatorWizard />
      </div>
    </QuizCreatorProvider>
  );
}
