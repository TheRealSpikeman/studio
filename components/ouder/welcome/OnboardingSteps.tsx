// src/components/ouder/welcome/OnboardingSteps.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { FileText, UserPlus, ShieldCheck, ArrowRight, ExternalLink, AlertTriangle, Check, BookUser, Gavel, Loader2 } from 'lucide-react';
import { AddChildForm, type AddChildFormData } from '@/components/ouder/AddChildForm';
import { useToast } from '@/hooks/use-toast';
import { PlanSelection } from './PlanSelection';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type SubscriptionPlan, LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY } from '@/types/subscription';
import { LegalDocumentDialog } from '@/components/common/LegalDocumentDialog';
import { PrivacyPolicyContent, TermsContent, DisclaimerContent } from '@/components/legal/LegalContent';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingStepsProps {
    planParam: string | null;
    onPlanSelect: (planId: string) => void;
}

const termsFormSchema = z.object({
  medicalDisclaimer: z.literal(true, { errorMap: () => ({ message: "U moet akkoord gaan met de medische disclaimer." }) }),
  generalTerms: z.literal(true, { errorMap: () => ({ message: "U moet akkoord gaan met de algemene voorwaarden." }) }),
  privacyTerms: z.literal(true, { errorMap: () => ({ message: "U moet akkoord gaan met het privacybeleid." }) }),
  ageConsent: z.literal(true, { errorMap: () => ({ message: "U moet de voorwaarden voor leeftijd en toestemming accepteren." }) }),
  coachingLimits: z.literal(true, { errorMap: () => ({ message: "U moet de grenzen van coaching begrijpen." }) }),
});

