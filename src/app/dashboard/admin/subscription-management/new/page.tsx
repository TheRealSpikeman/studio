// src/app/dashboard/admin/subscription-management/new/page.tsx
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PlusCircle, ArrowLeft, Save, Euro, Info, Edit, Users } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { SubscriptionPlan } from "../page"; 

const planFormSchema = z.object({
  id: z.string().min(3, { message: "Plan ID moet minimaal 3 tekens bevatten (bijv. 'gezins_gids_jaar')." }).regex(/^[a-z0-9_]+$/, "ID mag alleen kleine letters, cijfers en underscores bevatten."),
  name: z.string().min(3, { message: "Plannaam moet minimaal 3 tekens bevatten." }),
  description: z.string().min(10, { message: "Beschrijving moet minimaal 10 tekens bevatten." }),
  price: z.coerce.number().min(0, { message: "Prijs moet 0 of hoger zijn." }),
  currency: z.string().length(3, { message: "Valuta code moet 3 tekens zijn (bijv. EUR)." }).default("EUR"),
  billingInterval: z.enum(['month', 'year', 'once'], { required_error: "Selecteer een facturatie-interval." }),
  features: z.string().min(1, { message: "Voeg minimaal één feature toe (één per regel)." }),
  active: z.boolean().default(true),
  maxChildren: z.coerce.number().int().min(0, "Aantal kinderen mag niet negatief zijn.").optional(),
  isPopular: z.boolean().default(false),
});

export type PlanFormData = z.infer<typeof planFormSchema>;

interface NewSubscriptionPlanPageProps {
  planData?: SubscriptionPlan; // Optional for editing
}

export default function NewSubscriptionPlanPage({ planData }: NewSubscriptionPlanPageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = !!planData;

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: isEditMode && planData ? {
      ...planData,
      features: planData.features.join('\n'),
      maxChildren: planData.maxChildren ?? 0,
      isPopular: planData.isPopular ?? false,
    } : {
      id: "",
      name: "",
      description: "",
      price: 0,
      currency: "EUR",
      billingInterval: undefined,
      features: "",
      active: true,
      maxChildren: 0,
      isPopular: false,
    },
  });

  const onSubmit = (data: PlanFormData) => {
    const planToSave: SubscriptionPlan = {
      ...data,
      features: data.features.split('\n').map(f => f.trim()).filter(f => f.length > 0),
      maxChildren: data.maxChildren,
      isPopular: data.isPopular,
    };

    try {
      const existingPlansRaw = localStorage.getItem('subscriptionPlans');
      let existingPlans: SubscriptionPlan[] = existingPlansRaw ? JSON.parse(existingPlansRaw) : [];
      
      if (isEditMode && planData) {
        existingPlans = existingPlans.map(p => p.id === planData.id ? planToSave : p);
         toast({
          title: "Abonnement Bijgewerkt",
          description: `Het abonnement "${planToSave.name}" is bijgewerkt.`,
        });
      } else {
        if (existingPlans.some(p => p.id === planToSave.id)) {
          toast({
            title: "Fout bij opslaan",
            description: `Een abonnement met ID "${planToSave.id}" bestaat al. Kies een uniek ID.`,
            variant: "destructive",
          });
          return;
        }
        existingPlans.push(planToSave);
        toast({
          title: "Abonnement Aangemaakt",
          description: `Het abonnement "${planToSave.name}" is aangemaakt.`,
        });
      }
      localStorage.setItem('subscriptionPlans', JSON.stringify(existingPlans));
    } catch (error) {
      console.error("Failed to save/update subscription plan in localStorage:", error);
       toast({
          title: "Opslagfout",
          description: "Kon het abonnement niet lokaal opslaan.",
          variant: "destructive",
        });
      return;
    }
    router.push('/dashboard/admin/subscription-management');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                {isEditMode ? <Edit className="h-8 w-8 text-primary" /> : <PlusCircle className="h-8 w-8 text-primary" />}
                {isEditMode ? 'Abonnement Bewerken' : 'Nieuw Abonnementsplan Toevoegen'}
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
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              control={form.control} 
              name="id" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uniek Plan ID</FormLabel>
                  <FormControl><Input placeholder="bijv. coaching_maandelijks" {...field} disabled={isEditMode} /></FormControl>
                  <FormDescription className="text-xs">{isEditMode ? 'ID kan niet gewijzigd worden.' : 'Gebruik kleine letters, cijfers, underscores.'}</FormDescription>
                  <FormMessage />
                </FormItem>
              )} 
            />
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Plannaam (Publiek)</FormLabel><FormControl><Input placeholder="Bijv. Coaching & Tools - Maandelijks" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Korte Beschrijving</FormLabel><FormControl><Textarea placeholder="Korte omschrijving van het plan en de voordelen..." {...field} rows={2} /></FormControl><FormMessage /></FormItem>)} />
            <FormField 
                control={form.control} 
                name="price" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prijs</FormLabel>
                        <div className="relative">
                            <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <FormControl><Input type="number" step="0.01" placeholder="3.99" {...field} className="pl-10" /></FormControl>
                        </div>
                        <FormDescription className="text-xs">
                            Voor maandelijkse plannen, voer de maandprijs in. Voor jaarlijkse plannen, voer de totale jaarprijs in (na eventuele korting).
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} 
            />
            <FormField control={form.control} name="currency" render={({ field }) => (<FormItem><FormLabel>Valuta</FormLabel><FormControl><Input placeholder="EUR" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="billingInterval" render={({ field }) => (
                <FormItem>
                  <FormLabel>Facturatie Interval</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecteer interval" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="month">Maandelijks</SelectItem>
                      <SelectItem value="year">Jaarlijks</SelectItem>
                      <SelectItem value="once">Eenmalig (bijv. voor gratis plan)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="maxChildren"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><Users className="h-4 w-4"/>Maximum Aantal Kinderen</FormLabel>
                  <FormControl><Input type="number" min="0" placeholder="0 voor geen limiet" {...field} /></FormControl>
                  <FormDescription className="text-xs">Typisch 1 voor individuele plannen, of 3-5 voor gezinsplannen. 0 betekent geen specifieke limiet (bijv. voor gratis plan).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="features" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Features (één per regel)</FormLabel>
                  <FormControl><Textarea placeholder="- Feature 1\n- Feature 2\n- Nog een feature" {...field} rows={5} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="active" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">Plan Actief?</FormLabel>
                    <FormDescription>Is dit abonnement momenteel selecteerbaar voor nieuwe gebruikers?</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField control={form.control} name="isPopular" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">Markeer als 'Populair' / 'Meest Gekozen'?</FormLabel>
                    <FormDescription>Dit plan wordt uitgelicht op de prijspagina.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end gap-3 pt-8 border-t">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save className="mr-2 h-4 w-4" /> {isEditMode ? 'Abonnement Bijwerken' : 'Abonnement Opslaan'}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
