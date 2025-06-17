// src/app/dashboard/ouder/page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Users, Settings, BookOpenCheck, Euro, BarChart3, CalendarClock, CalendarPlus, ShieldCheck, MessagesSquare, Link2, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  statistic?: string; 
  disabled?: boolean;
  isLink?: boolean;
  colorClass?: string;
}

// Dummy data for statistics - replace with actual data fetching later
const dummyFamilyLessonStats = {
  geplandeLessenDezeWeek: 5,
  voltooideLessenTotaal: 23,
  recenteActiviteit: "Sofie heeft de 'Focus Zelfreflectie Tool' voltooid.",
};

const ouderDashboardItems: DashboardItem[] = [
  {
    id: 'kinderen',
    title: 'Mijn Kinderen',
    description: 'Voeg kinderen toe, beheer hun profielen en bekijk hun individuele voortgang en resultaten.',
    icon: Users,
    link: '/dashboard/ouder/kinderen', 
    buttonText: 'Kinderen Toevoegen & Beheren',
    buttonVariant: 'default', 
    isLink: true,
    colorClass: 'bg-orange-50 border-orange-200 hover:shadow-orange-100', 
  },
   {
    id: 'zoek-professional',
    title: 'Zoek Begeleiding (Tutor/Coach)',
    description: 'Vind en koppel gekwalificeerde tutors of coaches voor 1-op-1 ondersteuning van uw kind.',
    icon: Link2,
    link: '/dashboard/ouder/zoek-professional',
    buttonText: 'Zoek een Tutor of Coach',
    buttonVariant: 'outline',
    isLink: true,
    colorClass: 'bg-indigo-50 border-indigo-200 hover:shadow-indigo-100',
  },
  {
    id: 'gekoppelde-professionals',
    title: 'Mijn Begeleiders (Tutors/Coaches)',
    description: 'Overzicht van alle aan uw kinderen gekoppelde tutors en coaches. Plan hier ook lessen.',
    icon: UserCheck,
    link: '/dashboard/ouder/gekoppelde-professionals',
    buttonText: 'Bekijk Gekoppelde Begeleiders',
    buttonVariant: 'outline',
    isLink: true,
    colorClass: 'bg-cyan-50 border-cyan-200 hover:shadow-cyan-100',
  },
  {
    id: 'privacy',
    title: 'Privacy & Toestemming',
    description: 'Beheer hier de deelinstellingen van uw kind en lees tips over respectvolle communicatie en het waarborgen van autonomie.',
    icon: ShieldCheck,
    link: '/dashboard/ouder/privacy-instellingen', 
    buttonText: 'Beheer Privacy & Delen', 
    buttonVariant: 'outline',
    disabled: false, 
    isLink: true,
    colorClass: 'bg-pink-50 border-pink-200 hover:shadow-pink-100',
  },
  {
    id: 'aankomende-lessen',
    title: 'Aankomende Lessen',
    description: 'Snel overzicht van alle geplande bijlessen voor uw gezin.',
    icon: CalendarClock,
    link: '/dashboard/ouder/lessen/aankomend',
    buttonText: 'Bekijk Aankomende Lessen',
    buttonVariant: 'outline',
    statistic: `Totaal ${dummyFamilyLessonStats.geplandeLessenDezeWeek} lessen gepland deze week.`,
    isLink: true,
    colorClass: 'bg-blue-50 border-blue-200 hover:shadow-blue-100',
  },
  {
    id: 'plan-les',
    title: 'Nieuwe Les Plannen',
    description: 'Plan eenvoudig een nieuwe bijles of een lessenreeks in voor een van uw kinderen.',
    icon: CalendarPlus,
    link: '/dashboard/ouder/lessen/plannen',
    buttonText: 'Plan een Nieuwe Les',
    buttonVariant: 'default',
    isLink: true,
    colorClass: 'bg-green-50 border-green-200 hover:shadow-green-100',
  },
  {
    id: 'abonnementen',
    title: 'Abonnementen & Betaling',
    description: 'Beheer de abonnementen voor de coaching-hub en bijlessen. Bekijk factuurhistorie en pas betaalmethoden aan.',
    icon: Euro,
    link: '/dashboard/ouder/abonnementen', 
    buttonText: 'Beheer Abonnementen', 
    buttonVariant: 'outline',
    isLink: true,
    colorClass: 'bg-yellow-50 border-yellow-200 hover:shadow-yellow-100',
  },
  {
    id: 'resultaten',
    title: 'Resultaten & Voortgang',
    description: 'Bekijk de voortgang en algemene ontwikkeling van uw tiener (gedeeld met hun toestemming en respect voor hun privacy).',
    icon: BarChart3,
    link: '/dashboard/ouder/lessen/overzicht', 
    buttonText: 'Bekijk Resultaten & Verslagen',
    buttonVariant: 'outline',
    statistic: dummyFamilyLessonStats.recenteActiviteit,
    isLink: true,
    colorClass: 'bg-purple-50 border-purple-200 hover:shadow-purple-100',
  },
   {
    id: 'gezinsgesprekken',
    title: 'Gezinsgesprekken',
    description: 'Tips en handvatten om open en constructieve gesprekken te voeren over neurodiversiteit en welzijn binnen het gezin.',
    icon: MessagesSquare,
    link: '#',
    buttonText: 'Tips voor Gesprekken (binnenkort)',
    buttonVariant: 'outline',
    disabled: true,
    isLink: false,
    colorClass: 'bg-lime-50 border-lime-200 hover:shadow-lime-100',
  },
  {
    id: 'accountinstellingen',
    title: 'Mijn Accountinstellingen',
    description: 'Pas uw persoonlijke gegevens, wachtwoord en communicatievoorkeuren aan.',
    icon: Settings,
    link: '/dashboard/profile',
    buttonText: 'Ga naar Instellingen',
    buttonVariant: 'outline', 
    isLink: true,
    colorClass: 'bg-gray-50 border-gray-200 hover:shadow-gray-100',
  },
];


export default function OuderDashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Ouder Dashboard</h1>
        <p className="text-muted-foreground">
          Welkom! Beheer hier alles rondom de MindNavigator ervaring van uw kinderen.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ouderDashboardItems.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "group flex flex-col shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-in-out h-full",
              item.colorClass || "bg-card"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                     item.id === 'kinderen' || item.id === 'plan-les' ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-lg font-semibold leading-tight">{item.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              {item.statistic && (
                <p className="text-sm font-medium text-primary pt-1">{item.statistic}</p>
              )}
            </CardContent>
            <CardFooter className="pt-3">
              <Button
                variant={item.buttonVariant || 'default'}
                className="w-full"
                asChild={item.isLink && !item.disabled}
                disabled={item.disabled}
              >
                {item.isLink && !item.disabled ? <Link href={item.link}>{item.buttonText}</Link> : <>{item.buttonText}</>}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

