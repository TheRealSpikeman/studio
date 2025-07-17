// src/components/legal/LegalContent.tsx
import Link from 'next/link';
import { ExternalLink, ShieldCheck, AlertTriangle, Gavel, Stethoscope, Bot, Scale, Edit2 } from '@/lib/icons';
import type { ElementType } from 'react';
import { TermsPageContent } from './TermsPageContent';
import { PrivacyPageContent } from './PrivacyPageContent';

// Helper component for consistent section styling
const Section = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: ElementType }) => (
    <div className="mb-6">
        <h4 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            {title}
        </h4>
        <div className="space-y-3 text-base text-muted-foreground pl-7">
            {children}
        </div>
    </div>
);

// Helper for consistent list item styling
const ListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
        <span className="flex-1">{children}</span>
    </li>
);

export const PrivacyPolicyContent = () => (
    <div className="text-sm">
        <PrivacyPageContent />
    </div>
);

export const TermsContent = () => (
    <div className="text-sm">
        <TermsPageContent />
    </div>
);

export const DisclaimerContent = () => (
    <div className="text-sm">
        <Section title="Geen Medische Diagnose of Advies" icon={AlertTriangle}>
            <p>MindNavigator en de daarin aangeboden zelfreflectie-instrumenten, coaching tips, en andere content zijn uitsluitend bedoeld voor educatieve en informatieve doeleinden. Ze zijn <strong>nadrukkelijk geen vervanging</strong> voor professioneel medisch, psychologisch, of orthopedagogisch advies, diagnose, of behandeling.</p>
        </Section>

        <Section title="Raadpleeg Altijd een Professional" icon={Stethoscope}>
            <p>De informatie op dit platform mag niet worden gebruikt voor het diagnosticeren of behandelen van een gezondheidsprobleem of ziekte. Als u of uw kind vragen of zorgen heeft over mentale of fysieke gezondheid, dient u altijd contact op te nemen met een gekwalificeerde zorgverlener (huisarts, psycholoog, kinderarts, etc.).</p>
        </Section>
        
        <Section title="Gebruik van AI-gegenereerde Content" icon={Bot}>
            <p>Delen van de inzichten en aanbevelingen op dit platform worden gegenereerd met behulp van kunstmatige intelligentie (AI). Hoewel we streven naar hoge kwaliteit, kan AI-gegenereerde content onnauwkeurigheden bevatten of niet van toepassing zijn op uw specifieke situatie. Gebruik deze inzichten als een startpunt voor reflectie en gesprek, niet als een absolute waarheid.</p>
        </Section>
        
        <Section title="Beperking van Aansprakelijkheid" icon={Scale}>
            <p>Het gebruik van de informatie en tools op dit platform is geheel op eigen risico. MindNavigator, haar medewerkers en partners zijn niet aansprakelijk voor enige directe of indirecte schade die voortvloeit uit het gebruik van de Dienst of het vertrouwen op de verstrekte informatie.</p>
        </Section>
    </div>
);
