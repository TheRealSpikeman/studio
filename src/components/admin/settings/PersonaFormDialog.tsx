// src/components/admin/settings/PersonaFormDialog.tsx
"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import type { AiPersona } from '@/ai/personas';

const personaFormSchema = z.object({
  id: z.string().min(3, "ID is vereist.").regex(/^[a-z0-9-]+$/, "ID mag alleen kleine letters, cijfers en streepjes bevatten."),
  name: z.string().min(3, "Naam is vereist."),
  title: z.string().min(3, "Titel is vereist."),
  imageUrl: z.string().url({ message: "Voer een geldige URL in." }).or(z.literal('')),
  imageHint: z.string().min(2, "Hint is vereist."),
  bio: z.string().min(10, "Bio is te kort."),
  contribution: z.string().min(10, "Bijdrage is te kort."),
  description: z.string().min(10, "Prompt instructie is te kort."),
  linkedinUrl: z.string().url("Voer een geldige URL in.").optional().or(z.literal('')),
});

export type PersonaFormData = z.infer<typeof personaFormSchema>;

interface PersonaFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: PersonaFormData) => void;
  persona: AiPersona | null; // null for new, AiPersona for edit
}

export function PersonaFormDialog({ isOpen, onOpenChange, onSave, persona }: PersonaFormDialogProps) {
  const form = useForm<PersonaFormData>({
    resolver: zodResolver(personaFormSchema),
  });

  const isEditing = !!persona;

  useEffect(() => {
    if (isOpen) {
      if (persona) {
        form.reset(persona);
      } else {
        form.reset({
          id: "", name: "", title: "", imageUrl: "https://placehold.co/200x200.png", imageHint: "person portrait",
          bio: "", contribution: "", description: "", linkedinUrl: ""
        });
      }
    }
  }, [isOpen, persona, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Bewerk AI Persona' : 'Nieuwe AI Persona'}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Pas de gegevens voor "${persona?.name}" aan.` : "Voer de details voor een nieuwe AI persoonlijkheid in."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="persona-form" onSubmit={form.handleSubmit(onSave)} className="flex-1 overflow-y-auto pr-6 space-y-4">
              <FormField name="id" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Uniek ID</FormLabel><FormControl><Input {...field} disabled={isEditing} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Naam (incl. rol)</FormLabel><FormControl><Input placeholder="bv. Dr. Florentine Sage (Psycholoog)" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField name="title" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Titel</FormLabel><FormControl><Input placeholder="bv. Kinder- & Jeugdpsycholoog NIP" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <div className="grid grid-cols-2 gap-4">
                <FormField name="imageUrl" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Afbeelding URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField name="imageHint" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Afbeelding Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <FormField name="linkedinUrl" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>LinkedIn URL (optioneel)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField name="bio" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Biografie</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField name="contribution" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Bijdrage aan Platform</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>AI Prompt Instructie</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
          </form>
        </Form>
        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <DialogClose asChild><Button type="button" variant="outline">Annuleren</Button></DialogClose>
          <Button type="submit" form="persona-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Wijzigingen Opslaan' : 'Persona Aanmaken'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
