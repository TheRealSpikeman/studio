
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
import { Search, PlusCircle, ListChecks, MoreVertical, Edit, Trash2, Eye, Bot, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DEFAULT_QUIZZES } from '@/lib/quiz-data/default-quizzes';

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
    let loadedQuizzes: QuizAdmin[] = [];
    if (typeof window !== 'undefined') {
        const allKeys = Object.keys(localStorage);
        for (const key of allKeys) {
            try {
                const item = localStorage.getItem(key);
                if (item) {
                    const quiz = JSON.parse(item);
                    if (quiz.id && quiz.title && Array.isArray(quiz.questions) && quiz.category) {
                        loadedQuizzes.push(quiz);
                    }
                }
            } catch (e) {
                // Ignore items that are not valid JSON or quizzes
            }
        }

        if (loadedQuizzes.length === 0) {
            // No quizzes found, load defaults
            loadedQuizzes = [...DEFAULT_QUIZZES];
            DEFAULT_QUIZZES.forEach(quiz => localStorage.setItem(quiz.id, JSON.stringify(quiz)));
            toast({
                title: "Standaard Quizzen Geladen",
                description: "Je quizlijst was leeg, dus hebben we enkele voorbeelden voor je geladen.",
            });
        }
    }
    
    // Apply migration/defaults to all loaded quizzes
    const processedQuizzes = loadedQuizzes.map(q => ({
        ...q, 
        questions: q.questions.map(ques => ({...ques, weight: ques.weight ?? 1})),
        thumbnailUrl: q.thumbnailUrl || `https://placehold.co/400x200.png?text=${q.title.replace(/\s/g, '+')}`,
        analysisDetailLevel: q.analysisDetailLevel || 'standaard',
        analysisInstructions: q.analysisInstructions || '',
    }));
    
    setQuizzes(processedQuizzes);
  }, [toast]);

  const handleRestoreDefaultQuizzes = () => {
    if (typeof window === 'undefined') return;

    const currentQuizIds = new Set(quizzes.map(q => q.id));
    const quizzesToAdd = DEFAULT_QUIZZES.filter(dq => !currentQuizIds.has(dq.id));

    if (quizzesToAdd.length === 0) {
        toast({
            title: "Geen actie nodig",
            description: "Alle standaard quizzen zijn al aanwezig in uw lijst."
        });
        return;
    }

    quizzesToAdd.forEach(quiz => {
        localStorage.setItem(quiz.id, JSON.stringify(quiz));
    });
    
    setQuizzes(prev => [...prev, ...quizzesToAdd]);
    
    toast({
        title: "Standaard Quizzen Hersteld",
        description: `${quizzesToAdd.length} standaard quiz(zen) zijn toegevoegd aan de lijst.`
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
