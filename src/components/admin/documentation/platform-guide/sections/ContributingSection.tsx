// src/components/admin/documentation/platform-guide/sections/ContributingSection.tsx
"use client";
import { Handshake } from "@/lib/icons";
import { GuideSection } from "../GuideSection";
import Link from "next/link";

export const ContributingSection = () => {
    return (
        <GuideSection id="contributing" title="Bijdragen & Volgende Stappen" icon={Handshake}>
            <p>
                De codebase is opgezet om makkelijk uit te breiden. Wanneer u nieuwe secties aan deze gids wilt toevoegen, volg dan de bestaande structuur:
            </p>
            <ol className="list-decimal list-inside pl-4 space-y-2">
                <li>Maak een nieuw component aan in <code>src/components/admin/documentation/platform-guide/sections/</code>.</li>
                <li>Importeer en render dit nieuwe component in de hoofdpagina <code>src/app/dashboard/admin/documentation/platform-guide/page.tsx</code>.</li>
                <li>Gebruik de herbruikbare <code>&lt;GuideSection&gt;</code> component voor een consistente look & feel.</li>
            </ol>
            <p>
                Voor een overzicht van geplande features en de ontwikkelingsrichting, zie de <Link href="/dashboard/admin/documentation/roadmap" className="text-primary hover:underline">Roadmap</Link>.
            </p>
        </GuideSection>
    );
};
