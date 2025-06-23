
"use client";

import { useEffect, useState } from 'react';
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
import { ArrowLeft, BookOpen, UserPlus, Settings, BarChart3, CreditCard, Edit, Mail, School, Info, Cake, GraduationCap, Trash2, TrendingUp, Target, Users, Share2, Link2, HelpCircle, Sparkles, Star, CheckCircle2, ExternalLink, ScrollText, Compass, Percent, ListChecks, XCircle, Package, FileText as FileTextIcon } from 'lucide-react'; // Renamed FileText to FileTextIcon
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY = 'adminDashboard_SubscriptionPlans_v2';
export const LOCAL_STORAGE_FEATURES_KEY = 'adminDashboard_AppFeatures_v1';

// Definieer de mogelijke doelgroepen
export type TargetAudience = 'leerling' | 'ouder' | 'tutor' | 'coach' | 'platform' | 'beide';

// Subscription Plan Types & Zod Schema
const appFeatureSchema = z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().optional(),
    targetAudience: z.array(z.custom<TargetAudience>()),
    category: z.string().optional(),
    isRecommendedTool: z.boolean().optional(),
});
export type AppFeature = z.infer<typeof appFeatureSchema>;

const subscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string().optional(),
  description: z.string(),
  price: z.number(),
  currency: z.string(),
  billingInterval: z.enum(['month', 'year', 'once']),
  featureAccess: z.record(z.string(), z.boolean()).optional(), // Generic access control based on feature IDs
  active: z.boolean(),
  trialPeriodDays: z.number().optional(),
  maxChildren: z.number().optional(),
  isPopular: z.boolean().optional(),
  tagline: z.string().optional(),
});
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;

