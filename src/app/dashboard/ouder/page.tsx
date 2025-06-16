// src/app/dashboard/ouder/page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Users, Settings, BookOpenCheck, Euro, Contact } from 'lucide-react'; // Changed DollarSign to Euro
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Import cn utility

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

const ouderDashboardItems: DashboardItem[] = [
  {
    id: 'kinderen',
    title: 'Mijn Kinderen',
    description: 'Voeg uw kinderen toe en beheer hun profielen en voortgang.',
    icon: Contact,
    link: '/dashboard/ouder/kinderen', 
    buttonText: 'Kinderen Toevoegen & Beheren',
    buttonVariant: 'default', 
    disabled: false,
    isLink: true, 
    colorClass: 'bg-primary/10 border-primary/30 hover:shadow-primary/20', 
  },
  {
    id: 'lessen',
    title: 'Lessen Kinderen',
    description: 'Plan en beheer de bijlessen voor uw kinderen.',
    icon: BookOpenCheck,
    link: '/dashboard/ouder/lessen/overzicht', // Updated link
    buttonText: 'Plan & Bekijk Lessen',
    buttonVariant: 'outline',
    disabled: false,
    isLink: true,
    colorClass: 'bg-green-50 border-green-200 hover:shadow-green-100',
  },
  {
    id: 'abonnementen',
    title: 'Abonnementen & Betaling',
    description: 'Beheer de abonnementen voor de coaching-hub en bijlessen.',
    icon: Euro, // Changed DollarSign to Euro
    link: '/dashboard/ouder/abonnementen', 
    buttonText: 'Beheer Abonnementen', 
    buttonVariant: 'outline',
    disabled: false, 
    isLink: true,
    colorClass: 'bg-yellow-50 border-yellow-200 hover:shadow-yellow-100',
  },
  {
    id: 'accountinstellingen',
    title: 'Mijn Accountinstellingen',
    description: 'Beheer uw eigen accountgegevens en voorkeuren.',
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
          Welkom! Start hier met het toevoegen van uw kinderen. Beheer vervolgens hun profielen, lessen en abonnementen.
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
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-semibold">{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant={item.buttonVariant || 'outline'}
                className="w-full"
                asChild={item.isLink && !item.disabled}
                disabled={item.disabled}
              >
                {item.isLink && !item.disabled ? <Link href={item.link}>{item.buttonText}</Link> : item.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
