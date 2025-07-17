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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PlusCircle, ArrowLeft, Save, Euro, Info, Edit, Users, Percent, ListChecks, HelpCircle, CheckSquare, XSquare, Package } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSubscriptionPlanById, saveSubscriptionPlan, getAllFeatures, type SubscriptionPlan, type AppFeature, type TargetAudience, createSubscriptionPlan } from '@/types/subscription';
import { Switch } from "@/components/ui/switch";


const planFormSchema = z.object({
  id: z.string().min(3, { message: "Plan ID moet minimaal 3 tekens bevatten (bijv. 'gezins_gids_jaar')." }).regex(/^[a-z0-9_]+$/, "ID mag alleen kleine letters, cijfers en underscores bevatten."),
  name: z.string().min(3, { message: "Plannaam moet minimaal 3 tekens bevatten." }),
  description: z.string().min(10, { message: "Beschrijving moet minimaal 10 tekens bevatten." }),
  
  price: z.coerce.number().min(0, { message: "Prijs moet 0 of hoger zijn." }), // Total monthly price
  yearlyDiscountPercent: z.coerce.number().min(0).max(100, "Korting moet tussen 0 en 100 zijn.").optional(),

  currency: z.string().length(3, { message: "Valuta code moet 3 tekens zijn (bijv. EUR)." }).default("EUR"),
  
  maxParents: z.coerce.number().int().min(0, "Aantal ouders moet 0 of meer zijn.").optional(),
  maxChildren: z.coerce.number().int().min(0, "Aantal kinderen moet 0 of meer zijn.").optional(),
  
  featureAccess: z.record(z.boolean()), 
  active: z.boolean().default(true),
  trialPeriodDays: z.coerce.number().int().min(0, "Proefperiode moet 0 of meer dagen zijn.").optional(),
  isPopular: z.boolean().default(false),
});

export type PlanFormData = z.infer<typeof planFormSchema>;

interface SubscriptionPlanFormProps {
  initialData?: SubscriptionPlan; 
  isNew: boolean;
}

const getAudienceBadgeVariant = (audience: TargetAudience): "default" | "secondary" | "outline" => {
  switch (audience) {
    case 'leerling': return 'default'; 
    case 'ouder': return 'secondary';
    case 'tutor': return 'default';
    case 'coach': return 'secondary';
    case 'platform': return 'outline';
    case 'beide': return 'outline'; 
    default: return 'outline';
  }
};
const getAudienceBadgeClasses = (audience: TargetAudience): string => {
  switch (audience) {
    case 'leerling': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'ouder': return 'bg-green-100 text-green-700 border-green-300';
    case 'tutor': return 'bg-violet-100 text-violet-700 border-violet-300';
    case 'coach': return 'bg-cyan-100 text-cyan-700 border-cyan-300';
    case 'platform': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'beide': return 'bg-purple-100 text-purple-700 border-purple-300';
    default: return '';
  }
};

