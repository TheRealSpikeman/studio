// src/app/dashboard/coaching/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, MessageSquare, Zap, Sparkles, Repeat, BarChartBig, NotebookPen, ListTodo, 
  CalendarPlus, PlaySquare, Headphones, Library, Rocket, Users, Bot, Trophy, Bell, Check, Image as ImageIcon, Mic, CalendarDays
} from 'lucide-react'; 
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar } from '@/components/ui/calendar';
import { format, differenceInDays, startOfDay, isEqual } from 'date-fns';
import { nl } from 'date-fns/locale';

interface CoachingMessage {
  day: number;
  title: string;
  body: string;
  date: string; // ISO string
}

interface DailyTask {
  id: string;
  label: string;
  completed: boolean;
}

const COACHING_START_DATE = startOfDay(new Date(Date.now() - 86400000 * 30)); // Approx 30 days ago

const generateCoachingMessages = (): CoachingMessage[] => {
  const messages: CoachingMessage[] = [];
  const baseMessages = [
    { title: "Welkom bij je coachingstraject!", body: "Vandaag beginnen we met het verkennen van je sterke punten. Reflecteer op een moment waarop je je echt in je element voelde. Wat deed je toen?" },
    { title: "Structuur en Routine", body: "Een voorspelbare dagstructuur kan helpen om overprikkeling te verminderen en focus te verbeteren. Probeer vandaag één vast rustmoment in te plannen." },
    { title: "Communicatiestijlen", body: "Iedereen communiceert anders. Let vandaag eens op hoe anderen informatie overbrengen en hoe jij daarop reageert. Zijn er patronen te ontdekken?" },
    { title: "Zelfzorg Prioriteren", body: "Neem vandaag bewust tijd voor een activiteit die je energie geeft. Zelfzorg is essentieel voor welzijn." },
    { title: "Grenzen Stellen", body: "Oefen vandaag met het aangeven van een grens, hoe klein ook. Het is oké om 'nee' te zeggen." },
  ];
  for (let i = 0; i < 60; i++) { // Generate 60 days of messages
    const date = new Date(COACHING_START_DATE);
    date.setDate(COACHING_START_DATE.getDate() + i);
    const baseMsg = baseMessages[i % baseMessages.length];
    messages.push({
      day: i + 1,
      title: `${baseMsg.title} (Dag ${i + 1})`,
      body: `${baseMsg.body} Dit is de tip voor ${format(date, 'PPPP', { locale: nl })}.`,
      date: date.toISOString(),
    });
  }
  return messages;
};

const allCoachingMessages = generateCoachingMessages();

const generateDailyTasks = (date: Date): DailyTask[] => {
  const dayOfWeek = date.getDay(); // Sunday = 0, Monday = 1, etc.
  const baseTasks = [
    { id: 'task1', label: 'Doe 5 minuten ademhalingsoefening', completed: false },
    { id: 'task2', label: 'Lees de dagelijkse affirmatie', completed: false },
    { id: 'task3', label: 'Schrijf één ding op waar je dankbaar voor bent', completed: false },
  ];
  if (dayOfWeek % 2 === 0) { // Even days of week
    return [
      ...baseTasks,
      { id: 'task4', label: 'Plan een korte wandeling in', completed: false },
    ];
  }
  return baseTasks;
};

const getAffirmationForDate = (date: Date): string => {
  const affirmations = [
    "Ik ben kalm, capabel en omarm elke uitdaging met een open geest.",
    "Ik waardeer mijn unieke manier van denken en zijn.",
    "Elke dag biedt nieuwe kansen voor groei en leren.",
    "Ik ben veerkrachtig en kan obstakels overwinnen.",
    "Ik kies ervoor om vandaag vriendelijk te zijn voor mezelf.",
  ];
  const dayIndex = date.getDate() % affirmations.length;
  return affirmations[dayIndex];
};

const getVideoSeedForDate = (date: Date): string => {
  return `videotip-${format(date, 'yyyy-MM-dd')}`;
};