// Initial/Default App Features
export const DEFAULT_APP_FEATURES: AppFeature[] = [
    { id: 'startAssessment', label: 'Start Neurodivergentie Assessment', description: 'Toegang tot de eerste assessment.', targetAudience: ['leerling', 'ouder'], category: 'Onboarding', isRecommendedTool: true },
    { id: 'weeklyMotivationEmail', label: 'Wekelijkse motivatie email', description: 'Wekelijkse e-mails vol tips voor zelfreflectie', targetAudience: ['leerling'], category: 'Communicatie' },
    { id: 'basicReflectionToolLimited', label: 'Zelfreflectie Tools (basis, beperkt)', description: 'Basistools voor zelfreflectie', targetAudience: ['leerling'], category: 'Gratis Tier' },
    { id: 'allReflectionToolsUnlimited', label: 'Zelfreflectie Tools (alles, onbeperkt)', description: 'Toegang tot alle zelfreflectietools.', targetAudience: ['leerling'], category: 'Coaching' },
    { id: 'interactiveJournal', label: 'Interactief Dagboek', description: 'Interactief dagboek om ideeën te ordenen.', targetAudience: ['leerling'], category: 'Coaching', isRecommendedTool: true },
    { id: 'homeworkPlannerFocusTools', label: 'Huiswerk Planner & Focus Tools', description: 'Tools om huiswerk te plannen en beter te focussen.', targetAudience: ['leerling'], category: 'Tools', isRecommendedTool: true },
    { id: 'motivationTracking', label: 'Motivatie Tracker', description: 'Tool om persoonlijke motivatie te monitoren.', targetAudience: ['leerling'], category: 'Tools' },
    { id: 'basicPdfOverview', label: 'PDF rapportages (basis)', description: 'PDF export van de assessment resultaten (basis).', targetAudience: ['leerling', 'ouder'], category: 'Gratis Tier' },
    { id: 'extensivePdfReports', label: 'PDF rapportages (uitgebreid)', description: 'PDF export van de assessment resultaten (uitgebreid).', targetAudience: ['leerling', 'ouder'], category: 'Rapportage' },
    { id: 'noProgressAnalytics', label: 'Geen voortgangsanalyse', description: 'Gebruikers kunnen voortgangsanalyse uitzetten', targetAudience: ['platform'], category: 'Privacy', adminOnly: true },
    { id: 'childProgressTracking', label: 'Kind voortgang volgen', description: 'Voortgang volgen van een kind.', targetAudience: ['ouder'], category: 'Ouder Dashboard' },
    { id: 'familyInsights', label: 'Familie inzichten', description: 'Inzichten over het hele gezin.', targetAudience: ['ouder'], category: 'Ouder Dashboard' },
    { id: 'communicationWithLinkedProfessionals', label: 'Communicatie met tutors/coaches', description: 'Direct communiceren met gekoppelde begeleiders.', targetAudience: ['ouder', 'leerling'], category: 'Communicatie' },
    { id: 'browseProfessionals', label: 'Browse Geregistreerde Professionals', description: 'Browse door geregistreerde professionals.', targetAudience: ['ouder'], category: 'Marktplaats' },
    { id: 'professionalRates', label: 'Inzien Tarieven Professionals', description: 'Inzien van de tarieven van geregistreerde professionals.', targetAudience: ['ouder'], category: 'Marktplaats' },
    { id: 'bookPaySessions', label: 'Sessie Boeken & Betalen', description: 'Mogelijkheid tot het boeken en betalen van sessies.', targetAudience: ['ouder'], category: 'Marktplaats' },
    { id: 'sessionPlanningReminders', label: 'Sessie Planning & Reminders', description: 'Sessie planning met automatische reminders.', targetAudience: ['ouder', 'leerling', 'tutor', 'coach'], category: 'Planning' },
    { id: 'aiPoweredInsights', label: 'AI gedreven inzichten', description: 'AI gedreven inzichten voor kind en ouder', targetAudience: ['leerling', 'ouder'], category: 'AI', isRecommendedTool: true },
    { id: 'exclusiveCoachingModules', label: 'Exclusive coaching modules', description: 'Exclusieve coaching modules', targetAudience: ['leerling'], category: 'Coaching' },
    { id: 'accountManagement', label: 'Accountbeheer', description: 'Toegang tot accountbeheer', targetAudience: ['platform'], category: 'Algemeen' },
    { id: 'max3ChildrenIncluded', label: 'Max 3 kinderen', description: 'Account heeft tot 3 kinderen', targetAudience: ['ouder'], category: 'Abonnementen' },
    { id: 'max4ChildrenIncluded', label: 'Max 4 kinderen', description: 'Account heeft tot 4 kinderen', targetAudience: ['ouder'], category: 'Abonnementen' },
    { id: 'yearlyDiscount15', label: '15% jaarkorting', description: '15% korting voor jaarabonnement', targetAudience: ['platform'], category: 'Abonnementen', adminOnly: true },
];

// Default Subscription Plans
const initialDefaultPlans: SubscriptionPlan[] = [ 
  {
    id: 'free_start', name: 'Gratis Start', shortName: 'Gratis', description: 'Basis zelfreflectie tool & PDF overzicht.', price: 0, currency: 'EUR', billingInterval: 'once',
    featureAccess: { 
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])), 
      startAssessment: true, basicReflectionToolLimited: true, basicPdfOverview: true, accountManagement: true,
    },
    active: true, trialPeriodDays: 0, maxChildren: 1, isPopular: false,
  },
  {
    id: 'family_guide_monthly', name: 'Gezins Gids - Maandelijks', shortName: 'Gezin M', description: 'Complete digitale ondersteuning voor het gezin.', price: 19.99, currency: 'EUR', billingInterval: 'month',
    featureAccess: {
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, 
      homeworkPlannerFocusTools: true, motivationTracking: true, extensivePdfReports: true,
      childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true,
      max3ChildrenIncluded: true, browseProfessionals: true, professionalRates: true, bookPaySessions: true, sessionPlanningReminders: true,
      aiPoweredInsights: true, exclusiveCoachingModules: true, 
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: true,
  },
   {
    id: 'family_guide_yearly', name: 'Gezins Gids - Jaarlijks', shortName: 'Gezin J', description: 'Complete digitale ondersteuning met jaarkorting.', price: 191.88, currency: 'EUR', billingInterval: 'year',
    featureAccess: {
       ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, false])),
      startAssessment: true, weeklyMotivationEmail: true, allReflectionToolsUnlimited: true, interactiveJournal: true, 
      homeworkPlannerFocusTools: true, motivationTracking: true, extensivePdfReports: true,
      childProgressTracking: true, familyInsights: true, communicationWithLinkedProfessionals: true, accountManagement: true,
      max3ChildrenIncluded: true, browseProfessionals: true, professionalRates: true, bookPaySessions: true, sessionPlanningReminders: true,
      yearlyDiscount15: true,
      aiPoweredInsights: true, exclusiveCoachingModules: true,
    },
    active: true, trialPeriodDays: 14, maxChildren: 3, isPopular: false,
  },
  {
    id: 'premium_family_monthly', name: 'Premium Plan - Maandelijks', shortName: 'Prem M', description: 'Alles van Gezins Gids, plus premium features en meer kinderen.', price: 39.99, currency: 'EUR', billingInterval: 'month',
    featureAccess: {
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, true])), 
      noProgressAnalytics: false, 
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false,
  },
  {
    id: 'premium_family_yearly', name: 'Premium Plan - Jaarlijks', shortName: 'Prem J', description: 'Alles van Premium Plan met jaarkorting.', price: 360.00, currency: 'EUR', billingInterval: 'year',
    featureAccess: {
      ...Object.fromEntries(DEFAULT_APP_FEATURES.map(f => [f.id, true])),
      noProgressAnalytics: false, 
      yearlyDiscount15: true, 
    },
    active: true, trialPeriodDays: 14, maxChildren: 4, isPopular: false,
  },
];

