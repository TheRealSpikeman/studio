
// src/components/ouder/AddChildForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form"; // Added Controller
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, School, Mail, Info, Cake, GraduationCap, Target, Users, Share2, MessageCircle, HelpCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { allHomeworkSubjects, type SubjectOption } from "@/lib/quiz-data/subject-data";
import { Textarea } from "@/components/ui/textarea";

const schoolTypes = ["VMBO-T", "HAVO", "VWO", "Gymnasium", "Praktijkonderwijs", "Speciaal Onderwijs", "Anders"];
const NOT_SPECIFIED_VALUE = "_NOT_SPECIFIED_";
const childAgeOptions = Array.from({ length: (20 - 10) + 1 }, (_, i) => (i + 10).toString());

const predefinedLeerdoelen = [
  { id: 'plannen', label: "Beter leren plannen voor toetsen" },
  { id: 'faalangst', label: "Omgaan met faalangst" },
  { id: 'concentratie', label: "Concentratie verbeteren tijdens de les" },
  { id: 'zelfvertrouwen', label: "Zelfvertrouwen vergroten" },
  { id: 'motivatie', label: "Motivatie vinden/behouden" },
  { id: 'structuur', label: "Structuur aanbrengen in huiswerk" },
];

const predefinedTutorPreferences = [
  { id: 'ervaring-add-adhd', label: "Ervaring met ADD/ADHD" },
  { id: 'ervaring-ass', label: "Ervaring met ASS" },
  { id: 'ervaring-hsp', label: "Ervaring met HSP" },
  { id: 'ervaring-faalangst', label: "Ervaring met faalangst" },
  { id: 'man', label: "Man" },
  { id: 'vrouw', label: "Vrouw" },
  { id: 'geduldig', label: "Geduldig" },
  { id: 'streng-doch-rechtvaardig', label: "Streng doch rechtvaardig" },
  { id: 'resultaatgericht', label: "Resultaatgericht" },
  { id: 'uitleg-beelddenkers', label: "Kan goed uitleggen aan beelddenkers" },
  { id: 'flexibel-avond', label: "Flexibel (ook 's avonds)" },
  { id: 'flexibel-weekend', label: "Flexibel (ook weekend)" },
];