export default function CoachingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [receiveDailyEmails, setReceiveDailyEmails] = useState(false);
  
  const [journalEntries, setJournalEntries] = useState<Record<string, string>>({});
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<DailyTask[]>([]);
  
  const [pushNotifications, setPushNotifications] = useState(true);
  const [affirmationTiming, setAffirmationTiming] = useState("08:00");

  const { toast } = useToast();

  const currentJournalText = selectedDate ? journalEntries[format(selectedDate, 'yyyy-MM-dd')] || "" : "";
  
  const currentCoachingMessage = selectedDate 
    ? allCoachingMessages.find(msg => isEqual(startOfDay(new Date(msg.date)), startOfDay(selectedDate)))
    : undefined;

  const affirmationForSelectedDate = selectedDate ? getAffirmationForDate(selectedDate) : "Selecteer een datum.";
  const videoSeedForSelectedDate = selectedDate ? getVideoSeedForDate(selectedDate) : "defaultvideo";

  useEffect(() => {
    if (selectedDate) {
      setTasksForSelectedDate(generateDailyTasks(selectedDate).map(task => ({...task, id: `${task.id}-${format(selectedDate, 'yyyy-MM-dd')}`})));
      // Journal text for the new date is handled by `currentJournalText`
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(startOfDay(date)); // Ensure we're using the start of the day for comparisons
    }
  };

  const handleEmailPreferenceChange = (checked: boolean) => {
    setReceiveDailyEmails(checked);
    toast({
      title: "E-mailvoorkeur bijgewerkt",
      description: checked 
        ? "Je ontvangt nu dagelijkse coaching tips per e-mail." 
        : "Je ontvangt geen dagelijkse coaching tips meer per e-mail.",
    });
  };

  const handlePushNotificationChange = (checked: boolean) => {
    setPushNotifications(checked);
    toast({
      title: "Push Notificatie voorkeur bijgewerkt",
      description: checked
        ? "Push notificaties voor taken zijn ingeschakeld."
        : "Push notificaties voor taken zijn uitgeschakeld.",
    });
  };
  
  const handleJournalChange = (text: string) => {
    if (selectedDate) {
      setJournalEntries(prev => ({ ...prev, [format(selectedDate, 'yyyy-MM-dd')]: text }));
    }
  };

  const handleJournalSave = () => {
    if (selectedDate) {
      console.log(`Journal entry for ${format(selectedDate, 'yyyy-MM-dd')} saved:`, currentJournalText);
      toast({ title: "Dagboek opgeslagen", description: `Je reflectie voor ${format(selectedDate, 'PPP', { locale: nl })} is bewaard.` });
    }
  };

  const handleTaskToggle = (taskId: string) => {
    setTasksForSelectedDate(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Dagelijkse Coaching</h1>
        <p className="text-muted-foreground">
          Jouw persoonlijke hub voor groei, reflectie en welzijn. Bekijk content voor een specifieke dag via de kalender.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Selecteer een datum
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            locale={nl}
            disabled={(date) => date > new Date() || date < COACHING_START_DATE}
            initialFocus
          />
        </CardContent>
      </Card>

      {/* --- Row 1: Affirmation & Streaks --- */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Affirmatie voor {selectedDate ? format(selectedDate, 'PPP', { locale: nl }) : 'vandaag'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic text-foreground">{affirmationForSelectedDate}</p>
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

      {/* --- Row 2: Journaling & Daily Tasks --- */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <NotebookPen className="h-6 w-6 text-primary" />
              Dagboek Reflectie {selectedDate ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : ''}
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
            <div className="flex gap-2">
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
              Jouw Microtaken {selectedDate ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedDate && tasksForSelectedDate.length > 0 ? (
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
              <p className="text-muted-foreground">Geen taken voor deze dag of selecteer een datum.</p>
            )}
          </CardContent>
           <CardFooter>
            <p className="text-sm text-muted-foreground">Voltooi je taken om je streak te behouden!</p>
          </CardFooter>
        </Card>
      </div>
      
      {/* --- Row 3: Multimedia & Coaching Message --- */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlaySquare className="h-6 w-6 text-primary" />
              Video Tip {selectedDate ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {selectedDate ? (
              <Image 
                src={`https://picsum.photos/seed/${videoSeedForSelectedDate}/400/225`} 
                alt="Video tip thumbnail" 
                width={400} 
                height={225} 
                className="rounded-md mb-2 mx-auto" 
                data-ai-hint="coaching video"
                key={videoSeedForSelectedDate} // Force re-render if seed changes
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
              Coaching Tip {selectedDate ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : ''}
            </CardTitle>
            <CardDescription>
              Jouw persoonlijke tip voor de geselecteerde dag.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentCoachingMessage ? (
              <div>
                <h3 className="font-semibold text-lg mb-2">{currentCoachingMessage.title}</h3>
                <p className="text-muted-foreground">{currentCoachingMessage.body}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-10">
                {selectedDate ? "Geen coaching bericht gevonden voor deze dag." : "Selecteer een datum om een coaching bericht te zien."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Settings & Preferences --- */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Instellingen & Voorkeuren</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-3 rounded-md border">
            <div className="space-y-0.5">
                <Label htmlFor="daily-email-toggle" className="text-base">Dagelijkse Tips per E-mail</Label>
                <p className="text-xs text-muted-foreground">Ontvang elke dag een nieuwe coaching tip direct in je inbox.</p>
            </div>
            <Switch 
              id="daily-email-toggle" 
              checked={receiveDailyEmails}
              onCheckedChange={handleEmailPreferenceChange}
              aria-label="Ontvang dagelijkse coaching tips per e-mail"
            />
          </div>
           <div className="flex items-center justify-between p-3 rounded-md border">
            <div className="space-y-0.5">
                <Label htmlFor="push-notification-toggle" className="text-base">Push Notificaties voor Taken</Label>
                <p className="text-xs text-muted-foreground">Krijg reminders voor je dagelijkse microtaken.</p>
            </div>
            <Switch 
              id="push-notification-toggle" 
              checked={pushNotifications}
              onCheckedChange={handlePushNotificationChange}
              aria-label="Push notificaties voor taken"
            />
          </div>
          <div className="p-3 rounded-md border space-y-2">
            <Label htmlFor="affirmation-timing" className="text-base">Timing Ochtend Affirmatie</Label>
            <Select value={affirmationTiming} onValueChange={setAffirmationTiming}>
              <SelectTrigger id="affirmation-timing">
                <SelectValue placeholder="Kies een tijd" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="07:00">07:00</SelectItem>
                <SelectItem value="07:30">07:30</SelectItem>
                <SelectItem value="08:00">08:00</SelectItem>
                <SelectItem value="08:30">08:30</SelectItem>
                <SelectItem value="09:00">09:00</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Kies wanneer je je dagelijkse affirmatie wilt ontvangen.</p>
          </div>
           <div className="p-3 rounded-md border space-y-2">
            <Label className="text-base">Synchroniseer Taken met Kalender</Label>
            <div className="flex gap-2">
                <Button variant="outline" disabled><CalendarPlus className="mr-2 h-4 w-4"/> Google Calendar (binnenkort)</Button>
                <Button variant="outline" disabled><CalendarPlus className="mr-2 h-4 w-4"/> Outlook Agenda (binnenkort)</Button>
            </div>
             <p className="text-xs text-muted-foreground">Voeg je coaching-taken automatisch toe aan je favoriete agenda.</p>
          </div>
        </CardContent>
      </Card>
      
      {/* --- Community & AI (Placeholders) --- */}
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

      {/* --- Library & Workshops (Placeholders) --- */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Library className="h-6 w-6 text-primary" />
                Media Bibliotheek
              </CardTitle>
            </CardHeader>
            <CardContent><p className="text-muted-foreground">Vind extra oefeningen, video's en audio om je groei te ondersteunen (binnenkort).</p></CardContent>
            <CardFooter><Button variant="outline" className="w-full" disabled>Verken Bibliotheek</Button></CardFooter>
        </Card>
        <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-accent" />
                Workshops & Cursussen
              </CardTitle>
            </CardHeader>
            <CardContent><p className="text-muted-foreground">Nieuw: 5-daagse Mindfulness Marathon! Schrijf je in (binnenkort).</p></CardContent>
            <CardFooter><Button variant="outline" className="w-full" disabled>Bekijk Workshops</Button></CardFooter>
        </Card>
      </div>

      {/* Placeholder for Graphs & Reports */}
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
