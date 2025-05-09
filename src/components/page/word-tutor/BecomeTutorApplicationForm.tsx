// src/components/page/word-tutor/BecomeTutorApplicationForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, BookOpen, CalendarDays, UploadCloud, Euro, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const subjectOptions = [
  { id: "nederlands", label: "Nederlands" },
  { id: "wiskunde", label: "Wiskunde" },
  { id: "engels", label: "Engels" },
  { id: "geschiedenis", label: "Geschiedenis" },
  { id: "aardrijkskunde", label: "Aardrijkskunde" },
  { id: "biologie", label: "Biologie" },
  { id: "scheikunde", label: "Scheikunde" },
  { id: "natuurkunde", label: "Natuurkunde" },
  { id: "economie", label: "Economie" },
  { id: "frans", label: "Frans" },
  { id: "duits", label: "Duits" },
  { id: "overig", label: "Overig (specificeer in bio)" },
];

const tutorApplicationSchema = z.object({
  fullName: z.string().min(2, "Volledige naam is vereist."),
  email: z.string().email("Ongeldig e-mailadres."),
  phone: z.string().min(10, "Telefoonnummer is te kort.").optional().or(z.literal('')),
  subjects: z.array(z.string()).min(1, "Selecteer minimaal één vak."),
  bio: z.string().min(50, "Bio moet minimaal 50 tekens bevatten.").max(1000, "Bio mag maximaal 1000 tekens bevatten."),
  availability: z.string().min(10, "Beschikbaarheid is vereist."),
  cv: z.any().refine(file => file?.length > 0, "CV is vereist.").optional(), // Making optional for now due to file handling complexity
  vog: z.any().refine(file => file?.length > 0, "VOG is vereist.").optional(), // Making optional for now
  hourlyRate: z.coerce.number().min(10, "Uurtarief moet minimaal €10 zijn.").max(100, "Uurtarief mag maximaal €100 zijn."),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: "Je moet akkoord gaan met de 10% servicekosten en voorwaarden.",
  }),
});

type TutorApplicationFormData = z.infer<typeof tutorApplicationSchema>;

export function BecomeTutorApplicationForm() {
  const { toast } = useToast();
  const form = useForm<TutorApplicationFormData>({
    resolver: zodResolver(tutorApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subjects: [],
      bio: "",
      availability: "", // e.g., "Ma-vr avond, Za ochtend"
      cv: undefined,
      vog: undefined,
      hourlyRate: 20,
      agreeToTerms: false,
    },
  });

  function onSubmit(values: TutorApplicationFormData) {
    // TODO: Implement actual form submission logic (e.g., send to backend)
    console.log("Tutor application submitted:", values);
    toast({
      title: "Aanmelding Verstuurd!",
      description: "Bedankt voor je aanmelding. We nemen binnen 2 werkdagen contact met je op over de vervolgstappen.",
      duration: 7000,
    });
    form.reset();
  }

  // Placeholder for file inputs
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: 'cv' | 'vog') => {
    if (event.target.files && event.target.files.length > 0) {
      form.setValue(fieldName, event.target.files[0] as any); // Basic handling
      toast({ title: `${fieldName.toUpperCase()} geselecteerd`, description: event.target.files[0].name });
    }
  };


  return (
    <section id="tutor-application-form" className="py-16 md:py-24 bg-secondary/30">
      <div className="container max-w-3xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Meld je aan als Tutor</CardTitle>
            <CardDescription>Vul het onderstaande formulier in om je aan te melden. We kijken ernaar uit van je te horen!</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Stap 1: Persoonsgegevens */}
                <Card className="p-6 shadow-md">
                  <CardTitle className="text-xl mb-4 flex items-center gap-2"><User className="text-primary"/>Persoonlijke Gegevens</CardTitle>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Volledige naam</FormLabel>
                        <FormControl><Input placeholder="Jan Jansen" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>E-mailadres</FormLabel>
                        <FormControl><Input type="email" placeholder="jouw@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefoonnummer (optioneel)</FormLabel>
                        <FormControl><Input type="tel" placeholder="0612345678" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>

                {/* Stap 2: Vakken & Ervaring */}
                 <Card className="p-6 shadow-md">
                  <CardTitle className="text-xl mb-4 flex items-center gap-2"><BookOpen className="text-primary"/>Vakken & Ervaring</CardTitle>
                  <FormField
                    control={form.control}
                    name="subjects"
                    render={() => (
                      <FormItem className="mb-4">
                        <FormLabel>In welke vakken wil je bijles geven?</FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                          {subjectOptions.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="subjects"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Korte bio / motivatie (min. 50 tekens)</FormLabel>
                        <FormControl><Textarea placeholder="Vertel iets over jezelf, je ervaring en waarom je een goede tutor zou zijn..." {...field} rows={5} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>

                {/* Stap 3: Beschikbaarheid */}
                 <Card className="p-6 shadow-md">
                  <CardTitle className="text-xl mb-4 flex items-center gap-2"><CalendarDays className="text-primary"/>Beschikbaarheid</CardTitle>
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Geef een indicatie van je beschikbaarheid</FormLabel>
                        <FormControl><Textarea placeholder="Bijv: Maandagavond, woensdagmiddag, zaterdagochtend. Ik ben flexibel." {...field} rows={3} /></FormControl>
                        <FormDescription>Je kunt dit later verfijnen in je tutor-profiel.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>
                
                {/* Stap 4: Documenten Upload */}
                <Card className="p-6 shadow-md">
                    <CardTitle className="text-xl mb-4 flex items-center gap-2"><UploadCloud className="text-primary"/>Documenten</CardTitle>
                    <FormField
                        control={form.control}
                        name="cv"
                        render={({ field }) => (
                        <FormItem className="mb-4">
                            <FormLabel>Upload CV (PDF, max 5MB)</FormLabel>
                            <FormControl>
                                <Input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'cv')} className="pt-2"/>
                            </FormControl>
                            <FormDescription>We gebruiken je CV om je ervaring te beoordelen.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vog"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upload VOG (Verklaring Omtrent Gedrag - PDF, max 5MB, niet ouder dan 2 jaar)</FormLabel>
                             <FormControl>
                                <Input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'vog')} className="pt-2"/>
                            </FormControl>
                            <FormDescription>Een VOG is vereist om de veiligheid van onze leerlingen te waarborgen.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </Card>

                {/* Stap 5: Tarieven & Voorwaarden */}
                <Card className="p-6 shadow-md">
                    <CardTitle className="text-xl mb-4 flex items-center gap-2"><Euro className="text-primary"/>Tarieven & Voorwaarden</CardTitle>
                    <FormField
                        control={form.control}
                        name="hourlyRate"
                        render={({ field }) => (
                        <FormItem className="mb-4">
                            <FormLabel>Gewenst uurtarief (excl. 10% servicekosten)</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                    <Input type="number" placeholder="20" {...field} className="pl-7"/>
                                </div>
                            </FormControl>
                            <FormDescription>MindNavigator rekent 10% servicekosten over je uurtarief.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="tutorAgreeToTerms"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel htmlFor="tutorAgreeToTerms" className="cursor-pointer">
                              Ik ga akkoord met de 10% servicekosten en de <Button variant="link" asChild className="p-0 h-auto"><a href="/terms-tutors" target="_blank" rel="noopener noreferrer">algemene voorwaarden voor tutors</a></Button>.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                </Card>

                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                  Aanmelding Versturen
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
