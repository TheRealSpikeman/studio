// src/app/dashboard/admin/testing/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ClipboardCheck, RotateCcw, ShieldCheck, Users, GraduationCap, Briefcase, HeartHandshake, CheckCircle2, AlertTriangle, CreditCard, Mail } from '@/lib/icons';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

// Data for the checklist
const checklistSections = [
  {
    title: "Basisfunctionaliteit & Authenticatie",
    tasks: [
      { id: 'auth-login-admin', label: "Inloggen als Admin" },
      { id: 'auth-login-ouder', label: "Inloggen als Ouder" },
      { id: 'auth-login-leerling1', label: "Inloggen als Leerling (12-15 jr)" },
      { id: 'auth-login-leerling2', label: "Inloggen als Leerling (16-18 jr)" },
      { id: 'auth-login-tutor', label: "Inloggen als Tutor" },
      { id: 'auth-login-coach', label: "Inloggen als Coach" },
      { id: 'auth-signup-flow', label: "Nieuwe gebruiker aanmelden" },
      { id: 'auth-logout', label: "Uitloggen werkt correct" },
    ]
  },
  {
    title: "Ouder Dashboard & Flow",
    tasks: [
      { id: 'ouder-onboarding', label: "Welkomstpagina/onboarding doorlopen" },
      { id: 'ouder-add-child', label: "Kind toevoegen" },
      { id: 'ouder-view-child-progress', label: "Voortgang van kind bekijken" },
      { id: 'ouder-plan-lesson', label: "Les plannen voor kind" },
      { id: 'ouder-find-professional', label: "Tutor/Coach zoeken en koppelen" },
    ]
  },
  {
    title: "Leerling Flow",
    tasks: [
      { id: 'leerling-onboarding', label: "Welkomstpagina doorlopen" },
      { id: 'leerling-take-quiz', label: "Zelfreflectie quiz starten en voltooien" },
      { id: 'leerling-view-results', label: "Resultatenpagina bekijken" },
      { id: 'leerling-view-coaching', label: "Dagelijkse coaching hub bekijken" },
    ]
  },
  {
    title: "Tutor Dashboard & Flow",
    tasks: [
      { id: 'tutor-onboarding-flow', label: "Onboarding doorlopen als nieuwe tutor" },
      { id: 'tutor-dashboard-view', label: "Dashboard correct weergegeven na goedkeuring" },
      { id: 'tutor-manage-availability', label: "Beschikbaarheid en uurtarief instellen" },
      { id: 'tutor-view-lessons', label: "Lessenoverzicht bekijken (aankomend/afgelopen)" },
      { id: 'tutor-create-lesson-report', label: "Lesverslag schrijven en versturen" },
      { id: 'tutor-view-students-list', label: "Lijst met eigen leerlingen bekijken" },
    ]
  },
  {
    title: "Coach Dashboard & Flow",
    tasks: [
      { id: 'coach-application', label: "Aanmelden als nieuwe coach" },
      { id: 'coach-dashboard-view', label: "Dashboard correct weergegeven na goedkeuring" },
      { id: 'coach-manage-availability', label: "Beschikbaarheid en sessietarief instellen" },
      { id: 'coach-view-sessions', label: "Sessieoverzicht bekijken" },
      { id: 'coach-create-session-report', label: "Sessieverslag schrijven en versturen" },
      { id: 'coach-view-clients-list', label: "Lijst met eigen cliënten bekijken" },
    ]
  },
  {
    title: "Facturatie & Abonnementen (Ouder)",
    tasks: [
      { id: 'ouder-view-subscriptions', label: "Lopende abonnementen bekijken" },
      { id: 'ouder-view-invoices', label: "Factuurhistorie inzien en PDF downloaden" },
      { id: 'ouder-view-payable-lessons', label: "Openstaande betalingen voor lessen zien" },
      { id: 'ouder-change-payment-method', label: "Betaalmethode aanpassen (gesimuleerd)" },
    ]
  },
  {
    title: "Admin Functionaliteit",
    tasks: [
      { id: 'admin-view-users', label: "Gebruikersbeheer bekijken en filteren" },
      { id: 'admin-edit-user', label: "Gebruiker bewerken" },
      { id: 'admin-create-quiz', label: "Nieuwe quiz aanmaken (AI & handmatig)" },
      { id: 'admin-edit-quiz', label: "Bestaande quiz bewerken" },
      { id: 'admin-manage-features', label: "Features beheren" },
      { id: 'admin-manage-subscriptions', label: "Abonnementen beheren" },
      { id: 'admin-manage-blog', label: "Blog beheren (Nieuw & Bewerken)" },
    ]
  },
  {
    title: "Externe Integraties (Gesimuleerd)",
    tasks: [
      { id: 'hubspot-new-user', label: "HubSpot: Nieuwe gebruiker wordt gesynchroniseerd" },
      { id: 'hubspot-plan-change', label: "HubSpot: Abonnementswijziging wordt doorgegeven" },
      { id: 'resend-email-verification', label: "Resend: Verificatie e-mail wordt verstuurd bij signup" },
    ]
  }
];

