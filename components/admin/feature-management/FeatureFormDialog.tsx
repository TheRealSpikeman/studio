
// src/components/admin/feature-management/FeatureFormDialog.tsx
"use client";

import { useEffect, useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { type AppFeature, type SubscriptionPlan, type TargetAudience } from '@/types/subscription';

const targetAudienceOptions: { id: TargetAudience; label: string }[] = [
  { id: 'leerling', label: 'Leerling' },
  { id: 'ouder', label: 'Ouder' },
  { id: 'tutor', label: 'Tutor' },
  { id: 'coach', label: 'Coach' },
  { id: 'platform', label: 'Platform (algemeen)' },
  { id: 'beide', label: 'Beide (Leerling & Ouder)' },
];

const featureFormSchema = z.object({
  id: z.string().min(3, { message: "Feature ID moet minimaal 3 tekens bevatten (bijv. 'dailyCoaching')." }).regex(/^[a-zA-Z0-9-_]+$/, "ID mag alleen letters, cijfers, streepjes en underscores bevatten."),
  label: z.string().min(3, { message: "Label (titel) moet minimaal 3 tekens bevatten." }),
  description: z.string().optional(),
  targetAudience: z.array(z.custom<TargetAudience>()).min(1, { message: "Selecteer minimaal één doelgroep." }),
  category: z.string().optional(),
  isRecommendedTool: z.boolean().optional(),
  linkedPlans: z.array(z.string()).optional(), 
});

export type FeatureFormData = z.infer<typeof featureFormSchema>;

interface FeatureFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  feature: AppFeature | null;
  onSave: (data: FeatureFormData) => void;
  allSubscriptionPlans: SubscriptionPlan[];
}

export function FeatureFormDialog({ isOpen, onOpenChange, feature, onSave, allSubscriptionPlans }: FeatureFormDialogProps) {
  
  const form = useForm<FeatureFormData>({
    resolver: zodResolver(featureFormSchema),
    defaultValues: {
      id: "",
      label: "",
      description: "",
      targetAudience: ['leerling'],
      category: "",
      isRecommendedTool: false,
      linkedPlans: [],
    },
  });

  const isEditing = !!feature;

  useEffect(() => {
    if (isOpen) {
      let initialLinkedPlans: string[] = [];
      if (feature) { 
        initialLinkedPlans = allSubscriptionPlans
          .filter(plan => plan.featureAccess && plan.featureAccess[feature.id])
          .map(plan => plan.id);
        
        form.reset({
          id: feature.id,
          label: feature.label,
          description: feature.description || "",
          targetAudience: feature.targetAudience,
          category: feature.category || "",
          isRecommendedTool: feature.isRecommendedTool || false,
          linkedPlans: initialLinkedPlans,
        });
      } else { 
        form.reset({
          id: "",
          label: "",
          description: "",
          targetAudience: ['leerling'],
          category: "",
          isRecommendedTool: false,
          linkedPlans: [],
        });
      }
    }
  }, [feature, isOpen, form, allSubscriptionPlans]);

  const onSubmit = (values: FeatureFormData) => {
    onSave(values);
  };

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="max-h-[60vh] pr-5">
              <div className="space-y-4 py-2">
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
                <FormField
                    control={form.control}
                    name="isRecommendedTool"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Aanbevolen Tool?</FormLabel>
                                <FormDescription>
                                    Markeer dit als een aanbevolen tool op de resultatenpagina.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="linkedPlans"
                  render={() => (
                    <FormItem className="pt-2">
                      <FormLabel className="font-semibold">Koppel aan Abonnementen</FormLabel>
                      <FormDescription className="text-xs">
                        Selecteer aan welke actieve abonnementen deze feature direct gekoppeld moet zijn.
                      </FormDescription>
                      <ScrollArea className="h-48 w-full rounded-md border p-3 mt-1">
                        <div className="space-y-2">
                          {allSubscriptionPlans.length > 0 ? allSubscriptionPlans.map((plan) => (
                            <FormField
                              key={plan.id}
                              control={form.control}
                              name="linkedPlans"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0 hover:bg-muted/50 p-1.5 rounded-sm">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(plan.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), plan.id])
                                          : field.onChange((field.value || []).filter(value => value !== plan.id));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer flex-1">
                                    {plan.name} <span className="text-xs text-muted-foreground">({plan.shortName || plan.id})</span>
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          )) : (
                            <p className="text-xs text-muted-foreground text-center py-4">Geen actieve abonnementen gevonden om aan te koppelen.</p>
                          )}
                        </div>
                      </ScrollArea>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4 mt-2 border-t">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Annuleren
                </Button>
              </DialogClose>
              <Button type="submit">
                {isEditing ? 'Wijzigingen Opslaan' : 'Feature Toevoegen'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
