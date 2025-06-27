// src/components/ouder/welcome/OnboardingSteps.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { FileText, UserPlus, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { AddChildForm, type AddChildFormData } from '@/components/ouder/AddChildForm';
import { useToast } from '@/hooks/use-toast';
import { PlanSelection } from './PlanSelection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface OnboardingStepsProps {
    planParam: string | null;
    onPlanSelect: (planId: string) => void;
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
  contentSteps?: string[];
  customContent?: 'planSelection' | 'addChildForm' | 'termsAndConditions';
}

export function OnboardingSteps({ planParam, onPlanSelect }: OnboardingStepsProps) {
    const { toast } = useToast();
    const [addChildFormKey, setAddChildFormKey] = useState(0);
    const [openAccordionItem, setOpenAccordionItem] = useState(!planParam ? "bekijk-abonnementen" : "");
    const [termsAccepted, setTermsAccepted] = useState(false);


    const handleSaveChildOnWelcome = (data: AddChildFormData) => {
        console.log("Kind toegevoegd via welkomstpagina (simulatie):", data);
        toast({
          title: "Kind Succesvol Toegevoegd (Simulatie)",
          description: `${data.firstName} ${data.lastName} is toegevoegd. Een uitnodigingsmail is (gesimuleerd) verstuurd naar ${data.childEmail}. U kunt hieronder nog een kind toevoegen of doorgaan.`,
          duration: 8000,
        });
        setAddChildFormKey(prevKey => prevKey + 1);
    };

    const handleTermsNext = () => {
        setOpenAccordionItem("voeg-kind-toe");
    }

    const getActiepuntenConfig = (): Actiepunt[] => {
        return [
            {
                id: "bekijk-abonnementen",
                stepNumber: 1,
                title: planParam ? `Plan Geselecteerd: ${planParam}` : "Kies een Abonnement",
                description: "Kies een abonnement om te starten. Met 'Gratis Start' kan uw kind de basisassessment doen. Voor volledige coaching en tools is een betaald plan nodig.",
                contentHeader: planParam ? "U kunt uw keuze hieronder nog wijzigen, of doorgaan met de volgende stap." : "Selecteer hieronder een plan. Na uw keuze worden de andere instelopties actief.",
                customContent: 'planSelection',
            },
            {
                id: "belangrijke-voorwaarden",
                stepNumber: 2,
                title: "Belangrijke Voorwaarden & Privacy",
                description: "Lees en accepteer de belangrijkste voorwaarden voordat u verdergaat.",
                customContent: 'termsAndConditions',
            },
            {
                id: "voeg-kind-toe",
                stepNumber: 3,
                title: "Kind(eren) Toevoegen",
                description: "Maak profielen aan voor uw kinderen. Zij ontvangen een e-mail om hun account te activeren.",
                contentHeader: planParam ? "Na het toevoegen ontvangt uw kind een e-mail om het account te activeren. Daarna kunt u de voortgang volgen en instellingen beheren." : "Kies eerst een plan om deze stap te activeren.",
                customContent: 'addChildForm',
            },
            {
                id: "privacy-delen",
                stepNumber: 4,
                title: "Privacy & Delen Instellen",
                description: "Bekijk en beheer hier per kind de deelinstellingen voor resultaten en communicatie.",
                link: "/dashboard/ouder/privacy-instellingen",
                linkText: "Beheer Privacy & Delen",
                buttonVariant: 'outline',
                contentHeader: planParam ? "Stel hier de privacyvoorkeuren in. Deze instellingen bepalen welke informatie zichtbaar is voor u en, indien van toepassing, voor gekoppelde tutors of coaches." : "Kies eerst een plan om deze stap te activeren.",
            },
            {
                id: "ken-je-kind",
                stepNumber: 5,
                title: "'Ken je Kind' Test (Optioneel)",
                description: 'Doe een korte test (ca. 5 min) om een eerste indruk te krijgen van mogelijke neurodivergente kenmerken.',
                link: "/quiz/ouder-symptomen-check",
                linkText: 'Start "Ken je Kind" Test',
                buttonVariant: 'default',
                contentHeader: planParam ? "Deze test geeft u een eerste indruk en kan helpen bij het invullen van het kinderprofiel. De resultaten zijn alleen voor u." : "Kies eerst een plan om deze stap te activeren.",
            },
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
                const isDisabled = !planParam && !["bekijk-abonnementen", "belangrijke-voorwaarden"].includes(item.id);
                return (
                    <AccordionItem key={item.id} value={item.id} className="bg-card border shadow-md rounded-lg data-[state=open]:shadow-xl" disabled={isDisabled}>
                        <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed">
                            <div className="flex items-center gap-3"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm flex-shrink-0">{item.stepNumber}</div>{item.title}</div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-0">
                            <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                            {item.contentHeader && <p className="text-sm font-medium text-foreground mb-4">{item.contentHeader}</p>}
                            
                            {item.customContent === 'planSelection' && <PlanSelection planParam={planParam} onPlanSelect={onPlanSelect} />}
                            {item.customContent === 'addChildForm' && <AddChildForm key={addChildFormKey} onSave={handleSaveChildOnWelcome} onCancel={() => {}} />}
                            
                            {item.customContent === 'termsAndConditions' && (
                                <div className="space-y-4">
                                    <ScrollArea className="h-40 w-full rounded-md border p-4 text-xs bg-muted/30">
                                        <h4 className="font-bold mb-2">Samenvatting Voorwaarden & Privacy</h4>
                                        <p className="mb-2"><strong>Geen Diagnose:</strong> MindNavigator is een hulpmiddel voor zelfinzicht en is geen vervanging voor professioneel medisch of psychologisch advies. Raadpleeg altijd een gekwalificeerde zorgverlener bij zorgen.</p>
                                        <p className="mb-2"><strong>Data & Privacy:</strong> Uw gegevens worden vertrouwelijk behandeld conform AVG/GDPR. Resultaten worden niet zonder toestemming gedeeld.</p>
                                        <p className="mb-2"><strong>Ouderlijke Toestemming:</strong> Voor minderjarigen is uw toestemming vereist voor het aanmaken van een account en het afsluiten van abonnementen.</p>
                                        <p>Bekijk de volledige documenten voor alle details.</p>
                                    </ScrollArea>
                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="terms-agree" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(!!checked)} />
                                            <Label htmlFor="terms-agree" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Ik heb de belangrijkste punten gelezen en ga akkoord.
                                            </Label>
                                        </div>
                                        <Button onClick={handleTermsNext} disabled={!termsAccepted}>
                                            Volgende Stap <ArrowRight className="ml-2 h-4 w-4"/>
                                        </Button>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                        <Button variant="link" asChild className="p-0 h-auto text-primary text-xs"><Link href="/terms" target="_blank">Algemene Voorwaarden <ExternalLink className="ml-1 h-3 w-3"/></Link></Button>
                                        <Button variant="link" asChild className="p-0 h-auto text-primary text-xs"><Link href="/privacy" target="_blank">Privacybeleid <ExternalLink className="ml-1 h-3 w-3"/></Link></Button>
                                        <Button variant="link" asChild className="p-0 h-auto text-primary text-xs"><Link href="/disclaimer" target="_blank">Disclaimer <ExternalLink className="ml-1 h-3 w-3"/></Link></Button>
                                    </div>
                                </div>
                            )}

                            {item.link && item.linkText && <Button asChild variant={item.buttonVariant || 'default'} className="w-full sm:w-auto" disabled={isDisabled}><Link href={isDisabled ? '#' : item.link}>{item.linkText} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
