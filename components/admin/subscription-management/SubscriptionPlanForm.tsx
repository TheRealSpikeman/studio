
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PlusCircle, ArrowLeft, Save, Euro, Info, Edit, Users, Percent, ListChecks, HelpCircle, CheckSquare, XSquare, Users2, BookOpenCheck, Brain, Zap, ShieldCheck, Package, CaseLower } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSubscriptionPlans, saveSubscriptionPlans, getAllFeatures, type SubscriptionPlan, type AppFeature, type TargetAudience } from '@/types/subscription';


const planFormSchema = z.object({
  id: z.string().min(3, { message: "Plan ID moet minimaal 3 tekens bevatten (bijv. 'gezins_gids_jaar')." }).regex(/^[a-z0-9_]+$/, "ID mag alleen kleine letters, cijfers en underscores bevatten."),
  name: z.string().min(3, { message: "Plannaam moet minimaal 3 tekens bevatten." }),
  description: z.string().min(10, { message: "Beschrijving moet minimaal 10 tekens bevatten." }),
  price: z.coerce.number().min(0, { message: "Prijs moet 0 of hoger zijn." }),
  currency: z.string().length(3, { message: "Valuta code moet 3 tekens zijn (bijv. EUR)." }).default("EUR"),
  billingInterval: z.enum(['month', 'year', 'once'], { required_error: "Selecteer een facturatie-interval." }),
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
    setAllAppFeatures(getAllFeatures());
  }, []);

  const defaultFeatureAccess: Record<string, boolean> = {};
  allAppFeatures.forEach(feature => {
    defaultFeatureAccess[feature.id] = false; 
  });

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: !isNew && initialData ? {
      ...initialData,
      featureAccess: initialData.featureAccess || defaultFeatureAccess,
    } : {
      id: "",
      name: "",
      description: "",
      price: 0,
      currency: "EUR",
      billingInterval: undefined,
      featureAccess: defaultFeatureAccess,
      active: true,
      trialPeriodDays: 0,
      isPopular: false,
    },
  });

  useEffect(() => {
    if (isNew && allAppFeatures.length > 0) {
      const initialAccess: Record<string, boolean> = {};
      allAppFeatures.forEach(feature => {
        initialAccess[feature.id] = false; 
      });
      form.reset({
        ...form.getValues(), 
        featureAccess: initialAccess,
      });
    }
    if (!isNew && initialData) {
        form.reset(initialData);
    }
  }, [allAppFeatures, isNew, initialData, form]);


  const handleSelectAllFeatures = (select: boolean) => {
    allAppFeatures.forEach(feature => {
      form.setValue(`featureAccess.${feature.id}`, select);
    });
  };

  const onSubmit = (data: PlanFormData) => {
    const planToSave: SubscriptionPlan = { ...initialData, ...data };

    try {
      const existingPlans = getSubscriptionPlans();
      let updatedPlans: SubscriptionPlan[];
      
      if (!isNew && initialData) {
        updatedPlans = existingPlans.map(p => p.id === initialData.id ? planToSave : p);
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
        updatedPlans = [...existingPlans, planToSave];
        toast({
          title: "Abonnement Aangemaakt",
          description: `Het abonnement "${planToSave.name}" is aangemaakt.`,
        });
      }
      saveSubscriptionPlans(updatedPlans);
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
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              control={form.control} 
              name="id" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uniek Plan ID</FormLabel>
                  <FormControl><Input placeholder="bijv. coaching_maandelijks" {...field} disabled={!isNew} /></FormControl>
                  <FormDescription className="text-xs">
                    Gebruik kleine letters, cijfers, underscores. {!isNew ? 'ID kan niet gewijzigd worden na aanmaken.' : 'Dit ID wordt gebruikt in de URL en kan later niet meer gewijzigd worden.'}
                  </FormDescription>
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
                            Voer de totale prijs in voor het interval (bv. jaarprijs voor jaarlijks plan).
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} 
            />
            <FormField control={form.control} name="currency" render={({ field }) => (<FormItem><FormLabel>Valuta</FormLabel><FormControl><Input placeholder="EUR" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="billingInterval" render={({ field }) => (
                <FormItem>
                  <FormLabel>Facturatie Interval</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
              name="trialPeriodDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><Percent className="h-4 w-4"/>Proefperiode (dagen)</FormLabel>
                  <FormControl><Input type="number" min="0" placeholder="Bijv. 14" {...field} /></FormControl>
                  <FormDescription className="text-xs">Aantal dagen gratis proefperiode. Voer 0 in voor geen proefperiode.</FormDescription>
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
                                    <Checkbox
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
