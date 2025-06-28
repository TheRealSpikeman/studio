// src/components/ouder/profiel/KindProfielEditForm.tsx
"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";

import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';
import type { Child, EditableChildData, editableChildFormSchema } from '@/types/dashboard';
import { isTutorServiceCoveredByPlan, isCoachServiceCoveredByPlan } from '@/lib/utils';

import { User, School, GraduationCap, MessageSquare, Save, ImageUp, Trash2, Cake, AlertTriangle } from 'lucide-react';

const ageGroupOptions: {value: Child['ageGroup'], label: string}[] = [
    {value: '12-14', label: '12-14 jaar'},
    {value: '15-18', label: '15-18 jaar'},
    {value: 'adult', label: 'Volwassene (18+)'} 
];

const predefinedLeerdoelen = [
  { id: 'plannen', label: "Beter leren plannen voor toetsen" }, { id: 'faalangst', label: "Omgaan met faalangst" },
  { id: 'concentratie', label: "Concentratie verbeteren tijdens de les" }, { id: 'zelfvertrouwen', label: "Zelfvertrouwen vergroten" },
  { id: 'motivatie', label: "Motivatie vinden/behouden" }, { id: 'structuur', label: "Structuur aanbrengen in huiswerk" },
];

const predefinedTutorPreferences = [
  { id: 'ervaring-add-adhd', label: "Ervaring met ADD/ADHD" }, { id: 'ervaring-ass', label: "Ervaring met ASS" },
  { id: 'ervaring-hsp', label: "Ervaring met HSP" }, { id: 'ervaring-faalangst', label: "Ervaring met faalangst" },
  { id: 'man', label: "Man" }, { id: 'vrouw', label: "Vrouw" }, { id: 'geduldig', label: "Geduldig" },
  { id: 'streng-doch-rechtvaardig', label: "Streng doch rechtvaardig" }, { id: 'resultaatgericht', label: "Resultaatgericht" },
  { id: 'uitleg-beelddenkers', label: "Kan goed uitleggen aan beelddenkers" }, { id: 'flexibel-avond', label: "Flexibel (ook 's avonds)" },
  { id: 'flexibel-weekend', label: "Flexibel (ook weekend)" },
];
const allHulpvraagOptions: { id: 'tutor' | 'coach'; label: string }[] = [ { id: 'tutor', label: "Hulp bij huiswerk (Tutor)" }, { id: 'coach', label: "1-op-1 coaching (Coach)" } ];
const schoolTypes = ["VMBO-T", "HAVO", "VWO", "Gymnasium", "Praktijkonderwijs", "Speciaal Onderwijs", "Anders", "Niet opgegeven"];

const predefinedAvatarsForProfile = [
  { id: 'child_avatar1', src: 'https://placehold.co/80x80.png?text=C1', alt: 'Avatar Patroon 1', hint: 'abstract pattern' },
  { id: 'child_avatar2', src: 'https://placehold.co/80x80.png?text=C2', alt: 'Avatar Natuur', hint: 'nature element' },
  { id: 'child_avatar3', src: 'https://placehold.co/80x80.png?text=C3', alt: 'Avatar Dier', hint: 'animal cute' },
  { id: 'child_avatar4', src: 'https://placehold.co/80x80.png?text=C4', alt: 'Avatar Ruimte', hint: 'space cosmic' },
];

const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';
const parseMultiPartString = (str: string | undefined): { selected: string[]; other: string } => {
  if (!str) return { selected: [], other: '' };
  const geselecteerdMatch = str.match(/Geselecteerd:\s*(.*?)(?=\s*\.\s*Overig:|$)/i);
  const overigMatch = str.match(/Overig:\s*(.*)/i);
  const selectedItems = geselecteerdMatch ? geselecteerdMatch[1].trim().split(',').map(s => s.trim()).filter(Boolean) : [];
  const otherText = overigMatch ? overigMatch[1].trim() : (geselecteerdMatch && !str.includes("Overig:") ? '' : (!geselecteerdMatch ? str : ''));
  return { selected: selectedItems, other: otherText };
};