const LOCAL_STORAGE_KEY_TESTING = 'mindnavigator_testing_progress_v1';

// Reusing the same demo users for consistency
const demoUsers = [
  { role: 'Admin', icon: ShieldCheck, email: 'bosch.rgm@gmail.com', password: 'password' },
  { role: 'Ouder', icon: Users, email: 'ouder@mindnavigator.io', password: 'password' },
  { role: 'Leerling (12-15 jr)', icon: GraduationCap, email: 'leerling-1@mindnavigator.io', password: 'password' },
  { role: 'Leerling (16-18 jr)', icon: GraduationCap, email: 'leerling-2@mindnavigator.io', password: 'password' },
  { role: 'Tutor', icon: Briefcase, email: 'tutor@mindnavigator.io', password: 'password' },
  { role: 'Coach', icon: HeartHandshake, email: 'coach@mindnavigator.io', password: 'password' },
];


export default function TestingChecklistPage() {
  const { toast } = useToast();
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY_TESTING);
      if (savedProgress) {
        setCompletedTasks(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error("Error loading testing progress from localStorage", error);
    }
  }, []);

  const handleToggleTask = (taskId: string) => {
    const newCompletedTasks = { ...completedTasks, [taskId]: !completedTasks[taskId] };
    setCompletedTasks(newCompletedTasks);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TESTING, JSON.stringify(newCompletedTasks));
    } catch (error) {
      console.error("Error saving testing progress to localStorage", error);
      toast({ title: "Fout", description: "Kon testvoortgang niet opslaan.", variant: "destructive" });
    }
  };

  const resetProgress = () => {
    setCompletedTasks({});
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY_TESTING);
        toast({ title: "Voortgang Gereset", description: "Alle vinkjes zijn verwijderd."});
    } catch (error) {
        console.error("Error resetting progress in localStorage", error);
    }
  };

  const totalTasks = checklistSections.reduce((acc, section) => acc + section.tasks.length, 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  
  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            Applicatie Test Checklist
            </h1>
            <Button variant="outline" asChild>
            <Link href="/dashboard/admin/documentation">
                <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
            </Link>
            </Button>
        </div>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Totale Voortgang</CardTitle>
                <CardDescription>
                    {completedCount} van de {totalTasks} taken voltooid ({Math.round(progressPercentage)}%).
                </CardDescription>
            </CardHeader>
            <CardContent>
            <Progress value={progressPercentage} />
            <Button variant="ghost" size="sm" onClick={resetProgress} className="mt-4 text-muted-foreground hover:text-destructive">
                <RotateCcw className="mr-2 h-4 w-4" /> Voortgang Resetten
            </Button>
            </CardContent>
        </Card>
      
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
                <Card className="shadow-lg">
                    <AccordionTrigger className="p-6 text-left hover:no-underline w-full">
                         <div className="flex-1">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary"/>
                                Demo Login Informatie
                            </CardTitle>
                            <CardDescription className="pt-1 text-left">
                                Klik hier om de demo login-gegevens uit te klappen.
                            </CardDescription>
                         </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <p className="text-sm text-muted-foreground mb-4">Gebruik de volgende gegevens om in te loggen als verschillende rollen en de features te testen.</p>
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Rol</TableHead>
                                <TableHead>E-mailadres</TableHead>
                                <TableHead>Wachtwoord</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {demoUsers.map(({ role, icon: Icon, email, password }) => (
                                <TableRow key={role}>
                                    <TableCell className="font-semibold flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground"/>{role}</TableCell>
                                    <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">{email}</code></TableCell>
                                    <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">{password}</code></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </Card>
            </AccordionItem>
        </Accordion>

        <Accordion type="multiple" defaultValue={checklistSections.map(s => s.title)} className="w-full space-y-4">
            {checklistSections.map((section, sectionIndex) => (
                <AccordionItem key={sectionIndex} value={section.title} className="border rounded-lg bg-card shadow-sm">
                    <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">
                        {section.title}
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {section.tasks.map((task) => (
                                <div key={task.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50">
                                    <Checkbox
                                        id={task.id}
                                        checked={!!completedTasks[task.id]}
                                        onCheckedChange={() => handleToggleTask(task.id)}
                                    />
                                    <label
                                        htmlFor={task.id}
                                        className={cn(
                                            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                                            completedTasks[task.id] && "text-muted-foreground line-through",
                                        )}
                                    >
                                        {task.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
      </Accordion>
    </div>
  );
}
