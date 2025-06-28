// src/components/admin/documentation/platform-guide/sections/AiFlowsSection.tsx
"use client";
import { Bot } from "@/lib/icons";
import { GuideSection } from "../GuideSection";

export const AiFlowsSection = () => {
    return (
        <GuideSection id="ai-flows" title="Architectuur van AI Flows" icon={Bot}>
            <p>
              Alle AI-functionaliteit wordt afgehandeld via Genkit "flows", te vinden in <code>src/ai/flows/</code>. Om te voldoen aan de eisen van Next.js Server Components, is elke flow opgesplitst in twee bestanden:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-2">
                <li>
                    <strong><code>*-types.ts</code>:</strong> Dit bestand bevat <strong>geen</strong> <code>'use server';</code>. Het definieert en exporteert de Zod-schema's voor input/output validatie en de afgeleide TypeScript types. Dit bestand is veilig om overal te importeren.
                </li>
                 <li>
                    <strong><code>*-flow.ts</code>:</strong> Dit bestand begint met <code>'use server';</code> en mag <strong>alleen asynchrone functies</strong> exporteren. Het importeert de types uit het bijbehorende <code>types</code>-bestand en bevat de daadwerkelijke AI-logica.
                </li>
            </ul>
            <p>Deze scheiding is cruciaal voor de stabiliteit van de applicatie en voorkomt build-fouten.</p>
        </GuideSection>
    );
};