export const KindProfielEditForm = ({ initialData, onSave, onCancel }: { initialData: Child; onSave: (data: EditableChildData) => void; onCancel: () => void; }) => {
  const form = useForm<EditableChildData>({ resolver: zodResolver(editableChildFormSchema), defaultValues: {} });
  const { reset, control, handleSubmit, watch, setValue } = form;
  const watchedSchoolType = watch("schoolType");
  const watchedHulpvraagType = watch("hulpvraagType");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const displayedName = `${watch('firstName') || ''} ${watch('lastName') || ''}`.trim();
  const displayedAvatar = watch('avatarUrl');
  const selectedTutorHulp = watchedHulpvraagType?.includes('tutor');
  const selectedCoachHulp = watchedHulpvraagType?.includes('coach');
  const tutorServiceCovered = isTutorServiceCoveredByPlan(initialData.planId);
  const coachServiceCovered = isCoachServiceCoveredByPlan(initialData.planId);

  useEffect(() => {
    const parsedLeerdoelen = parseMultiPartString(initialData.leerdoelen);
    const parsedVoorkeuren = parseMultiPartString(initialData.voorkeurTutor);
    reset({
      firstName: initialData.firstName, lastName: initialData.lastName, ageGroup: initialData.ageGroup || '12-14',
      childEmail: initialData.childEmail || '', schoolType: initialData.schoolType || '', otherSchoolType: initialData.otherSchoolType || '',
      className: initialData.className || '', helpSubjects: initialData.helpSubjects || [], hulpvraagType: initialData.hulpvraagType || [],
      selectedLeerdoelen: parsedLeerdoelen.selected, otherLeerdoelen: parsedLeerdoelen.other,
      selectedTutorPreferences: parsedVoorkeuren.selected, otherTutorPreference: parsedVoorkeuren.other,
      avatarUrl: initialData.avatarUrl || null,
    });
  }, [initialData, reset]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setValue('avatarUrl', reader.result as string, { shouldValidate: true });
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSave)} className="space-y-0">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg bg-card shadow">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20"><AvatarImage src={displayedAvatar || undefined} alt={displayedName} data-ai-hint="child person" /><AvatarFallback className="text-3xl bg-muted">{getInitials(displayedName)}</AvatarFallback></Avatar>
                <div><h1 className="text-3xl font-bold text-foreground">{displayedName || "Kind Profiel Bewerken"}</h1><p className="text-muted-foreground">Pas hier de gegevens aan.</p></div>
            </div>
            <div className="flex gap-2"><Button type="submit"><Save className="mr-2 h-4 w-4"/> Opslaan</Button><Button variant="outline" type="button" onClick={onCancel}>Annuleren</Button></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><User className="h-6 w-6 text-primary"/>Persoonlijke Gegevens</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                  <FormField control={control} name="firstName" render={({ field }) => (<FormItem><div><FormLabel htmlFor="firstNameEdit">Voornaam</FormLabel><Input id="firstNameEdit" {...field} /></div><FormMessage/></FormItem>)} />
                  <FormField control={control} name="lastName" render={({ field }) => (<FormItem><div><FormLabel htmlFor="lastNameEdit">Achternaam</FormLabel><Input id="lastNameEdit" {...field} /></div><FormMessage/></FormItem>)} />
                  <FormField control={control} name="ageGroup" render={({ field }) => (<FormItem><FormLabel htmlFor="ageGroupEdit">Leeftijdsgroep</FormLabel><Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="ageGroupEdit" className="pl-10 relative"><Cake className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent>{ageGroupOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>)} />
                  <FormField control={control} name="childEmail" render={({ field }) => (<FormItem><div><FormLabel htmlFor="childEmailEdit">E-mail Kind</FormLabel><Input id="childEmailEdit" type="email" {...field} /></div><FormMessage/></FormItem>)} />
                  <FormField control={control} name="avatarUrl" render={({ field }) => (<FormItem><FormLabel htmlFor="avatarUrlEdit">Avatar URL (optioneel)</FormLabel><Input id="avatarUrlEdit" {...field} value={field.value || ''} placeholder="https://..."/><FormMessage/></FormItem>)} />
                  <div className="space-y-2"><Label>Of kies een standaard avatar:</Label><div className="flex flex-wrap gap-2">{predefinedAvatarsForProfile.map(avatar => (<button key={avatar.id} type="button" onClick={() => setValue('avatarUrl', avatar.src, { shouldValidate: true })} className={`rounded-md overflow-hidden border-2 transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary w-16 h-16 ${displayedAvatar === avatar.src ? 'border-primary ring-2 ring-primary scale-105' : 'border-transparent'}`}><Image src={avatar.src} alt={avatar.alt} width={64} height={64} data-ai-hint={avatar.hint} className="object-cover"/></button>))}</div>
                      <Input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden"/>
                      <Button type="button" onClick={() => avatarInputRef.current?.click()} variant="outline" size="sm"><ImageUp className="mr-2 h-4 w-4"/>Upload Eigen Foto</Button>
                      {displayedAvatar && <Button type="button" onClick={() => setValue('avatarUrl', null)} variant="ghost" size="sm" className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Verwijder Huidige Foto</Button>}
                  </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><School className="h-6 w-6 text-primary"/>Schoolinformatie</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                  <FormField control={control} name="schoolType" render={({ field }) => (<FormItem><FormLabel htmlFor="schoolTypeEdit">Schooltype</FormLabel><Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="schoolTypeEdit" className="pl-10 relative"><School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><SelectValue placeholder="Kies schooltype" /></SelectTrigger><SelectContent>{schoolTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>)} />
                  {watchedSchoolType === "Anders" && (<FormField control={form.control} name="otherSchoolType" render={({ field }) => (<FormItem className="mt-2"><FormLabel htmlFor="otherSchoolTypeEdit">Specificatie ander schooltype</FormLabel><Input id="otherSchoolTypeEdit" {...field} placeholder="Bijv. Thuisonderwijs" /><FormMessage /></FormItem>)} />)}
                  <FormField control={control} name="className" render={({ field }) => (<FormItem><div><FormLabel htmlFor="classNameEdit">Klas</FormLabel><Input id="classNameEdit" {...field} /></div><FormMessage/></FormItem>)} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg flex flex-col h-full"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="h-6 w-6 text-primary"/>Hulp bij Huiswerk (Tutor)</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm flex-grow">
                <p className="text-xs text-muted-foreground mb-3 -mt-2">Help ons de beste tutor te vinden. Selecteer de vakken en leerdoelen.</p>
                <FormField control={form.control} name="hulpvraagType" render={({ field }) => (<FormItem className="flex items-center space-x-2 mb-4"><Checkbox id="hulpvraag-tutor-edit" checked={field.value?.includes('tutor')} onCheckedChange={(checked) => { const newVal = field.value || []; return checked ? field.onChange([...newVal, 'tutor']) : field.onChange(newVal.filter(v => v !== 'tutor')); }} /><FormLabel htmlFor="hulpvraag-tutor-edit" className="font-semibold cursor-pointer">Hulp bij huiswerk (Tutor) actief?</FormLabel><FormMessage/></FormItem>)} />
                {selectedTutorHulp && !tutorServiceCovered && (<Alert variant="default" className="bg-orange-50 border-orange-300 text-orange-700 mb-3"><AlertTriangle className="h-5 w-5 !text-orange-600" /><AlertTitle className="text-orange-700 font-semibold">Abonnement Vereist</AlertTitle><AlertDescription>Het huidige abonnement '{initialData.planName || 'Gratis Start'}' dekt geen tutorbegeleiding. U kunt deze voorkeuren wel instellen, maar om een tutor te koppelen is een upgrade naar 'Gezins Gids' of 'Premium' nodig.<Button variant="link" asChild className="p-0 h-auto ml-1 text-orange-700 hover:text-orange-800"><Link href="/dashboard/ouder/abonnementen">Upgrade nu</Link></Button></AlertDescription></Alert>)}
                {selectedTutorHulp && (<><FormField control={control} name="helpSubjects" render={() => (<FormItem><FormLabel className="font-semibold text-foreground/90 mb-1 block">Hulp bij Vakken</FormLabel><p className="text-xs text-muted-foreground !mt-0 !mb-2">Selecteer de vakken waarvoor ondersteuning gewenst is.</p><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">{allHomeworkSubjects.map(subject => (<FormField key={subject.id} control={control} name="helpSubjects" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2"><FormControl><Checkbox checked={field.value?.includes(subject.id)} onCheckedChange={(checked) => { const newVal = field.value || []; return checked ? field.onChange([...newVal, subject.id]) : field.onChange(newVal.filter(v => v !== subject.id));}}/></FormControl><FormLabel htmlFor={`subject-${subject.id}-edit`} className="font-normal cursor-pointer">{subject.name}</FormLabel></FormItem>)} />))}</div><FormMessage/></FormItem>)} /><div className="mt-4"><FormLabel className="font-semibold text-foreground/90 mb-1 block">Leerdoelen & Aandachtspunten</FormLabel><p className="text-xs text-muted-foreground !mt-0 !mb-2">Kies de 2-3 belangrijkste leerdoelen.</p><FormField control={control} name="selectedLeerdoelen" render={() => (<FormItem><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{predefinedLeerdoelen.map(doel => (<FormField key={doel.id} control={control} name="selectedLeerdoelen" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2"><FormControl><Checkbox checked={field.value?.includes(doel.label)} onCheckedChange={(checked) => { const newVal = field.value || []; return checked ? field.onChange([...newVal, doel.label]) : field.onChange(newVal.filter(v => v !== doel.label)); }}/></FormControl><FormLabel htmlFor={`leerdoel-${doel.id}-edit`} className="font-normal cursor-pointer">{doel.label}</FormLabel></FormItem>)} />))}</div><FormMessage/></FormItem>)} /></div><FormField control={control} name="otherLeerdoelen" render={({ field }) => (<FormItem className="mt-4"><FormLabel htmlFor="otherLeerdoelenEdit">Andere leerdoelen/toelichting</FormLabel><Textarea id="otherLeerdoelenEdit" {...field} rows={3} /><FormMessage/></FormItem>)} /></>)}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg flex flex-col h-full"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><MessageSquare className="h-6 w-6 text-primary"/>1-op-1 Coaching (Coach)</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-4 flex-grow">
                  <p className="text-xs text-muted-foreground mb-3 -mt-2">Geef hier de voorkeuren aan als u op zoek bent naar een 1-op-1 coach.</p>
                  <FormField control={form.control} name="hulpvraagType" render={({ field }) => (<FormItem className="flex items-center space-x-2 mb-4"><Checkbox id="hulpvraag-coach-edit" checked={field.value?.includes('coach')} onCheckedChange={(checked) => { const newVal = field.value || []; return checked ? field.onChange([...newVal, 'coach']) : field.onChange(newVal.filter(v => v !== 'coach')); }} /><FormLabel htmlFor="hulpvraag-coach-edit" className="font-semibold cursor-pointer">1-op-1 coaching actief?</FormLabel><FormMessage/></FormItem>)} />
                  {selectedCoachHulp && !coachServiceCovered && (<Alert variant="default" className="bg-orange-50 border-orange-300 text-orange-700 mb-3"><AlertTriangle className="h-5 w-5 !text-orange-600" /><AlertTitle className="text-orange-700 font-semibold">Abonnement Vereist</AlertTitle><AlertDescription>Het huidige abonnement '{initialData.planName || 'Gratis Start'}' dekt geen 1-op-1 coaching.<Button variant="link" asChild className="p-0 h-auto ml-1 text-orange-700 hover:text-orange-800"><Link href="/dashboard/ouder/abonnementen">Upgrade nu</Link></Button></AlertDescription></Alert>)}
                  {selectedCoachHulp && (<><div><FormLabel className="font-semibold text-foreground/90 mb-1 block">Voorkeuren Coach</FormLabel><p className="text-xs text-muted-foreground !mt-0 !mb-2">Selecteer de belangrijkste voorkeuren voor een coach.</p><FormField control={control} name="selectedTutorPreferences" render={() => (<FormItem><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{predefinedTutorPreferences.map(pref => (<FormField key={pref.id} control={control} name="selectedTutorPreferences" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2"><FormControl><Checkbox checked={field.value?.includes(pref.label)} onCheckedChange={(checked) => { const newVal = field.value || []; return checked ? field.onChange([...newVal, pref.label]) : field.onChange(newVal.filter(v => v !== pref.label)); }}/></FormControl><FormLabel htmlFor={`coachpref-${pref.id}-edit`} className="font-normal cursor-pointer">{pref.label}</FormLabel></FormItem>)} />))}</div><FormMessage/></FormItem>)} /></div><FormField control={control} name="otherTutorPreference" render={({ field }) => (<FormItem className="mt-4"><FormLabel htmlFor="otherTutorPreferenceEdit">Andere voorkeuren coach/toelichting</FormLabel><Textarea id="otherTutorPreferenceEdit" {...field} rows={2} /><FormMessage/></FormItem>)} /></>)}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
};