export default function SubscriptionManagementPage() {
    const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
    const [allAppFeatures, setAllAppFeatures] = useState<AppFeature[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        setIsLoading(true);
        const storedFeaturesRaw = localStorage.getItem(LOCAL_STORAGE_FEATURES_KEY);
        let loadedFeatures = DEFAULT_APP_FEATURES;
        if (storedFeaturesRaw) {
          try {
            loadedFeatures = JSON.parse(storedFeaturesRaw);
          } catch (e) {
            console.error("Error parsing features from localStorage, using defaults", e);
            localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(DEFAULT_APP_FEATURES));
          }
        } else {
          localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(DEFAULT_APP_FEATURES));
        }
        setAllAppFeatures(loadedFeatures);

        const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
        let loadedPlans: SubscriptionPlan[] = [];

        const ensureFullFeatureAccess = (plan: SubscriptionPlan): SubscriptionPlan => {
            const migratedFeatureAccess: Record<string, boolean> = {};
            loadedFeatures.forEach(appFeature => {
                migratedFeatureAccess[appFeature.id] = (plan.featureAccess && typeof plan.featureAccess[appFeature.id] === 'boolean')
                ? plan.featureAccess[appFeature.id]
                : false;
            });
            return {
                ...plan,
                shortName: plan.shortName ?? '',
                featureAccess: migratedFeatureAccess,
                trialPeriodDays: plan.trialPeriodDays ?? (plan.price === 0 ? 0 : 14),
                maxChildren: plan.maxChildren ?? (plan.id.includes('family_guide') ? 3 : (plan.price === 0 ? 1 : 0)),
                isPopular: plan.isPopular ?? false,
                tagline: plan.tagline ?? '',
            };
        };

        if (storedPlansRaw) {
          try {
            const parsedPlans: SubscriptionPlan[] = JSON.parse(storedPlansRaw);
            loadedPlans = parsedPlans.map(ensureFullFeatureAccess);
          } catch (e) {
            console.error("Error parsing plans from localStorage, using defaults", e);
            loadedPlans = initialDefaultPlans.map(ensureFullFeatureAccess);
            localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(initialDefaultPlans));
          }
        } else {
          loadedPlans = initialDefaultPlans.map(ensureFullFeatureAccess);
          localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(initialDefaultPlans));
        }

        setAvailablePlans(loadedPlans);
        setIsLoading(false);
    }, []);

    const handleSavePlans = (updatedPlans: SubscriptionPlan[]) => {
        localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(updatedPlans));
        setAvailablePlans(updatedPlans);
        toast({
            title: "Plannen Opgeslagen",
            description: "De wijzigingen zijn opgeslagen in de lokale storage.",
        });
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Abonnement Beheer (Admin)</h1>
            <p className="mb-4">Hier kunt u de abonnementen en bijbehorende features beheren. Wijzigingen worden opgeslagen in de lokale storage.</p>
            {isLoading ? (
                <div>Laden...</div>
            ) : (
                <SubscriptionPlanList plans={availablePlans} allAppFeatures={allAppFeatures} onSave={handleSavePlans} />
            )}
        </div>
    );
}

