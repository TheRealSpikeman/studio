// src/app/dashboard/page.tsx
"use client"; 

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MessageSquare, TrendingUp, ClipboardList, BarChart3, BookOpenCheck } from 'lucide-react';
import { useDashboardRole } from '@/contexts/DashboardRoleContext'; 

import AdminDashboardOverviewPage from './admin/page'; 
import TutorDashboardPage from './tutor/page';
import OuderDashboardPage from './ouder/page';

const currentUserData = { 
  name: "Alex", 
  ageGroup: '15-18' as '12-14' | '15-18' | 'adult'
};

const latestCoachingTip = {
  title: "Tip van de dag: Structuur en Routine",
  message: "Een voorspelbare dagstructuur kan helpen om overprikkeling te verminderen en focus te verbeteren. Probeer vandaag één vast rustmoment in te plannen.",
};

interface DashboardActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  buttonText: string;
  colorClass?: string;
}

const leerlingDashboardItems: DashboardActionItem[] = [
  {
    id: 'quizzes',
    title: 'Ontdek Jezelf',
    description: 'Start een nieuwe quiz, ga verder waar je gebleven was, of bekijk alle beschikbare quizzen.',
    icon: ClipboardList,
    link: currentUserData.ageGroup === 'adult' ? '/quizzes' : `/quizzes?ageGroup=${currentUserData.ageGroup}`,
    buttonText: 'Naar Mijn Quizzen',
    colorClass: 'bg-orange-50 border-orange-200 hover:shadow-orange-100',
  },
  {
    id: 'coaching',
    title: 'Jouw Dagelijkse Groei',
    description: 'Ontvang persoonlijke tips, reflecteer in je dagboek en volg je voortgang in de coaching hub.',
    icon: MessageSquare,
    link: '/dashboard/coaching',
    buttonText: 'Naar Mijn Coaching',
    colorClass: 'bg-teal-50 border-teal-200 hover:shadow-teal-100',
  },
  {
    id: 'results',
    title: 'Jouw Inzichten',
    description: 'Bekijk je voltooide quizrapporten, ontdek je profiel en download je resultaten.',
    icon: BarChart3,
    link: '/dashboard/results',
    buttonText: 'Bekijk Mijn Resultaten',
    colorClass: 'bg-purple-50 border-purple-200 hover:shadow-purple-100',
  },
  {
    id: 'homework',
    title: 'Slimmer Studeren',
    description: 'Krijg hulp bij je huiswerk met handige tools, tips en planninghulpmiddelen.',
    icon: BookOpenCheck,
    link: '/dashboard/homework-assistance',
    buttonText: 'Naar Huiswerk Tools',
    colorClass: 'bg-blue-50 border-blue-200 hover:shadow-blue-100',
  }
];

function LeerlingDashboardContent() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">
          Welkom terug, <span className="text-primary">{currentUserData.name}</span>!
        </h1>
        <p className="text-muted-foreground">Klaar om meer over jezelf te ontdekken en te groeien?</p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leerlingDashboardItems.map((item) => (
            <Card key={item.id} className={`group flex flex-col shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-in-out h-full ${item.colorClass || 'bg-card'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ item.id === 'quizzes' ? 'bg-primary/20 text-primary' : item.id === 'coaching' ? 'bg-accent/20 text-accent' : item.id === 'results' ? 'bg-purple-600/20 text-purple-600' : 'bg-blue-600/20 text-blue-600' }`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                      <CardTitle className="text-lg font-semibold leading-tight">{item.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
              <CardFooter className="pt-3">
                <Button asChild className="w-full" variant={item.id === 'quizzes' ? 'default' : 'outline'}>
                  <Link href={item.link}>{item.buttonText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-primary">
                <MessageSquare className="h-6 w-6 text-primary" />
                {latestCoachingTip.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{latestCoachingTip.message}</p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="flex-1">
                    <Link href="/dashboard/coaching">Naar Coaching Hub</Link>
                </Button>
                <Button variant="outline" className="flex-1">
                    Markeer als gelezen
                </Button>
            </CardFooter>
          </Card>
        </section>
        
        <section>
            <Card className="shadow-lg">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-accent">
                        <TrendingUp className="h-6 w-6 text-accent"/>
                        Mijn Voortgang
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground text-sm">
                        Je hebt recent de "Sociale Angst & Vriendschap" quiz voltooid. Goed bezig!
                    </p>
                     <p className="text-muted-foreground text-sm mt-2">
                        Volgende stap: verdiep je in de coaching tips over communicatiestijlen.
                    </p>
                 </CardContent>
                 <CardFooter>
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/dashboard/results">Bekijk alle resultaten</Link>
                    </Button>
                 </CardFooter>
            </Card>
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { currentDashboardRole } = useDashboardRole();

  if (currentDashboardRole === 'admin') {
    return <AdminDashboardOverviewPage />;
  }

  if (currentDashboardRole === 'tutor') {
    return <TutorDashboardPage />;
  }

  if (currentDashboardRole === 'ouder') {
    return <OuderDashboardPage />; 
  }

  return <LeerlingDashboardContent />;
}
