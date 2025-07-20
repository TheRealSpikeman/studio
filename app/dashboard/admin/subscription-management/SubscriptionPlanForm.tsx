// src/components/admin/subscription-management/SubscriptionPlanForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PlusCircle, ArrowLeft, Save, Euro, Info, Edit, Percent } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { SubscriptionPlan, AppFeature } from '@/types/subscription';
import { createSubscriptionPlan, updateSubscriptionPlan } from '@/services/subscriptionService';


const planFormSchema = z.object({
  id: z.string().min(3, { message: "Plan ID moet minimaal 3 tekens bevatten (bijv. 'gezins_gids_jaar')." }).regex(/^[a-z0-9_]+$/, "ID mag alleen kleine letters, cijfers en underscores bevatten."),
  name: z.string().min(3, { message: "Plannaam moet minimaal 3 tekens bevatten." }),
  shortName: z.string().optional(),
  description: z.string().min(10, { message: "Beschrijving moet minimaal 10 tekens bevatten." }),
  tagline: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Prijs moet 0 of hoger zijn." }),
  yearlyDiscountPercent: z.coerce.number().min(0).max(100, "Korting moet tussen 0 en 100 zijn.").optional(),
  maxParents: z.coerce.number().int().min(0, "Aantal ouders moet 0 of meer zijn.").optional(),
  maxChildren: z.coerce.number().int().min(0, "Aantal kinderen moet 0 of meer zijn.").optional(),
  active: z.boolean().default(true),
  trialPeriodDays: z.coerce.number().int().min(0, "Proefperiode moet 0 of meer dagen zijn.").optional(),
  isPopular: z.boolean().default(false),
});

export type PlanFormData = z.infer<typeof planFormSchema>;

interface SubscriptionPlanFormProps {
  initialData?: SubscriptionPlan; 
  isNew: boolean;
}

export function SubscriptionPlanForm({ initialData, isNew }: SubscriptionPlanFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      id: "", name: "", shortName: "", description: "", tagline: "", price: 0, yearlyDiscountPercent: 0,
      maxParents: 0, maxChildren: 0, active: true, trialPeriodDays: 0, isPopular: false,
    }
  });
  
  useEffect(() => {
    if (initialData) {
        form.reset({
            ...initialData,
            price: initialData.price || 0,
            yearlyDiscountPercent: initialData.yearlyDiscountPercent ?? 0,
            maxParents: initialData.maxParents ?? 0,
            maxChildren: initialData.maxChildren ?? 0,
            trialPeriodDays: initialData.trialPeriodDays ?? 0,
        });
    } else {
        form.reset({
            id: "", name: "", shortName: "", description: "", tagline: "", price: 15.00, yearlyDiscountPercent: 10,
            maxParents: 2, maxChildren: 1, active: true, trialPeriodDays: 14, isPopular: false,
        });
    }
  }, [initialData, form]);

  const onSubmit = async (data: PlanFormData) => {
    // Note: featureAccess is no longer part of the form or data model
    const planToSave: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt' | 'featureAccess'> & { id?: string } = {
      ...initialData,
      ...data,
      billingInterval: 'month', // All prices are defined as monthly now
      currency: 'EUR',
    };

    try {
      if (isNew) {
        if (!planToSave.id) {
             toast({ title: "Fout", description: "Plan ID is vereist.", variant: "destructive" });
             return;
        }
        await createSubscriptionPlan(planToSave as Omit<SubscriptionPlan, 'createdAt' | 'updatedAt' | 'featureAccess'>);
        toast({ title: "Abonnement Aangemaakt", description: `Het abonnement "${planToSave.name}" is aangemaakt.` });
      } else {
        if (!initialData?.id) return;
        await updateSubscriptionPlan(initialData.id, planToSave);
        toast({ title: "Abonnement Bijgewerkt", description: `Het abonnement "${planToSave.name}" is bijgewerkt.` });
      }
      router.push('/dashboard/admin/subscription-management');
      router.refresh();
    } catch (error) {
      toast({ title: "Opslaan Mislukt", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                {isNew ? <PlusCircle className="h-8 w-8 text-primary" /> : <Edit className="h-8 w-8 text-primary" />}
                {isNew ? 'Nieuw Abonnementsplan' : 'Abonnement Bewerken'}
            </h1>
            <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/admin/subscription-management">
                <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Overzicht
                </Link>
            </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Plan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField name="id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uniek Plan ID</FormLabel>
                    <FormControl><Input placeholder="bijv. gezin_1_kind" {...field} disabled={!isNew} /></FormControl>
                    <FormDescription className="text-xs">
                      Gebruik kleine letters, cijfers, underscores. {!isNew && 'Kan niet gewijzigd worden.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField name="name" render={({ field }) => (<FormItem><FormLabel>Plannaam (Publiek)</FormLabel><FormControl><Input placeholder="Bijv. Gezins Gids" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField name="shortName" render={({ field }) => (<FormItem><FormLabel>Korte Naam</FormLabel><FormControl><Input placeholder="Bijv. 1 Kind" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="tagline" render={({ field }) => (<FormItem><FormLabel>Tagline (optioneel)</FormLabel><FormControl><Input placeholder="Beste voor startende gezinnen" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField name="description" render={({ field }) => (<FormItem><FormLabel>Beschrijving</FormLabel><FormControl><Textarea placeholder="Leg uit voor wie dit plan is..." {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Euro className="h-5 w-5 text-primary"/>Prijs & Limieten</CardTitle>
             <CardDescription>Definieer de prijzen, limieten en een eventuele jaarkorting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <FormField name="price" render={({ field }) => (<FormItem><FormLabel>Prijs per Maand</FormLabel><div className="relative"><Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><FormControl><Input type="number" step="0.01" placeholder="15.00" {...field} value={field.value || ''} className="pl-8" /></FormControl></div><FormMessage /></FormItem>)} />
               <FormField name="yearlyDiscountPercent" render={({ field }) => (<FormItem><FormLabel>Jaarkorting (%)</FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><FormControl><Input type="number" min="0" max="100" placeholder="10" {...field} value={field.value || ''} className="pl-8"/></FormControl></div><FormMessage /></FormItem>)} />
               <FormField name="trialPeriodDays" render={({ field }) => (<FormItem><FormLabel>Proefperiode (dagen)</FormLabel><FormControl><Input type="number" min="0" placeholder="14" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>)} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField name="maxParents" render={({ field }) => (<FormItem><FormLabel>Max. Ouders</FormLabel><FormControl><Input type="number" min="0" placeholder="2" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
               <FormField name="maxChildren" render={({ field }) => (<FormItem><FormLabel>Max. Kinderen</FormLabel><FormControl><Input type="number" min="0" placeholder="1" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Plan Status</CardTitle>
            </CardHeader>
             <CardContent className="space-y-6">
                <FormField control={form.control} name="active" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5"><FormLabel className="text-base cursor-pointer">Actief?</FormLabel><FormDescription>Actieve plannen zijn zichtbaar voor nieuwe klanten.</FormDescription></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isPopular" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5"><FormLabel className="text-base cursor-pointer">Populair?</FormLabel><FormDescription>Markeer dit plan als 'Meest Gekozen'.</FormDescription></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
            </CardContent>
        </Card>

        <CardFooter className="flex justify-end gap-3 pt-8 border-t">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save className="mr-2 h-4 w-4" /> {isNew ? 'Abonnement Opslaan' : 'Abonnement Bijwerken'}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