export function SubscriptionPlanForm({ initialData, isNew }: SubscriptionPlanFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [allAppFeatures, setAllAppFeatures] = useState<AppFeature[]>([]);

  useEffect(() => {
    async function fetchFeatures() {
        const features = await getAllFeatures();
        setAllAppFeatures(features);
    }
    fetchFeatures();
  }, []);

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      id: "", name: "", description: "", price: 0, yearlyDiscountPercent: 0,
      currency: "EUR", maxParents: 0, maxChildren: 0, featureAccess: {}, active: true, trialPeriodDays: 0, isPopular: false,
    }
  });
  
  useEffect(() => {
    if (initialData) {
        form.reset({
            ...initialData,
            yearlyDiscountPercent: initialData.yearlyDiscountPercent ?? 0,
            maxParents: initialData.maxParents ?? 0,
            maxChildren: initialData.maxChildren ?? 0,
            trialPeriodDays: initialData.trialPeriodDays ?? 0,
        });
    } else {
        const defaultFeatureAccess: Record<string, boolean> = {};
        allAppFeatures.forEach(feature => {
            defaultFeatureAccess[feature.id] = false;
        });
        form.reset({
            id: "", name: "", description: "", price: 15.00, yearlyDiscountPercent: 15,
            currency: "EUR", maxParents: 2, maxChildren: 1, featureAccess: defaultFeatureAccess, 
            active: true, trialPeriodDays: 14, isPopular: false,
        });
    }
  }, [initialData, allAppFeatures, form]);


  const handleSelectAllFeatures = (select: boolean) => {
    allAppFeatures.forEach(feature => {
      form.setValue(`featureAccess.${feature.id}`, select);
    });
  };

  const onSubmit = async (data: PlanFormData) => {
    const planToSave: Omit<SubscriptionPlan, 'id'> & { id?: string } = {
      ...initialData,
      ...data,
      billingInterval: 'month', // We only support monthly for now
      maxParents: data.maxParents ?? 0, 
      maxChildren: data.maxChildren ?? 0, 
    };

    try {
      if (isNew) {
        if (!planToSave.id) {
             toast({ title: "Fout", description: "Plan ID is vereist.", variant: "destructive" });
             return;
        }
        await createSubscriptionPlan(planToSave as SubscriptionPlan);
        toast({ title: "Abonnement Aangemaakt", description: `Het abonnement "${planToSave.name}" is aangemaakt.` });
      } else {
        if (!initialData?.id) return;
        await saveSubscriptionPlan(initialData.id, planToSave);
        toast({ title: "Abonnement Bijgewerkt", description: `Het abonnement "${planToSave.name}" is bijgewerkt.` });
      }
      router.push('/dashboard/admin/subscription-management');
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
                {isNew ? 'Nieuw Abonnementsplan Toevoegen' : 'Abonnement Bewerken'}
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
              <FormField 
                control={form.control} 
                name="id" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uniek Plan ID</FormLabel>
                    <FormControl><Input placeholder="bijv. coaching_maandelijks" {...field} disabled={!isNew} /></FormControl>
                    <FormDescription className="text-xs">
                      Gebruik kleine letters, cijfers, underscores. {!isNew ? 'ID kan niet gewijzigd worden na aanmaken.' : 'Dit ID wordt intern gebruikt en kan later niet meer gewijzigd worden.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Plannaam (Publiek)</FormLabel><FormControl><Input placeholder="Bijv. Coaching & Tools - Maandelijks" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Korte Beschrijving</FormLabel><FormControl><Textarea placeholder="Korte omschrijving van het plan en de voordelen..." {...field} rows={2} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Euro className="h-5 w-5 text-primary"/>Prijs & Limieten</CardTitle>
             <CardDescription>Definieer de prijzen, limieten en een eventuele jaarkorting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Totale Prijs per Maand</FormLabel><div className="relative"><Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><FormControl><Input type="number" step="0.01" placeholder="15.00" {...field} value={field.value || ''} className="pl-8" /></FormControl></div><FormMessage /></FormItem>)} />
               <FormField control={form.control} name="yearlyDiscountPercent" render={({ field }) => (<FormItem><FormLabel>Jaarkorting (%)</FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><FormControl><Input type="number" min="0" max="100" placeholder="15" {...field} value={field.value || ''} className="pl-8"/></FormControl></div><FormMessage /></FormItem>)} />
               <FormField control={form.control} name="trialPeriodDays" render={({ field }) => (<FormItem><FormLabel>Proefperiode (dagen)</FormLabel><div className="relative"><Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><FormControl><Input type="number" min="0" placeholder="14" {...field} value={field.value || ''} className="pl-8"/></FormControl></div><FormMessage /></FormItem>)} />
               <FormField control={form.control} name="maxParents" render={({ field }) => (<FormItem><FormLabel>Max. Ouders</FormLabel><FormControl><Input type="number" min="0" placeholder="1" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
               <FormField control={form.control} name="maxChildren" render={({ field }) => (<FormItem><FormLabel>Max. Kinderen</FormLabel><FormControl><Input type="number" min="0" placeholder="1" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="currency" render={({ field }) => (<FormItem className="hidden"><FormControl><Input placeholder="EUR" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Opties</CardTitle>
          </CardHeader>
           <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <FormLabel className="cursor-pointer text-sm pr-2">Plan Actief?</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <FormLabel className="cursor-pointer text-sm pr-2">Markeer als 'Populair'?</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary"/>Configureer Features voor dit Abonnement</CardTitle>
                <CardDescription>Vink aan welke features in dit abonnement inbegrepen zijn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex gap-2 mb-4">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleSelectAllFeatures(true)}>
                        <CheckSquare className="mr-2 h-4 w-4" /> Selecteer Alles
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleSelectAllFeatures(false)}>
                        <XSquare className="mr-2 h-4 w-4" /> Deselecteer Alles
                    </Button>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
                    {allAppFeatures.map((feature) => (
                        <FormField
                        key={feature.id}
                        control={form.control}
                        name={`featureAccess.${feature.id}`}
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-2.5 py-2.5 border-b border-border/30 last:border-b-0">
                                <FormControl className="mt-1">
                                    <Switch
                                        checked={!!field.value} 
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-0.5">
                                    <FormLabel className="text-sm font-medium leading-tight cursor-pointer">
                                        {feature.label}
                                    </FormLabel>
                                    {feature.description && (
                                        <FormDescription className="text-xs text-muted-foreground leading-tight">
                                            {feature.description}
                                        </FormDescription>
                                    )}
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {feature.targetAudience.map(audience => (
                                            <Badge 
                                                key={audience} 
                                                variant={getAudienceBadgeVariant(audience)} 
                                                className={cn("text-[10px] px-1.5 py-0 leading-tight", getAudienceBadgeClasses(audience))}
                                            >
                                                {audience.charAt(0).toUpperCase() + audience.slice(1)}
                                            </Badge>
                                        ))}
                                        {feature.category && <Badge variant="outline" className="text-[10px] px-1.5 py-0 leading-tight">{feature.category}</Badge>}
                                    </div>
                                </div>
                            </FormItem>
                        )}
                        />
                    ))}
                 </div>
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