function TermsAndConditionsStep({ onNext }: { onNext: () => void }) {
  const { auth, refreshUser, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof termsFormSchema>>({
    resolver: zodResolver(termsFormSchema),
    defaultValues: {
      medicalDisclaimer: false,
      privacyTerms: false,
      generalTerms: false,
      ageConsent: false,
      coachingLimits: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof termsFormSchema>) => {
    if(!isAuthenticated || !auth?.currentUser) {
        toast({ title: "Authenticatie Fout", description: "Wacht alstublieft tot uw account volledig is geladen.", variant: 'destructive' });
        return;
    }
    setIsSubmitting(true);
    try {
        const token = await auth.currentUser.getIdToken();
        
        const response = await fetch('/api/user/save-agreements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ agreements: data }),
        });

        if (!response.ok) { throw new Error('Kon de voorwaarden niet opslaan.'); }

        toast({ title: "Voorwaarden geaccepteerd en opgeslagen." });
        await refreshUser(); // Refresh user data to get the new agreements object
        onNext();

    } catch (error) {
        console.error("Failed to save agreements:", error);
        toast({ title: "Fout", description: "Er is een fout opgetreden. Probeer het opnieuw.", variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-5 w-5 !text-red-600"/>
            <AlertTitleUi className="font-semibold text-red-700">BELANGRIJKE MEDISCHE DISCLAIMER</AlertTitleUi>
            <AlertDescription className="text-red-800/90 text-sm">
                MindNavigator is <strong>GEEN</strong> medische dienst en vervangt nooit professionele zorg. Voor diagnoses (ADHD, autisme, etc.) of behandeling, raadpleeg altijd een huisarts of GGZ-instelling.
                 <br /><strong>Bij acute problemen:</strong> Bel direct 112 (spoed) of 113 (suïcidepreventie).
            </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <FormField control={form.control} name="medicalDisclaimer" render={({ field }) => ( <FormItem className="flex items-start gap-3 rounded-md border bg-card p-4 hover:bg-muted/50 transition-colors"> <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1 h-5 w-5" /></FormControl> <div className="space-y-1 leading-none"><Label className="cursor-pointer"><strong>Medische Disclaimer:</strong> Ik begrijp dat MindNavigator een hulpmiddel is en geen medische dienst, en ik zoek professionele hulp bij medische zorgen.</Label><FormMessage /></div> </FormItem> )}/>
          <FormField control={form.control} name="generalTerms" render={({ field }) => ( <FormItem className="flex items-start gap-3 rounded-md border bg-card p-4 hover:bg-muted/50 transition-colors"> <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1 h-5 w-5" /></FormControl> <div className="space-y-1 leading-none"> <Label className="cursor-pointer"> <strong>Algemene Voorwaarden:</strong> Ik ga akkoord met de {' '} <LegalDocumentDialog triggerNode={<Button type="button" variant="link" asChild className="p-0 h-auto -my-1"><span className="cursor-pointer">algemene voorwaarden</span></Button>}><TermsContent /></LegalDocumentDialog>. </Label> <FormMessage /> </div> </FormItem> )}/>
          <FormField control={form.control} name="privacyTerms" render={({ field }) => ( <FormItem className="flex items-start gap-3 rounded-md border bg-card p-4 hover:bg-muted/50 transition-colors"> <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1 h-5 w-5" /></FormControl> <div className="space-y-1 leading-none"> <Label className="cursor-pointer"> <strong>Privacy & Gegevensverwerking:</strong> Ik ga akkoord met het {' '} <LegalDocumentDialog triggerNode={<Button type="button" variant="link" asChild className="p-0 h-auto -my-1"><span className="cursor-pointer">privacybeleid</span></Button>}><PrivacyPolicyContent /></LegalDocumentDialog> {' '}en begrijp hoe data wordt verwerkt en beschermd. </Label> <FormMessage /> </div> </FormItem> )}/>
          <FormField control={form.control} name="ageConsent" render={({ field }) => ( <FormItem className="flex items-start gap-3 rounded-md border bg-card p-4 hover:bg-muted/50 transition-colors"> <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1 h-5 w-5" /></FormControl> <div className="space-y-1 leading-none"><Label className="cursor-pointer"><strong>Leeftijd & Toestemming:</strong> Ik bevestig dat ik als ouder/verzorger toestemming geef voor mijn minderjarige kind om dit platform te gebruiken.</Label><FormMessage /></div> </FormItem> )}/>
          <FormField control={form.control} name="coachingLimits" render={({ field }) => ( <FormItem className="flex items-start gap-3 rounded-md border bg-card p-4 hover:bg-muted/50 transition-colors"> <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1 h-5 w-5" /></FormControl> <div className="space-y-1 leading-none"><Label className="cursor-pointer"><strong>Coaching Grenzen:</strong> Ik begrijp dat coaching ondersteuning biedt maar geen vervanging is voor therapie of medische behandeling.</Label><FormMessage /></div> </FormItem> )}/>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-end pt-4 border-t">
          <Button type="submit" disabled={!form.formState.isValid || isSubmitting || isAuthLoading}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Bezig met opslaan...' : 'Volgende Stap'} 
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4"/>}
          </Button>
        </div>
      </form>
    </Form>
  );
}


interface Actiepunt {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  contentHeader?: string;
  customContent?: 'planSelection' | 'addChildForm' | 'termsAndConditions';
}

export function OnboardingSteps({ planParam, onPlanSelect }: OnboardingStepsProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [addChildFormKey, setAddChildFormKey] = useState(0);
    const [openAccordionItem, setOpenAccordionItem] = useState("");
    const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
    
    useEffect(() => {
        const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
        if (storedPlansRaw) {
            try { setAvailablePlans(JSON.parse(storedPlansRaw)); } catch (e) { console.error("Failed to parse plans from localStorage", e); }
        }
    }, []);

    useEffect(() => {
        if (!planParam) {
            setOpenAccordionItem("bekijk-abonnementen");
        } else if (!user?.onboardingAgreements) {
            setOpenAccordionItem("belangrijke-voorwaarden");
        } else {
            setOpenAccordionItem("voeg-kind-toe");
        }
    }, [planParam, user]);

    const handleSaveChildOnWelcome = (data: AddChildFormData) => {
        console.log("Kind toegevoegd via welkomstpagina (simulatie):", data);
        toast({
          title: "Kind Succesvol Toegevoegd (Simulatie)",
          description: `${data.firstName} ${data.lastName} is toegevoegd. Een uitnodigingsmail is (gesimuleerd) verstuurd naar ${data.childEmail}.`,
          duration: 8000,
        });
        setAddChildFormKey(prevKey => prevKey + 1);
    };

    const handlePlanSelected = (planId: string) => {
        onPlanSelect(planId);
        setOpenAccordionItem("belangrijke-voorwaarden");
    }

    const handleTermsNext = () => {
        setOpenAccordionItem("voeg-kind-toe");
    }

    const getActiepuntenConfig = (): Actiepunt[] => {
        const cleanedPlanId = planParam?.split('?')[0];
        const selectedPlan = availablePlans.find(p => p.id === cleanedPlanId);
        const planDisplayName = selectedPlan ? selectedPlan.name : cleanedPlanId;

        return [
            { id: "bekijk-abonnementen", stepNumber: 1, title: planParam && planDisplayName ? `Plan Geselecteerd: ${planDisplayName}` : "Kies een Abonnement", description: "Kies een abonnement om te starten. Met 'Gratis Start' kan uw kind de basisassessment doen. Voor volledige coaching en tools is een betaald plan nodig.", contentHeader: planParam ? "U kunt uw keuze hieronder nog wijzigen, of doorgaan met de volgende stap." : "Selecteer hieronder een plan. Na uw keuze worden de andere instelopties actief.", customContent: 'planSelection' },
            { id: "belangrijke-voorwaarden", stepNumber: 2, title: "Belangrijke Voorwaarden & Privacy", description: "Lees en accepteer de belangrijkste voorwaarden voordat u verdergaat.", customContent: 'termsAndConditions' },
            { id: "voeg-kind-toe", stepNumber: 3, title: "Kind(eren) Toevoegen", description: "Maak profielen aan voor uw kinderen. Zij ontvangen een e-mail om hun account te activeren.", contentHeader: planParam ? "Na het toevoegen ontvangt uw kind een e-mail om het account te activeren. Daarna kunt u de voortgang volgen en instellingen beheren." : "Kies eerst een plan om deze stap te activeren.", customContent: 'addChildForm' },
            { id: "privacy-delen", stepNumber: 4, title: "Privacy & Delen Instellen", description: "Bekijk en beheer hier per kind de deelinstellingen voor resultaten en communicatie.", link: "/dashboard/ouder/privacy-instellingen", linkText: "Beheer Privacy & Delen", buttonVariant: 'outline', contentHeader: planParam ? "Stel hier de privacyvoorkeuren in. Deze instellingen bepalen welke informatie zichtbaar is voor u en, indien van toepassing, voor gekoppelde tutors of coaches." : "Kies eerst een plan om deze stap te activeren." },
            { id: "ken-je-kind", stepNumber: 5, title: "'Ken je Kind' Test (Optioneel)", description: 'Doe een korte test (ca. 5 min) om een eerste indruk te krijgen van mogelijke neurodivergente kenmerken.', link: "/quiz/ouder-symptomen-check", linkText: 'Start "Ken je Kind" Test', buttonVariant: 'default', contentHeader: planParam ? "Deze test geeft u een eerste indruk en kan helpen bij het invullen van het kinderprofiel. De resultaten zijn alleen voor u." : "Kies eerst een plan om deze stap te activeren.", },
        ];
    };

    const sortedActiepunten = getActiepuntenConfig();
    
    return (
         <Accordion 
            type="single" 
            collapsible 
            className="w-full space-y-4 text-left mb-10" 
            value={openAccordionItem} 
            onValueChange={setOpenAccordionItem}
        >
            {sortedActiepunten.map((item) => {
                const isPlanSelected = !!planParam;
                const areTermsCompleted = !!user?.onboardingAgreements;
                
                let isStepDisabled = false;
                if (item.id === "belangrijke-voorwaarden" && !isPlanSelected) isStepDisabled = true;
                if (["voeg-kind-toe", "privacy-delen", "ken-je-kind"].includes(item.id) && (!isPlanSelected || !areTermsCompleted)) isStepDisabled = true;
                
                const isStepCompleted = (item.id === "bekijk-abonnementen" && isPlanSelected) || (item.id === "belangrijke-voorwaarden" && areTermsCompleted);

                return (
                    <AccordionItem key={item.id} value={item.id} className="bg-card border shadow-md rounded-lg data-[state=open]:shadow-xl" disabled={isStepDisabled}>
                        <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-7 w-7 items-center justify-center rounded-full font-semibold text-sm flex-shrink-0 ${isStepCompleted ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground'}`}>
                                    {isStepCompleted && item.stepNumber > 1 ? <Check className="h-4 w-4"/> : item.stepNumber}
                                </div>
                                {item.title}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-0">
                            <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                            {item.contentHeader && <p className="text-sm font-medium text-foreground mb-4">{item.contentHeader}</p>}
                            
                            {item.customContent === 'planSelection' && <PlanSelection planParam={planParam} onPlanSelect={handlePlanSelected} />}
                            {item.customContent === 'addChildForm' && <AddChildForm key={addChildFormKey} onSave={handleSaveChildOnWelcome} onCancel={() => {}} />}
                            {item.customContent === 'termsAndConditions' && <TermsAndConditionsStep onNext={handleTermsNext} />}

                            {item.link && item.linkText && <Button asChild variant={item.buttonVariant || 'default'} className="w-full sm:w-auto" disabled={isStepDisabled}><Link href={isStepDisabled ? '#' : item.link}>{item.linkText} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
