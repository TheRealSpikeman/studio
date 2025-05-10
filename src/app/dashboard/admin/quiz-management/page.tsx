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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, PlusCircle, ListChecks, MoreVertical, Edit, Trash2, Eye, Bot, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import { generateAiQuiz } from '@/ai/flows/generate-ai-quiz-flow'; // Import the new flow

const DUMMY_QUIZZES: QuizAdmin[] = [
  { 
    id: 'q1', title: 'Basis Neuroprofiel (15-18 jr)', description: 'Algemene neurodiversiteitstest voor oudere tieners.', 
    audience: ['15-18'], category: 'Basis', status: 'published', 
    questions: [{id:'q1a', text:'Vraag 1', weight: 1}, {id:'q1b', text:'Vraag 2', weight: 1}],
    lastUpdatedAt: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  { 
    id: 'q2', title: 'Examenvrees Check', description: 'Quiz over omgaan met examenstress.', 
    audience: ['15-18', '12-14'], category: 'Thema', status: 'concept', 
    questions: [{id:'q2a', text:'Vraag A', weight: 2}],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  { 
    id: 'q3', title: 'Focus Test (12-14 jr)', description: 'Concentratiecheck voor jongere tieners.', 
    audience: ['12-14'], category: 'ADD', status: 'published', questions: [],
    lastUpdatedAt: new Date(Date.now() - 86400000 * 10).toISOString(), createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  },
];

const ITEMS_PER_PAGE = 10;

const audienceOptions: { id: QuizAudience; label: string }[] = [
  { id: '12-14', label: '12-14 jaar' },
  { id: '15-18', label: '15-18 jaar' },
  { id: 'adult', label: 'Volwassene' },
  { id: 'all', label: 'Algemeen (alle leeftijden)' },
];

const categoryOptions: { id: QuizCategory; label: string }[] = [
  { id: 'Basis', label: 'Basis Quiz' },
  { id: 'ADD', label: 'ADD' },
  { id: 'ADHD', label: 'ADHD' },
  { id: 'HSP', label: 'HSP' },
  { id: 'ASS', label: 'ASS' },
  { id: 'AngstDepressie', label: 'Angst/Depressie' },
  { id: 'Thema', label: 'Thema (algemeen)' },
];

const numQuestionsOptions = [
  { id: 5, label: '5 vragen' },
  { id: 10, label: '10 vragen' },
  { id: 15, label: '15 vragen' },
];

const difficultyOptions = [
    { id: 'laag', label: 'Laag' },
    { id: 'gemiddeld', label: 'Gemiddeld' },
    { id: 'hoog', label: 'Hoog' },
];

const aiQuizFormSchema = z.object({
  topic: z.string().min(3, { message: "Onderwerp moet minimaal 3 tekens bevatten." }),
  audience: z.string({ required_error: "Selecteer een doelgroep." }),
  category: z.string({ required_error: "Selecteer een domein/categorie." }),
  numQuestions: z.coerce.number().min(1, { message: "Selecteer het aantal vragen." }),
  difficulty: z.string({ required_error: "Selecteer een moeilijkheidsgraad."}),
});
type AiQuizFormData = z.infer<typeof aiQuizFormSchema>;

export default function QuizManagementPage() {
  const [quizzes, setQuizzes] = useState<QuizAdmin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuizStatusAdmin | 'all'>('all');
  const [audienceFilter, setAudienceFilter] = useState<QuizAudience | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<QuizCategory | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [isAiQuizDialogOpen, setIsAiQuizDialogOpen] = useState(false);
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState(false);

  useEffect(() => {
    // Load quizzes from localStorage on initial mount if any, merge with DUMMY_QUIZZES
    // This is a demo-specific way to handle persistence.
    const loadedQuizzes: QuizAdmin[] = [...DUMMY_QUIZZES];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ai-quiz-')) {
          const storedQuiz = JSON.parse(localStorage.getItem(key)!);
          // Avoid duplicates if DUMMY_QUIZZES already has it (though unlikely with dynamic IDs)
          if (!loadedQuizzes.find(q => q.id === storedQuiz.id)) {
            loadedQuizzes.push(storedQuiz);
          }
        }
      }
    } catch (error) {
        console.error("Error loading quizzes from localStorage:", error);
    }
    setQuizzes(loadedQuizzes);
  }, []);


  const aiQuizForm = useForm<AiQuizFormData>({
    resolver: zodResolver(aiQuizFormSchema),
    defaultValues: {
      topic: "",
      audience: undefined,
      category: undefined,
      numQuestions: 10,
      difficulty: "gemiddeld",
    },
  });

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
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    try {
      localStorage.removeItem(`ai-quiz-${quizId}`); // Also remove from localStorage if it was an AI quiz
    } catch (error) {
      console.error("Error removing quiz from localStorage:", error);
    }
    toast({ title: "Quiz verwijderd", description: `Quiz met ID ${quizId} is verwijderd (simulatie).` });
  };
  
  const getStatusBadgeVariant = (status: QuizStatusAdmin): "default" | "secondary" => {
    return status === 'published' ? 'default' : 'secondary';
  };
  
  const getStatusBadgeClass = (status: QuizStatusAdmin): string => {
    return status === 'published' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300';
  };

  const handleGenerateAiQuiz = async (data: AiQuizFormData) => {
    setIsGeneratingAiQuiz(true);
    toast({
      title: "Quiz genereren met AI...",
      description: `Onderwerp: ${data.topic}. Een ogenblik geduld.`,
    });
    

    try {
      const aiInput = {
        topic: data.topic,
        audience: audienceOptions.find(opt => opt.id === data.audience)?.label || data.audience,
        category: categoryOptions.find(opt => opt.id === data.category)?.label || data.category,
        numQuestions: data.numQuestions,
        difficulty: data.difficulty,
      };
      const aiResult = await generateAiQuiz(aiInput);

      const newQuizId = `ai-${Date.now()}`;
      const newQuiz: QuizAdmin = {
        id: newQuizId,
        title: `${data.topic} (AI: ${data.audience} - ${data.category} - ${data.difficulty})`,
        description: `AI gegenereerde quiz over ${data.topic} (doelgroep ${data.audience}, cat. ${data.category}, moeilijkheid ${data.difficulty}). Pas de titel en beschrijving eventueel aan.`,
        audience: [data.audience as QuizAudience],
        category: data.category as QuizCategory,
        status: 'concept',
        questions: aiResult.questions.map((q, i) => ({
          id: `ai-q${i+1}-${Date.now()}`, // Ensure question IDs are unique enough
          text: q.text,
          example: q.example,
          weight: q.weight
        })),
        lastUpdatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        slug: `ai-${data.topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-5)}`,
        metaTitle: `AI Quiz: ${data.topic}`,
        metaDescription: `Een door AI gegenereerde quiz over ${data.topic} voor ${data.audience}.`
      };

      setQuizzes(prev => [newQuiz, ...prev]);
      try {
        localStorage.setItem(`ai-quiz-${newQuiz.id}`, JSON.stringify(newQuiz));
      } catch (error) {
          console.error("Error saving AI quiz to localStorage:", error);
          toast({
              title: "Fout bij opslaan AI Quiz",
              description: "De quiz is gegenereerd, maar kon niet lokaal worden opgeslagen voor bewerking.",
              variant: "destructive"
          });
      }
      aiQuizForm.reset();
      setIsAiQuizDialogOpen(false);
      toast({
        title: "AI Quiz gegenereerd!",
        description: `De quiz "${newQuiz.title}" is aangemaakt. Bewerk deze om details te verfijnen.`,
        variant: "default", 
      });

    } catch (error) {
      console.error("Error generating AI quiz:", error);
      toast({
        title: "Fout bij AI Quiz Generatie",
        description: "Er is iets misgegaan. Probeer het later opnieuw of pas je input aan.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  const calculateAverageWeight = (quiz: QuizAdmin): string => {
    if (!quiz.questions || quiz.questions.length === 0) return "N/A";
    const totalWeight = quiz.questions.reduce((sum, q) => sum + (q.weight || 1), 0);
    const avg = totalWeight / quiz.questions.length;
    return isNaN(avg) ? "N/A" : avg.toFixed(1);
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
              <Button asChild className="w-full sm:w-auto">
                <Link href="/dashboard/admin/quiz-management/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Quiz Toevoegen
                </Link>
              </Button>
              <Dialog open={isAiQuizDialogOpen} onOpenChange={setIsAiQuizDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Bot className="mr-2 h-4 w-4" /> Genereer met AI
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Zap className="text-primary h-5 w-5"/>Genereer Quiz met AI</DialogTitle>
                    <DialogDescription>
                      Geef de AI instructies om een nieuwe quiz te genereren, inclusief moeilijkheidsgraad en weging.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...aiQuizForm}>
                    <form onSubmit={aiQuizForm.handleSubmit(handleGenerateAiQuiz)} className="space-y-4 py-4">
                      <FormField
                        control={aiQuizForm.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Onderwerp / Thema</FormLabel>
                            <FormControl><Input placeholder="Bijv. Sociale Vaardigheden" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={aiQuizForm.control}
                        name="audience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Doelgroep</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Kies doelgroep" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {audienceOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={aiQuizForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Domein / Categorie</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Kies domein" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {categoryOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={aiQuizForm.control}
                        name="numQuestions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Aantal Vragen</FormLabel>
                            <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Kies aantal" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {numQuestionsOptions.map(opt => <SelectItem key={opt.id} value={String(opt.id)}>{opt.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={aiQuizForm.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Moeilijkheid / Weging</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Kies moeilijkheid" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {difficultyOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormDescription>Dit beïnvloedt de complexiteit en de weging van de vragen.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAiQuizDialogOpen(false)} disabled={isGeneratingAiQuiz}>Annuleren</Button>
                        <Button type="submit" disabled={isGeneratingAiQuiz}>
                          {isGeneratingAiQuiz && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isGeneratingAiQuiz ? "Bezig met genereren..." : "Vraag AI om quiz te genereren"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
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
                  <TableHead className="min-w-[100px]">Doelgroep</TableHead>
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
                  <TableRow><TableCell colSpan={8} className="h-24 text-center">Geen quizzen gevonden.</TableCell></TableRow>
                )}
                {paginatedQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">
                      {quiz.title}
                      {quiz.id.startsWith('ai-') && <Bot className="inline-block ml-2 h-4 w-4 text-primary" title="AI Gegenereerd"/>}
                    </TableCell>
                    <TableCell>{quiz.audience.join(', ')}</TableCell>
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
