
// src/components/admin/feature-management/FeatureFormDialog.tsx
"use client";

import { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
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
import type { AppFeature, TargetAudience } from '@/app/dashboard/admin/subscription-management/page'; // Import AppFeature and TargetAudience

const targetAudienceOptions: { id: TargetAudience; label: string }[] = [
  { id: 'leerling', label: 'Leerling' },
  { id: 'ouder', label: 'Ouder' },
  { id: 'platform', label: 'Platform (algemeen)' },
  { id: 'beide', label: 'Beide (Leerling & Ouder)' },
];

const featureFormSchema = z.object({
  id: z.string().min(3, { message: "Feature ID moet minimaal 3 tekens bevatten (bijv. 'dailyCoaching')." }).regex(/^[a-zA-Z0-9-_]+$/, "ID mag alleen letters, cijfers, streepjes en underscores bevatten."),
  label: z.string().min(3, { message: "Label (titel) moet minimaal 3 tekens bevatten." }),
  description: z.string().optional(),
  targetAudience: z.array(z.string() as z.ZodType<TargetAudience[], any>).min(1, { message: "Selecteer minimaal één doelgroep." }),
  category: z.string().optional(),
});

type FeatureFormData = z.infer<typeof featureFormSchema>;

interface FeatureFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  feature: AppFeature | null; // null for adding new, AppFeature object for editing
  onSave: (data: AppFeature) => void;
}

export function FeatureFormDialog({ isOpen, onOpenChange, feature, onSave }: FeatureFormDialogProps) {
  const form = useForm<FeatureFormData>({
    resolver: zodResolver(featureFormSchema),
    defaultValues: {
      id: "",
      label: "",
      description: "",
      targetAudience: ['leerling'],
      category: "",
    },
  });

  const isEditing = !!feature;

  useEffect(() => {
    if (isOpen) {
      if (feature) {
        form.reset({
          id: feature.id,
          label: feature.label,
          description: feature.description || "",
          targetAudience: feature.targetAudience,
          category: feature.category || "",
        });
      } else {
        form.reset({
          id: "",
          label: "",
          description: "",
          targetAudience: ['leerling'],
          category: "",
        });
      }
    }
  }, [feature, isOpen, form]);

  function onSubmit(values: FeatureFormData) {
    onSave(values as AppFeature); // Assuming FeatureFormData is compatible with AppFeature
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Feature Bewerken' : 'Nieuwe Feature Toevoegen'}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Bewerk de details van feature "${feature?.label}".` : 'Voer de details voor de nieuwe feature in.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uniek Feature ID</FormLabel>
                  <FormControl>
                    <Input placeholder="bijv. daily_coaching_emails" {...field} disabled={isEditing} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Gebruik kleine letters, cijfers, underscores of streepjes. {isEditing ? 'ID kan niet gewijzigd worden.' : 'Dit ID wordt intern gebruikt.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label (Publieke Titel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Bijv. Dagelijkse Coaching E-mails" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Omschrijving (optioneel)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Korte uitleg van de feature..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAudience"
              render={() => (
                <FormItem>
                  <FormLabel>Doelgroep(en)</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {targetAudienceOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {item.label}
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categorie (optioneel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Bijv. Coaching, Tools, Rapportage" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">Helpt bij het groeperen van features.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Annuleren
            </Button>
          </DialogClose>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
            {isEditing ? 'Wijzigingen Opslaan' : 'Feature Toevoegen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
