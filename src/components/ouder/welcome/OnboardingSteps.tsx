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
  customContent?: 'planSelection' | 'addChildForm';
}

export function OnboardingSteps({ planParam, onPlanSelect }: OnboardingStepsProps) {
    const { toast } = useToast();
    const [addChildFormKey, setAddChildFormKey] = useState(0);

    const handleSaveChildOnWelcome = (data: AddChildFormData) => {
        console.log("Kind toegevoegd via welkomstpagina (simulatie):", data);
        toast({
          title: "Kind Succesvol Toegevoegd (Simulatie)",
          description: `${data.firstName} ${data.lastName} is toegevoegd. Een uitnodigingsmail is (gesimuleerd) verstuurd naar ${data.childEmail}. U kunt hieronder nog een kind toevoegen of doorgaan.`,
          duration: 8000,
        });
        setAddChildFormKey(prevKey => prevKey + 1);
    };

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
                description: "Een korte herinnering aan de belangrijkste punten en links naar de volledige documenten.",
                contentHeader: "Door MindNavigator te gebruiken, bent u akkoord gegaan tijdens uw registratie.",
                contentSteps: [
                    `U bent akkoord gegaan met deze voorwaarden en ons privacybeleid tijdens uw registratie.`,
                    "MindNavigator is een hulpmiddel voor zelfinzicht en ondersteuning. Het vervangt geen professionele diagnose of behandeling. Lees onze volledige documenten voor een compleet begrip van onze diensten en uw rechten."
                ],
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
    const defaultOpenAccordionItem = !planParam ? "bekijk-abonnementen" : "";

    return (
         <Accordion type="single" collapsible className="w-full space-y-4 text-left mb-10" defaultValue={defaultOpenAccordionItem}>
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

                            {item.contentSteps && <div className="space-y-2 text-sm text-muted-foreground mb-4">{item.contentSteps.map((step, i) => <p key={i}>{step}</p>)}<div className="flex flex-col sm:flex-row gap-2 mt-3"><Button variant="link" asChild className="p-0 h-auto text-primary"><Link href="/terms" target="_blank">Algemene Voorwaarden <ExternalLink className="ml-1 h-3 w-3"/></Link></Button><Button variant="link" asChild className="p-0 h-auto text-primary"><Link href="/privacy" target="_blank">Privacybeleid <ExternalLink className="ml-1 h-3 w-3"/></Link></Button><Button variant="link" asChild className="p-0 h-auto text-primary"><Link href="/disclaimer" target="_blank">Disclaimer <ExternalLink className="ml-1 h-3 w-3"/></Link></Button></div></div>}
                            {item.link && item.linkText && <Button asChild variant={item.buttonVariant || 'default'} className="w-full sm:w-auto" disabled={isDisabled}><Link href={isDisabled ? '#' : item.link}>{item.linkText} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