const addChildFormSchema = z.object({
  firstName: z.string().min(2, { message: "Voornaam moet minimaal 2 tekens bevatten." }),
  lastName: z.string().min(2, { message: "Achternaam moet minimaal 2 tekens bevatten." }),
  age: z.string().min(1, { message: "Selecteer een leeftijd." }),
  childEmail: z.string().email({ message: "Voer een geldig e-mailadres voor het kind in." }),
  schoolType: z.string().optional(),
  otherSchoolType: z.string().optional(),
  className: z.string().optional(),
  helpSubjects: z.array(z.string()).optional(),
  hulpvraagType: z.array(z.enum(['tutor', 'coach'])).optional(),
  selectedLeerdoelen: z.array(z.string()).optional(),
  otherLeerdoelen: z.string().max(250, "Toelichting mag maximaal 250 tekens bevatten.").optional(),
  selectedTutorPreferences: z.array(z.string()).optional(),
  otherTutorPreference: z.string().max(250, "Toelichting mag maximaal 250 tekens bevatten.").optional(),
  deelResultatenMetTutor: z.boolean().optional(),
}).refine(data => {
  if (data.schoolType === "Anders" && (!data.otherSchoolType || data.otherSchoolType.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Specificatie voor 'Ander schooltype' is vereist.",
  path: ["otherSchoolType"], 
});

export type AddChildFormData = z.infer<typeof addChildFormSchema>;

interface AddChildFormProps {
  onSave: (data: AddChildFormData) => void;
  onCancel: () => void;
}

export function AddChildForm({ onSave, onCancel }: AddChildFormProps) {
  const form = useForm<AddChildFormData>({
    resolver: zodResolver(addChildFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: undefined,
      childEmail: "",
      schoolType: "",
      otherSchoolType: "",
      className: "",
      helpSubjects: [],
      hulpvraagType: [],
      selectedLeerdoelen: [],
      otherLeerdoelen: "",
      selectedTutorPreferences: [],
      otherTutorPreference: "",
      deelResultatenMetTutor: false,
    },
  });

  const watchedSchoolType = form.watch("schoolType");

  function onSubmit(values: AddChildFormData) {
    const dataToSave = {
      ...values,
      schoolType: values.schoolType === NOT_SPECIFIED_VALUE ? "" : values.schoolType,
      otherSchoolType: values.schoolType === "Anders" ? values.otherSchoolType : "",
    };
    onSave(dataToSave);
  }

  return (
    <Card className="w-full shadow-xl">
        <CardHeader>
            <CardTitle>Kindgegevens Invoeren</CardTitle>
            <CardDescription>
                Vul de gegevens van uw kind in. Na het opslaan ontvangt het kind een uitnodiging om het eigen account te activeren en te koppelen. Deze informatie helpt ons ook bij het selecteren van de juiste quizzen en, indien van toepassing, de meest geschikte tutor of coach.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Voornaam kind</FormLabel>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <FormControl>
                                <Input placeholder="Sofie" {...field} className="pl-10" />
                                </FormControl>
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Achternaam kind</FormLabel>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <FormControl>
                                <Input placeholder="de Tester" {...field} className="pl-10" />
                                </FormControl>
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Leeftijd kind</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="pl-10 relative">
                                <Cake className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <SelectValue placeholder="Selecteer leeftijd" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {childAgeOptions.map(age => (
                                <SelectItem key={age} value={age}>{age} jaar</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="childEmail"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>E-mailadres kind (voor account activatie)</FormLabel>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <FormControl>
                            <Input type="email" placeholder="kind@email.com" {...field} className="pl-10" />
                            </FormControl>
                        </div>
                        <FormDescription className="flex items-center gap-1 text-xs pt-1">
                            <Info className="h-3 w-3"/> Het kind ontvangt hierop een uitnodiging om het account te activeren.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <FormField
                    control={form.control}
                    name="schoolType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Type school</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""} >
                            <FormControl>
                            <SelectTrigger className="pl-10 relative">
                                <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <SelectValue placeholder="Selecteer schooltype" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {schoolTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            <SelectItem value={NOT_SPECIFIED_VALUE}>Niet opgegeven</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription className="text-xs pt-1 flex items-center gap-1">
                            <Info className="h-3 w-3"/> Helpt ons bij het vinden van passende tutors.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="className"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Klas</FormLabel>
                        <div className="relative">
                            <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <FormControl>
                            <Input placeholder="Bijv. 3A, VWO 5" {...field} className="pl-10" />
                            </FormControl>
                        </div>
                         <FormDescription className="text-xs pt-1 flex items-center gap-1">
                           <Info className="h-3 w-3"/> Optioneel, voor specifieke tutor matching.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                {watchedSchoolType === "Anders" && (
                  <FormField
                    control={form.control}
                    name="otherSchoolType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specificatie ander schooltype</FormLabel>
                        <FormControl>
                          <Input placeholder="Bijv. Thuisonderwijs, Buitenlandse school" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}


                <FormField
                  control={form.control}
                  name="hulpvraagType"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-primary" />
                          Type begeleiding gezocht
                        </FormLabel>
                        <FormDescription className="text-xs pt-1 flex items-center gap-1">
                          <Info className="h-3 w-3" /> Welk type ondersteuning zoekt u primair voor dit kind? (Meerdere selecties mogelijk)
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        <FormField
                          control={form.control}
                          name="hulpvraagType"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('tutor')}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), 'tutor'])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== 'tutor'
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer text-sm">
                                Hulp bij huiswerk (Tutor)
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="hulpvraagType"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('coach')}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), 'coach'])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== 'coach'
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer text-sm">
                                1-op-1 coaching (Coach)
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="helpSubjects"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-primary"/>
                            Voor welke vakken heeft dit kind hulp nodig? (Indien tutor gezocht)
                        </FormLabel>
                        <FormDescription className="text-xs pt-1 flex items-center gap-1">
                           <Info className="h-3 w-3"/> Selecteer de vakken. Dit helpt bij het aanbevelen van content en tutors.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                        {allHomeworkSubjects.map((subject) => (
                          <FormField
                            key={subject.id}
                            control={form.control}
                            name="helpSubjects"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={subject.id}
                                  className="flex flex-row items-center space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(subject.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), subject.id])
                                          : field.onChange(
                                              (field.value || []).filter(
                                                (value) => value !== subject.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center gap-1.5 cursor-pointer">
                                    <subject.icon className="h-4 w-4"/> {subject.name}
                                  </FormLabel>
                                </FormItem>
                              );
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
                  name="selectedLeerdoelen"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          Leerdoelen of aandachtspunten
                        </FormLabel>
                         <FormDescription className="text-xs pt-1 flex items-center gap-1">
                           <Info className="h-3 w-3"/> Selecteer de meest relevante doelen of aandachtspunten.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                        {predefinedLeerdoelen.map((doel) => (
                          <FormField
                            key={doel.id}
                            control={form.control}
                            name="selectedLeerdoelen"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={doel.id}
                                  className="flex flex-row items-center space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(doel.label)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), doel.label])
                                          : field.onChange(
                                              (field.value || []).filter(
                                                (value) => value !== doel.label
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer text-sm">
                                    {doel.label}
                                  </FormLabel>
                                </FormItem>
                              );
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
                  name="otherLeerdoelen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        Andere leerdoelen of specifieke toelichting (optioneel)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Bijv. 'Moeite met starten van taken', 'Hulp nodig bij het samenvatten van lange teksten'."
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="selectedTutorPreferences"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          Voorkeuren voor type tutor/coach (optioneel)
                        </FormLabel>
                        <FormDescription className="text-xs pt-1 flex items-center gap-1">
                           <Info className="h-3 w-3"/> Selecteer voorkeuren voor het type begeleider.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                        {predefinedTutorPreferences.map((pref) => (
                          <FormField
                            key={pref.id}
                            control={form.control}
                            name="selectedTutorPreferences"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={pref.id}
                                  className="flex flex-row items-center space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(pref.label)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), pref.label])
                                          : field.onChange(
                                              (field.value || []).filter(
                                                (value) => value !== pref.label
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer text-sm">
                                    {pref.label}
                                  </FormLabel>
                                </FormItem>
                              );
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
                  name="otherTutorPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        Andere voorkeuren voor begeleider of specifieke toelichting (optioneel)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Bijv. 'Iemand die ook 's avonds laat kan', 'Een coach die ervaring heeft met topsport'."
                          {...field}
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="deelResultatenMetTutor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-muted/30">
                        <div className="flex items-center h-full pt-0.5">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="deelResultatenMetTutor"
                                />
                            </FormControl>
                        </div>
                        <div className="space-y-1 leading-none">
                            <FormLabel htmlFor="deelResultatenMetTutor" className="text-base font-semibold flex items-center gap-2 cursor-pointer">
                                <Share2 className="h-5 w-5 text-primary" />
                                Toestemming delen quizresultaten met begeleiders
                            </FormLabel>
                            <FormDescription className="text-xs pt-1">
                                Mag MindNavigator (geanonimiseerde) samenvattingen van quizresultaten en leerdoelen van dit kind delen met potentiële of gekoppelde begeleiders (tutors/coaches) om de matching en begeleiding te optimaliseren? U behoudt controle en kunt dit later aanpassen.
                            </FormDescription>
                            <FormMessage />
                        </div>
                    </FormItem>
                  )}
                />

                <CardFooter className="flex justify-end gap-2 pt-8 px-0 pb-0">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Annuleren
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        Kind Opslaan & Uitnodigen
                    </Button>
                </CardFooter>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
