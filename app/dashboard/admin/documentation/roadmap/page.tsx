// src/app/dashboard/admin/documentation/roadmap/page.tsx
"use client";

import { useState, useEffect, useMemo, Fragment } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Rocket, ArrowLeft, RotateCcw, CheckCircle2, Package, GitBranch, Cpu, AlertTriangle, Users, Mail } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/common/CodeBlock';

interface Task {
  id: string;
  label: string;
}

interface Section {
  title: string;
  tasks: Task[];
}

interface Phase {
  title: string;
  weeks: string;
  sections: Section[];
}

const roadmapData: Phase[] = [
  {
    title: "FASE 1: MVP Foundation",
    weeks: "4 weken",
    sections: [
      {
        title: "Week 1: Firebase Backend & Authentication",
        tasks: [
          { id: 'fb-auth-setup', label: "Firebase Authentication setup (email/Google/Apple)" },
          { id: 'firestore-structure', label: "Cloud Firestore database structure" },
          { id: 'security-rules', label: "Firebase Security Rules voor data protection" },
          { id: 'user-registration', label: "User registration met Firebase Auth" },
          { id: 'postgresql-hybrid', label: "PostgreSQL hybrid (alleen complexe relaties)" },
          { id: 'admin-sdk', label: "Firebase Admin SDK setup" },
        ]
      },
      {
        title: "Week 2: Storage, Charts & Domain",
        tasks: [
          { id: 'storage-setup', label: "Firebase Storage voor file uploads" },
          { id: 'analytics-setup', label: "Firebase Analytics tracking setup" },
          { id: 'hubspot-integration', label: "HubSpot API integration" },
          { id: 'recharts-install', label: "Recharts component library" },
          { id: 'basic-charts', label: "Basic chart componenten (Line, Bar, Pie)" },
          { id: 'custom-domain', label: "Custom domein via Firebase Hosting" },
          { id: 'app-check', label: "Firebase App Check voor API security" },
        ]
      },
      {
        title: "Week 3: Payments & Functions",
        tasks: [
          { id: 'functions-webhooks', label: "Firebase Functions voor Mollie webhooks" },
          { id: 'firestore-payments', label: "Cloud Firestore payment tracking" },
          { id: 'invoice-generation', label: "Nederlandse factuur generatie via Functions" },
          { id: 'storage-invoices', label: "Firebase Storage voor PDF invoices" },
          { id: 'cloud-messaging', label: "Firebase Cloud Messaging voor notifications" },
          { id: 'email-delivery', label: "Email delivery via Firebase Functions" },
        ]
      },
      {
        title: "Week 4: Sessions & Real-time",
        tasks: [
          { id: 'realtime-availability', label: "Firestore real-time coach availability" },
          { id: 'session-booking', label: "Session booking via Cloud Functions" },
          { id: 'realtime-db-sessions', label: "Firebase Realtime Database voor live sessions" },
          { id: 'storage-assessments', label: "Assessment document storage" },
          { id: 'analytics-events', label: "Firebase Analytics event tracking" },
        ]
      }
    ]
  },
  {
    title: "FASE 2: Business Features",
    weeks: "4 weken",
    sections: [
      {
        title: "Week 5: HubSpot & Analytics",
        tasks: [
          { id: 'hubspot-pro', label: "HubSpot Professional upgrade" },
          { id: 'analytics-custom-events', label: "Firebase Analytics custom events" },
          { id: 'performance-monitoring', label: "Firebase Performance Monitoring" },
          { id: 'parent-reports', label: "Parent progress reports via Functions" },
          { id: 'remote-config', label: "Firebase Remote Config voor feature flags" },
        ]
      },
      {
        title: "Week 6: Video & Real-time",
        tasks: [
          { id: 'webrtc-video', label: "Firebase Realtime Database voor video sessions" },
          { id: 'twilio-integration', label: "Twilio Video + Firebase integration" },
          { id: 'coach-performance', label: "Coach performance tracking (Firestore)" },
          { id: 'session-notifications', label: "Firebase Cloud Messaging voor session notifications" },
          { id: 'dynamic-links', label: "Firebase Dynamic Links voor session sharing" },
        ]
      },
      {
        title: "Week 7: Advanced Features",
        tasks: [
          { id: 'email-extensions', label: "Firebase Extensions voor email/SMS" },
          { id: 'realtime-dashboard', label: "Firestore real-time dashboard updates" },
          { id: 'automated-reports', label: "Firebase Functions voor automated reports" },
          { id: 'moneybird-integration', label: "Moneybird accounting integration" },
          { id: 'crashlytics', label: "Firebase Crashlytics voor error tracking" },
        ]
      },
      {
        title: "Week 8: Marketplace & Deploy",
        tasks: [
          { id: 'marketplace-payments', label: "Cloud Functions voor marketplace payments" },
          { id: 'coach-booking', label: "Firestore coach booking system" },
          { id: 'production-deploy', label: "Firebase Hosting production deployment" },
          { id: 'performance-optimization', label: "Firebase Performance optimization" },
          { id: 'marketplace-security', label: "Firebase Security Rules voor marketplace" },
        ]
      }
    ]
  },
  {
    title: "FASE 3: Advanced & Launch",
    weeks: "8 weken",
    sections: [
      {
        title: "Week 9-10: AI & Personalization",
        tasks: [
          { id: 'genkit-optimization', label: "Genkit AI coaching optimization" },
          { id: 'ml-analytics', label: "Firebase ML predictive analytics" },
          { id: 'advanced-pdf-reports', label: "Advanced PDF rapporten" },
          { id: 'custom-visualizations', label: "Custom visualization componenten" },
          { id: 'ab-testing-setup', label: "Firebase A/B Testing setup" },
        ]
      },
      {
        title: "Week 11-12: Security & Compliance",
        tasks: [
          { id: 'app-check-implementation', label: "App Check security implementation" },
          { id: 'avg-compliance', label: "AVG compliance via Firebase Security Rules" },
          { id: 'data-encryption', label: "Data encryption end-to-end" },
          { id: 'audit-logging', label: "Firebase Audit logging" },
          { id: 'privacy-controls', label: "Privacy controls voor minderjarigen" },
        ]
      },
      {
        title: "Week 13-14: Performance & Scale",
        tasks: [
          { id: 'performance-final', label: "Firebase Performance optimization" },
          { id: 'load-testing', label: "Load testing via Firebase Test Lab" },
          { id: 'multi-language', label: "Multi-language support setup" },
          { id: 'i18n-remote-config', label: "Firebase Remote Config internationalization" },
          { id: 'cdn-optimization', label: "CDN optimization via Firebase Hosting" },
        ]
      },
      {
        title: "Week 15-16: Launch Preparation",
        tasks: [
          { id: 'app-distribution', label: "Firebase App Distribution voor beta" },
          { id: 'marketing-pixels', label: "Marketing pixel integrations" },
          { id: 'analytics-conversions', label: "Firebase Analytics conversion tracking" },
          { id: 'production-monitoring', label: "Production monitoring setup" },
          { id: 'launch-checklist', label: "Launch checklist completion" },
        ]
      }
    ]
  },
];

