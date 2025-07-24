// src/app/dashboard/admin/quiz-management/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { QuizAdmin, QuizAudience, QuizCategory, QuizStatusAdmin } from '@/types/quiz-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, PlusCircle, ListChecks, MoreVertical, Edit, Trash2, Eye, Bot, RefreshCw, Users, Loader2, ImageUp } from '@/lib/icons';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import { storageService } from '@/services/storageService';
import { audienceOptions, categoryOptions, getCategoryLabel } from '@/types/quiz-admin'; 

const ITEMS_PER_PAGE = 10;

export default function QuizManagementPage() {
  const [quizzes, setQuizzes] = useState<QuizAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuizStatusAdmin | 'all'>('all');
  const [audienceFilter, setAudienceFilter] = useState<QuizAudience | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchQuizzes = async () => {
    setIsLoading(true);
    const allQuizzes = await storageService.getAllQuizzes();
    const processedQuizzes = allQuizzes.map(q => ({
        ...q, 
        questions: (q.questions || []).map(ques => ({...ques, weight: ques.weight ?? 1})),
        thumbnailUrl: q.thumbnailUrl || `https://placehold.co/400x200.png?text=${q.title.replace(/\s/g, '+')}`,
        settings: {
          ...q.settings,
          analysisDetailLevel: q.settings?.analysisDetailLevel ?? 'standaard',
          analysisInstructions: q.settings?.analysisInstructions ?? '',
          accessibility: {
            isPublic: q.settings?.accessibility?.isPublic ?? false,
            allowedPlans: q.settings?.accessibility?.allowedPlans ?? [],
          },
        }
    }));
    setQuizzes(processedQuizzes);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleRestoreDefaultQuizzes = async () => {
    // This logic should ideally be in a service or backend function
    const currentQuizzes = await storageService.getAllQuizzes();
    const defaultQuizzes = []; // Now defaults are seeded on first load
    const currentQuizIds = new Set(currentQuizzes.map(q => q.id));

    if (defaultQuizzes.length === 0) {
        toast({ title: "Herstel Actie", description: "De standaard quizzen worden bij de eerste laadbeurt van de database toegevoegd." });
        return;
    }
    
    toast({
        title: "Standaard Quizzen Hersteld",
        description: `Standaard quizzen zijn hersteld.`
    });
    fetchQuizzes();
  };

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || quiz.status === statusFilter;
      const matchesAudience = audienceFilter === 'all' || quiz.audience === audienceFilter;
      const matchesCategory = categoryFilter === 'all' || quiz.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesAudience && matchesCategory;
    });
  }, [quizzes, searchTerm, statusFilter, audienceFilter, categoryFilter]);

  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuizzes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredQuizzes, currentPage]);

  const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE);

  const handleDeleteQuiz = async (quizId: string) => {
    await storageService.deleteQuiz(quizId);
    toast({ title: "Quiz verwijderd", description: `Quiz met ID ${quizId} is verwijderd.` });
    fetchQuizzes(); // Refresh list
  };
  
  const getStatusBadgeVariant = (status: QuizStatusAdmin): "default" | "secondary" => {
    return status === 'published' ? 'default' : 'secondary';
  };
  
  const getStatusBadgeClass = (status: QuizStatusAdmin): string => {
    return status === 'published' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300';
  };

  const calculateAverageWeight = (quiz: QuizAdmin): string => {
    if (!quiz.questions || quiz.questions.length === 0) return "N/A";
    const totalWeight = quiz.questions.reduce((sum, q) => sum + (q.weight || 1), 0);
    const avg = totalWeight / quiz.questions.length;
    return isNaN(avg) ? "N/A" : avg.toFixed(1);
  };
  
  const getAgeGroupFromAudience = (audience: QuizAudience): '12-14' | '15-18' | 'all' => {
    if (!audience) return 'all';
    if (audience.includes('12-14')) return '12-14';
    if (audience.includes('15-18')) return '15-18';
    return 'all';
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
            <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
              <Button onClick={handleRestoreDefaultQuizzes} variant="outline" className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" /> Standaard Quizzen Herstellen
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/dashboard/admin/quiz-management/create">
                  <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Quiz Toevoegen
                </Link>
              </Button>
            </div>
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
                {audienceOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(value) => {setCategoryFilter(value as string | 'all'); setCurrentPage(1);}}>
              <SelectTrigger><SelectValue placeholder="Filter op categorie" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Categorieën</SelectItem>
                {categoryOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
             {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead className="min-w-[200px]">Doelgroep</TableHead>
                  <TableHead>Categorie</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[80px]">Vragen</TableHead>
                  <TableHead className="min-w-[100px]">Gem. Weging</TableHead>
                  <TableHead className="min-w-[130px]">Laatst Bijgewerkt</TableHead>
                  <TableHead className="text-right w-[80px]">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQuizzes.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="h-24 text-center">Geen quizzen gevonden. Maak je eerste quiz aan!</TableCell></TableRow>
                )}
                {paginatedQuizzes.map((quiz) => {
                  const isAdaptiveOrLegacyTeenQuiz = quiz.category === 'Basis' || quiz.id.startsWith('teen-neuro');
                  const ageGroup = getAgeGroupFromAudience(quiz.audience);
                  const previewHref = isAdaptiveOrLegacyTeenQuiz
                    ? `/quiz/teen-neurodiversity-quiz?ageGroup=${ageGroup}`
                    : `/quiz/${quiz.id}`;
                  
                  return (
                    <TableRow key={quiz.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{quiz.title}</span>
                           <div className="flex items-center gap-2 mt-1">
                                {quiz.thumbnailUrl && !quiz.thumbnailUrl.includes('placehold.co') && (
                                    <ImageUp className="h-4 w-4 text-green-500"/>
                                )}
                            </div>
                        </div>
                      </TableCell>
                      <TableCell>{quiz.audience}</TableCell>
                      <TableCell>{getCategoryLabel(quiz.category)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(quiz.status)} className={getStatusBadgeClass(quiz.status)}>
                          {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{(quiz.questions || []).length}</TableCell>
                      <TableCell>{calculateAverageWeight(quiz)}</TableCell>
                      <TableCell>
                          <FormattedDateCell isoDateString={quiz.lastUpdatedAt} dateFormatPattern="P" />
                      </TableCell>
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
                            <DropdownMenuItem asChild>
                              <Link 
                                href={previewHref}
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                  <Eye className="mr-2 h-4 w-4" />Voorbeeld
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteQuiz(quiz.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />Verwijderen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            )}
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
