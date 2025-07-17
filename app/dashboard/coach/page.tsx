
// src/app/dashboard/coach/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, BookOpen, Users, Settings, Euro, FileText, AlertTriangle, Briefcase, Clock, Handshake, Wrench } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Simulate user data and role for redirection logic
const MOCKED_CURRENT_COACH = {
  isLoggedIn: true, 
  role: 'coach' as 'coach' | 'admin', 
  status: 'actief' as 'pending_onboarding' | 'pending_approval' | 'actief' | 'rejected', 
};

interface DashboardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  disabled?: boolean;
  isLink: boolean;
  colorClass?: string;
}

const coachDashboardItems: DashboardItem[] = [
  {
    id: 'availability',
    title: 'Mijn Beschikbaarheid (Coach)',
    description: 'Stel je werkuren en afwijkende dagen in.',
    icon: Clock,
    link: '/dashboard/coach/availability',
    buttonText: 'Beheer Beschikbaarheid',
    buttonVariant: 'outline',
    isLink: true,
    colorClass: 'bg-blue-50 border-blue-200 hover:shadow-blue-100',
  },
  {
    id: 'sessions',
    title: 'Mijn Sessies',
    description: 'Bekijk je geplande en afgelopen coachingsessies.',
    icon: BookOpen,
    link: '/dashboard/coach/lessons', // Using 'lessons' path for now, can be refactored to 'sessions'
    buttonText: 'Bekijk Sessies',
    buttonVariant: 'outline',
    isLink: true,
    colorClass: 'bg-green-50 border-green-200 hover:shadow-green-100',
  },
  {
    id: 'clients',
    title: 'Mijn Cliënten',
    description: 'Bekijk het overzicht van je cliënten en hun voortgang.',
    icon: Users,
    link: '/dashboard/coach/students', // Using 'students' path for now, can be refactored to 'clients'
    buttonText: 'Bekijk Mijn Cliënten',
    buttonVariant: 'outline',
    isLink: true,
    colorClass: 'bg-purple-50 border-purple-200 hover:shadow-purple-100',
  },
   {
    id: 'tools',
    title: 'Mijn Coach Tools',
    description: 'Overzicht van tools voor cliëntanalyse, sessieplanning en communicatie.',
    icon: Wrench,
    link: '/dashboard/coach/tools',
    buttonText: 'Open Tools',
    buttonVariant: 'outline',
    isLink: true,
    colorClass: 'bg-teal-50 border-teal-200 hover:shadow-teal-100',
  },
  {
    id: 'earnings',
    title: 'Verdiensten & Uitbetalingen',
    description: 'Bekijk je factuurhistorie en verdiende bedragen.',
    icon: Euro,
    link: '#', 
    buttonText: 'Bekijk Verdiensten',
    buttonVariant: 'outline',
    disabled: true,
    isLink: false,
    colorClass: 'bg-yellow-50 border-yellow-200 hover:shadow-yellow-100',
  },
  {
    id: 'profileSettings',
    title: 'Coach Profiel Instellingen',
    description: 'Werk je persoonlijke gegevens, specialisaties en documenten bij.',
    icon: Settings,
    link: '/dashboard/profile', // General profile page for now
    buttonText: 'Ga naar Profiel',
    buttonVariant: 'default',
    isLink: true,
    colorClass: 'bg-gray-50 border-gray-200 hover:shadow-gray-100',
  },
];


export default function CoachDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!MOCKED_CURRENT_COACH.isLoggedIn || MOCKED_CURRENT_COACH.role !== 'coach') {
      // router.push('/login'); 
      return;
    }
    // Add onboarding/approval checks for coach if needed, similar to tutor
    // For now, assuming 'actief' coach can access.
  }, [router]);
  
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Handshake className="h-8 w-8 text-primary"/> Coach Dashboard
        </h1>
        <p className="text-muted-foreground">
          Beheer hier je beschikbaarheid, geplande sessies, cliënten en profiel.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coachDashboardItems.map((item) => (
          <Card 
            key={item.id} 
            className={cn(
                "group flex flex-col shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-in-out h-full",
                item.colorClass || "bg-card"
            )}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  {item.title}
                  {item.disabled && <Badge variant="outline" className="text-xs border-amber-400 text-amber-600">Binnenkort</Badge>}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant={item.buttonVariant || 'outline'} 
                className="w-full" 
                asChild={item.isLink} 
                disabled={item.disabled}
              >
                {item.isLink ? <Link href={item.link}>{item.buttonText}</Link> : <>{item.buttonText}</>}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
