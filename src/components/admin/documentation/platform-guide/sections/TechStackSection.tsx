// src/components/admin/documentation/platform-guide/sections/TechStackSection.tsx
"use client";
import { Cpu } from "@/lib/icons";
import { GuideSection } from "../GuideSection";

export const TechStackSection = () => {
    return (
        <GuideSection id="tech-stack" title="Kern Technologieën" icon={Cpu}>
             <p>Het platform is gebouwd op een moderne, schaalbare tech stack:</p>
            <ul className="list-disc list-inside pl-4">
              <li><strong>Frontend:</strong> Next.js & React met TypeScript.</li>
              <li><strong>Styling:</strong> Tailwind CSS met ShadCN/UI componenten.</li>
              <li><strong>Generative AI:</strong> Genkit voor interactie met AI-modellen (Google Gemini).</li>
              <li><strong>Backend & Database:</strong> Firebase (Authentication, Firestore, Storage).</li>
            </ul>
        </GuideSection>
    );
};
