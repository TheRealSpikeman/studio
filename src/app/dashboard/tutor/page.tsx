// src/app/dashboard/tutor/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, BookOpen, Users, Settings, Euro, FileText, AlertTriangle, Briefcase, Clock } from 'lucide-react'; // Changed DollarSign to Euro
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Simulate user data and role for redirection logic
// In a real app, this would come from an authentication context
const MOCKED_CURRENT_TUTOR = {
  isLoggedIn: true, // Assume logged in to reach this page
  role: 'tutor' as 'tutor' | 'admin', // Role must be tutor or admin
  status: 'actief' as 'pending_onboarding' | 'pending_approval' | 'actief' | 'rejected', // Current status of the tutor
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

const dashboardItems: DashboardItem[] = [
  {
    id: 'availability',
    title: 'Mijn Beschikbaarheid',
    description: 'Stel je werkuren, afwijkende dagen en uurtarief in.',
    icon: Clock,
    link: '/dashboard/tutor/availability',
    buttonText: 'Beheer Beschikbaarheid',
    buttonVariant: 'outline',
    isLink: true,
    colorClass: 'bg-blue-50 border-blue-200 hover:shadow-blue-100',
  },
  {
    id: 'lessons',
    title: 'Mijn Lessen',
    description: 'Bekijk je geplande en afgelopen online bijlessen.',
    icon: BookOpen,
    link: '/dashboard/tutor/lessons',
    buttonText: 'Bekijk Lessen',
    buttonVariant: 'outline',
    isLink: true,
    colorClass: 'bg-green-50 border-green-200 hover:shadow-green-100',
  },
  {
    id: 'students',
    title: 'Mijn Leerlingen',
    description: 'Bekijk het overzicht van je leerlingen en hun voortgang.',
    icon: Users,
    link: '/dashboard/tutor/students',
    buttonText: 'Bekijk Mijn Leerlingen',
    buttonVariant: 'outline',
    isLink: true,
    colorClass: 'bg-purple-50 border-purple-200 hover:shadow-purple-100',
  },
  {
    id: 'earnings',
    title: 'Verdiensten & Uitbetalingen',
    description: 'Bekijk je factuurhistorie en verdiende bedragen.',
    icon: Euro, // Changed DollarSign to Euro
    link: '#', // Placeholder
    buttonText: 'Bekijk Verdiensten',
    buttonVariant: 'outline',
    disabled: true,
    isLink: false,
    colorClass: 'bg-yellow-50 border-yellow-200 hover:shadow-yellow-100',
  },
  {
    id: 'reviews',
    title: 'Mijn Beoordelingen',
    description: 'Lees feedback van leerlingen die je hebt geholpen.',
    icon: FileText,
    link: '#', // Placeholder
    buttonText: 'Bekijk Beoordelingen',
    buttonVariant: 'outline',
    disabled: true,
    isLink: false,
    colorClass: 'bg-pink-50 border-pink-200 hover:shadow-pink-100',
  },
  {
    id: 'profileSettings',
    title: 'Profiel Instellingen',
    description: 'Werk je persoonlijke gegevens en documenten bij.',
    icon: Settings,
    link: '/dashboard/profile',
    buttonText: 'Ga naar Profiel',
    buttonVariant: 'default',
    isLink: true,
    colorClass: 'bg-gray-50 border-gray-200 hover:shadow-gray-100',
  },
];


export default function TutorDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!MOCKED_CURRENT_TUTOR.isLoggedIn || MOCKED_CURRENT_TUTOR.role !== 'tutor') {
      // router.push('/login'); // Or appropriate access denied page
      return;
    }

    if (MOCKED_CURRENT_TUTOR.status === 'pending_onboarding' || MOCKED_CURRENT_TUTOR.status === 'pending_approval') {
      router.replace('/dashboard/tutor/onboarding');
    }
  }, [router]);

  if (MOCKED_CURRENT_TUTOR.status === 'pending_onboarding' || MOCKED_CURRENT_TUTOR.status === 'pending_approval') {
    return (
        <div className="flex min-h-[calc(100vh-theme(space.16))] flex-col items-center justify-center p-8">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Profiel Laden...</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Een ogenblik geduld, we controleren je profielstatus.</p>
                </CardContent>
            </Card>
        </div>
    );
  }
  
  if (MOCKED_CURRENT_TUTOR.status === 'rejected') {
     return (
        <div className="flex min-h-[calc(100vh-theme(space.16))] flex-col items-center justify-center p-8 text-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                    <CardTitle className="text-2xl text-destructive">Aanmelding Afgewezen</CardTitle>
                    <CardDescription>
                        Bedankt voor je interesse om tutor te worden. Helaas kunnen we je aanmelding op dit moment niet goedkeuren.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Neem contact op met <a href="mailto:support@mindnavigator.nl" className="text-primary hover:underline">support@mindnavigator.nl</a> voor meer informatie.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => router.push('/')} className="w-full">Terug naar home</Button>
                </CardFooter>
            </Card>
        </div>
    );
  }


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Tutor Dashboard</h1>
        <p className="text-muted-foreground">
          Beheer hier je beschikbaarheid, geplande lessen, leerlingen en profiel.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item) => (
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
