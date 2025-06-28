// src/components/admin/documentation/platform-guide/sections/IntroductionSection.tsx
"use client";
import { Info } from "@/lib/icons";
import { GuideSection } from "../GuideSection";

export const IntroductionSection = () => {
    return (
        <GuideSection id="introduction" title="Introductie" icon={Info}>
            <p>
                Welkom bij de technische handleiding van het MindNavigator-platform.
                Deze gids is bedoeld voor ontwikkelaars en beheerders en biedt een overzicht van de kernconcepten,
                architectuur en technologieën die worden gebruikt.
            </p>
            <p>
                Het doel is om een duidelijk en onderhoudbaar referentiepunt te creëren voor iedereen die aan het project werkt.
                Gebruik de secties hieronder om snel de informatie te vinden die u nodig heeft.
            </p>
        </GuideSection>
    );
};
