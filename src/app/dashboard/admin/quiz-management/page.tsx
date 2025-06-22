
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
import { Search, PlusCircle, ListChecks, MoreVertical, Edit, Trash2, Eye, Bot } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const ITEMS_PER_PAGE = 10;

const audienceOptions: { id: QuizAudience; label: string }[] = [
  { id: 'Tiener (12-14 jr, voor zichzelf)', label: 'Tiener (12-14 jr, voor zichzelf)' },
  { id: 'Tiener (15-18 jr, voor zichzelf)', label: 'Tiener (15-18 jr, voor zichzelf)' },
  { id: 'Volwassene (18+, voor zichzelf)', label: 'Volwassene (18+, voor zichzelf)' },
  { id: 'Algemeen (alle leeftijden, voor zichzelf)', label: 'Algemeen (alle leeftijden, voor zichzelf)' },
  { id: 'Ouder (over kind 6-11 jr)', label: 'Ouder (over kind 6-11 jr)' },
  { id: 'Ouder (over kind 12-14 jr)', label: 'Ouder (over kind 12-14 jr)' },
  { id: 'Ouder (over kind 15-18 jr)', label: 'Ouder (over kind 15-18 jr)' },
];

const categoryOptions: { id: QuizCategory; label: string }[] = [
  { id: 'Basis', label: 'Basis Zelfreflectie (Kind/Tiener)' },
  { id: 'Thema', label: 'Thematische Quiz (Kind/Tiener)' },
  { id: 'Ouder Observatie', label: 'Ouder Observatie (Ken je Kind)' },
  { id: 'ADD', label: 'Subtest: ADD Kenmerken' },
  { id: 'ADHD', label: 'Subtest: ADHD Kenmerken' },
  { id: 'HSP', label: 'Subtest: HSP Kenmerken' },
  { id: 'ASS', label: 'Subtest: ASS Kenmerken' },
  { id: 'AngstDepressie', label: 'Subtest: Angst/Depressie Kenmerken' },
];

export default function QuizManagementPage() {
  const [quizzes, setQuizzes] = useState<QuizAdmin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuizStatusAdmin | 'all'>('all');
  const [audienceFilter, setAudienceFilter] = useState<QuizAudience | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<QuizCategory | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const allQuizzes: QuizAdmin[] = [];
    if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                try {
                    const storedData = localStorage.getItem(key);
                    if (storedData) {
                        const quiz = JSON.parse(storedData);
                        // Basic validation to ensure it's a quiz object
                        if (quiz.id && quiz.title && Array.isArray(quiz.questions) && quiz.category) {
                            allQuizzes.push(quiz);
                        }
                    }
                } catch (e) {
                    // Not a JSON object or not a quiz object, ignore.
                }
            }
        }
    }
    
    setQuizzes(allQuizzes.map(q => ({
        ...q, 
        questions: q.questions.map(ques => ({...ques, weight: ques.weight ?? 1})),
        thumbnailUrl: q.thumbnailUrl || `https://placehold.co/400x200.png?text=${q.title.replace(/\s/g, '+')}`,
        analysisDetailLevel: q.analysisDetailLevel || 'standaard',
        analysisInstructions: q.analysisInstructions || '',
    })));
  }, []);

  const handleDeleteAllQuizzes = () => {
    if (typeof window === 'undefined') return;

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            try {
                const item = localStorage.getItem(key);
                if (item) {
                    const quiz = JSON.parse(item);
                    // This duck-typing check identifies quiz objects
                    if (quiz.id && quiz.title && Array.isArray(quiz.questions) && quiz.category) {
                        keysToRemove.push(key);
                    }
                }
            } catch (e) {
                // Not a JSON object, so definitely not a quiz object we want to delete.
                // Continue to the next item.
            }
        }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    setQuizzes([]); // Clear state immediately
    
    toast({
        title: "Alle quizzen verwijderd",
        description: "De lokale opslag is opgeschoond. U kunt nu met een schone lei beginnen."
    });
  };

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || quiz.status === statusFilter;
      const matchesAudience = audienceFilter === 'all' || (Array.isArray(quiz.audience) && quiz.audience.includes(audienceFilter as QuizAudience));
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
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    try {
      localStorage.removeItem(quizId);
    } catch (error) {
      console.error("Error removing quiz from localStorage:", error);
    }
    toast({ title: "Quiz verwijderd", description: `Quiz met ID ${quizId} is verwijderd.` });
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
  
  const getAgeGroupFromAudience = (audience: QuizAudience[]): '12-14' | '15-18' | 'all' => {
    if (!audience || audience.length === 0) return 'all';
    const audStr = audience[0];
    if (audStr.includes('12-14')) return '12-14';
    if (audStr.includes('15-18')) return '15-18';
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Alle Quizzen Verwijderen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Deze actie zal ALLE quizzen (inclusief uw eigen concepten) permanent verwijderen uit de lokale opslag van uw browser. Dit kan niet ongedaan worden gemaakt. Dit is nuttig om oude, hardgecodeerde data op te ruimen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuleren</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAllQuizzes} className="bg-destructive hover:bg-destructive/90">Ja, verwijder alles</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
            <Select value={categoryFilter} onValueChange={(value) => {setCategoryFilter(value as QuizCategory | 'all'); setCurrentPage(1);}}>
              <SelectTrigger><SelectValue placeholder="Filter op categorie" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Categorieën</SelectItem>
                {categoryOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
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
                    : `/quiz/${quiz.slug || quiz.id}`;
                  
                  return (
                    <TableRow key={quiz.id}>
                      <TableCell className="font-medium">
                        {quiz.title}
                        {quiz.id.startsWith('ai-') && <Bot className="inline-block ml-2 h-4 w-4 text-primary" title="AI Gegenereerd"/>}
                      </TableCell>
                      <TableCell>{Array.isArray(quiz.audience) ? quiz.audience.join(', ') : quiz.audience}</TableCell>
                      <TableCell>{quiz.category}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(quiz.status)} className={getStatusBadgeClass(quiz.status)}>
                          {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{quiz.questions.length}</TableCell>
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

