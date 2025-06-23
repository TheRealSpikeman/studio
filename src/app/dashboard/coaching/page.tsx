// src/app/dashboard/coaching/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, Repeat, BarChartBig, NotebookPen, ListTodo, 
  PlaySquare, Library, Rocket, Users, Bot, Trophy, Image as ImageIcon, Mic, CalendarDays, Eye, EyeOff, Zap, Loader2, Info
} from 'lucide-react'; 
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Calendar } from '@/components/ui/calendar';
import { format, startOfDay, isEqual, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { generateCoachingInsights } from '@/ai/flows/generate-coaching-insights';
import type { GenerateCoachingInsightsOutput } from '@/ai/flows/generate-coaching-insights';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import Link from 'next/link';

interface DailyTask {
  id: string;
  label: string;
  completed: boolean;
}

const COACHING_START_DATE = startOfDay(new Date(Date.now() - 86400000 * 30)); // Approx 30 days ago

const JOURNEY_STEPS = {
  WELCOME_SEEN: 'journey_welcome_seen_v1',
  QUIZ_COMPLETED: 'journey_quiz_completed_v1',
  FIRST_COACHING_VIEWED: 'journey_first_coaching_viewed_v1',
  SEVEN_DAY_STREAK: 'journey_seven_day_streak_v1'
};


const generateStaticDailyTasks = (date: Date): DailyTask[] => {
  const baseTasks = [
    { id: 'task1-static', label: 'Doe 5 minuten ademhalingsoefening', completed: false },
    { id: 'task2-static', label: 'Lees de dagelijkse affirmatie', completed: false },
    { id: 'task3-static', label: 'Schrijf één ding op waar je dankbaar voor bent', completed: false },
  ];
  return baseTasks.map(task => ({...task, id: `${task.id}-${format(date, 'yyyy-MM-dd')}`}));
};

const getVideoSeedForDate = (date: Date): string => {
  return `videotip-${format(date, 'yyyy-MM-dd')}`;
};

interface AiCoachingContent {
  dailyAffirmation: string;
  dailyCoachingTip: string;
  microTaskSuggestion: string;
}

export default function CoachingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [journalEntries, setJournalEntries] = useState<Record<string, string>>({});
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<DailyTask[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const [aiCoachingContent, setAiCoachingContent] = useState<AiCoachingContent | null>(null);
  const [isLoadingAiContent, setIsLoadingAiContent] = useState(true); // Start as true
  const [userName, setUserName] = useState<string>("een MindNavigator gebruiker");
  const [onboardingAnalysisText, setOnboardingAnalysisText] = useState<string | undefined>(undefined);
  const [showFirstTimeCoachingExplanation, setShowFirstTimeCoachingExplanation] = useState(false);


  useEffect(() => {
    setIsClient(true);
    setSelectedDate(startOfDay(new Date())); 
    
    if (typeof window !== 'undefined') {
      const storedUserData = localStorage.getItem('mindnavigator_onboardingUser');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          if (userData.name) setUserName(userData.name);
        } catch (e) { console.warn("Kon gebruikersnaam niet laden."); }
      }
      // Load analysis text but set loading to false after. The next useEffect will handle the fetch.
      const storedAnalysis = localStorage.getItem('mindnavigator_onboardingAnalysis');
      setOnboardingAnalysisText(storedAnalysis ?? null); // Use null if not found
      
      const firstCoachingViewed = localStorage.getItem(JOURNEY_STEPS.FIRST_COACHING_VIEWED);
      if (!firstCoachingViewed) {
         setShowFirstTimeCoachingExplanation(true);
      }
    }
  }, []);

  const fetchAiCoachingData = useCallback(async (date: Date, analysisText: string | null) => {
    setIsLoadingAiContent(true); // Always set loading to true when fetching
    setAiCoachingContent(null);
    
    if (!analysisText || analysisText.trim() === '') {
      toast({ title: "Info", description: "Voltooi eerst de Zelfreflectie Tool voor gepersonaliseerde coaching.", duration: 5000});
      setAiCoachingContent({ dailyAffirmation: "Elke dag is een nieuw begin.", dailyCoachingTip: "Ontdek vandaag iets nieuws over jezelf.", microTaskSuggestion: "Denk na over één ding dat je vandaag wilt bereiken." });
      setIsLoadingAiContent(false);
      return;
    }

    try {
      const input = {
        onboardingAnalysisText: analysisText,
        userName: userName,
        currentDate: format(date, "EEEE d MMMM", { locale: nl })
      };
      const result: GenerateCoachingInsightsOutput = await generateCoachingInsights(input);
      setAiCoachingContent(result);
      
      const aiTask: DailyTask = { id: `ai-task-${format(date, 'yyyy-MM-dd')}`, label: result.microTaskSuggestion, completed: false };
      const staticTasks = generateStaticDailyTasks(date);
      setTasksForSelectedDate([aiTask, ...staticTasks]);

      if (!localStorage.getItem(JOURNEY_STEPS.FIRST_COACHING_VIEWED)) {
        localStorage.setItem(JOURNEY_STEPS.FIRST_COACHING_VIEWED, 'true');
        setShowFirstTimeCoachingExplanation(false);
      }

    } catch (error) {
      console.error("Error fetching AI coaching insights:", error);
      toast({ title: "Fout", description: "Kon gepersonaliseerde coaching content niet laden.", variant: "destructive"});
      setAiCoachingContent({ dailyAffirmation: "Begin de dag met een glimlach.", dailyCoachingTip: "Neem vandaag even tijd voor jezelf.", microTaskSuggestion: "Adem diep in en uit." });
    } finally {
        setIsLoadingAiContent(false);
    }
  }, [toast, userName]); // Removed onboardingAnalysisText from here

  useEffect(() => {
    // This effect now correctly triggers when onboardingAnalysisText is loaded or selectedDate changes.
    // The fetchAiCoachingData function reference is stable, breaking the loop.
    if (selectedDate && onboardingAnalysisText !== undefined) { 
      setTasksForSelectedDate(generateStaticDailyTasks(selectedDate));
      fetchAiCoachingData(selectedDate, onboardingAnalysisText);
    }
  }, [selectedDate, onboardingAnalysisText, fetchAiCoachingData]);


  const currentJournalText = selectedDate ? journalEntries[format(selectedDate, 'yyyy-MM-dd')] || "" : "";
  const videoSeedForSelectedDate = selectedDate ? getVideoSeedForDate(selectedDate) : "defaultvideo";

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(startOfDay(date)); 
    }
  };
  
  const handleJournalChange = (text: string) => {
    if (selectedDate) {
      setJournalEntries(prev => ({ ...prev, [format(selectedDate, 'yyyy-MM-dd')]: text }));
    }
  };

  const handleJournalSave = () => {
    if (selectedDate) {
      console.log(`Journal entry for ${format(selectedDate, 'yyyy-MM-dd')} saved:`, currentJournalText);
      localStorage.setItem(`journalEntry_${format(selectedDate, 'yyyy-MM-dd')}`, currentJournalText);
      toast({ title: "Dagboek opgeslagen", description: `Je reflectie voor ${format(selectedDate, 'PPP', { locale: nl })} is bewaard.` });
    }
  };

  useEffect(() => {
    if (selectedDate && isClient) {
        const savedEntry = localStorage.getItem(`journalEntry_${format(selectedDate, 'yyyy-MM-dd')}`);
        if (savedEntry) {
            setJournalEntries(prev => ({ ...prev, [format(selectedDate, 'yyyy-MM-dd')]: savedEntry }));
        } else {
            setJournalEntries(prev => ({ ...prev, [format(selectedDate, 'yyyy-MM-dd')]: "" }));
        }
    }
  }, [selectedDate, isClient]);

  const handleTaskToggle = (taskId: string) => {
    setTasksForSelectedDate(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const toggleCalendar = () => {
    setIsCalendarOpen(prev => !prev);
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Dagelijkse Coaching</h1>
        <p className="text-muted-foreground">
          Jouw persoonlijke hub voor groei, reflectie en welzijn. Bekijk content voor een specifieke dag via de kalender.
        </p>
      </section>

      {isClient && onboardingAnalysisText && (
        <div className="mb-6">
          <Alert variant="default" className="bg-gradient-to-r from-primary/5 to-purple-50/50 border-primary/20 shadow-sm">
            <Sparkles className="h-5 w-5 !text-primary" />
            <AlertTitleUi className="text-primary font-semibold">Jouw Persoonlijke Coaching</AlertTitleUi>
            <AlertDescUi className="text-foreground/80">
              Op basis van jouw Zelfreflectie Tool krijg je elke dag content die echt bij jou past. 
              De affirmatie, tip en taak hieronder zijn speciaal voor jou samengesteld.
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary hover:text-primary/80 ml-2"
                asChild
              >
                <Link href="/dashboard/results">Bekijk je resultaten →</Link>
              </Button>
            </AlertDescUi>
          </Alert>
        </div>
      )}
      {isClient && showFirstTimeCoachingExplanation && (
         <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200 text-blue-700">
            <Info className="h-5 w-5 !text-blue-600" />
            <AlertTitleUi className="text-blue-700 font-semibold">Welkom bij je Coaching Hub!</AlertTitleUi>
            <AlertDescUi className="text-blue-600">
                Dit is je persoonlijke ruimte voor dagelijkse groei. Elke dag vind je hier een nieuwe affirmatie, een coaching tip en een kleine taak, allemaal afgestemd op de inzichten uit je Zelfreflectie Tool.
            </AlertDescUi>
          </Alert>
      )}


      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Selecteer een datum
          </CardTitle>
          <Button onClick={toggleCalendar} variant="outline">
            {isCalendarOpen ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {isCalendarOpen ? "Verberg Kalender" : "Toon Kalender"}
          </Button>
        </CardHeader>
        {isCalendarOpen && (
          <CardContent className="flex justify-center pt-4">
            {!isClient ? (
              <Skeleton className="h-[290px] w-[280px] rounded-md border" />
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
                locale={nl}
                disabled={(date) => date > new Date() || date < COACHING_START_DATE}
                initialFocus
              />
            )}
          </CardContent>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Affirmatie {selectedDate && isClient ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAiContent ? <Skeleton className="h-6 w-3/4" /> : <p className="text-lg italic text-foreground">{aiCoachingContent?.dailyAffirmation || "Selecteer een datum of voltooi de Zelfreflectie Tool."}</p>}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-6 w-6 text-accent" />
              Jouw Groei Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">🔥 5 dagen op rij actief!</p>
            <p className="text-sm text-muted-foreground">Blijf zo doorgaan, je doet het geweldig!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <NotebookPen className="h-6 w-6 text-primary" />
              Dagboek Reflectie {selectedDate && isClient ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea 
              placeholder="Hoe voel je je vandaag? Wat heb je geleerd? Waar ben je dankbaar voor?" 
              value={currentJournalText}
              onChange={(e) => handleJournalChange(e.target.value)}
              rows={5}
              disabled={!selectedDate}
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled>
                <ImageIcon className="mr-2 h-4 w-4" /> Foto (binnenkort)
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Mic className="mr-2 h-4 w-4" /> Audio (binnenkort)
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleJournalSave} className="w-full" disabled={!selectedDate}>Reflectie Opslaan</Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-6 w-6 text-accent" />
              Jouw Microtaken {selectedDate && isClient ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingAiContent && onboardingAnalysisText !== null ? <Skeleton className="h-20 w-full" /> : null}
            {!isLoadingAiContent && selectedDate && tasksForSelectedDate.length > 0 ? (
              tasksForSelectedDate.map(task => (
                <div key={task.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Checkbox 
                    id={task.id} 
                    checked={task.completed}
                    onCheckedChange={() => handleTaskToggle(task.id)}
                    aria-label={task.label}
                  />
                  <Label htmlFor={task.id} className={`cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.label}
                  </Label>
                </div>
              ))
            ) : (
              !isLoadingAiContent && <p className="text-muted-foreground">Geen taken voor deze dag, selecteer een datum of voltooi de Zelfreflectie Tool.</p>
            )}
          </CardContent>
           <CardFooter>
            <p className="text-sm text-muted-foreground">Voltooi je taken om je streak te behouden!</p>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlaySquare className="h-6 w-6 text-primary" />
              Video Tip {selectedDate && isClient ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {selectedDate && isClient ? (
              <Image 
                src={`https://placehold.co/400x225.png?seed=${videoSeedForSelectedDate}`} 
                alt="Video tip thumbnail" 
                width={400} 
                height={225} 
                className="rounded-md mb-2 mx-auto" 
                data-ai-hint="coaching video"
                key={videoSeedForSelectedDate} 
              />
            ) : (
              <div className="h-[225px] w-full max-w-[400px] mx-auto bg-muted rounded-md flex items-center justify-center text-muted-foreground mb-2">
                Selecteer een datum
              </div>
            )}
            <p className="text-muted-foreground">Een korte video (1-2 min) met extra inzichten over de tip van vandaag.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Bekijk Video (binnenkort)</Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-accent" />
              Coaching Tip {selectedDate && isClient ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : ''}
            </CardTitle>
            <CardDescription>
              Jouw persoonlijke tip voor de geselecteerde dag.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAiContent ? (
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-3/4" />
                 </div>
            ) : aiCoachingContent?.dailyCoachingTip ? (
              <div>
                <p className="text-muted-foreground">{aiCoachingContent.dailyCoachingTip}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-10">
                {selectedDate && isClient && onboardingAnalysisText ? "Geen coaching bericht gevonden voor deze dag." : "Selecteer een datum of voltooi de Zelfreflectie Tool voor een tip."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Community Forum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Deel je ervaringen, stel vragen en steun anderen in onze community (binnenkort).</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Ga naar Forum</Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-accent" />
              AI Coach Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Stel vragen en krijg directe feedback van je AI-gedreven coach (binnenkort).</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>Start Chat</Button>
          </CardFooter>
        </Card>
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Wekelijkse Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Doe mee aan de "Mindfulness Momenten" challenge deze week (binnenkort)!</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Bekijk Challenge</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Library className="h-6 w-6 text-primary" />
                Media Bibliotheek
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Vind extra oefeningen, video's en audio om je groei te ondersteunen (binnenkort).</p>
            </CardContent>
            <CardFooter><Button variant="outline" className="w-full" disabled>Verken Bibliotheek</Button></CardFooter>
        </Card>
        <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-accent" />
                Workshops & Cursussen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Nieuw: 5-daagse Mindfulness Marathon! Schrijf je in (binnenkort).</p>
            </CardContent>
            <CardFooter><Button variant="outline" className="w-full" disabled>Bekijk Workshops</Button></CardFooter>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChartBig className="h-6 w-6 text-primary" />
            Voortgangsrapporten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Gedetailleerde grafieken en analyses van je voortgang (binnenkort beschikbaar).</p>
          <div className="h-40 bg-muted rounded-md mt-4 flex items-center justify-center text-muted-foreground italic">
            Grafiek placeholder
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" disabled>Bekijk Rapporten</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
