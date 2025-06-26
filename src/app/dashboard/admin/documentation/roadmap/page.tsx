// src/app/dashboard/admin/documentation/roadmap/page.tsx
"use client";

import { useState, useEffect, useMemo, Fragment } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Rocket, ArrowLeft, RotateCcw, Check, CheckCircle, Package, Brain, BarChart, Database, UserCheck as UserCheckIcon, ShieldCheck, Cpu, GitBranch, MessageCircle, FileText, Briefcase, Phone, Mail, Handshake, Globe, Activity, Clock, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  label: string;
  isBold?: boolean;
}

interface Section {
  title: string;
  icon?: React.ElementType;
  tasks?: Task[];
  content?: React.ReactNode;
}

interface Phase {
  title: string;
  weeks: string;
  sections: Section[];
}

const roadmapData: Phase[] = [
  {
    title: "FASE 1: MVP Foundation",
    weeks: "Weken 1-4",
    sections: [
      {
        title: "Week 1: Database & Authentication",
        tasks: [
          { id: 'db-schema', label: "Database schema (PostgreSQL + Prisma)" },
          { id: 'db-migration', label: "Database schema migratie" },
          { id: 'auth-routes', label: "User registration API routes" },
          { id: 'auth-jwt', label: "Password hashing & JWT tokens" },
          { id: 'auth-profile', label: "User profile management" },
        ]
      },
      {
        title: "Week 2: CRM, Charts & Domein Setup",
        tasks: [
          { id: 'crm-setup', label: "HubSpot API setup (Starter tier)" },
          { id: 'crm-sync', label: "Contact sync functionaliteit" },
          { id: 'charts-lib', label: "Recharts component library installatie" },
          { id: 'charts-basic', label: "Basic chart componenten (Line, Bar, Pie)" },
          { id: 'domain-config', label: "Custom domein configuratie (mindnavigator.nl)", isBold: true },
          { id: 'domain-ssl', label: "SSL certificaat setup", isBold: true },
          { id: 'domain-dns', label: "DNS records configuratie (A, CNAME, MX, SPF, DKIM)", isBold: true },
          { id: 'domain-sub', label: "Subdomeins setup (app, api)", isBold: true },
          { id: 'domain-email', label: "Email delivery configuratie", isBold: true },
          { id: 'charts-responsive', label: "Responsive chart containers" },
        ]
      },
      {
        title: "Week 3: Payments & Factuur Systeem",
        tasks: [
          { id: 'payments-mollie', label: "Mollie payment integration" },
          { id: 'payments-webhook', label: "Mollie webhook configuratie", isBold: true },
          { id: 'payments-sub-tracking', label: "Subscription status tracking" },
          { id: 'invoice-system', label: "Nederlandse factuur systeem (EIGEN, niet HubSpot)", isBold: true },
          { id: 'invoice-btw', label: "BTW berekeningen (21%)" },
          { id: 'invoice-automation', label: "Mollie → Factuur automation" },
          { id: 'invoice-pdf', label: "Professional factuur PDF templates" },
          { id: 'invoice-email', label: "Email delivery via custom domein (SPF/DKIM)", isBold: true },
          { id: 'invoice-storage', label: "File storage (Firebase Storage)" },
        ]
      },
      {
        title: "Week 4: Session Booking & Factuur Delivery",
        tasks: [
          { id: 'booking-availability', label: "Coach availability systeem" },
          { id: 'booking-api', label: "Session booking API" },
          { id: 'invoice-delivery', label: "Automatische factuur verzending (Email)", isBold: true },
          { id: 'invoice-status', label: "Factuur status tracking (paid/pending/overdue)" },
          { id: 'storage-assessments', label: "Assessment document storage" },
          { id: 'invoice-reminders', label: "Failed payment → Herinnering facturen" },
        ]
      }
    ]
  },
  // Add other phases similarly...
];

const LOCAL_STORAGE_KEY = 'mindnavigator_roadmap_progress';

export default function RoadmapPage() {
  const { toast } = useToast();
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedProgress) {
        setCompletedTasks(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error("Error loading roadmap progress from localStorage", error);
    }
  }, []);

  const handleToggleTask = (taskId: string) => {
    const newCompletedTasks = { ...completedTasks, [taskId]: !completedTasks[taskId] };
    setCompletedTasks(newCompletedTasks);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCompletedTasks));
    } catch (error) {
      console.error("Error saving roadmap progress to localStorage", error);
      toast({ title: "Fout", description: "Kon voortgang niet opslaan.", variant: "destructive" });
    }
  };

  const resetProgress = () => {
    setCompletedTasks({});
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        toast({ title: "Voortgang Gereset", description: "Alle vinkjes zijn verwijderd."});
    } catch (error) {
        console.error("Error resetting progress in localStorage", error);
    }
  };

  const totalTasks = useMemo(() => roadmapData.flatMap(phase => phase.sections.flatMap(sec => sec.tasks || [])).length, []);
  const completedCount = useMemo(() => Object.values(completedTasks).filter(Boolean).length, [completedTasks]);
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Rocket className="h-8 w-8 text-primary" />
          Development Roadmap
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Voortgang</CardTitle>
          <CardDescription>
            {completedCount} van de {totalTasks} taken voltooid ({Math.round(progressPercentage)}%).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} />
          <Button variant="ghost" size="sm" onClick={resetProgress} className="mt-4">
              <RotateCcw className="mr-2 h-4 w-4" /> Voortgang Resetten
          </Button>
        </CardContent>
      </Card>
      
      <Accordion type="multiple" defaultValue={['FASE 1: MVP Foundation']} className="w-full space-y-4">
        {roadmapData.map(phase => (
            <AccordionItem key={phase.title} value={phase.title} className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="p-4 font-semibold text-xl hover:no-underline flex justify-between items-center w-full">
                    <span>{phase.title}</span>
                    <Badge variant="outline">{phase.weeks}</Badge>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t space-y-6">
                    {phase.sections.map(section => (
                       <div key={section.title} className="space-y-3">
                        <h3 className="font-semibold text-primary">{section.title}</h3>
                        {section.tasks && section.tasks.map(task => (
                            <div key={task.id} className="flex items-center space-x-3 pl-2">
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
                                        task.isBold && "font-bold"
                                    )}
                                >
                                    {task.label}
                                </label>
                            </div>
                        ))}
                       </div>
                    ))}
                </AccordionContent>
            </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
