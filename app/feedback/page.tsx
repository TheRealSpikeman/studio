// src/app/feedback/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from '@/hooks/use-toast';
import { MessageSquareText, User, Mail, ListFilter, AlertTriangle, FileText, Settings, Lightbulb, MessageCircle, Workflow, LayoutDashboard, Users2, BookOpenCheck, ClipboardList, Briefcase, HeartHandshake } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { feedbackService } from '@/services/feedbackService';
import type { FeedbackEntry } from '@/types/feedback';

const pageFeatureOptions = [
  { value: 'algemeen_platform', label: 'Algemeen / Niet Specifiek' },
  { value: 'landingspagina', label: 'Landingspagina & Info Pagina\'s' },
  { value: 'registratie_login', label: 'Registratie / Inloggen / Goedkeuring' },
  { value: 'dashboard_algemeen', label: 'Dashboard (Algemeen)' },
  { value: 'dashboard_leerling', label: 'Dashboard Leerling & Zelfreflectie', icon: ClipboardList },
  { value: 'dashboard_coaching', label: 'Coaching Hub (Leerling)', icon: MessageSquareText },
  { value: 'dashboard_huiswerk', label: 'Huiswerkbegeleiding Tools (Leerling)', icon: BookOpenCheck },
  { value: 'dashboard_ouder', label: 'Ouder Dashboard', icon: Users2 },
  { value: 'dashboard_tutor', label: 'Tutor Dashboard', icon: Briefcase },
  { value: 'dashboard_coach', label: 'Coach Dashboard', icon: HeartHandshake },
  { value: 'dashboard_admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  { value: 'profielpagina', label: 'Mijn Profiel Pagina' },
  { value: 'anders', label: 'Anders (specificeer hieronder)' },
];

const feedbackFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Voer een geldig e-mailadres in." }).optional().or(z.literal('')),
  feedbackType: z.enum(['bug', 'suggestie', 'algemeen', 'ui_ux'], { required_error: "Selecteer een type feedback."}),
  pageOrFeature: z.string({ required_error: "Selecteer de betreffende pagina/feature."}),
  otherPageOrFeature: z.string().optional(),
  description: z.string().min(10, { message: "Beschrijving moet minimaal 10 tekens bevatten."}),
  priority: z.enum(['laag', 'normaal', 'hoog'], { required_error: "Selecteer een prioriteit." }),
}).refine(data => {
    if (data.pageOrFeature === 'anders' && (!data.otherPageOrFeature || data.otherPageOrFeature.trim() === '')) {
        return false;
    }
    return true;
}, {
    message: "Specificatie voor 'Anders' is vereist.",
    path: ["otherPageOrFeature"],
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

function FeedbackForm() {
  const { toast } = useToast();
  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: "",
      email: "",
      feedbackType: undefined,
      pageOrFeature: undefined,
      otherPageOrFeature: "",
      description: "",
      priority: 'normaal',
    },
  });

  const watchedPageOrFeature = form.watch("pageOrFeature");

  async function onSubmit(values: FeedbackFormData) {
    const submissionData = { ...values };
    if (values.pageOrFeature !== 'anders') {
      delete (submissionData as any).otherPageOrFeature;
    }

    const dataToSave: Omit<FeedbackEntry, 'id'> = {
        ...submissionData,
        timestamp: new Date().toISOString(),
        status: 'nieuw'
    };
    
    try {
        await feedbackService.createFeedback(dataToSave);
        toast({
            title: "Feedback Ontvangen!",
            description: "Bedankt voor je feedback. We gaan ermee aan de slag.",
            variant: "default" 
        });
        form.reset(); 
    } catch(error) {
         toast({
            title: "Fout bij verzenden",
            description: "Kon je feedback niet versturen. Probeer het later opnieuw.",
            variant: "destructive" 
        });
        console.error(error);
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><User className="h-4 w-4 text-muted-foreground"/>Naam (Optioneel)</FormLabel>
                  <FormControl><Input placeholder="Je naam" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><Mail className="h-4 w-4 text-muted-foreground"/>E-mail (Optioneel)</FormLabel>
                  <FormControl><Input type="email" placeholder="jouw@email.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="feedbackType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><ListFilter className="h-4 w-4 text-muted-foreground"/>Type Feedback*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecteer type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bug"><AlertTriangle className="h-4 w-4 mr-2 inline-block text-destructive"/>Fout/Bug</SelectItem>
                    <SelectItem value="suggestie"><Lightbulb className="h-4 w-4 mr-2 inline-block text-yellow-500"/>Suggestie/Verbetering</SelectItem>
                    <SelectItem value="algemeen"><MessageCircle className="h-4 w-4 mr-2 inline-block text-blue-500"/>Algemene Opmerking</SelectItem>
                    <SelectItem value="ui_ux"><Settings className="h-4 w-4 mr-2 inline-block text-purple-500"/>UI/UX Feedback</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pageOrFeature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><FileText className="h-4 w-4 text-muted-foreground"/>Betreft Pagina/Feature*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecteer pagina of feature" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pageFeatureOptions.map(opt => {
                      const IconComponent = opt.icon;
                      return (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
                            {opt.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchedPageOrFeature === 'anders' && (
            <FormField
              control={form.control}
              name="otherPageOrFeature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><FileText className="h-4 w-4 text-muted-foreground"/>Specificatie 'Anders'*</FormLabel>
                  <FormControl><Input placeholder="Geef hier de specifieke pagina of feature aan" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><MessageSquareText className="h-4 w-4 text-muted-foreground"/>Beschrijving*</FormLabel>
                <FormControl><Textarea placeholder="Geef een duidelijke omschrijving van je feedback..." {...field} rows={6} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><Workflow className="h-4 w-4 text-muted-foreground"/>Prioriteit*</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecteer prioriteit" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="laag">Laag</SelectItem>
                    <SelectItem value="normaal">Normaal</SelectItem>
                    <SelectItem value="hoog">Hoog</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        <p className="text-xs text-muted-foreground pt-1">* Verplicht veld</p>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Verstuur Feedback
        </Button>
    </form>
</Form>
  );
}


export default function FeedbackPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center py-12 md:py-16 lg:py-20">
        <div className="container max-w-2xl">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <MessageSquareText className="mx-auto h-12 w-12 text-primary mb-3" />
              <CardTitle className="text-3xl font-bold">Geef ons Feedback (Alpha)</CardTitle>
              <CardDescription>
                Help ons MindNavigator te verbeteren! Jouw input is waardevol tijdens deze alpha testfase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackForm />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
