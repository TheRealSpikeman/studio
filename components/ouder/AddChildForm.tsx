// src/components/ouder/AddChildForm.tsx
"use client";

import { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School } from 'lucide-react';

const addChildFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "Voornaam must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Achternaam must be at least 2 characters.",
  }),
  age: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 4 && num <= 20;
  }, {
    message: "Leeftijd moet een getal zijn tussen 4 en 20.",
  }),
  childEmail: z.string().email({
    message: "Invalid email address.",
  }),
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

const allHulpvraagOptions: { id: 'tutor' | 'coach'; label: string }[] = [
    { id: 'tutor', label: "Hulp bij huiswerk (Tutor)" },
    { id: 'coach', label: "1-op-1 coaching (Coach)" },
];

const schoolTypes = ["VMBO-T", "HAVO", "VWO", "Gymnasium", "Praktijkonderwijs", "Speciaal Onderwijs", "Anders"];

export function AddChildForm({ onSave, onCancel }: AddChildFormProps) {
  const form = useForm<AddChildFormData>({
    resolver: zodResolver(addChildFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: "",
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
    mode: "onChange",
  });

  const { handleSubmit, watch } = form;
  const watchedSchoolType = watch("schoolType");
  const watchedHulpvraagType = watch("hulpvraagType");

  function onSubmit(data: AddChildFormData) {
    onSave(data);
  }

  return (
     <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Voeg een Kind Toe</CardTitle>
            <CardDescription>Vul de gegevens van uw kind in om een profiel aan te maken.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Voornaam</FormLabel>
                                <FormControl>
                                    <Input placeholder="Voornaam" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Achternaam</FormLabel>
                                <FormControl>
                                    <Input placeholder="Achternaam" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="age" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leeftijd</FormLabel>
                                <FormControl>
                                    <Input placeholder="Leeftijd" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="childEmail" render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mailadres Kind</FormLabel>
                                <FormControl>
                                    <Input placeholder="E-mailadres" {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <FormField control={form.control} name="schoolType" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1"><School className="h-4 w-4"/>Schooltype</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Kies een schooltype" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {schoolTypes.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {watchedSchoolType === "Anders" && (
                        <FormField control={form.control} name="otherSchoolType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Specificatie ander schooltype</FormLabel>
                                <FormControl>
                                    <Input placeholder="Bijv. Thuisonderwijs" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    )}

                    <FormField control={form.control} name="className" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Klas</FormLabel>
                            <FormControl>
                                <Input placeholder="Klas" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="helpSubjects" render={() => (
                        <FormItem>
                            <FormLabel>Hulp nodig bij vakken</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {allHomeworkSubjects.map((subject) => (
                                    <FormField
                                        key={subject.id}
                                        control={form.control}
                                        name="helpSubjects"
                                        render={({ field }) => {
                                            const isChecked = Array.isArray(field.value) && field.value.includes(subject.id);
                                            return (
                                                <FormItem className={cn("flex flex-row items-center space-x-2 rounded-md border p-1 cursor-pointer hover:bg-muted/50")}>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => {
                                                                return checked ? field.onChange([...(field.value || []), subject.id]) : field.onChange(field.value?.filter((value) => value !== subject.id));
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal pl-0 cursor-pointer">{subject.name}</FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="hulpvraagType" render={() => (
                        <FormItem>
                            <FormLabel>Hulpvraag type</FormLabel>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {allHulpvraagOptions.map((opt) => (
                                    <FormField
                                        key={opt.id}
                                        control={form.control}
                                        name="hulpvraagType"
                                        render={({ field }) => {
                                            const isChecked = Array.isArray(field.value) && field.value.includes(opt.id);
                                            return (
                                                <FormItem className={cn("flex flex-row items-center space-x-2 rounded-md border p-1 cursor-pointer hover:bg-muted/50")}>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => {
                                                                return checked ? field.onChange([...(field.value || []), opt.id]) : field.onChange(field.value?.filter((value) => value !== opt.id));
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal pl-0 cursor-pointer">{opt.label}</FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="selectedLeerdoelen" render={() => (
                        <FormItem>
                            <FormLabel>Leerdoelen</FormLabel>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {predefinedLeerdoelen.map((doel) => (
                                    <FormField
                                        key={doel.id}
                                        control={form.control}
                                        name="selectedLeerdoelen"
                                        render={({ field }) => {
                                            const isChecked = Array.isArray(field.value) && field.value.includes(doel.label);
                                            return (
                                                <FormItem className={cn("flex flex-row items-center space-x-2 rounded-md border p-1 cursor-pointer hover:bg-muted/50")}>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => {
                                                                return checked ? field.onChange([...(field.value || []), doel.label]) : field.onChange(field.value?.filter((value) => value !== doel.label));
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal pl-0 cursor-pointer">{doel.label}</FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="otherLeerdoelen" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Andere Leerdoelen</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Andere Leerdoelen" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="selectedTutorPreferences" render={() => (
                        <FormItem>
                            <FormLabel>Tutor Preferences</FormLabel>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {predefinedTutorPreferences.map((pref) => (
                                    <FormField
                                        key={pref.id}
                                        control={form.control}
                                        name="selectedTutorPreferences"
                                        render={({ field }) => {
                                            const isChecked = Array.isArray(field.value) && field.value.includes(pref.label);
                                            return (
                                                <FormItem className={cn("flex flex-row items-center space-x-2 rounded-md border p-1 cursor-pointer hover:bg-muted/50")}>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => {
                                                                return checked ? field.onChange([...(field.value || []), pref.label]) : field.onChange(field.value?.filter((value) => value !== pref.label));
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal pl-0 cursor-pointer">{pref.label}</FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="otherTutorPreference" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Andere Tutor Preferences</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Andere Tutor Preferences" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="deelResultatenMetTutor" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-2">
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>Deel resultaten met tutor?</FormLabel>
                        </FormItem>
                    )} />

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={onCancel}>
                            Annuleren
                        </Button>
                        <Button type="submit">
                            Opslaan
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
