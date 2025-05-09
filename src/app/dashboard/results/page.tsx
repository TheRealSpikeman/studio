import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, BarChart3 } from 'lucide-react';
import Link from 'next/link';

// Dummy data for demonstration
const completedQuizzes = [
  { id: 'neuroprofile-101', title: 'Basis Neuroprofiel Quiz', dateCompleted: '2024-03-10', score: 'Uitgebalanceerd Profiel', reportLink: '/reports/neuroprofile-101.pdf' },
  { id: 'autism-spectrum-202', title: 'Autisme Spectrum Verkenning', dateCompleted: '2024-03-25', score: 'Sterke Kenmerken', reportLink: '/reports/autism-spectrum-202.pdf' },
  // Add more completed quizzes
];

export default function ResultsHistoryPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Resultatenoverzicht</h1>
        <p className="text-muted-foreground">
          Bekijk hier de resultaten van al je voltooide quizzen en download je rapporten.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <BarChart3 className="h-6 w-6 text-primary" />
            Voltooide Quizzen
          </CardTitle>
          <CardDescription>
            Een overzicht van al je afgeronde quizzen en bijbehorende rapporten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedQuizzes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz Titel</TableHead>
                  <TableHead>Datum Voltooid</TableHead>
                  <TableHead>Score/Profiel</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.dateCompleted}</TableCell>
                    <TableCell>{quiz.score}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" asChild>
                        <Link href={`/quiz/${quiz.id}/results`}> {/* Link to in-app results page */}
                          <Eye className="mr-2 h-4 w-4" />
                          Bekijk
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        {/* This should trigger a PDF download, for now links to a placeholder */}
                        <Link href={quiz.reportLink} target="_blank" download> 
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              Je hebt nog geen quizzen voltooid. Ga naar het <Link href="/dashboard/quizzes" className="text-primary hover:underline">quizoverzicht</Link> om te starten.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
