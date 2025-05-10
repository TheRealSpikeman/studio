// src/app/dashboard/admin/quiz-management/page.tsx
"use client";

import { useState, useMemo } from 'react';
import type { QuizAdmin, QuizAudience, QuizCategory, QuizStatusAdmin } from '@/types/quiz-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, PlusCircle, ListChecks, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const DUMMY_QUIZZES: QuizAdmin[] = [
  { 
    id: 'q1', title: 'Basis Neuroprofiel (15-18 jr)', description: 'Algemene neurodiversiteitstest voor oudere tieners.', 
    audience: ['15-18'], category: 'Basis', status: 'published', questions: [{id:'q1a', text:'Vraag 1'}, {id:'q1b', text:'Vraag 2'}],
    lastUpdatedAt: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  { 
    id: 'q2', title: 'Examenvrees Check', description: 'Quiz over omgaan met examenstress.', 
    audience: ['15-18', '12-14'], category: 'Thema', status: 'concept', questions: [{id:'q2a', text:'Vraag A'}],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  { 
    id: 'q3', title: 'Focus Test (12-14 jr)', description: 'Concentratiecheck voor jongere tieners.', 
    audience: ['12-14'], category: 'ADD', status: 'published', questions: [],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 10).toISOString(), createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  },
];

const ITEMS_PER_PAGE = 10;

export default function QuizManagementPage() {
  const [quizzes, setQuizzes] = useState<QuizAdmin[]>(DUMMY_QUIZZES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuizStatusAdmin | 'all'>('all');
  const [audienceFilter, setAudienceFilter] = useState<QuizAudience | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<QuizCategory | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || quiz.status === statusFilter;
      const matchesAudience = audienceFilter === 'all' || quiz.audience.includes(audienceFilter as QuizAudience);
      const matchesCategory = categoryFilter === 'all' || quiz.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesAudience && matchesCategory;
    });
  }, [quizzes, searchTerm, statusFilter, audienceFilter, categoryFilter]);

  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuizzes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredQuizzes, currentPage]);

  const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE);

  const handleDeleteQuiz = (quizId: string) => {
    // TODO: Implement actual delete logic with confirmation
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    toast({ title: "Quiz verwijderd", description: `Quiz met ID ${quizId} is verwijderd (simulatie).` });
  };
  
  const getStatusBadgeVariant = (status: QuizStatusAdmin): "default" | "secondary" => {
    return status === 'published' ? 'default' : 'secondary';
  };
  
  const getStatusBadgeClass = (status: QuizStatusAdmin): string => {
    return status === 'published' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300';
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <ListChecks className="h-6 w-6" />
                Quiz Beheer
              </CardTitle>
              <CardDescription>
                Beheer alle quizzen, vragen en instellingen. Totaal {filteredQuizzes.length} quizzen gevonden.
              </CardDescription>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard/admin/quiz-management/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Quiz Toevoegen
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative md:col-span-1 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Zoek op titel of beschrijving..."
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {setStatusFilter(value as QuizStatusAdmin | 'all'); setCurrentPage(1);}}>
              <SelectTrigger><SelectValue placeholder="Filter op status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Statussen</SelectItem>
                <SelectItem value="published">Gepubliceerd</SelectItem>
                <SelectItem value="concept">Concept</SelectItem>
              </SelectContent>
            </Select>
            <Select value={audienceFilter} onValueChange={(value) => {setAudienceFilter(value as QuizAudience | 'all'); setCurrentPage(1);}}>
              <SelectTrigger><SelectValue placeholder="Filter op doelgroep" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Doelgroepen</SelectItem>
                <SelectItem value="12-14">12-14 jaar</SelectItem>
                <SelectItem value="15-18">15-18 jaar</SelectItem>
                <SelectItem value="adult">Volwassene</SelectItem>
                <SelectItem value="all">Algemeen</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(value) => {setCategoryFilter(value as QuizCategory | 'all'); setCurrentPage(1);}}>
              <SelectTrigger><SelectValue placeholder="Filter op categorie" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Categorieën</SelectItem>
                <SelectItem value="Basis">Basis</SelectItem>
                <SelectItem value="ADD">ADD</SelectItem>
                <SelectItem value="ADHD">ADHD</SelectItem>
                <SelectItem value="HSP">HSP</SelectItem>
                <SelectItem value="ASS">ASS</SelectItem>
                <SelectItem value="AngstDepressie">Angst/Depressie</SelectItem>
                <SelectItem value="Thema">Thema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead className="min-w-[100px]">Doelgroep</TableHead>
                  <TableHead>Categorie</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[80px]">Vragen</TableHead>
                  <TableHead className="min-w-[130px]">Laatst Bijgewerkt</TableHead>
                  <TableHead className="text-right w-[80px]">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQuizzes.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center">Geen quizzen gevonden.</TableCell></TableRow>
                )}
                {paginatedQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.audience.join(', ')}</TableCell>
                    <TableCell>{quiz.category}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(quiz.status)} className={getStatusBadgeClass(quiz.status)}>
                        {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{quiz.questions.length}</TableCell>
                    <TableCell>{format(parseISO(quiz.lastUpdatedAt), 'Pp', { locale: nl })}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" /><span className="sr-only">Acties</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/quiz-management/edit/${quiz.id}`}><Edit className="mr-2 h-4 w-4" />Bewerken</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled><Eye className="mr-2 h-4 w-4" />Voorbeeld</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteQuiz(quiz.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Vorige</Button>
              <span className="text-sm text-muted-foreground">Pagina {currentPage} van {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Volgende</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