interface SubscriptionPlanListProps {
    plans: SubscriptionPlan[];
    allAppFeatures: AppFeature[];
    onSave: (updatedPlans: SubscriptionPlan[]) => void;
}

function SubscriptionPlanList({ plans, allAppFeatures, onSave }: SubscriptionPlanListProps) {
    const [editablePlanId, setEditablePlanId] = useState<string | null>(null);

    const handleEditPlan = (planId: string) => {
        setEditablePlanId(planId);
    };

    const handleCancelEdit = () => {
        setEditablePlanId(null);
    };

    const handleSavePlan = (updatedPlan: SubscriptionPlan) => {
        const updatedPlans = plans.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan);
        onSave(updatedPlans);
        setEditablePlanId(null);
    };

    return (
        <div className="space-y-4">
            {plans.map(plan => (
                <div key={plan.id} className="border rounded-md p-4">
                    {editablePlanId === plan.id ? (
                        <SubscriptionPlanEditForm plan={plan} allAppFeatures={allAppFeatures} onSave={handleSavePlan} onCancel={handleCancelEdit} />
                    ) : (
                        <>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                                    <p className="text-muted-foreground">{plan.description}</p>
                                </div>
                                <div>
                                    <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan.id)}>
                                        <Edit className="mr-2 h-4 w-4" /> Bewerken
                                    </Button>
                                </div>
                            </div>
                            <ul className="list-disc list-inside text-sm">
                                {DEFAULT_APP_FEATURES.filter(feature => plan.featureAccess && plan.featureAccess[feature.id]).map(feature => (
                                    <li key={feature.id}>{feature.label}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

interface SubscriptionPlanEditFormProps {
    plan: SubscriptionPlan;
    allAppFeatures: AppFeature[];
    onSave: (updatedPlan: SubscriptionPlan) => void;
    onCancel: () => void;
}

function SubscriptionPlanEditForm({ plan, allAppFeatures, onSave, onCancel }: SubscriptionPlanEditFormProps) {
    const form = useForm<SubscriptionPlan>({
        resolver: zodResolver(subscriptionPlanSchema),
        defaultValues: plan,
        mode: "onChange"
    });

    const { handleSubmit } = form;

    const onSubmit = (data: SubscriptionPlan) => {
        onSave(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Naam</FormLabel>
                            <FormControl>
                                <Input placeholder="Naam" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="shortName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Korte naam</FormLabel>
                            <FormControl>
                                <Input placeholder="Korte naam" {...field} />
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
                            <FormLabel>Beschrijving</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Beschrijving" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prijs</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Prijs" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Valuta</FormLabel>
                            <FormControl>
                                <Input placeholder="Valuta" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="billingInterval"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Factuur Interval</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="month">Maandelijks</SelectItem>
                                    <SelectItem value="year">Jaarlijks</SelectItem>
                                    <SelectItem value="once">Eenmalig</SelectItem>
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
                            <FormLabel>Trial dagen</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Trial dagen" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="maxChildren"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Maximum aantal kinderen</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Maximum aantal kinderen" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isPopular"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Populair</FormLabel>
                                <FormDescription>Is dit een populair abonnement?</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Actief</FormLabel>
                                <FormDescription>Is dit abonnement actief?</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div>
                    <FormLabel>Feature Toegang</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {allAppFeatures.map((feature) => (
                            <FormField
                                key={feature.id}
                                control={form.control}
                                name={`featureAccess.${feature.id}`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 rounded-md border p-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={plan.featureAccess ? !!plan.featureAccess[feature.id] : false}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">{feature.label}</FormLabel>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="ghost" onClick={onCancel}>
                        Annuleren
                    </Button>
                    <Button type="submit">
                        Opslaan
                    </Button>
                </div>
            </form>
        </Form>
    );
}

