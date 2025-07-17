// src/app/invest/InvestmentProposal.tsx
"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { StatCard } from '@/components/invest/StatCard';
import { CustomBarChart, type BarChartData } from '@/components/invest/BarChart';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import {
  Brain, Users, ShieldCheck, CreditCard, ExternalLink, Search, CheckCircle2, ArrowRight,
  TrendingUp, BarChart, Target, AlertTriangle, Package, Check, Lightbulb, UserCheck, MessageCircle, FileText, Briefcase, Phone, Mail, Handshake, Globe, Activity, Clock, Bot, Cpu, GitBranch, Euro, Send, Loader2
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


const marketData: BarChartData[] = [
    { label: 'Jongeren (12-18)', value: 100, displayValue: '1.2M', badgeClass: 'bg-muted text-muted-foreground', barClass: 'bg-gray-200' },
    { label: 'Neurodivergent', value: 16.6, displayValue: '200K', badgeClass: 'bg-teal-500 text-white', barClass: 'bg-teal-400' },
    { label: 'Target Markt', value: 8.3, displayValue: '100K', badgeClass: 'bg-primary/80 text-white', barClass: 'bg-primary/70' },
    { label: 'Jaar 3 Target', value: 0.375, displayValue: '4.5K', badgeClass: 'bg-primary text-white', barClass: 'bg-primary' },
];

const revenueData: BarChartData[] = [
  { label: '2026 (Jaar 1)', value: (750 / 7800) * 100, displayValue: '€750K', badgeClass: 'bg-teal-500 text-white', barClass: 'bg-teal-400' },
  { label: '2027 (Jaar 2)', value: (3200 / 7800) * 100, displayValue: '€3.2M', badgeClass: 'bg-primary/80 text-white', barClass: 'bg-primary/70' },
  { label: '2028 (Jaar 3)', value: 100, displayValue: '€7.8M', badgeClass: 'bg-primary text-white', barClass: 'bg-primary' },
];

const riskData: BarChartData[] = [
    { label: 'Technologie', value: 10, displayValue: '1/10', colorClass: 'bg-green-500' },
    { label: 'Uitvoering', value: 20, displayValue: '2/10', colorClass: 'bg-green-500' },
    { label: 'Markt', value: 30, displayValue: '3/10', colorClass: 'bg-yellow-500' },
    { label: 'Concurrentie', value: 40, displayValue: '4/10', colorClass: 'bg-orange-500' },
];

const investmentAllocationData: BarChartData[] = [
    { label: 'Marketing & PR', value: 45, displayValue: '€180K (45%)', colorClass: 'bg-blue-500' },
    { label: 'Platform & AI', value: 20, displayValue: '€80K (20%)', colorClass: 'bg-teal-500' },
    { label: 'Team Uitbreiding', value: 20, displayValue: '€80K (20%)', colorClass: 'bg-purple-500' },
    { label: 'Internationale Expansie', value: 15, displayValue: '€60K (15%)', colorClass: 'bg-pink-500' },
];

const interestFormSchema = z.object({
  name: z.string().min(2, "Naam is vereist."),
  email: z.string().email("Voer een geldig e-mailadres in."),
  amount: z.coerce.number().positive("Voer een geldig bedrag in.").min(10000, "Minimum investering is €10.000."),
  message: z.string().optional(),
});

type InterestFormData = z.infer<typeof interestFormSchema>;

function InvestmentForm() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<InterestFormData>({
      resolver: zodResolver(interestFormSchema),
      defaultValues: { name: "", email: "", amount: 10000, message: "" }
    });
  
    function onSubmit(data: InterestFormData) {
        setIsSubmitting(true);
        console.log("Simulating submission of investment interest:", data);
        
        // Simulate an API call
        setTimeout(() => {
          toast({
            title: "Interesse Ontvangen!",
            description: `Bedankt, ${data.name}. We hebben uw interesse genoteerd en nemen spoedig contact op. (Dit is een simulatie)`,
          });
          form.reset();
          setIsSubmitting(false);
        }, 1500);
    }

    return (
      <Card className="shadow-xl bg-primary/10 border-primary/30">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2"><Handshake className="h-7 w-7"/>Toon Uw Interesse</CardTitle>
                    <CardDescription>Laat hier vrijblijvend uw interesse blijken. Wij nemen contact met u op voor een persoonlijk gesprek en het volledige businessplan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Volledige Naam</FormLabel><FormControl><Input placeholder="Uw naam" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>E-mailadres</FormLabel><FormControl><Input type="email" placeholder="uw@emailadres.nl" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="amount" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indicatief Bedrag</FormLabel>
                        <div className="relative"><Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><FormControl><Input type="number" placeholder="10000" {...field} className="pl-8"/></FormControl></div>
                        <FormMessage/>
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem><FormLabel>Vraag of opmerking (optioneel)</FormLabel><FormControl><Textarea placeholder="Eventuele vragen..." {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Verstuur Interesse
                    </Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
    );
}

export function InvestmentProposal() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background py-12 md:py-16">
        <div className="container mx-auto max-w-4xl space-y-16">
          
          <section className="text-center">
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">MindNavigator</h1>
            <p className="mt-3 text-xl text-primary font-semibold md:text-2xl">
              Een Unieke Investeringskans voor Friends & Family
            </p>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Welkom, en bedankt voor je interesse. Dit is een exclusieve kans om deel uit te maken van de groei van MindNavigator, een werkend platform dat klaar is voor de volgende fase. Ik wilde dit persoonlijk met jullie delen voordat we de deuren openen voor externe investeerders. Ik weet dat er niets vervelender is dan later te horen: "Waarom heb je ons niets verteld toen het nog kon?"
            </p>
          </section>

          <section>
            <Card className="shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2"><Brain className="h-7 w-7"/>Wat is MindNavigator?</CardTitle>
                <CardDescription>Een concreet antwoord op een groeiend probleem.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-base">
                <p><strong>Het Probleem:</strong> Ongeveer 200.000 Nederlandse tieners zijn neurodivergent (denk aan ADHD, autisme spectrum). Ouders betalen vaak €75-€125 per uur voor particuliere coaching omdat wachttijden in de reguliere zorg 6-12 maanden kunnen zijn. Dit is voor veel gezinnen financieel onbereikbaar.</p>
                <p><strong>Onze Oplossing:</strong> Een intelligent online platform waar neurodivergente jongeren (12-18 jaar) en hun ouders toegang krijgen tot betaalbare, op maat gemaakte ondersteuning. Van een persoonlijkheidstest die sterktes en uitdagingen blootlegt tot een gepersonaliseerd dashboard met tools en toegang tot gekwalificeerde coaches.</p>
                <p className="font-semibold text-primary">Het mooiste? Het platform draait al in een live beta-omgeving op <a href="https://mindnavigator.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary/80">mindnavigator.io</a>.</p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Waarom Dit Bijzonder Is</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard icon={<Activity />} value="500+" label="Uur geïnvesteerd in R&D" />
                <StatCard icon={<Clock />} value="6+" label="Maanden voorsprong op concurrentie" />
                <StatCard icon={<Globe />} value="Live Beta" label="Platform draait al online" />
                <StatCard icon={<TrendingUp />} value="Q4 2026" label="Geplande commerciële launch" />
            </div>
          </section>

           <section>
            <h2 className="text-3xl font-bold text-center mb-8">Onze Technologische Voorsprong</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><Bot className="h-6 w-6 text-primary"/>AI Maakt Het Slim</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/><span>Persoonlijkheidstests wijzen ouders naar de juiste coach.</span></p>
                        <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/><span>Dashboard past zich aan de unieke behoeften van elk kind aan.</span></p>
                        <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/><span>Ouders krijgen concrete, AI-gegenereerde tips over hoe ze hun kind kunnen helpen.</span></p>
                        <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/><span>Geen one-size-fits-all, maar maatwerk via technologie.</span></p>
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><Cpu className="h-6 w-6 text-primary"/>Bewezen & Schaalbare Technologie</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/><span>Live beta platform elimineert het technische ontwikkelrisico.</span></p>
                        <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/><span>Moderne tech stack (Next.js, Firebase) die meegroeit van 100 naar 100.000+ gebruikers.</span></p>
                        <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/><span>Vroege feedback van gebruikers valideert de product-market fit.</span></p>
                         <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/><span>Data-voordeel: onze AI wordt slimmer met elke gebruiker, een voordeel dat concurrenten moeilijk kunnen inhalen.</span></p>
                    </CardContent>
                </Card>
            </div>
          </section>

          <section>
             <h2 className="text-3xl font-bold text-center mb-8">Marktpotentieel & Financiële Kans</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><Target className="h-6 w-6 text-primary"/>De Nederlandse Markt (2026)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomBarChart data={marketData} layout="badge" />
                        <p className="text-sm text-center font-semibold mt-4">Totale Adresseerbare Markt: €264 miljoen/jaar</p>
                    </CardContent>
                 </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><BarChart className="h-6 w-6 text-primary"/>Omzetprognose</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomBarChart data={revenueData} layout="badge" />
                         <p className="text-sm text-center font-semibold mt-4">10x groei in 3 jaar | 71% winstmarge jaar 3</p>
                    </CardContent>
                </Card>
             </div>
          </section>
          
          <section>
            <h2 className="text-3xl font-bold text-center mb-8">De Investering</h2>
            <div className="text-center bg-primary/10 p-6 rounded-lg border border-primary/20">
                <p className="text-lg">We vragen een investering van:</p>
                <p className="text-4xl font-bold text-primary my-2">€400.000</p>
                <p className="text-lg">voor <strong>20%</strong> van het bedrijf</p>
                <p className="text-sm text-muted-foreground mt-2">(Bedrijfswaardering: €2 miljoen)</p>
                <p className="text-sm text-muted-foreground">Minimum investering: €10.000</p>
            </div>
             <Card className="shadow-lg mt-8">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><Package className="h-6 w-6 text-primary"/>Gebruik van het Geld</CardTitle>
                </CardHeader>
                <CardContent>
                    <CustomBarChart data={investmentAllocationData} layout="in-bar" />
                </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Risico's & Rendement</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><AlertTriangle className="h-6 w-6 text-primary"/>Risicoanalyse</CardTitle>
                        <CardDescription>Schaal 1-10 (1 = laag risico)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CustomBarChart data={riskData} layout="in-bar" />
                        <p className="text-sm text-muted-foreground mt-4">De grootste risico's zijn gemitigeerd doordat het platform al operationeel is en de marktvraag wordt gevalideerd in de beta-fase.</p>
                    </CardContent>
                 </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><TrendingUp className="h-6 w-6 text-primary"/>Rendementscenario's</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Conservatief Scenario (6x Exit)</h3>
                            <p className="text-sm text-muted-foreground">€10.000 investering → <span className="font-bold text-green-600">€60.000 return (500%)</span></p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Optimistisch Scenario (10x Exit)</h3>
                            <p className="text-sm text-muted-foreground">€10.000 investering → <span className="font-bold text-green-600">€100.000 return (900%)</span></p>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2">Exit strategie: Acquisitie door een grotere tech/educatie speler of beursgang binnen 3-5 jaar.</p>
                    </CardContent>
                </Card>
             </div>
          </section>

          <section>
            <InvestmentForm />
          </section>
          
          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Veelgestelde Vragen</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Waarom kom je bij ons en niet bij professionele investeerders?</AccordionTrigger>
                <AccordionContent>Ik heb al toezeggingen van andere investeerders tegen een hogere waardering, maar ik wil jullie graag de kans geven voordat we het formeel maken. Later wordt het veel duurder en ingewikkelder om in te stappen.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is dit niet riskant zoals crypto of andere tech hypes?</AccordionTrigger>
                <AccordionContent>Nee, dit is fundamenteel anders. Ik heb 500+ uur eigen tijd geïnvesteerd in onderzoek en ontwikkeling. Het platform draait al online op mindnavigator.io, je kunt het vandaag uitproberen. De markt (neurodiversiteit coaching) bestaat al - wij maken het alleen toegankelijker via technologie.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Wat als de grote techbedrijven dit gaan kopiëren?</AccordionTrigger>
                <AccordionContent>Dat kan, maar wij hebben 6+ maanden voorsprong en specialistische kennis. Bovendien kopen grote bedrijven vaak de innovators op (= exit opportunity).</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Hoe weet ik dat mijn geld goed gebruikt wordt?</AccordionTrigger>
                <AccordionContent>Jullie krijgen kwartaal updates met echte cijfers, en het platform is transparant - je kunt live zien op mindnavigator.io hoeveel gebruikers we hebben.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

           <section className="text-center p-6 border-t border-b">
             <h2 className="text-2xl font-bold text-foreground">Een Persoonlijke Boodschap</h2>
             <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                Beste vrienden en familie,
                Normaal gesproken zou ik jullie niet benaderen voor een investering. Maar dit voelt anders. Ik heb hier honderden uren van mijn eigen tijd en energie in gestoken en een werkende oplossing gebouwd voor een echt probleem dat mij persoonlijk raakt. Of je nu meedoet of meeleest vanaf de zijlijn, onze vriendschap verandert niet. Ik wilde jullie simpelweg de kans geven om erbij te zijn als je dat leuk vindt.
             </p>
             <p className="mt-4 font-semibold">- Glenn Bosch, Oprichter & CEO MindNavigator</p>
           </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