const LOCAL_STORAGE_KEY = 'mindnavigator_roadmap_progress_v2';
const defaultCompletedTasks = {
  'fb-auth-setup': true,
  'firestore-structure': true,
  'storage-setup': true,
};

export default function RoadmapPage() {
  const { toast } = useToast();
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedProgress) {
        setCompletedTasks(JSON.parse(savedProgress));
      } else {
        setCompletedTasks(defaultCompletedTasks);
      }
    } catch (error) {
      console.error("Error loading roadmap progress from localStorage", error);
      setCompletedTasks(defaultCompletedTasks);
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
          Development Roadmap (Firebase-First)
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Totale Voortgang</CardTitle>
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
      
      <h2 className="text-2xl font-bold text-foreground pt-4">Roadmap Fases</h2>
      <Accordion type="multiple" defaultValue={['FASE 1: MVP Foundation']} className="w-full space-y-4">
        {roadmapData.map(phase => (
            <AccordionItem key={phase.title} value={phase.title} className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="p-4 font-semibold text-xl hover:no-underline flex justify-between items-center w-full">
                    <span>{phase.title}</span>
                    <Badge variant="outline">{phase.weeks}</Badge>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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

      <h2 className="text-2xl font-bold text-foreground pt-4">Technische Details & Vereisten</h2>
      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="tech-stack" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline"><Cpu className="mr-2 h-5 w-5 text-primary"/>Tech Stack</AccordionTrigger>
            <AccordionContent className="p-4 border-t">
                <h3 className="font-semibold mb-2">Firebase Services</h3>
                <p className="text-sm text-muted-foreground">Authentication, Cloud Firestore, PostgreSQL (Hybrid), Storage, Functions, Hosting, Analytics, Crashlytics, Performance, Cloud Messaging, Genkit AI, App Check, Security Rules.</p>
                <h3 className="font-semibold mt-4 mb-2">Externe Integraties</h3>
                <p className="text-sm text-muted-foreground">Recharts, D3.js, Mollie API, HubSpot API, Twilio Video, Moneybird API, Firebase Extensions.</p>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="dependencies" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline"><GitBranch className="mr-2 h-5 w-5 text-primary"/>Dependencies & Critical Path</AccordionTrigger>
            <AccordionContent className="p-4 border-t grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2">Vereisten per Week</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li><strong>Week 1:</strong> Firebase project (✅), Google Cloud billing, Custom domain.</li>
                    <li><strong>Week 3:</strong> Mollie merchant account, SSL (Firebase managed), Email delivery setup.</li>
                    <li><strong>Week 6:</strong> Twilio Video account, HubSpot Pro, Performance baseline.</li>
                  </ul>
                </div>
                 <div>
                  <h3 className="font-semibold mb-2">Success Metrics</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li><strong>Technisch:</strong> Page load &lt; 2s, 99.9% uptime.</li>
                    <li><strong>Business:</strong> User registration &gt; 15%, Payment success &gt; 98%, Retention &gt; 85%.</li>
                  </ul>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="deliverables" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline"><Package className="mr-2 h-5 w-5 text-primary"/>Deliverables per Fase</AccordionTrigger>
            <AccordionContent className="p-4 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Fase 1: MVP Foundation</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Firebase Auth & Firestore Dashboard</li>
                    <li>Payment processing & Facturatie</li>
                    <li>Hosting & Deployment</li>
                  </ul>
                </div>
                 <div>
                  <h3 className="font-semibold mb-2">Fase 2: Business Features</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Analytics & HubSpot integratie</li>
                    <li>Real-time Video Calling</li>
                    <li>Marketplace Systeem</li>
                  </ul>
                </div>
                 <div>
                  <h3 className="font-semibold mb-2">Fase 3: Launch Ready</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Genkit AI Coaching Features</li>
                    <li>App Check & AVG Compliance</li>
                    <li>Performance-geoptimaliseerd & Gelaunched</li>
                  </ul>
                </div>
            </AccordionContent>
        </AccordionItem>
         <AccordionItem value="workflow" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline"><Mail className="mr-2 h-5 w-5 text-primary"/>Development Workflow</AccordionTrigger>
            <AccordionContent className="p-4 border-t">
              <h3 className="font-semibold mb-2">Daily Development</h3>
              <CodeBlock language="bash" code={`# Start Firebase emulators
firebase emulators:start

# Development op localhost:9002
# Alle Firebase services lokaal`} />
              
              <h3 className="font-semibold mt-4 mb-2">Deployment</h3>
              <CodeBlock language="bash" code={`# Deploy to staging
firebase hosting:channel:deploy staging

# Deploy to production
firebase deploy --only hosting,functions`} />
            </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
